import assert from 'node:assert/strict';
import test from 'node:test';
import { finanzstatus, zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { FRIST_FEHLER, KEINE_LASTSCHRIFT_FEHLER, KONTO_FEHLER, Rueckgabefehler, SCHON_ZURUECK_FEHLER, UMSATZ_FEHLER, VERWENDUNGSZWECK, zurueckgeben } from '../src/lastschrift';
import { umsaetzeVon, zuruecksetzen as umsaetzeZuruecksetzen } from '../src/umsaetze';

const LENA = { kennung: 'lena.hoffmann' };
const JONAS = { kennung: 'jonas.weber' };
const GIRO = 'DE02500105175407324911';
const KARTE = 'DE44500105175407325028';

function ausgangsstand() {
  kontenZuruecksetzen();
  umsaetzeZuruecksetzen();
}
const finden = (gegenpartei: string, iban = GIRO) => umsaetzeVon(LENA.kennung, iban)!.find(u => u.gegenpartei === gegenpartei)!;
const ablehnung = (fn: () => unknown, status: number, meldung: string) =>
  assert.throws(fn, (e: unknown) => e instanceof Rueckgabefehler && e.status === status && e.message === meldung);

test('BR-0095: die Rückgabe schreibt den Betrag gut und legt genau einen Umsatz an', () => {
  ausgangsstand();
  const lastschrift = finden('Fitnessstudio Vital');
  const { gutschrift, lastschriftUmsatzId } = zurueckgeben(LENA, GIRO, lastschrift.umsatzId);
  assert.equal(lastschriftUmsatzId, lastschrift.umsatzId);
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2175.2);
  assert.equal(gutschrift.betrag, 29.9);
  assert.equal(gutschrift.saldoDanach, 2175.2);
  assert.equal(gutschrift.verwendungszweck, VERWENDUNGSZWECK);
  assert.equal(gutschrift.gegenpartei, 'Fitnessstudio Vital');
  assert.equal(gutschrift.sepaLastschrift, false);
  assert.equal(gutschrift.zurueckgegeben, false);
  const liste = umsaetzeVon(LENA.kennung, GIRO)!;
  assert.equal(liste[0].umsatzId, gutschrift.umsatzId, 'die Gutschrift ist der neueste Umsatz');
  assert.equal(liste.filter(u => u.verwendungszweck === VERWENDUNGSZWECK).length, 1);
  assert.equal(liste.find(u => u.umsatzId === lastschrift.umsatzId)!.zurueckgegeben, true);
});

test('BR-0094: eine zweite Rückgabe derselben Lastschrift bucht nicht erneut', () => {
  ausgangsstand();
  const id = finden('Fitnessstudio Vital').umsatzId;
  zurueckgeben(LENA, GIRO, id);
  const anzahl = umsaetzeVon(LENA.kennung, GIRO)!.length;
  ablehnung(() => zurueckgeben(LENA, GIRO, id), 422, SCHON_ZURUECK_FEHLER);
  assert.equal(umsaetzeVon(LENA.kennung, GIRO)!.length, anzahl);
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2175.2);
});

test('BR-0094: nur SEPA-Lastschriften lassen sich zurückgeben; unbekannter Umsatz ist 404', () => {
  ausgangsstand();
  ablehnung(() => zurueckgeben(LENA, GIRO, finden('Bäckerei Krause').umsatzId), 422, KEINE_LASTSCHRIFT_FEHLER);
  ablehnung(() => zurueckgeben(LENA, KARTE, finden('Buchhandlung Seitenweise', KARTE).umsatzId), 422, KEINE_LASTSCHRIFT_FEHLER);
  ablehnung(() => zurueckgeben(LENA, GIRO, 'unbekannt'), 404, UMSATZ_FEHLER);
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2145.3);
});

test('BR-0093: nach 56 Tagen ist die Rückgabefrist abgelaufen, 14 Tage liegen in der Frist', () => {
  ausgangsstand();
  ablehnung(() => zurueckgeben(LENA, GIRO, finden('Zeitungsverlag Nord').umsatzId), 422, FRIST_FEHLER);
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2145.3);
  zurueckgeben(LENA, GIRO, finden('Fitnessstudio Vital').umsatzId);
});

test('BR-0011: eine fremde IBAN ist 404, eine zu lange umsatzId 400', () => {
  ausgangsstand();
  ablehnung(() => zurueckgeben(LENA, 'DE00123456789012345678', 'x'), 404, KONTO_FEHLER);
  ablehnung(() => zurueckgeben(JONAS, GIRO, finden('Fitnessstudio Vital').umsatzId), 404, KONTO_FEHLER);
  assert.throws(() => zurueckgeben(LENA, GIRO, 'u'.repeat(37)), (e: unknown) => e instanceof Rueckgabefehler && e.status === 400);
});
