import assert from 'node:assert/strict';
import test from 'node:test';
import { Nachrichtenfehler, liste, loeschen, oeffnen, zuruecksetzen } from '../src/nachrichten';

const LENA = 'lena.hoffmann';
const JONAS = 'jonas.weber';

test('BR-0085: Liste nur der eigenen Nachrichten, neueste zuerst', () => {
  zuruecksetzen();
  assert.deepEqual(liste(LENA).nachrichten.map(n => n.versendetAm), ['2026-11-17', '2026-11-12', '2026-11-02']);
  assert.equal(liste(JONAS).nachrichten.length, 1);
  assert.deepEqual(liste('lasttest-001'), { nachrichten: [], anzahlUngelesen: 0 });
});

test('BR-0085: fremde und unbekannte Kennung ergeben 404, zu lange 400, nichts ändert sich', () => {
  zuruecksetzen();
  const fremd = liste(JONAS).nachrichten[0].nachrichtId;
  for (const aktion of [oeffnen, loeschen]) {
    assert.throws(() => aktion(LENA, fremd), (e: unknown) => e instanceof Nachrichtenfehler && e.status === 404);
    assert.throws(() => aktion(LENA, 'N-unbekannt'), (e: unknown) => e instanceof Nachrichtenfehler && e.status === 404);
    assert.throws(() => aktion(LENA, 'N'.repeat(37)), (e: unknown) => e instanceof Nachrichtenfehler && e.status === 400);
  }
  assert.equal(liste(JONAS).nachrichten.length, 1);
  assert.equal(liste(LENA).anzahlUngelesen, 2);
});

test('BR-0086, BR-0087: Öffnen setzt gelesen und senkt die Zahl, erneutes Öffnen ändert nichts', () => {
  zuruecksetzen();
  const [erste] = liste(LENA).nachrichten;
  assert.equal(oeffnen(LENA, erste.nachrichtId).gelesen, true);
  assert.equal(liste(LENA).anzahlUngelesen, 1);
  oeffnen(LENA, erste.nachrichtId);
  assert.equal(liste(LENA).anzahlUngelesen, 1);
});

test('BR-0086: Löschen entfernt die Nachricht und senkt die Zahl nur bei einer ungelesenen', () => {
  zuruecksetzen();
  const [ungelesen, , gelesen] = liste(LENA).nachrichten;
  loeschen(LENA, gelesen.nachrichtId);
  assert.equal(liste(LENA).anzahlUngelesen, 2);
  loeschen(LENA, ungelesen.nachrichtId);
  assert.deepEqual({ n: liste(LENA).nachrichten.length, u: liste(LENA).anzahlUngelesen }, { n: 1, u: 1 });
});
