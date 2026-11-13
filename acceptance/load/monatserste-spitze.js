// NFR-003 – Antwortzeit von Finanzstatus und Überweisung
// NFR-004 – Verfügbarkeit von Finanzstatus und Überweisung
//
// NFR-003: GET /api/konten und POST /api/ueberweisungen antworten in mindestens 95 % der Aufrufe in
// höchstens 500 ms, auch in der Lastspitze am Monatsersten: 15 Minuten Beharrungszustand mit 300
// gleichzeitig angemeldeten Kundinnen, rund 20 Finanzstatus-Aufrufen je Sekunde, jede zehnte Runde
// zusätzlich eine Überweisung.
// NFR-004: dieselben Aufrufe werden in mindestens 99,5 % der Fälle nicht mit 5xx beantwortet;
// fachliche Ablehnungen mit 4xx zählen als erfolgreich. Beide Anforderungen misst derselbe Lauf.
//
// Lastmodell: geschlossen. Die 300 VUs sind die 300 gleichzeitig angemeldeten Kundinnen; nach jeder
// Runde wartet eine Kundin ihre Denkzeit ab (300 Kundinnen / 15 s Denkzeit = 20 Finanzstatus-Aufrufe je
// Sekunde, jede zehnte Runde eine Überweisung = rund 2 je Sekunde). Anlauf, 15 Minuten Beharrung,
// Ablauf.
//
// Anmeldung: Die Seite /anmelden ist keine Anmeldeschnittstelle. Der Dienst meldet über
// POST /api/anmeldung an (in docs/architecture.md als „Anmeldung und Sitzung“ geführt); die Feldnamen
// Kennung und PIN stehen im Anmeldeformular. Antwortet dieser Aufruf nicht mit Erfolg, postet das
// Skript das Formular der Anmeldeseite so, wie die Seite es selbst ausliefert: action, Methode und alle
// Felder (samt verstecktem Token und Wert) werden aus dem gelieferten HTML gelesen, nur die beiden
// Eingabefelder werden mit Kennung und PIN belegt. Erfolg ist erst, wenn GET /api/konten mit 200
// antwortet – der Statuscode der Anmeldung allein genügt nicht.
//
// Sitzung: Der Dienst hält die Sitzung in einem Cookie. k6 leert den Cookie-Jar standardmäßig am Ende
// jeder Iteration – dann laufen alle folgenden Aufrufe ohne Sitzung und antworten 401. Ein Lauf über
// Iterationen braucht deshalb options.noCookiesReset: true; sonst misst er nur Anmeldungen und 401er.
// Weil eine 401 keine fachliche Ablehnung, sondern eine fehlende Sitzung ist, zählt sie NICHT als
// Erfolg: sitzung_gueltig bricht den Lauf ab, sobald die Sitzung nicht mehr steht.
//
// Prüfgrößen je Aufrufart, an den Namen des Aufrufs gebunden:
//   NFR-003  p95 der Antwortzeit <= 500 ms für finanzstatus und ueberweisung
//   NFR-004  Anteil der Antworten mit 5xx < 0,5 % für finanzstatus und ueberweisung
//            (4xx gilt als Erfolg: erwartete Antworten sind 200–499, Fehler sind nur 5xx und Netzfehler)
// Wächter: anmeldung_erfolgreich > 99 % bricht den Lauf nach 30 s selbst ab, wenn die Anmeldung nicht
// gelingt; sitzung_gueltig > 99 % und ueberweisung_ausgefuehrt > 99 % ebenso, damit ein Lauf, der keine
// Überweisung ausführt, nicht 15 Minuten lang Zeitziele misst, die er nicht geprüft hat.
//
// Kundinnen und Zugänge stehen als Testdaten in load/data/kundinnen.csv, je VU eine Zeile.

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

const basisUrl = (__ENV.BANKING_URL || __ENV.BASE_URL || '').replace(/\/$/, '');
if (!basisUrl) {
  throw new Error('BANKING_URL fehlt: die Adresse des Systems liefert die Umgebung des Lasttests.');
}

const kundinnen = new SharedArray('kundinnen', () => {
  // open() löst relativ zur Skriptdatei auf: load/data/kundinnen.csv.
  return open('./data/kundinnen.csv')
    .split(/\r?\n/)
    .map((zeile) => zeile.trim())
    .filter((zeile) => zeile.length > 0)
    .slice(1)
    .map((zeile) => {
      const felder = zeile.split(',');
      return { kennung: (felder[0] || '').trim(), pin: (felder[1] || '').trim() };
    });
});

