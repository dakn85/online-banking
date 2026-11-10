import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request, Response } from 'express';
import {
  anlegen, BETRAG_FEHLER, Dauerauftragsfehler, Eingabe, ERSTE_AUSFUEHRUNG_FEHLER, liste, loeschen, NICHT_GEFUNDEN, TAG_FEHLER, zuruecksetzen,
} from '../src/dauerauftraege';
import { finanzstatus, zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { nurAngemeldet } from '../src/sitzung';
import { IBAN_FEHLER } from '../src/ueberweisung';

/* UC-005 Dauerauftrag einrichten, ansehen und löschen: WP-1 und WP-2. */
const HEUTE = '2026-11-10';
const GIRO = 'DE02500105175407324931';
const KREDITKARTE = 'DE44500105175407324955';
const gut: Eingabe = {
  auftraggeberIban: GIRO, empfaenger: 'Möbel Nord GmbH', empfaengerIban: 'DE89 3704 0044 0532 0130 00',
  betrag: 50, ausfuehrungstag: 15, ersteAusfuehrung: '2026-11-15', verwendungszweck: 'Miete März',
};
/** Status und Meldung der Ablehnung, sonst der Status 201 des Vertrags. */
const antwort = (kennung: string, eingabe: Eingabe) => {
  try { anlegen(kennung, eingabe, HEUTE); } catch (e) { const f = e as Dauerauftragsfehler; return `${f.status} ${f.message}`; }
  return '201';
};
const vorher = () => { kontenZuruecksetzen(); zuruecksetzen(); };

test('UC-005: ein Dauerauftrag wird gespeichert wie eingegeben, die Kennung vergibt der Dienst', () => {
  vorher();
  const d = anlegen('lena.hoffmann', { ...gut, betrag: 50.129 }, HEUTE);
  assert.deepEqual(d, {
    dauerauftragsId: 'DA-2026-00001', auftraggeberIban: GIRO, empfaenger: 'Möbel Nord GmbH', empfaengerIban: 'DE89370400440532013000',
    betrag: 50.13, waehrung: 'EUR', ausfuehrungstag: 15, ersteAusfuehrung: '2026-11-15', verwendungszweck: 'Miete März',
  }, 'IBAN ohne Leerzeichen, Betrag auf Cent gerundet (ADR-005)');
  assert.deepEqual(liste('lena.hoffmann'), [d]);
});

test('WP-1, BR-0020: IBAN des Empfängers mit Prüfziffer nach ISO 7064 MOD 97-10, 15 bis 34 Stellen, SEPA-Land', () => {
  vorher();
  for (const empfaengerIban of ['DE89 3704 0044 0532 0130 01', 'TR33 0006 1005 1978 6457 8413 26', 'DE8937040044', '', undefined]) {
    assert.equal(antwort('lena.hoffmann', { ...gut, empfaengerIban }), `400 ${IBAN_FEHLER}`, String(empfaengerIban));
  }
  assert.equal(antwort('lena.hoffmann', { ...gut, empfaengerIban: 'NL91 ABNA 0417 1643 00' }), '201');
  assert.equal(liste('lena.hoffmann').length, 1);
});

test('WP-1, BR-0021: Betrag mindestens 0,01 Euro, ohne Vergleich mit dem verfügbaren Betrag', () => {
  vorher();
  for (const betrag of [0, 0.009, -5, '50', null, undefined, Number.NaN]) {
    assert.equal(antwort('lena.hoffmann', { ...gut, betrag }), `400 ${BETRAG_FEHLER}`, String(betrag));
  }
  assert.equal(antwort('lena.hoffmann', { ...gut, waehrung: 'USD' }), `400 ${BETRAG_FEHLER}`, 'lautet auf Euro');
  assert.equal(antwort('lena.hoffmann', { ...gut, betrag: 0.01, waehrung: 'EUR' }), '201');
  const verfuegbar = finanzstatus().konten[0].verfuegbarerBetrag!;
  assert.equal(antwort('lena.hoffmann', { ...gut, betrag: verfuegbar + 10000 }), '201', 'über dem verfügbaren Betrag');
  assert.equal(finanzstatus().konten[0].verfuegbarerBetrag, verfuegbar, 'das Anlegen bucht nichts');
});

test('WP-1, BR-0022: Ausführungstag ist eine ganze Zahl von 1 bis 28', () => {
  vorher();
  for (const ausfuehrungstag of [0, 29, 31, -1, 1.5, '15', null, undefined]) {
    assert.equal(antwort('lena.hoffmann', { ...gut, ausfuehrungstag }), `400 ${TAG_FEHLER}`, String(ausfuehrungstag));
  }
  assert.equal(antwort('lena.hoffmann', { ...gut, ausfuehrungstag: 1 }), '201');
  assert.equal(antwort('lena.hoffmann', { ...gut, ausfuehrungstag: 28 }), '201');
});

test('BR-0023: erste Ausführung ab dem heutigen Tag, sie darf vom Ausführungstag abweichen', () => {
  vorher();
  assert.equal(antwort('lena.hoffmann', { ...gut, ersteAusfuehrung: '2026-11-09' }), `400 ${ERSTE_AUSFUEHRUNG_FEHLER}`);
  assert.equal(antwort('lena.hoffmann', { ...gut, ersteAusfuehrung: HEUTE, ausfuehrungstag: 3 }), '201', 'heute, anderer Ausführungstag');
  for (const ersteAusfuehrung of ['2026-02-30', '15.11.2026', '', undefined]) {
    assert.match(antwort('lena.hoffmann', { ...gut, ersteAusfuehrung }), /^400 /, `kein Datum: ${ersteAusfuehrung}`);
  }
});

test('UC-005 Schritt 4 und 5: Reihenfolge IBAN, Betrag, Ausführungstag, erste Ausführung, zuletzt das Auftraggeberkonto (403)', () => {
  vorher();
  const alles = { ...gut, auftraggeberIban: KREDITKARTE, empfaengerIban: 'TR33 0006 1005 1978 6457 8413 26', betrag: 0, ausfuehrungstag: 31, ersteAusfuehrung: '2026-11-09' };
  assert.equal(antwort('lena.hoffmann', alles), `400 ${IBAN_FEHLER}`);
  assert.equal(antwort('lena.hoffmann', { ...alles, empfaengerIban: gut.empfaengerIban }), `400 ${BETRAG_FEHLER}`);
  assert.equal(antwort('lena.hoffmann', { ...alles, empfaengerIban: gut.empfaengerIban, betrag: 50 }), `400 ${TAG_FEHLER}`);
  assert.equal(antwort('lena.hoffmann', { ...alles, empfaengerIban: gut.empfaengerIban, betrag: 50, ausfuehrungstag: 15 }), `400 ${ERSTE_AUSFUEHRUNG_FEHLER}`);
  assert.match(antwort('lena.hoffmann', { ...gut, auftraggeberIban: KREDITKARTE }), /^403 /, 'BR-0024: kein Girokonto der Kundin');
  assert.match(antwort('lena.hoffmann', { ...gut, auftraggeberIban: 'DE00000000000000000000' }), /^403 /, 'unbekanntes Konto');
  assert.deepEqual(liste('lena.hoffmann'), [], 'bei einer Abweichung wird nichts angelegt');
});

test('Pflichtangaben und Längen des Schemas DauerauftragAnlegen', () => {
  vorher();
  assert.match(antwort('lena.hoffmann', { ...gut, empfaenger: '  ' }), /^400 /);
  assert.match(antwort('lena.hoffmann', { ...gut, verwendungszweck: undefined }), /^400 /);
  assert.match(antwort('lena.hoffmann', { ...gut, auftraggeberIban: undefined }), /^400 /);
  assert.match(antwort('lena.hoffmann', { ...gut, empfaenger: 'x'.repeat(71) }), /^400 /);
  assert.match(antwort('lena.hoffmann', { ...gut, verwendungszweck: 'z'.repeat(141) }), /^400 /);
  assert.equal(antwort('lena.hoffmann', { ...gut, empfaenger: 'x'.repeat(70), verwendungszweck: 'z'.repeat(140) }), '201');
});

test('UC-005 Schritt 2: Liste nach erster Ausführung aufsteigend', () => {
  vorher();
  anlegen('lena.hoffmann', { ...gut, empfaenger: 'Spät', ersteAusfuehrung: '2027-01-05' }, HEUTE);
  anlegen('lena.hoffmann', { ...gut, empfaenger: 'Früh', ersteAusfuehrung: '2026-11-11' }, HEUTE);
  anlegen('lena.hoffmann', { ...gut, empfaenger: 'Früh, später angelegt', ersteAusfuehrung: '2026-11-11' }, HEUTE);
  assert.deepEqual(liste('lena.hoffmann').map(d => d.empfaenger), ['Früh', 'Früh, später angelegt', 'Spät']);
});

test('WP-2, BR-0024: der Dienst liefert und löscht nur Daueraufträge der angemeldeten Kundin, sonst 404', () => {
  vorher();
  const lena = anlegen('lena.hoffmann', gut, HEUTE);
  const jonas = anlegen('jonas.weber', { ...gut, empfaenger: 'Stadtwerke' }, HEUTE);
  assert.notEqual(lena.dauerauftragsId, jonas.dauerauftragsId, 'Kennung eindeutig');
  assert.deepEqual(liste('lena.hoffmann').map(d => d.empfaenger), ['Möbel Nord GmbH']);
  assert.deepEqual(liste('jonas.weber').map(d => d.empfaenger), ['Stadtwerke']);
  const status = (kennung: string, id: string) => {
    try { loeschen(kennung, id); } catch (e) { const f = e as Dauerauftragsfehler; return `${f.status} ${f.message}`; }
    return '204';
  };
  assert.equal(status('lena.hoffmann', jonas.dauerauftragsId), `404 ${NICHT_GEFUNDEN}`, 'fremde Kennung');
  assert.equal(status('lena.hoffmann', 'DA-2026-99999'), `404 ${NICHT_GEFUNDEN}`, 'unbekannte Kennung');
  assert.equal(liste('jonas.weber').length, 1, 'der fremde Dauerauftrag bleibt');
  assert.equal(status('lena.hoffmann', lena.dauerauftragsId), '204');
  assert.deepEqual(liste('lena.hoffmann'), []);
  assert.equal(status('lena.hoffmann', lena.dauerauftragsId), `404 ${NICHT_GEFUNDEN}`, 'schon gelöscht');
});

test('WP-2, BR-0024: ohne gültige Sitzung antwortet die API mit 401', () => {
  let status = 0;
  let weiter = false;
  const res = { locals: {}, status(s: number) { status = s; return this; }, json() { return this; } } as unknown as Response;
  nurAngemeldet('api')({ headers: {} } as Request, res, () => { weiter = true; });
  assert.equal(status, 401);
  assert.equal(weiter, false, 'die Route wird nicht erreicht');
});

test('ADR-002: der Ausgangsstand hat keine Daueraufträge', () => {
  vorher();
  anlegen('lena.hoffmann', gut, HEUTE);
  zuruecksetzen();
  assert.deepEqual(liste('lena.hoffmann'), []);
  assert.equal(anlegen('lena.hoffmann', gut, HEUTE).dauerauftragsId, 'DA-2026-00001');
});
