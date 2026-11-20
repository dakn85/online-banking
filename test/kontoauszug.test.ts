import assert from 'node:assert/strict';
import test from 'node:test';
import { Monatsfehler, MONAT_UNGUELTIG, auszugAus, monatPruefen, pdfAus } from '../src/kontoauszug';
import { kontoMitIban, zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { Umsatz, heuteUtc, umsaetzeVon, zuruecksetzen } from '../src/umsaetze';

const LENA = 'lena.hoffmann';
const GIRO = 'DE02500105175407324931';
const KARTE = 'DE44500105175407324955';
const TAGESGELD = 'DE97500105175407324947';

function ausgangsstand() {
  kontenZuruecksetzen();
  zuruecksetzen();
}
const auszug = (iban: string, monat: string) => {
  ausgangsstand();
  return auszugAus(kontoMitIban(LENA, iban)!, umsaetzeVon(LENA, iban)!, monat);
};

test('UC-024: Monat muss JJJJ-MM sein und darf nicht nach dem laufenden Monat liegen', () => {
  const dieser = heuteUtc().slice(0, 7);
  assert.equal(monatPruefen(dieser), dieser);
  assert.equal(monatPruefen('2026-02'), '2026-02');
  const naechster = new Date(Date.UTC(Number(dieser.slice(0, 4)), Number(dieser.slice(5)), 1)).toISOString().slice(0, 7);
  for (const falsch of [naechster, '2026-13', '2026-2', '26-02', '', undefined, 202602]) {
    assert.throws(() => monatPruefen(falsch), (f: Error) => f instanceof Monatsfehler && f.message === MONAT_UNGUELTIG);
  }
});

test('BR-0098: Kreditkarte, Anfangssaldo aus dem Saldo vor dem ersten Umsatz, Endsaldo vom neuesten Umsatz', () => {
  const a = auszug(KARTE, '2026-02');
  assert.equal(a.anfangssaldo, -715);
  assert.equal(a.endsaldo, -387.45);
  assert.deepEqual(a.umsaetze.map(u => u.buchungstag), ['2026-02-11', '2026-02-05', '2026-02-02']);
});

test('BR-0098: Monat vor dem ersten Umsatz zeigt den Saldo vor dem ersten Umsatz, leer', () => {
  const a = auszug(KARTE, '2025-12');
  assert.equal(a.anfangssaldo, -715);
  assert.equal(a.endsaldo, -715);
  assert.equal(a.umsaetze.length, 0);
});

test('BR-0098: Monat nach dem letzten Umsatz hat gleiche Salden und keine Zeilen', () => {
  const a = auszug(KARTE, '2026-06');
  assert.equal(a.anfangssaldo, -387.45);
  assert.equal(a.endsaldo, -387.45);
  assert.equal(a.umsaetze.length, 0);
});

test('BR-0098: Konto ohne Umsätze zeigt den Kontosaldo', () => {
  const a = auszug(TAGESGELD, '2026-02');
  assert.equal(a.anfangssaldo, 0);
  assert.equal(a.endsaldo, 0);
});

test('BR-0098: laufender Monat endet mit dem aktuellen Saldo', () => {
  ausgangsstand();
  const umsaetze = umsaetzeVon(LENA, GIRO)!;
  const a = auszugAus(kontoMitIban(LENA, GIRO)!, umsaetze, heuteUtc().slice(0, 7));
  assert.equal(a.endsaldo, 2145.3);
});

test('BR-0098: Monatsgrenzen gehören zum Monat (erster und letzter Tag)', () => {
  const u = (buchungstag: string, betrag: number, saldoDanach: number) => ({ buchungstag, betrag, saldoDanach, gebuchtAm: `${buchungstag}T10:00:00.000Z` } as Umsatz);
  const liste = [u('2026-03-01', 10, 110), u('2026-02-28', 20, 100), u('2026-02-01', -30, 80), u('2026-01-31', 50, 110)];
  const a = auszugAus({ saldo: 110 }, liste, '2026-02');
  assert.equal(a.anfangssaldo, 110);
  assert.equal(a.endsaldo, 100);
  assert.deepEqual(a.umsaetze.map(x => x.buchungstag), ['2026-02-28', '2026-02-01']);
});

test('BR-0011: ein fremdes Konto hat keine Umsätze für den Auszug', () => {
  ausgangsstand();
  assert.equal(kontoMitIban(LENA, 'DE00123456789012345678'), undefined);
  assert.equal(umsaetzeVon(LENA, 'DE00123456789012345678'), undefined);
});

test('UC-024: das PDF ist ein PDF mit Inhalt', async () => {
  const a = auszug(GIRO, '2026-02');
  const pdf = await pdfAus({ kontoname: 'Girokonto', iban: GIRO }, a);
  assert.equal(pdf.subarray(0, 5).toString('latin1'), '%PDF-');
  assert.ok(pdf.length > 500);
});
