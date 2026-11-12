// NFR-003 – Antwortzeit von Finanzstatus und Überweisung
//
// Anforderung: GET /api/konten und POST /api/ueberweisungen antworten in mindestens 95 % der Aufrufe in
// höchstens 500 ms, auch in der Lastspitze am Monatsersten. Gemessen wird über 15 Minuten im
// Beharrungszustand mit 300 gleichzeitig angemeldeten Kundinnen, rund 20 Finanzstatus-Aufrufen je
// Sekunde und jeder zehnten Überweisung.
//
// Lastmodell: geschlossen. Die 300 VUs sind die 300 gleichzeitig angemeldeten Kundinnen; nach jedem
// Aufruf wartet eine Kundin ihre Denkzeit ab, sodass 300 Kundinnen / 15 s Denkzeit = 20
// Finanzstatus-Aufrufe je Sekunde entstehen. Jede zehnte Runde eines VU enthält zusätzlich eine
// Überweisung, also rund 2 Überweisungen je Sekunde. Anlauf, 15 Minuten Beharrung, Ablauf.
//
// Prüfgröße je Aufrufart: p95 der Antwortzeit <= 500 ms (Threshold auf den Namen des Aufrufs).

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const basisUrl = (__ENV.BANKING_URL || __ENV.BASE_URL || '').replace(/\/$/, '');
// Zugangsdaten kommen aus den Zugängen der Umgebung, nie aus dem Skript.
const kennung = __ENV.BANKING_KENNUNG || __ENV.KENNUNG;
const pin = __ENV.BANKING_PIN || __ENV.PIN;

if (!basisUrl) {
  throw new Error('BANKING_URL fehlt: die Adresse des Systems liefert die Umgebung des Lasttests.');
}
if (!kennung || !pin) {
  throw new Error('BANKING_KENNUNG und BANKING_PIN fehlen: die Zugangsdaten stehen in den Zugängen der Umgebung.');
}

// Lastniveau aus NFR-003
const KUNDINNEN = 3;
const AUFRUFE_JE_SEKUNDE = 20;
const UEBERWEISUNG_JEDE = 10;
const DENKZEIT_SEKUNDEN = KUNDINNEN / AUFRUFE_JE_SEKUNDE;

// Empfängerin der Lastüberweisungen: Testdaten des Projekts, kein Zugangsdatum.
const EMPFAENGER = 'Lasttest Monatserste';
const EMPFAENGER_IBAN = __ENV.LASTTEST_EMPFAENGER_IBAN || 'DE89370400440532013000';
const BETRAG = 0.01;

const anmeldungErfolgreich = new Rate('anmeldung_erfolgreich');
const ueberweisungAusgefuehrt = new Rate('ueberweisung_ausgefuehrt');
const ueberweisungen = new Counter('ueberweisungen');

export const options = {
  scenarios: {
    monatserste: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: KUNDINNEN },
        { duration: '40s', target: KUNDINNEN },
        { duration: '5s', target: 0 },
      ],
      gracefulRampDown: '30s',
      tags: { nfr: 'NFR-003' },
    },
  },
  thresholds: {
    'http_req_duration{name:finanzstatus}': ['p(95)<=500'],
    'http_req_duration{name:ueberweisung}': ['p(95)<=500'],
    'anmeldung_erfolgreich': ['rate>0.99'],
    'ueberweisung_ausgefuehrt': ['rate>0.99'],
    'ueberweisungen': ['count>0'],
  },
};

// Zustand je VU: einmal anmelden, dann als dieselbe Kundin weiterarbeiten.
let angemeldet = false;
let girokontoIban = '';
let runden = 0;

export default function () {
  const beginn = Date.now();

  if (!angemeldet) {
    girokontoIban = anmelden();
    angemeldet = girokontoIban !== '';
    if (!angemeldet) {
      sleep(1);
      return;
    }
  }

  finanzstatus();

  runden += 1;
  if (runden % UEBERWEISUNG_JEDE === 0) ueberweisung();

  // Denkzeit: hält 300 Kundinnen bei rund 20 Finanzstatus-Aufrufen je Sekunde.
  const rest = DENKZEIT_SEKUNDEN * 1000 - (Date.now() - beginn);
  sleep(rest > 0 ? rest / 1000 : 0);
}

/** Meldet die Kundin über das Anmeldeformular an und gibt die IBAN ihres Girokontos zurück. */
function anmelden() {
  http.get(`${basisUrl}/anmelden`, { tags: { name: 'anmelden' } });
  const antwort = http.post(
    `${basisUrl}/anmelden`,
    { kennung, pin },
    { tags: { name: 'anmelden' }, redirects: 0 },
  );
  // Die Sitzung wird am Dienst geprüft; dieser Aufruf zählt nicht als Messung des Finanzstatus.
  const probe = http.get(`${basisUrl}/api/konten`, { tags: { name: 'anmelden-pruefung' } });
  const ok = antwort.status >= 300 && antwort.status < 400 && probe.status === 200;
  anmeldungErfolgreich.add(ok);
  if (!ok) {
    console.error(`Anmeldung fehlgeschlagen: POST /anmelden ${antwort.status}, GET /api/konten ${probe.status}`);
    return '';
  }
  return girokontoAus(probe.body);
}

function girokontoAus(rumpf) {
  try {
    const uebersicht = JSON.parse(rumpf);
    const girokonto = (uebersicht.konten || []).filter((konto) => konto.art === 'Girokonto')[0];
    return girokonto && girokonto.iban ? girokonto.iban : '';
  } catch (fehler) {
    console.error(`Antwort des Finanzstatus nicht lesbar: ${fehler}`);
    return '';
  }
}

function finanzstatus() {
  const antwort = http.get(`${basisUrl}/api/konten`, { tags: { name: 'finanzstatus' } });
  check(antwort, { 'Finanzstatus antwortet 200': (r) => r.status === 200 }, { name: 'finanzstatus' });
}

function ueberweisung() {
  const auftrag = {
    // Eigene Kennung je Auftrag; eine Wiederholung derselben Kennung würde nicht erneut buchen.
    auftragsId: `last-${__VU}-${__ITER}-${Date.now()}`,
    auftraggeberIban: girokontoIban,
    empfaenger: EMPFAENGER,
    empfaengerIban: EMPFAENGER_IBAN,
    betrag: BETRAG,
    verwendungszweck: 'Lasttest Monatserste NFR-003',
    waehrung: 'EUR',
  };
  const antwort = http.post(`${basisUrl}/api/ueberweisungen`, JSON.stringify(auftrag), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'ueberweisung' },
  });
  const ok = antwort.status === 201 || antwort.status === 200;
  ueberweisungAusgefuehrt.add(ok);
  ueberweisungen.add(1);
  check(antwort, { 'Überweisung ausgeführt': () => ok }, { name: 'ueberweisung' });
}
