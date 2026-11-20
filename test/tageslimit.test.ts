import assert from 'node:assert/strict';
import test from 'node:test';
import { istLastkunde } from '../src/kunden';
import { lesen, setzen, STANDARDLIMIT, TAGESLIMIT_FEHLER, Tageslimitfehler, zuruecksetzen } from '../src/tageslimit';
import { demoZuruecksetzen } from '../src/testdaten';

const LENA = 'lena.hoffmann';
const JONAS = 'jonas.weber';
const abgelehnt = (wert: unknown) => assert.throws(() => setzen(LENA, wert), (e: unknown) =>
  e instanceof Tageslimitfehler && e.status === 400 && e.message === TAGESLIMIT_FEHLER);

test('BR-0070: anfangs gilt das Standardlimit von 5.000,00 EUR', () => {
  zuruecksetzen();
  assert.deepEqual(lesen(LENA), { tageslimit: 5000, standardlimit: 5000 });
  assert.equal(STANDARDLIMIT, 5000);
});

test('UC-015: die Kundin senkt ihr Tageslimit und hebt es bis zum Standardlimit wieder an', () => {
  zuruecksetzen();
  assert.deepEqual(setzen(LENA, 1000), { tageslimit: 1000, standardlimit: 5000 });
  assert.equal(lesen(LENA).tageslimit, 1000);
  assert.deepEqual(setzen(LENA, 5000), { tageslimit: 5000, standardlimit: 5000 });
});

test('BR-0070: 0,00 EUR ist erlaubt, zwei Nachkommastellen auch', () => {
  zuruecksetzen();
  assert.equal(setzen(LENA, 0).tageslimit, 0);
  assert.equal(setzen(LENA, 1234.56).tageslimit, 1234.56);
  assert.equal(setzen(LENA, 0.1 + 0.2).tageslimit, 0.3);
});

test('UC-015 A1: leer, keine Zahl, unter 0, über dem Standardlimit oder mehr als zwei Nachkommastellen ändert nichts', () => {
  zuruecksetzen();
  setzen(LENA, 1000);
  for (const wert of [undefined, null, '', '1000', Number.NaN, Infinity, -0.01, 5000.01, 6000, 10.005]) abgelehnt(wert);
  assert.equal(lesen(LENA).tageslimit, 1000);
});

test('BR-0070: das Tageslimit gilt je Kundin', () => {
  zuruecksetzen();
  setzen(LENA, 200);
  assert.equal(lesen(JONAS).tageslimit, 5000);
});

test('POST /api/test/reset: der Demo-Reset setzt das Tageslimit der Demo-Kundinnen zurück, nicht das der Lastkunden', () => {
  setzen(LENA, 200);
  setzen('lasttest-001', 300);
  demoZuruecksetzen();
  assert.equal(lesen(LENA).tageslimit, 5000);
  assert.equal(lesen('lasttest-001').tageslimit, 300);
  zuruecksetzen(istLastkunde);
  assert.equal(lesen('lasttest-001').tageslimit, 5000);
});
