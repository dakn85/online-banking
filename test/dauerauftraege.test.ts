import assert from 'node:assert/strict';
import test from 'node:test';
import { aendern, anlegen, Dauerauftragsfehler, heute, liste, loeschen, zuruecksetzen } from '../src/dauerauftraege';

const LENA = 'lena.hoffmann';
const JONAS = 'jonas.weber';
const IBAN = 'DE89 3704 0044 0532 0130 00';
const gut = (aenderung: Record<string, unknown> = {}) => ({
  empfaenger: 'Möbel Nord GmbH', empfaengerIban: IBAN, betrag: 50, verwendungszweck: 'Rechnung 4711',
  turnus: 'monatlich', ersterAusfuehrungstag: heute(5), ...aenderung,
});
const status = (fn: () => unknown) => { try { fn(); } catch (e) { return (e as Dauerauftragsfehler).status; } return 0; };
const meldung = (fn: () => unknown) => { try { fn(); } catch (e) { return (e as Dauerauftragsfehler).message; } return ''; };

test('BR-0078 (WP-1): Liste, Ändern und Löschen sehen nur Daueraufträge der eigenen Kundin; fremde und unbekannte Kennung ist 404', () => {
  zuruecksetzen();
  const meiner = anlegen(LENA, gut());
  assert.equal(liste(JONAS).some(d => d.dauerauftragId === meiner.dauerauftragId), false);
  const jonas = liste(JONAS)[0].dauerauftragId;
  for (const id of [jonas, 'gibt-es-nicht']) {
    assert.equal(status(() => aendern(LENA, id, gut())), 404);
    assert.equal(meldung(() => aendern(LENA, id, gut())), 'Der Dauerauftrag existiert nicht mehr.');
    assert.equal(status(() => loeschen(LENA, id)), 404);
  }
  assert.equal(liste(JONAS).length, 1, 'fremder Dauerauftrag unverändert');
  loeschen(LENA, meiner.dauerauftragId);
  assert.equal(status(() => loeschen(LENA, meiner.dauerauftragId)), 404);
});

test('BR-0077 (WP-2): Pflicht und Format (400) kommen vor erstem Ausführungstag und Enddatum (422)', () => {
  zuruecksetzen();
  const vergangen = heute(-1);
  assert.equal(status(() => anlegen(LENA, gut({ verwendungszweck: '', ersterAusfuehrungstag: vergangen }))), 400);
  assert.equal(status(() => anlegen(LENA, gut({ empfaengerIban: 'TR330006100519786457841326', ersterAusfuehrungstag: vergangen }))), 400);
  assert.equal(status(() => anlegen(LENA, gut({ betrag: 0.09, ersterAusfuehrungstag: vergangen }))), 400);
  assert.equal(status(() => anlegen(LENA, gut({ ersterAusfuehrungstag: vergangen }))), 422);
  assert.equal(status(() => anlegen(LENA, gut({ turnus: 'wöchentlich' }))), 400);
  assert.equal(liste(LENA).length, 0, 'nichts gespeichert');
});

test('BR-0077 (WP-2): erster Ausführungstag heute und Enddatum gleich erstem Ausführungstag sind zulässig; Tag wird vor Enddatum geprüft', () => {
  zuruecksetzen();
  anlegen(LENA, gut({ ersterAusfuehrungstag: heute() }));
  anlegen(LENA, gut({ ersterAusfuehrungstag: heute(5), enddatum: heute(5) }));
  assert.equal(meldung(() => anlegen(LENA, gut({ ersterAusfuehrungstag: heute(-1), enddatum: heute(-2) }))), 'Der erste Ausführungstag darf nicht in der Vergangenheit liegen.');
  assert.equal(meldung(() => anlegen(LENA, gut({ ersterAusfuehrungstag: heute(10), enddatum: heute(5) }))), 'Das Enddatum darf nicht vor dem ersten Ausführungstag liegen.');
});

test('BR-0077 (WP-2): beim Ändern wird der erste Ausführungstag nur bei Abweichung gegen heute geprüft, das Enddatum immer', () => {
  zuruecksetzen();
  const d = liste(JONAS)[0];
  assert.equal(d.ersterAusfuehrungstag, heute(-30));
  assert.equal(aendern(JONAS, d.dauerauftragId, { ...d, betrag: 700 }).betrag, 700);
  assert.equal(status(() => aendern(JONAS, d.dauerauftragId, { ...d, enddatum: heute(-40) })), 422);
  assert.equal(meldung(() => aendern(JONAS, d.dauerauftragId, { ...d, ersterAusfuehrungstag: heute(-1) })), 'Der erste Ausführungstag darf nicht in der Vergangenheit liegen.');
  assert.equal(status(() => aendern(JONAS, d.dauerauftragId, { ...d, betrag: 0 })), 400);
  assert.equal(liste(JONAS)[0].betrag, 700);
});

test('UC-016: mehr als zwei Nachkommastellen werden mit 400 abgelehnt; Liste nach Tag, dann Empfänger sortiert; Auftraggeber ist das Girokonto', () => {
  zuruecksetzen();
  assert.equal(meldung(() => anlegen(LENA, gut({ betrag: 10.555 }))), 'Die Angaben zum Dauerauftrag sind unvollständig oder ungültig.');
  anlegen(LENA, gut({ empfaenger: 'Stadtwerke Nord' }));
  anlegen(LENA, gut({ empfaenger: 'Möbel Nord GmbH' }));
  anlegen(LENA, gut({ empfaenger: 'Zuerst', ersterAusfuehrungstag: heute(1) }));
  assert.deepEqual(liste(LENA).map(d => d.empfaenger), ['Zuerst', 'Möbel Nord GmbH', 'Stadtwerke Nord']);
  assert.equal(liste(LENA)[0].auftraggeberIban, 'DE02500105175407324911');
  assert.equal('enddatum' in liste(LENA)[0], false);
});
