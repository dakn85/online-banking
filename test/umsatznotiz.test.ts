import assert from 'node:assert/strict';
import test from 'node:test';
import { zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { csvAus, umsaetzeVon, zuruecksetzen as umsaetzeZuruecksetzen } from '../src/umsaetze';
import { KONTO_FEHLER, LAENGE_FEHLER, LEER_FEHLER, NOTIZ_FEHLER, Notizfehler, UMSATZ_FEHLER, loeschen, speichern } from '../src/umsatznotiz';

const LENA = 'lena.hoffmann';
const JONAS = 'jonas.weber';
const GIRO = 'DE02500105175407324911';
const KARTE = 'DE44500105175407325028';
const JONAS_GIRO = 'DE61500105175407325013';

function ausgangsstand() {
  kontenZuruecksetzen();
  umsaetzeZuruecksetzen();
}
const finden = (gegenpartei: string, kennung = LENA, iban = GIRO) => umsaetzeVon(kennung, iban)!.find(u => u.gegenpartei === gegenpartei)!;
const ablehnung = (fn: () => unknown, status: number, meldung: string) =>
  assert.throws(fn, (e: unknown) => e instanceof Notizfehler && e.status === status && e.message === meldung);

test('BR-0106: die Notiz steht am Umsatz im Feld notiz, ein neuer Text überschreibt sie', () => {
  ausgangsstand();
  const id = finden('Bäckerei Krause').umsatzId;
  assert.equal('notiz' in finden('Bäckerei Krause'), false, 'ohne Notiz fehlt das Feld');
  assert.deepEqual(speichern(LENA, GIRO, id, 'Erste Notiz'), { text: 'Erste Notiz' });
  assert.equal(finden('Bäckerei Krause').notiz, 'Erste Notiz');
  assert.deepEqual(speichern(LENA, 'DE02 5001 0517 5407 3249 11', id, 'Zweite Notiz'), { text: 'Zweite Notiz' });
  assert.equal(finden('Bäckerei Krause').notiz, 'Zweite Notiz');
  assert.equal(umsaetzeVon(LENA, GIRO)!.filter(u => u.notiz !== undefined).length, 1, 'nur dieser Umsatz trägt eine Notiz');
});

test('BR-0106: fremde IBAN ist 404 „Das Konto wurde nicht gefunden.“, fremde umsatzId 404 „Der Umsatz wurde nicht gefunden.“', () => {
  ausgangsstand();
  const id = finden('Bäckerei Krause').umsatzId;
  ablehnung(() => speichern(LENA, 'DE00123456789012345678', id, 'Notiz'), 404, KONTO_FEHLER);
  ablehnung(() => speichern(JONAS, GIRO, id, 'Notiz'), 404, KONTO_FEHLER);
  ablehnung(() => loeschen(JONAS, GIRO, id), 404, KONTO_FEHLER);
  ablehnung(() => speichern(LENA, GIRO, 'U-9999', 'Notiz'), 404, UMSATZ_FEHLER);
  ablehnung(() => loeschen(LENA, GIRO, 'U-9999'), 404, UMSATZ_FEHLER);
  // Der Umsatz eines anderen Kontos derselben Kundin gehört nicht zu diesem Konto.
  ablehnung(() => speichern(LENA, KARTE, id, 'Notiz'), 404, UMSATZ_FEHLER);
  // Konto und Umsatz gehen vor dem Text: Ein fremdes Konto erfährt nichts über die Feldprüfung.
  ablehnung(() => speichern(LENA, 'DE00123456789012345678', id, ''), 404, KONTO_FEHLER);
  ablehnung(() => speichern(LENA, GIRO, 'U-9999', ''), 404, UMSATZ_FEHLER);
  assert.equal(finden('Bäckerei Krause').notiz, undefined);
});

test('BR-0106: die Notiz einer Kundin steht nicht an den Umsätzen einer anderen', () => {
  ausgangsstand();
  speichern(LENA, GIRO, finden('Bäckerei Krause').umsatzId, 'Nur für Lena');
  assert.equal(finden('Bäckerei Krause', JONAS, JONAS_GIRO).notiz, undefined);
});

test('BR-0106: die Notiz ändert weder Reihenfolge noch Saldo danach, Filter oder Export', () => {
  ausgangsstand();
  const ohneNotiz = () => umsaetzeVon(LENA, GIRO)!.map(({ notiz: _notiz, ...u }) => u);
  const vorher = ohneNotiz();
  const csv = csvAus(umsaetzeVon(LENA, GIRO)!);
  speichern(LENA, GIRO, finden('Bäckerei Krause').umsatzId, 'Gehalt Miete Abschlag');
  assert.deepEqual(ohneNotiz(), vorher);
  assert.equal(csvAus(umsaetzeVon(LENA, GIRO)!), csv);
  // Der Suchtext trifft Gegenpartei und Verwendungszweck, nicht die Notiz.
  assert.deepEqual(umsaetzeVon(LENA, GIRO, { suchtext: 'Gehalt' })!.map(u => u.gegenpartei), ['Lindner Logistik GmbH']);
});

test('BR-0106 (Umsatznotiz.text): Randleerzeichen fallen weg, leer und über 140 Zeichen sind 400 und speichern nichts', () => {
  ausgangsstand();
  const id = finden('Bäckerei Krause').umsatzId;
  assert.deepEqual(speichern(LENA, GIRO, id, '  Rückfrage an den Vermieter  '), { text: 'Rückfrage an den Vermieter' });
  for (const leer of ['', '   ', undefined, 7]) ablehnung(() => speichern(LENA, GIRO, id, leer), 400, LEER_FEHLER);
  ablehnung(() => speichern(LENA, GIRO, id, 'x'.repeat(141)), 400, LAENGE_FEHLER);
  assert.equal(finden('Bäckerei Krause').notiz, 'Rückfrage an den Vermieter', 'die gespeicherte Notiz bleibt');
  assert.deepEqual(speichern(LENA, GIRO, id, ` ${'ä'.repeat(140)} `), { text: 'ä'.repeat(140) });
});

test('BR-0107: Löschen entfernt die Notiz; ohne Notiz 404 „Die Notiz wurde nicht gefunden.“', () => {
  ausgangsstand();
  const id = finden('Bäckerei Krause').umsatzId;
  ablehnung(() => loeschen(LENA, GIRO, id), 404, NOTIZ_FEHLER);
  speichern(LENA, GIRO, id, 'Frühstück mit dem Team');
  loeschen(LENA, GIRO, id);
  assert.equal('notiz' in finden('Bäckerei Krause'), false);
  ablehnung(() => loeschen(LENA, GIRO, id), 404, NOTIZ_FEHLER);
});

test('Umsatznotiz, ADR-002: nach einem Reset trägt kein Umsatz eine Notiz', () => {
  ausgangsstand();
  speichern(LENA, GIRO, finden('Bäckerei Krause').umsatzId, 'Frühstück mit dem Team');
  ausgangsstand();
  assert.equal(umsaetzeVon(LENA, GIRO)!.some(u => u.notiz !== undefined), false);
});
