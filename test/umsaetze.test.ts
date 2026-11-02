import assert from 'node:assert/strict';
import test from 'node:test';
import { zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { ausfuehren, zuruecksetzen as auftraegeZuruecksetzen } from '../src/ueberweisung';
import { Abfragefehler, ZEITRAUM_FEHLER, filterAus, umsaetzeVon, zuruecksetzen } from '../src/umsaetze';

const GIRO = 'DE02500105175407324931';
const KARTE = 'DE44500105175407324955';

function ausgangsstand() {
  kontenZuruecksetzen();
  auftraegeZuruecksetzen();
  zuruecksetzen();
}

const ueberweisen = (auftragsId: string, empfaenger: string, betrag: number, verwendungszweck: string) => ausfuehren({
  auftragsId, auftraggeberIban: GIRO, empfaenger, empfaengerIban: 'DE89370400440532013000', betrag, verwendungszweck,
});

test('C-001/BR-0008: Demo-Umsätze neueste zuerst, der jüngste trägt den Kontosaldo', () => {
  ausgangsstand();
  const giro = umsaetzeVon(GIRO)!;
  assert.ok(giro.length >= 3);
  assert.equal(giro[0].saldoDanach, 2145.3);
  assert.deepEqual(giro.map(u => u.buchungstag), [...giro.map(u => u.buchungstag)].sort().reverse());
  // Saldo danach geht rückwärts auf: jeder Vorgänger ist Saldo danach minus Betrag.
  for (let i = 1; i < giro.length; i++) assert.equal(Math.round((giro[i - 1].saldoDanach - giro[i - 1].betrag) * 100) / 100, giro[i].saldoDanach);
  assert.equal(umsaetzeVon(KARTE)![0].saldoDanach, -387.45);
});

test('C-001: Demo-Umsätze tragen keinen Suchtext der Szenarien', () => {
  ausgangsstand();
  for (const iban of [GIRO, KARTE]) assert.deepEqual(umsaetzeVon(iban, { suchtext: 'Möbel' }), []);
});

test('BR-0012/BR-0008: Überweisungen werden Umsätze, die zuletzt gebuchte oben, Saldo danach gemindert; doppelt bestätigt einmal', () => {
  ausgangsstand();
  ueberweisen('a1', 'Möbel Nord GmbH', 50, 'Rechnung 4711');
  ueberweisen('a2', 'Möbel Nord GmbH', 12, 'Rechnung 4712');
  ueberweisen('a2', 'Möbel Nord GmbH', 12, 'Rechnung 4712');
  const moebel = umsaetzeVon(GIRO, { suchtext: 'möbel' })!;
  assert.deepEqual(moebel.map(u => [u.verwendungszweck, u.betrag, u.saldoDanach]), [['Rechnung 4712', -12, 2083.3], ['Rechnung 4711', -50, 2095.3]]);
  assert.equal(moebel[0].buchungstag, moebel[0].gebuchtAm.slice(0, 10));
  assert.equal(umsaetzeVon(GIRO)![0].verwendungszweck, 'Rechnung 4712');
});

test('BR-0009/BR-0010: Richtung, Zeitraum mit eingeschlossenen Grenzen, Suche im Verwendungszweck', () => {
  ausgangsstand();
  assert.ok(umsaetzeVon(GIRO, { richtung: 'eingang' })!.every(u => u.betrag > 0));
  assert.ok(umsaetzeVon(GIRO, { richtung: 'ausgang' })!.every(u => u.betrag < 0));
  const tag = umsaetzeVon(GIRO)![0].buchungstag;
  assert.equal(umsaetzeVon(GIRO, { von: tag, bis: tag })!.length, 1);
  assert.deepEqual(umsaetzeVon(GIRO, { von: '2020-01-01', bis: '2020-12-31' }), []);
  assert.equal(umsaetzeVon(GIRO, { suchtext: 'GEHALT' })!.length, 1);
});

test('BR-0010: Von nach Bis ist 400 mit Meldung; Format und Richtung werden geprüft', () => {
  assert.throws(() => filterAus({ von: '2026-03-31', bis: '2026-03-01' }), (e: unknown) => e instanceof Abfragefehler && e.message === ZEITRAUM_FEHLER);
  assert.throws(() => filterAus({ von: '31.03.2026' }), Abfragefehler);
  assert.throws(() => filterAus({ richtung: 'seitwaerts' }), Abfragefehler);
  assert.deepEqual(filterAus({ von: '', bis: '', suchtext: '  ' }), { suchtext: undefined, von: undefined, bis: undefined, richtung: 'alle' });
});

test('BR-0011: fremde IBAN liefert nichts, Leerzeichen in der IBAN zählen nicht', () => {
  ausgangsstand();
  assert.equal(umsaetzeVon('DE00123456789012345678'), undefined);
  assert.ok(umsaetzeVon('DE02 5001 0517 5407 3249 31')?.length);
});
