import assert from 'node:assert/strict';
import test from 'node:test';
import { finanzstatus, zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { setzen, zuruecksetzen as limitZuruecksetzen } from '../src/tageslimit';
import { Ablehnung, ausfuehren, ibanGueltig, zuruecksetzen } from '../src/ueberweisung';

const LENA = { kennung: 'lena.hoffmann' };
const GIRO = 'DE02500105175407324911';
const auftrag = (mehr = {}) => ({ auftragsId: 'a-1', auftraggeberIban: GIRO, empfaenger: 'Möbel Nord GmbH', empfaengerIban: 'DE89 3704 0044 0532 0130 00', betrag: 50, verwendungszweck: 'Rechnung 4711', ...mehr });
const frisch = () => { kontenZuruecksetzen(); zuruecksetzen(); limitZuruecksetzen(); };
const status = (fn: () => unknown) => { try { fn(); } catch (e) { return (e as Ablehnung).status; } return 0; };

test('WP-1: IBAN-Prüfziffer nach ISO 7064 MOD 97-10 und SEPA-Länderliste', () => {
  assert.ok(ibanGueltig('DE89 3704 0044 0532 0130 00'));
  assert.ok(!ibanGueltig('DE00 1234 5678 9012 3456 78'));
  assert.ok(!ibanGueltig('TR330006100519786457841326'), 'gültig, aber außerhalb des SEPA-Raums');
});

test('BR-0006: die Überweisung mindert Saldo und Gesamtvermögen', () => {
  frisch();
  assert.equal(ausfuehren(LENA, auftrag()).neu, true);
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2095.3);
  assert.equal(finanzstatus(LENA.kennung).gesamtvermoegen, 1707.85);
});

test('BR-0005: dieselbe Auftrags-Kennung bucht nur einmal', () => {
  frisch();
  ausfuehren(LENA, auftrag());
  assert.equal(ausfuehren(LENA, auftrag()).neu, false);
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2095.3);
});

test('BR-0003, BR-0004, BR-0007: Ablehnungen buchen nichts', () => {
  frisch();
  assert.equal(status(() => ausfuehren(LENA, auftrag({ empfaengerIban: 'DE00123456789012345678' }))), 400);
  assert.equal(status(() => ausfuehren(LENA, auftrag({ auftragsId: 'a-2', betrag: 3145.31 }))), 422);
  assert.equal(status(() => ausfuehren(LENA, auftrag({ auftragsId: 'a-4', auftraggeberIban: 'DE44500105175407325028' }))), 403);
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2145.3);
  assert.equal(status(() => ausfuehren(LENA, auftrag({ auftragsId: 'a-5', betrag: 3145.3 }))), 0, 'genau der verfügbare Betrag geht');
});

test('UC-002 A8: ein Betrag unter 0,10 € wird mit 400 abgelehnt und bucht nichts, 0,10 € geht', () => {
  frisch();
  for (const [auftragsId, betrag] of [['m-1', 0.09], ['m-2', 0], ['m-3', -5], ['m-4', Number.NaN]] as const) {
    assert.equal(status(() => ausfuehren(LENA, auftrag({ auftragsId, betrag }))), 400, `Betrag ${betrag}`);
  }
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2145.3);
  assert.equal(status(() => ausfuehren(LENA, auftrag({ auftragsId: 'm-5', betrag: 0.1 }))), 0, 'genau 0,10 € geht');
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2145.2);
});

test('BR-0070: Tageslimit zählt die Ausgänge des Tages, Grenze zulässig, abgelehnte zählen nicht', () => {
  frisch();
  setzen(LENA.kennung, 100);
  assert.equal(status(() => ausfuehren(LENA, auftrag({ auftragsId: 'l-1', betrag: 150 }))), 422);
  assert.equal(ausfuehren(LENA, auftrag({ auftragsId: 'l-2', betrag: 60 })).neu, true);
  assert.equal(status(() => ausfuehren(LENA, auftrag({ auftragsId: 'l-3', betrag: 50 }))), 422);
  assert.equal(ausfuehren(LENA, auftrag({ auftragsId: 'l-4', betrag: 40 })).neu, true, 'Summe genau in Höhe des Limits');
  assert.equal(ausfuehren(LENA, auftrag({ auftragsId: 'l-2', betrag: 60 })).neu, false, 'Wiederholung wird nicht erneut geprüft');
});

test('BR-0070: Tageslimit 0,00 sperrt jede Überweisung, BR-0004 geht vor', () => {
  frisch();
  setzen(LENA.kennung, 0);
  assert.equal(status(() => ausfuehren(LENA, auftrag())), 422);
  assert.throws(() => ausfuehren(LENA, auftrag({ auftragsId: 'z-2', betrag: 99999 })), /verfügbaren Betrag/);
});

test('BR-0070: der Reset leert die Ausgänge des Tages', () => {
  frisch();
  setzen(LENA.kennung, 50);
  ausfuehren(LENA, auftrag());
  frisch();
  setzen(LENA.kennung, 50);
  assert.equal(ausfuehren(LENA, auftrag({ auftragsId: 'n-1' })).neu, true);
});
