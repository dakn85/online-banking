import assert from 'node:assert/strict';
import test from 'node:test';
import { Kundendatenfehler, TAN_FALSCH, aendern, lesen, zuruecksetzen } from '../src/kundendaten';
import { aeltesteZuerst, zuruecksetzen as nachrichtenZuruecksetzen } from '../src/nachrichten';

const LENA = 'lena.hoffmann';
const JONAS = 'jonas.weber';
const auftrag = (aenderung: Record<string, string> = {}) => ({ ...lesen(LENA), tan: '123456', ...aenderung });
const alles = () => { zuruecksetzen(); nachrichtenZuruecksetzen(); };
const abgelehnt = (a: unknown, status: number, meldung: string) =>
  assert.throws(() => aendern(LENA, a), (e: unknown) => e instanceof Kundendatenfehler && e.status === status && e.message === meldung);

test('UC-023: Ausgangsstand der Demo-Kundinnen und der Lastkunden', () => {
  alles();
  assert.deepEqual(lesen(LENA), { strasse: 'Lindenallee 12', postleitzahl: '50667', ort: 'Köln', email: 'lena.hoffmann@example.org', telefonnummer: '+49 221 1234567' });
  assert.equal(lesen(JONAS).ort, 'München');
  assert.equal(lesen('lasttest-007').email, 'lasttest-007@example.org');
});

test('BR-0096: falsche TAN ergibt 422, nichts wird gespeichert, keine Nachricht', () => {
  alles();
  abgelehnt(auftrag({ email: 'neu@example.org', tan: '000000' }), 422, TAN_FALSCH);
  assert.equal(lesen(LENA).email, 'lena.hoffmann@example.org');
  assert.equal(aeltesteZuerst(LENA).length, 3);
});

test('BR-0096: ein ungültiges Feld ergibt 400, die TAN wird erst danach geprüft', () => {
  alles();
  abgelehnt(auftrag({ postleitzahl: '5066', tan: '000000' }), 400, 'Die Postleitzahl muss aus 5 Ziffern bestehen.');
  abgelehnt(auftrag({ tan: '12345' }), 400, 'Die TAN muss aus 6 Ziffern bestehen.');
  abgelehnt(auftrag({ strasse: '   ' }), 400, 'Bitte geben Sie Straße und Hausnummer an.');
  abgelehnt(auftrag({ ort: 'x'.repeat(61) }), 400, 'Der Ort darf höchstens 60 Zeichen lang sein.');
  abgelehnt(auftrag({ email: 'kein-at' }), 400, 'Die E-Mail-Adresse ist ungültig.');
  abgelehnt(auftrag({ telefonnummer: 'abc123' }), 400, 'Die Telefonnummer ist ungültig.');
  abgelehnt(null, 400, 'Bitte geben Sie Straße und Hausnummer an.');
});

test('BR-0097: Änderung der Anschrift und der Telefonnummer ergibt genau eine Nachricht in fester Reihenfolge, ohne Werte', () => {
  alles();
  const neu = aendern(LENA, auftrag({ strasse: '  Rosenweg 3 ', telefonnummer: '+49 30 7654321' }));
  assert.equal(neu.strasse, 'Rosenweg 3');
  const alle = aeltesteZuerst(LENA);
  assert.equal(alle.length, 4);
  const nachricht = alle[3];
  assert.equal(nachricht.absender, 'Aventa Bank');
  assert.equal(nachricht.betreff, 'Ihre persönlichen Daten wurden geändert');
  assert.equal(nachricht.text, 'Ihre Anschrift wurde geändert. Ihre Telefonnummer wurde geändert.');
  assert.equal(nachricht.gelesen, false);
  assert.equal(nachricht.versendetAm, new Date().toISOString().slice(0, 10));
  assert.equal(aeltesteZuerst(JONAS).length, 1);
});

test('BR-0097: unveränderte Angaben legen keine Nachricht an, Randleerzeichen zählen nicht als Änderung', () => {
  alles();
  aendern(LENA, auftrag({ telefonnummer: ' +49 221 1234567 ' }));
  assert.equal(aeltesteZuerst(LENA).length, 3);
});

test('BR-0097: eine reine Schreibweisenänderung der E-Mail-Adresse ist eine Änderung', () => {
  alles();
  aendern(LENA, auftrag({ email: 'Lena.Hoffmann@example.org' }));
  assert.equal(aeltesteZuerst(LENA)[3].text, 'Ihre E-Mail-Adresse wurde geändert.');
});
