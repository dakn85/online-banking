import assert from 'node:assert/strict';
import test from 'node:test';
import { Datenfehler, IBAN_LAENGE, KONTO_FEHLT, NAME_LAENGE, NAME_LEER, Namensfehler, eigenenNamenSetzen, finanzstatus, kontenSetzen, zuruecksetzen } from '../src/konten';

const LENA = 'lena.hoffmann';

test('BR-0001: Gesamtvermögen ist die Summe aller Salden, die Kreditkarte mindert es', () => {
  zuruecksetzen();
  assert.equal(finanzstatus(LENA).gesamtvermoegen, 1757.85);
});

test('BR-0002: verfügbarer Betrag nur beim Girokonto, Saldo plus Rahmen', () => {
  zuruecksetzen();
  const [giro, karte] = finanzstatus(LENA).konten;
  assert.equal(giro.verfuegbarerBetrag, 3145.3);
  assert.equal('verfuegbarerBetrag' in karte, false);
  assert.equal('dispositionsrahmen' in karte, false);
});

test('Ein Girokonto ohne Dispositionsrahmen ist ein Datenfehler', () => {
  kontenSetzen(LENA, [{ kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE02500105175407324911', saldo: 10, waehrung: 'EUR' }]);
  assert.throws(() => finanzstatus(LENA), Datenfehler);
  zuruecksetzen();
});

test('PK-9: Die Meldung eines Datenfehlers nennt keine IBAN', () => {
  kontenSetzen(LENA, [{ kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE89370400440532013000', saldo: 10, waehrung: 'EUR' }]);
  assert.throws(() => finanzstatus(LENA), (fehler: Error) => {
    assert.equal(fehler.message, 'Finanzstatus: Girokonto ohne Dispositionsrahmen');
    assert.doesNotMatch(fehler.message, /DE\d{2}/);
    return true;
  });
  zuruecksetzen();
});

/* UC-001 A3 bis A5: eigener Kontoname (BR-0108, Konto.eigenerName, Konto.iban) */
const GIRO = 'DE02500105175407324911';
const TAGESGELD = 'DE97500105175407324947';
const JONAS = 'jonas.weber';
const namensfehler = (fn: () => unknown, status: number, meldung: string) =>
  assert.throws(fn, (e: unknown) => e instanceof Namensfehler && e.status === status && e.message === meldung);
const tagesgeld = (kennung = LENA) => finanzstatus(kennung).konten.find(k => k.art === 'Tagesgeldkonto')!;

test('UC-001 Schritt 5: ohne vergebenen Namen ist eigenerName vorhanden und null', () => {
  zuruecksetzen();
  for (const k of finanzstatus(LENA).konten) {
    assert.equal('eigenerName' in k, true);
    assert.equal(k.eigenerName, null);
  }
});

test('BR-0108: der eigene Name steht am Konto der Kundin, Kontoname, Art, IBAN und Saldo bleiben', () => {
  zuruecksetzen();
  const vorher = tagesgeld();
  const antwort = eigenenNamenSetzen(LENA, 'DE97 5001 0517 5407 3249 47', '  Urlaubskasse  ');
  assert.equal(antwort.eigenerName, 'Urlaubskasse');
  assert.deepEqual(tagesgeld(), { ...vorher, eigenerName: 'Urlaubskasse' });
  assert.equal(tagesgeld(JONAS).eigenerName, null, 'Jonas behält seine Konten ohne Namen');
});

test('BR-0108: fremde oder unbekannte IBAN ist 404 und ändert nichts', () => {
  zuruecksetzen();
  namensfehler(() => eigenenNamenSetzen(LENA, 'DE02500105175407324999', 'Urlaubskasse'), 404, KONTO_FEHLT);
  namensfehler(() => eigenenNamenSetzen(JONAS, TAGESGELD, 'Urlaubskasse'), 404, KONTO_FEHLT);
  assert.equal(tagesgeld().eigenerName, null);
});

test('BR-0108: zwei Konten dürfen denselben eigenen Namen tragen, unverändert speichern ist erlaubt', () => {
  zuruecksetzen();
  eigenenNamenSetzen(LENA, GIRO, 'Urlaubskasse');
  eigenenNamenSetzen(LENA, TAGESGELD, 'Urlaubskasse');
  assert.equal(eigenenNamenSetzen(LENA, TAGESGELD, 'Urlaubskasse').eigenerName, 'Urlaubskasse');
  assert.deepEqual(finanzstatus(LENA).konten.map(k => k.eigenerName), ['Urlaubskasse', null, 'Urlaubskasse']);
});

test('Konto.eigenerName: leer, nur Leerzeichen, kein Text oder länger als 60 Zeichen ist 400; der bisherige Name bleibt', () => {
  zuruecksetzen();
  eigenenNamenSetzen(LENA, TAGESGELD, 'Urlaubskasse');
  for (const leer of ['', '   ', undefined, 42]) namensfehler(() => eigenenNamenSetzen(LENA, TAGESGELD, leer), 400, NAME_LEER);
  namensfehler(() => eigenenNamenSetzen(LENA, TAGESGELD, 'x'.repeat(61)), 400, NAME_LAENGE);
  assert.equal(eigenenNamenSetzen(LENA, TAGESGELD, ` ${'x'.repeat(60)} `).eigenerName, 'x'.repeat(60));
  eigenenNamenSetzen(LENA, TAGESGELD, 'Urlaubskasse');
  namensfehler(() => eigenenNamenSetzen(LENA, TAGESGELD, 'y'.repeat(61)), 400, NAME_LAENGE);
  assert.equal(tagesgeld().eigenerName, 'Urlaubskasse');
});

test('Konto.iban: eine IBAN mit anderer Länge als 22 Zeichen ist 400 vor der Suche nach dem Konto', () => {
  zuruecksetzen();
  namensfehler(() => eigenenNamenSetzen(LENA, 'DE97 5001 0517 5407 3249', 'Urlaubskasse'), 400, IBAN_LAENGE);
  namensfehler(() => eigenenNamenSetzen(LENA, 'DE9750010517540732494799', 'Urlaubskasse'), 400, IBAN_LAENGE);
});

test('ADR-002: der Reset entfernt jeden eigenen Namen', () => {
  zuruecksetzen();
  eigenenNamenSetzen(LENA, TAGESGELD, 'Urlaubskasse');
  zuruecksetzen();
  assert.equal(tagesgeld().eigenerName, null);
});
