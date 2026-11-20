import assert from 'node:assert/strict';
import test from 'node:test';
import { Kartenfehler, KEINE_KARTE, lesen, setzen, SPERRGRUND_FEHLER } from '../src/debitkarte';
import { demoZuruecksetzen, lastIban, lastKennung } from '../src/testdaten';

const LENA = 'lena.hoffmann';
const GIRO = 'DE02500105175407324911';
const KREDIT = 'DE44500105175407325028';
const VORUEBERGEHEND = 'vorübergehend gesperrt';
const ENDGUELTIG = 'endgültig gesperrt';
const fehler = (status: number, meldung: string) => (e: unknown) => e instanceof Kartenfehler && e.status === status && e.message === meldung;

test('BR-0081: Ausgangsstand ist aktiv ohne Sperrgrund, je Kundin eigene Karte', () => {
  demoZuruecksetzen();
  assert.deepEqual(lesen(LENA, GIRO), { kartennummerMaskiert: '**** 4821', status: 'aktiv' });
  assert.deepEqual(lesen('jonas.weber', 'DE61500105175407325013'), { kartennummerMaskiert: '**** 7305', status: 'aktiv' });
});

test('BR-0081: zulässige Statuswechsel', () => {
  demoZuruecksetzen();
  assert.equal(setzen(LENA, GIRO, VORUEBERGEHEND).status, VORUEBERGEHEND);
  assert.equal(setzen(LENA, GIRO, 'aktiv').status, 'aktiv');
  assert.deepEqual(setzen(LENA, GIRO, ENDGUELTIG, 'Verlust'), { kartennummerMaskiert: '**** 4821', status: ENDGUELTIG, sperrgrund: 'Verlust' });
  demoZuruecksetzen();
  setzen(LENA, GIRO, VORUEBERGEHEND);
  assert.equal(setzen(LENA, GIRO, ENDGUELTIG, 'Diebstahl').sperrgrund, 'Diebstahl');
});

test('BR-0081: unzulässige Aktionen je Status mit Meldung und unverändertem Status', () => {
  demoZuruecksetzen();
  assert.throws(() => setzen(LENA, GIRO, 'aktiv'), fehler(409, 'Die Debitkarte ist nicht gesperrt.'));
  assert.equal(lesen(LENA, GIRO).status, 'aktiv');

  setzen(LENA, GIRO, VORUEBERGEHEND);
  assert.throws(() => setzen(LENA, GIRO, VORUEBERGEHEND), fehler(409, 'Die Debitkarte ist bereits vorübergehend gesperrt.'));
  assert.equal(lesen(LENA, GIRO).status, VORUEBERGEHEND);

  setzen(LENA, GIRO, ENDGUELTIG, 'Verlust');
  assert.throws(() => setzen(LENA, GIRO, 'aktiv'), fehler(409, 'Die Debitkarte ist endgültig gesperrt und lässt sich nicht entsperren.'));
  assert.throws(() => setzen(LENA, GIRO, VORUEBERGEHEND), fehler(409, 'Die Debitkarte ist endgültig gesperrt und lässt sich nicht vorübergehend sperren.'));
  assert.throws(() => setzen(LENA, GIRO, ENDGUELTIG, 'Diebstahl'), fehler(409, 'Die Debitkarte ist bereits endgültig gesperrt.'));
  assert.deepEqual(lesen(LENA, GIRO), { kartennummerMaskiert: '**** 4821', status: ENDGUELTIG, sperrgrund: 'Verlust' });
});

test('BR-0081: Sperrgrund nur bei endgültiger Sperre geprüft, sonst ignoriert; 400 vor 409', () => {
  demoZuruecksetzen();
  assert.throws(() => setzen(LENA, GIRO, ENDGUELTIG), fehler(400, SPERRGRUND_FEHLER));
  assert.throws(() => setzen(LENA, GIRO, ENDGUELTIG, 'Irrtum'), fehler(400, SPERRGRUND_FEHLER));
  assert.throws(() => setzen(LENA, GIRO, 'gesperrt'), (e: unknown) => e instanceof Kartenfehler && e.status === 400);
  assert.throws(() => setzen(LENA, GIRO, undefined), (e: unknown) => e instanceof Kartenfehler && e.status === 400);
  assert.deepEqual(setzen(LENA, GIRO, VORUEBERGEHEND, 'Verlust'), { kartennummerMaskiert: '**** 4821', status: VORUEBERGEHEND });
  assert.throws(() => setzen(LENA, GIRO, VORUEBERGEHEND, 'Verlust'), fehler(409, 'Die Debitkarte ist bereits vorübergehend gesperrt.'));
  assert.equal(lesen(LENA, GIRO).sperrgrund, undefined);
});

test('BR-0082: nur das Girokonto der Kundin mit Karte, sonst 404', () => {
  demoZuruecksetzen();
  assert.deepEqual(lesen(LENA, 'DE02 5001 0517 5407 3249 11').status, 'aktiv');
  for (const iban of [KREDIT, 'DE61500105175407325013', 'DE00000000000000000000', lastIban(1)]) {
    assert.throws(() => lesen(LENA, iban), fehler(404, KEINE_KARTE));
    assert.throws(() => setzen(LENA, iban, VORUEBERGEHEND), fehler(404, KEINE_KARTE));
  }
  assert.throws(() => lesen(lastKennung(1), lastIban(1)), fehler(404, KEINE_KARTE));
  assert.throws(() => setzen(LENA, KREDIT, 'unbekannt'), fehler(404, KEINE_KARTE));
});

test('UC-018: der Demo-Reset setzt die Karte auf aktiv ohne Sperrgrund zurück', () => {
  setzen(LENA, GIRO, ENDGUELTIG, 'Verlust');
  demoZuruecksetzen();
  assert.deepEqual(lesen(LENA, GIRO), { kartennummerMaskiert: '**** 4821', status: 'aktiv' });
});
