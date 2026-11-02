import assert from 'node:assert/strict';
import test from 'node:test';
import { anlegen, liste, loeschen, umbenennen, Vorlagenfehler, zuruecksetzen } from '../src/empfaengervorlagen';

const IBAN = 'DE89 3704 0044 0532 0130 00';
const status = (fn: () => unknown) => { try { fn(); } catch (e) { return (e as Vorlagenfehler).status; } return 0; };

test('WP-1: Name Pflicht, höchstens 70 Zeichen, je Kundin eindeutig ohne Leerzeichen und Groß-/Kleinschreibung', () => {
  zuruecksetzen();
  assert.equal(status(() => anlegen('lena.hoffmann', { name: '  ', empfaengerIban: IBAN })), 400);
  assert.equal(status(() => anlegen('lena.hoffmann', { name: 'x'.repeat(71), empfaengerIban: IBAN })), 400);
  assert.equal(status(() => anlegen('lena.hoffmann', { name: 'Möbel Nord GmbH', empfaengerIban: 'TR330006100519786457841326' })), 400);
  assert.equal(status(() => anlegen('lena.hoffmann', { name: 'Möbel Nord GmbH', empfaengerIban: IBAN, verwendungszweck: 'z'.repeat(141) })), 400);
  const v = anlegen('lena.hoffmann', { name: 'Möbel Nord GmbH', empfaengerIban: IBAN, verwendungszweck: 'Rechnung 4711' });
  assert.equal(v.empfaengerIban, 'DE89370400440532013000');
  assert.equal(status(() => anlegen('lena.hoffmann', { name: ' möbel nord gmbh ', empfaengerIban: IBAN })), 409);
  assert.equal(status(() => anlegen('jonas.weber', { name: 'Möbel Nord GmbH ', empfaengerIban: IBAN })), 422, 'andere Kundin: kein Namenskonflikt, aber Höchstzahl erreicht');
});

test('WP-1: Höchstzahl 50 erst nach Pflicht und Eindeutigkeit (BR-0015)', () => {
  zuruecksetzen();
  assert.equal(liste('jonas.weber').length, 50);
  assert.equal(status(() => anlegen('jonas.weber', { name: 'Vorlage 51', empfaengerIban: IBAN })), 422);
  assert.equal(status(() => anlegen('jonas.weber', { name: 'vorlage 1', empfaengerIban: IBAN })), 409);
  assert.equal(status(() => anlegen('jonas.weber', { name: '', empfaengerIban: IBAN })), 400);
  assert.equal(liste('jonas.weber').length, 50);
  assert.deepEqual(liste('jonas.weber').slice(0, 3).map(v => v.name), ['Vorlage 1', 'Vorlage 2', 'Vorlage 3'], 'nach Name aufsteigend');
});

test('BR-0018: leerer Verwendungszweck fehlt in Antwort und Liste', () => {
  zuruecksetzen();
  const v = anlegen('lena.hoffmann', { name: 'Hausverwaltung Weber', empfaengerIban: IBAN, verwendungszweck: '   ' });
  assert.equal('verwendungszweck' in v, false);
  assert.equal('verwendungszweck' in liste('lena.hoffmann')[0], false);
});

test('BR-0013 beim Umbenennen: eigener Name ist kein Konflikt, IBAN und Zweck bleiben', () => {
  zuruecksetzen();
  const a = anlegen('lena.hoffmann', { name: 'Möbel Nord GmbH', empfaengerIban: IBAN, verwendungszweck: 'Rechnung 4711' });
  anlegen('lena.hoffmann', { name: 'Stadtwerke Nord', empfaengerIban: 'DE44 5001 0517 5407 3249 31' });
  assert.equal(umbenennen('lena.hoffmann', a.vorlagenId, 'MÖBEL NORD GMBH').name, 'MÖBEL NORD GMBH');
  assert.equal(status(() => umbenennen('lena.hoffmann', a.vorlagenId, 'stadtwerke nord')), 409);
  const neu = umbenennen('lena.hoffmann', a.vorlagenId, 'Möbel Nord GmbH (Filiale Süd)');
  assert.deepEqual([neu.empfaengerIban, neu.verwendungszweck], ['DE89370400440532013000', 'Rechnung 4711']);
});

test('WP-2: nur Vorlagen der angemeldeten Kundin, fremde und unbekannte Kennung 404 (BR-0016)', () => {
  zuruecksetzen();
  const a = anlegen('lena.hoffmann', { name: 'Möbel Nord GmbH', empfaengerIban: IBAN });
  assert.equal(liste('lena.hoffmann').length, 1);
  assert.ok(liste('jonas.weber').every(v => v.vorlagenId !== a.vorlagenId));
  assert.equal(status(() => umbenennen('jonas.weber', a.vorlagenId, 'Neu')), 404);
  assert.equal(status(() => loeschen('jonas.weber', a.vorlagenId)), 404);
  assert.equal(status(() => loeschen('lena.hoffmann', 'gibt-es-nicht')), 404);
  loeschen('lena.hoffmann', a.vorlagenId);
  assert.equal(liste('lena.hoffmann').length, 0);
  assert.equal(liste('jonas.weber').length, 50);
});