if (kundinnen.length === 0) {
  throw new Error('load/data/kundinnen.csv enthält keine Kundin (Kopfzeile kennung,pin, dann eine Zeile je Kundin).');
}

// Lastniveau aus NFR-003
const KUNDINNEN = 300;
const AUFRUFE_JE_SEKUNDE = 20;
const UEBERWEISUNG_JEDE = 10;
const DENKZEIT_SEKUNDEN = KUNDINNEN / AUFRUFE_JE_SEKUNDE;

// Empfängerin der Lastüberweisungen: Testdaten des Projekts.
const EMPFAENGER = 'Lasttest Monatserste';
const EMPFAENGER_IBAN = __ENV.LASTTEST_EMPFAENGER_IBAN || 'DE89370400440532013000';
const BETRAG = 0.01;

// NFR-004: 4xx ist eine fachliche Ablehnung und zählt als Erfolg, Fehler sind 5xx und Netzfehler.
const erwarteteAntwort = http.expectedStatuses({ min: 200, max: 499 });

const anmeldungErfolgreich = new Rate('anmeldung_erfolgreich');
const sitzungGueltig = new Rate('sitzung_gueltig');
const ueberweisungAusgefuehrt = new Rate('ueberweisung_ausgefuehrt');
const ueberweisungen = new Counter('ueberweisungen');

export const options = {
  // Die VU bleibt über alle Iterationen dieselbe angemeldete Kundin: den Sitzungscookie behalten.
  noCookiesReset: true,
  scenarios: {
    monatserste: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: KUNDINNEN },
        { duration: '15m', target: KUNDINNEN },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
      tags: { nfr: 'NFR-003' },
    },
  },
  thresholds: {
    'http_req_duration{name:finanzstatus}': ['p(95)<=500'],
    'http_req_duration{name:ueberweisung}': ['p(95)<=500'],
    'http_req_failed{name:finanzstatus}': ['rate<0.005'],
    'http_req_failed{name:ueberweisung}': ['rate<0.005'],
    'anmeldung_erfolgreich': [{ threshold: 'rate>0.99', abortOnFail: true, delayAbortEval: '30s' }],
    'sitzung_gueltig': [{ threshold: 'rate>0.99', abortOnFail: true, delayAbortEval: '60s' }],
    'ueberweisung_ausgefuehrt': [{ threshold: 'rate>0.99', abortOnFail: true, delayAbortEval: '120s' }],
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
    girokontoIban = anmelden(kundinnen[(__VU - 1) % kundinnen.length]);
    angemeldet = girokontoIban !== '';
  }

  if (angemeldet) {
    finanzstatus();

    runden += 1;
    if (runden % UEBERWEISUNG_JEDE === 0) ueberweisung();
  }

  // Denkzeit: hält 300 Kundinnen bei rund 20 Finanzstatus-Aufrufen je Sekunde. Auch eine gescheiterte
  // Runde wartet sie ab und wiederholt sich nicht im Sekundentakt.
  const rest = DENKZEIT_SEKUNDEN * 1000 - (Date.now() - beginn);
  sleep(rest > 0 ? rest / 1000 : 0);
}

/** Meldet die Kundin dieses VU an und gibt die IBAN ihres Girokontos zurück. */
function anmelden(kundin) {
  const seite = http.get(`${basisUrl}/anmelden`, {
    tags: { name: 'anmeldeseite' },
    responseCallback: erwarteteAntwort,
  });

  let wege = meldePerApi(kundin) ? 'POST /api/anmeldung' : '';
  if (!wege) wege = meldePerFormular(kundin, seite.body || '') ? 'Formular der Anmeldeseite' : '';

  // Die Sitzung wird am Dienst geprüft; dieser Aufruf zählt nicht als Messung des Finanzstatus.
  const probe = http.get(`${basisUrl}/api/konten`, {
    tags: { name: 'anmelden-pruefung' },
    responseCallback: erwarteteAntwort,
  });
  const ok = probe.status === 200;
  anmeldungErfolgreich.add(ok);
  if (!ok) {
    console.error(`Anmeldung fehlgeschlagen: Anmeldeweg ${wege || 'keiner'}, GET /api/konten ${probe.status}`);
    return '';
  }
  return girokontoAus(probe.body);
}

