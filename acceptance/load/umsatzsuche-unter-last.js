import http from 'k6/http';
import { check, sleep } from 'k6';

// Lasttest „Umsatzsuche unter Last“ (PK-77).
// Steckbrief: 300 angemeldete Kundinnen, 2 min Anstieg, 5 min halten, 1 min Abbau,
// je 1–3 s Denkzeit zwischen zwei Anfragen, Export in jedem zehnten Durchgang.
// Geschlossenes Modell: jeder virtuelle Nutzer meldet sich einmal an und bleibt es.

const basis = __ENV.BANKING_URL;
const pin = __ENV.LASTTEST_PIN;

// Wechselnde Filterwerte: Kategorie aus der festen Liste (BR-0104), Betrag breit gefasst,
// damit die Auswahl Treffer hat und der Export mit denselben Filtern nicht leer ist (BR-0076).
const kategorien = [
  'Wohnen',
  'Lebensmittel',
  'Mobilität',
  'Freizeit',
  'Versicherungen',
  'Gesundheit',
  'Sonstiges',
];
const betragVonWerte = [0, 5, 10];
const betragBisWerte = [5000, 10000, 50000];

// Denkzeit zwischen zwei Anfragen: 1 bis 3 Sekunden.
function denkzeit() {
  sleep(1 + Math.random() * 2);
}

function wert(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

function anmelden(kennung) {
  const antwort = http.post(
    `${basis}/api/anmeldung`,
    JSON.stringify({ kennung: kennung, pin: pin }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'anmeldung' },
    },
  );
  check(antwort, { 'Anmeldung 200': (r) => r.status === 200 }, { name: 'anmeldung' });
  return antwort.status === 200;
}

// Pro virtuellem Nutzer: einmal angemeldet, danach bleibt die Sitzung bestehen.
let angemeldet = false;

export function setup() {
  if (!basis) {
    throw new Error('BANKING_URL fehlt in der Umgebung.');
  }
  if (!pin) {
    throw new Error('LASTTEST_PIN fehlt im Zugang (Umgebungsvariable LASTTEST_PIN).');
  }
  // Einmal zurücksetzen, damit jeder Lastkunde seinen Umsatzbestand hat.
  const antwort = http.post(`${basis}/api/test/lasttest/reset`, null, {
    tags: { name: 'reset' },
  });
  if (antwort.status !== 204) {
    throw new Error(`Lastdaten-Reset fehlgeschlagen: Status ${antwort.status}`);
  }
}

export default function () {
  // Jeder virtuelle Nutzer meldet sich einmal an (lasttest-001 bis lasttest-300).
  if (!angemeldet) {
    const nummer = String(((__VU - 1) % 300) + 1).padStart(3, '0');
    angemeldet = anmelden(`lasttest-${nummer}`);
    if (!angemeldet) {
      denkzeit();
      return;
    }
    denkzeit();
  }

  // GET /api/konten: IBAN des Girokontos.
  const kontenAntwort = http.get(`${basis}/api/konten`, { tags: { name: 'konten' } });
  const kontenOk = check(
    kontenAntwort,
    { 'Konten 200': (r) => r.status === 200 },
    { name: 'konten' },
  );

  let iban = '';
  if (kontenOk) {
    try {
      const daten = kontenAntwort.json();
      const giro = (daten.konten || []).find((k) => k.art === 'Girokonto');
      iban = giro && giro.iban ? giro.iban : '';
    } catch (e) {
      iban = '';
    }
  }
  if (!iban) {
    denkzeit();
    return;
  }
  denkzeit();

  // Eine Auswahl für diesen Durchgang: Seite 1, 2 und 3 mit denselben Filtern.
  const betragVon = wert(betragVonWerte);
  const betragBis = wert(betragBisWerte);
  const kategorie = wert(kategorien);
  const filter = `betragVon=${betragVon}&betragBis=${betragBis}&kategorie=${encodeURIComponent(kategorie)}`;

  for (const seite of [1, 2, 3]) {
    const url = `${basis}/api/konten/${encodeURIComponent(iban)}/umsaetze?${filter}&seite=${seite}&seitengroesse=20`;
    const antwort = http.get(url, { tags: { name: 'umsaetze' } });
    check(antwort, { 'Umsätze 200': (r) => r.status === 200 }, { name: 'umsaetze' });
    denkzeit();
  }

  // Export mit denselben Filtern in jedem zehnten Durchgang.
  if (__ITER % 10 === 0) {
    const url = `${basis}/api/konten/${encodeURIComponent(iban)}/umsaetze/export?${filter}`;
    const antwort = http.get(url, { tags: { name: 'export' } });
    check(antwort, { 'Export 200': (r) => r.status === 200 }, { name: 'export' });
    denkzeit();
  }
}

// 5xx zählt als Serverfehler; eine fachliche Ablehnung mit 4xx gilt als erfolgreich (NFR-004).
http.setResponseCallback(http.expectedStatuses({ min: 200, max: 499 }));

export const options = {
  // Die Sitzung (Cookie aventa_sitzung) soll über die Durchgänge eines Nutzers erhalten bleiben.
  noCookiesReset: true,
  stages: [
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    // 95 % der Aufrufe in höchstens 500 ms, je Anfrageart.
    'http_req_duration{name:anmeldung}': ['p(95)<500'],
    'http_req_duration{name:konten}': ['p(95)<500'],
    'http_req_duration{name:umsaetze}': ['p(95)<500'],
    'http_req_duration{name:export}': ['p(95)<500'],
    // Die Anmeldung muss tragen, sonst bricht der Lauf ab.
    'checks{name:anmeldung}': [
      { threshold: 'rate>0.99', abortOnFail: true, delayAbortEval: '30s' },
    ],
    // Eine schnelle Ablehnung darf keine Zeitgrenze bestehen.
    'checks{name:konten}': ['rate>0.99'],
    'checks{name:umsaetze}': ['rate>0.99'],
    'checks{name:export}': ['rate>0.99'],
    // Höchstens 0,5 % Fehler.
    'http_req_failed': ['rate<0.005'],
  },
};
