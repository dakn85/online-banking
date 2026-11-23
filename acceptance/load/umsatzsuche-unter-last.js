// Umsatzsuche unter Last (PK-73, NFR-003).
//
// Steckbrief load/kontext/steckbrief.yaml:
//   Ablauf je Durchgang: GET /api/konten -> GET /api/konten/{iban}/umsaetze
//   (Seite 1, dann Seite 2 und 3 derselben Auswahl) -> jeder zehnte Durchgang
//   GET /api/konten/{iban}/umsaetze/export mit denselben Filtern.
//   Anmeldung: jedes VU meldet sich je Lebensdauer einmal ueber POST /api/anmeldung an.
//   Lastmodell: 300 VU (lasttest-001..300) in 2 min ansteigen, 5 min halten, 1 min abbauen,
//   zwischen zwei Anfragen 1-3 s Denkzeit.
//   Testdaten: setup() setzt mit POST /api/test/lasttest/reset je Lastkunde 200 Umsaetze.
//
// Ziel wie NFR-003: 95 % der Aufrufe in hoechstens 500 ms, hoechstens 0,5 % Serverfehler.
// 4xx gilt als fachlich korrekt (NFR-004; z. B. 422 aus BR-0076 bei leerem Export) und
// zaehlt in den Erfolgs-Checks nicht als Fehler, nur 5xx zaehlen als Serverfehler.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const basis = __ENV.BANKING_URL || 'http://online-banking.online-banking:8080';
const pin = __ENV.LASTTEST_PIN;

const serverfehler = new Rate('serverfehler');

// Denkzeit zwischen zwei Anfragen: 1 bis 3 Sekunden (Steckbrief: Lastmodell).
const denkzeit = () => 1 + Math.random() * 2;

// Wechselnde Filterauswahlen aus der festen Werteliste der Kategorie (BR-0104) und
// Betragsfenstern ueber die gestreuten Betraege der 200 Lastumsaetze.
const auswahlen = [
  { betragVon: 0, betragBis: 100, kategorie: 'Lebensmittel' },
  { betragVon: 50, betragBis: 500, kategorie: 'Wohnen' },
  { betragVon: 10, betragBis: 2000, kategorie: 'Mobilität' },
  { betragVon: 0, betragBis: 10000, kategorie: 'Freizeit' },
  { betragVon: 100, betragBis: 5000, kategorie: 'Versicherungen' },
  { betragVon: 0, betragBis: 250, kategorie: 'Gesundheit' },
  { betragVon: 20, betragBis: 1000, kategorie: 'Sonstiges' },
  { betragVon: 0, betragBis: 10000, kategorie: 'Lebensmittel' },
  { betragVon: 200, betragBis: 2000, kategorie: 'Wohnen' },
  { betragVon: 0, betragBis: 500, kategorie: 'Mobilität' },
];

// Die Maske schickt fest 20 Treffer je Seite mit (BR-0105).
const SEITENGROESSE = 20;
const MAX_KUNDEN = 300;

export const options = {
  scenarios: {
    umsatzsuche: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: MAX_KUNDEN }, // Anstieg in 2 Minuten auf 300
        { duration: '5m', target: MAX_KUNDEN }, // 5 Minuten halten
        { duration: '1m', target: 0 },          // 1 Minute Abbau
      ],
      gracefulRampDown: '30s',
    },
  },
  // Jeder virtuelle Nutzer bleibt ueber die Iterationen angemeldet.
  noCookiesReset: true,
  setupTimeout: '5m',
  thresholds: {
    // NFR-003: p95 hoechstens 500 ms je Aufrufart.
    'http_req_duration{name:konten}': ['p(95)<500'],
    'http_req_duration{name:umsaetze}': ['p(95)<500'],
    'http_req_duration{name:export}': ['p(95)<500'],
    // Ein schneller Fehler darf ein Zeitlimit nicht bestehen: Erfolgsrate je Aufrufart.
    'checks{name:konten}': ['rate>0.99'],
    'checks{name:umsaetze}': ['rate>0.99'],
    'checks{name:export}': ['rate>0.99'],
    // Eine Anmeldung, die nicht haelt, bricht den Lauf ab.
    'checks{name:anmeldung}': [{ threshold: 'rate>0.99', abortOnFail: true, delayAbortEval: '30s' }],
    // NFR-003: hoechstens 0,5 % Serverfehler (5xx).
    'serverfehler': ['rate<=0.005'],
  },
};