/** Anmeldung an der Schnittstelle des Dienstes: Kennung und PIN als JSON. */
function meldePerApi(kundin) {
  const antwort = http.post(
    `${basisUrl}/api/anmeldung`,
    JSON.stringify({ kennung: kundin.kennung, pin: kundin.pin }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'anmeldung' }, responseCallback: erwarteteAntwort },
  );
  return antwort.status >= 200 && antwort.status < 300;
}

/**
 * Anmeldung über das Formular, das die Anmeldeseite selbst ausliefert: action, Methode und alle Felder
 * kommen aus dem HTML, sodass auch ein Token mitgeht. Belegt werden nur die Eingabefelder: das
 * Passwortfeld mit der PIN, die übrigen sichtbaren Felder mit der Kennung.
 */
function meldePerFormular(kundin, html) {
  const formular = /<form\b([^>]*)>([\s\S]*?)<\/form>/i.exec(html);
  if (!formular) return false;

  const attribut = (tag, name) => {
    const treffer = new RegExp(name + '\\s*=\\s*"([^"]*)"', 'i').exec(tag);
    return treffer ? treffer[1] : '';
  };

  const action = attribut(formular[1], 'action') || '/anmelden';
  const felder = {};
  const eingabe = /<input\b([^>]*)>/gi;
  let tag = eingabe.exec(formular[2]);
  while (tag !== null) {
    const name = attribut(tag[1], 'name');
    if (name) felder[name] = attribut(tag[1], 'value');
    tag = eingabe.exec(formular[2]);
  }

  const typen = /<input\b([^>]*)>/gi;
  tag = typen.exec(formular[2]);
  while (tag !== null) {
    const name = attribut(tag[1], 'name');
    const typ = (attribut(tag[1], 'type') || 'text').toLowerCase();
    if (name && typ === 'password') felder[name] = kundin.pin;
    else if (name && (typ === 'text' || typ === 'email' || typ === 'tel')) felder[name] = kundin.kennung;
    tag = typen.exec(formular[2]);
  }

  const ziel = /^https?:/i.test(action) ? action : `${basisUrl}${action.charAt(0) === '/' ? '' : '/'}${action}`;
  const antwort = http.post(ziel, felder, { tags: { name: 'anmeldung-formular' }, responseCallback: erwarteteAntwort });
  return antwort.status >= 200 && antwort.status < 400;
}

function girokontoAus(rumpf) {
  try {
    const uebersicht = JSON.parse(rumpf);
    const konten = uebersicht.konten || [];
    for (let i = 0; i < konten.length; i++) {
      if (konten[i].art === 'Girokonto' && konten[i].iban) return konten[i].iban;
    }
    console.error('Finanzstatus nennt kein Girokonto');
    return '';
  } catch (fehler) {
    console.error(`Antwort des Finanzstatus nicht lesbar: ${fehler}`);
    return '';
  }
}

function finanzstatus() {
  const antwort = http.get(`${basisUrl}/api/konten`, {
    tags: { name: 'finanzstatus' },
    responseCallback: erwarteteAntwort,
  });
  check(antwort, { 'Finanzstatus antwortet 200': (r) => r.status === 200 }, { name: 'finanzstatus' });
  // 401 heißt: keine Sitzung. Das ist kein Messergebnis, sondern ein kaputter Lauf.
  sitzungGueltig.add(antwort.status !== 401);
  // Eine abgelaufene Sitzung soll nicht dazu führen, dass der Rest des Laufs nur 401er misst.
  if (antwort.status === 401) angemeldet = false;
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
    responseCallback: erwarteteAntwort,
  });
  const ok = antwort.status === 200 || antwort.status === 201;
  ueberweisungAusgefuehrt.add(ok);
  ueberweisungen.add(1);
  sitzungGueltig.add(antwort.status !== 401);
  if (antwort.status === 401) angemeldet = false;
  if (!ok) console.error(`Überweisung nicht ausgeführt: ${antwort.status} ${String(antwort.body).slice(0, 200)}`);
  check(antwort, { 'Überweisung ausgeführt': () => ok }, { name: 'ueberweisung' });
}
