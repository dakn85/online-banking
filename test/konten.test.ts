import assert from 'node:assert/strict';
import test from 'node:test';
import { Datenfehler, finanzstatus, kontenSetzen, zuruecksetzen } from '../src/konten';

test('BR-0001: Gesamtvermögen ist die Summe aller Salden, die Kreditkarte mindert es', () => {
  zuruecksetzen();
  assert.equal(finanzstatus().gesamtvermoegen, 1757.85);
});

test('BR-0002: verfügbarer Betrag nur beim Girokonto, Saldo plus Rahmen', () => {
  zuruecksetzen();
  const [giro, karte] = finanzstatus().konten;
  assert.equal(giro.verfuegbarerBetrag, 3145.3);
  assert.equal('verfuegbarerBetrag' in karte, false);
  assert.equal('dispositionsrahmen' in karte, false);
});

test('Ein Girokonto ohne Dispositionsrahmen ist ein Datenfehler', () => {
  kontenSetzen([{ kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE02500105175407324931', saldo: 10, waehrung: 'EUR' }]);
  assert.throws(() => finanzstatus(), Datenfehler);
  zuruecksetzen();
});