// setup() laeuft einmal; lasttest/reset gibt jedem Lastkunden 200 Umsaetze ueber sechs Monate.
export function setup() {
  if (!pin) {
    throw new Error('LASTTEST_PIN fehlt: Der Zugang der Lastumgebung muss LASTTEST_PIN setzen.');
  }
  const res = http.post(`${basis}/api/test/lasttest/reset`, null, { timeout: '5m' });
  if (res.status !== 204) {
    throw new Error(`Lasttest-Reset fehlgeschlagen: HTTP ${res.status}. Laeuft der Dienst mit TEST_MODE=1?`);
  }
  return { pin };
}

// Modulzustand je VU (k6 gibt jedem VU einen eigenen JS-Kontext).
let angemeldet = false;
let durchgang = 0;

export default function (data) {
  if (!pin) return;

  // Jede virtuelle Nutzerin ist genau ein Lastkunde lasttest-001 bis lasttest-300.
  const nummer = ((__VU - 1) % MAX_KUNDEN) + 1;
  const kennung = `lasttest-${String(nummer).padStart(3, '0')}`;

  if (!angemeldet) {
    const res = http.post(
      `${basis}/api/anmeldung`,
      JSON.stringify({ kennung, pin: data.pin }),
      { headers: { 'Content-Type': 'application/json' }, tags: { name: 'anmeldung' } },
    );
    check(res, { erfolgreich: (r) => r.status === 200 }, { name: 'anmeldung' });
    serverfehler.add(res.status >= 500);
    angemeldet = res.status === 200;
    sleep(denkzeit());
    return;
  }

  // 1) Konten der Kundin lesen, um die IBAN des Girokontos zu finden.
  const kontenRes = http.get(`${basis}/api/konten`, { tags: { name: 'konten' } });
  check(kontenRes, { erfolgreich: (r) => r.status < 500 }, { name: 'konten' });
  serverfehler.add(kontenRes.status >= 500);

  let iban;
  if (kontenRes.status < 500 && kontenRes.body) {
    try {
      const konten = JSON.parse(kontenRes.body).konten || [];
      const giro = konten.find((k) => k.art === 'Girokonto');
      iban = giro && giro.iban;
    } catch (e) {
      iban = undefined;
    }
  }
  sleep(denkzeit());

  // Abgelaufene Sitzung: naechste Iteration meldet sich neu an.
  if (kontenRes.status === 401) {
    angemeldet = false;
    return;
  }
  if (!iban) return;

  // 2) Umsatzsuche mit Betrag von/bis und Kategorie; Seite 1, dann Seite 2 und 3 derselben Auswahl.
  const auswahl = auswahlen[Math.floor(Math.random() * auswahlen.length)];
  const filter = `betragVon=${auswahl.betragVon}&betragBis=${auswahl.betragBis}` +
    `&kategorie=${encodeURIComponent(auswahl.kategorie)}`;

  for (let seite = 1; seite <= 3; seite++) {
    const url = `${basis}/api/konten/${encodeURIComponent(iban)}/umsaetze` +
      `?${filter}&seite=${seite}&seitengroesse=${SEITENGROESSE}`;
    const res = http.get(url, { tags: { name: 'umsaetze' } });
    check(res, { erfolgreich: (r) => r.status < 500 }, { name: 'umsaetze' });
    serverfehler.add(res.status >= 500);
    sleep(denkzeit());
  }

  // 3) Jeder zehnte Durchgang exportiert dieselbe Auswahl.
  durchgang += 1;
  if (durchgang % 10 === 0) {
    const url = `${basis}/api/konten/${encodeURIComponent(iban)}/umsaetze/export?${filter}`;
    const res = http.get(url, { tags: { name: 'export' } });
    check(res, { erfolgreich: (r) => r.status < 500 }, { name: 'export' });
    serverfehler.add(res.status >= 500);
    sleep(denkzeit());
  }
}
