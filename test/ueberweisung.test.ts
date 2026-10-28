import assert from 'node:assert/strict';
import test from 'node:test';
import { finanzstatus, zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { Ablehnung, ausfuehren, ibanGueltig, zuruecksetzen } from '../src/ueberweisung';

const GIRO = 'DE02500105175407324931';
const auftrag = (mehr = {}) => ({ auftragsId: 'a-1', auftraggeberIban: GIRO, empfaenger: 'Möbel Nord GmbH', empfaengerIban: 'DE89 3704 0044 0532 0130 00', betrag: 50, verwendungszweck: 'Rechnung 4711', ...mehr });
const frisch = () => { kontenZuruecksetzen(); zuruecksetzen(); };
const status = (fn: () => unknown) => { try { fn(); } catch (e) { return (e as Ablehnung).status; } return 0; };

test('WP-1: IBAN-Prüfziffer nach ISO 7064 MOD 97-10 und SEPA-Länderliste', () => {
  assert.ok(ibanGueltig('DE89 3704 0044 0532 0130 00'));
  assert.ok(!ibanGueltig('DE00 1234 5678 9012 3456 78'));
  assert.ok(!ibanGueltig('TR330006100519786457841326'), 'gültig, aber außerhalb des SEPA-Raums');
});

test('BR-0006: die Überweisung mindert Saldo und Gesamtvermögen', () => {
  frisch();
  assert.equal(ausfuehren(auftrag()).neu, true);
  assert.equal(finanzstatus().konten[0].saldo, 2095.3);
  assert.equal(finanzstatus().gesamtvermoegen, 1707.85);
});

test('BR-0005: dieselbe Auftrags-Kennung bucht nur einmal', () => {
  frisch();
  ausfuehren(auftrag());
  assert.equal(ausfuehren(auftrag()).neu, false);
  assert.equal(finanzstatus().konten[0].saldo, 2095.3);
});

test('BR-0003, BR-0004, BR-0007: Ablehnungen buchen nichts', () => {
  frisch();
  assert.equal(status(() => ausfuehren(auftrag({ empfaengerIban: 'DE00123456789012345678' }))), 400);
  assert.equal(status(() => ausfuehren(auftrag({ auftragsId: 'a-2', betrag: 3145.31 }))), 422);
  assert.equal(status(() => ausfuehren(auftrag({ auftragsId: 'a-3', betrag: 0 }))), 422);
  assert.equal(status(() => ausfuehren(auftrag({ auftragsId: 'a-4', auftraggeberIban: 'DE44500105175407324955' }))), 403);
  assert.equal(finanzstatus().konten[0].saldo, 2145.3);
  assert.equal(status(() => ausfuehren(auftrag({ auftragsId: 'a-5', betrag: 3145.3 }))), 0, 'genau der verfügbare Betrag geht');
});
