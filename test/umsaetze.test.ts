import assert from 'node:assert/strict';
import test from 'node:test';
import { zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { ausfuehren, zuruecksetzen as auftraegeZuruecksetzen } from '../src/ueberweisung';
import { Abfragefehler, BETRAGSBEREICH_FEHLER, Filter, ZEITRAUM_FEHLER, csvAus, filterAus, SEITENGROESSE_MAX, seiteAus, trefferseite, umsaetzeVon, zuruecksetzen } from '../src/umsaetze';

const LENA = 'lena.hoffmann';
const GIRO = 'DE02500105175407324911';
const MARIA = 'DE16500105175407325047';
const KARTE = 'DE44500105175407325028';

function ausgangsstand() {
  kontenZuruecksetzen();
  auftraegeZuruecksetzen();
  zuruecksetzen();
}

const ueberweisen = (auftragsId: string, empfaenger: string, betrag: number, verwendungszweck: string) => ausfuehren({ kennung: LENA }, {
  auftragsId, auftraggeberIban: GIRO, empfaenger, empfaengerIban: 'DE89370400440532013000', betrag, verwendungszweck,
});

test('C-001/BR-0008: Demo-Umsätze neueste zuerst, der jüngste trägt den Kontosaldo', () => {
  ausgangsstand();
  const giro = umsaetzeVon(LENA, GIRO)!;
  assert.ok(giro.length >= 3);
  assert.equal(giro[0].saldoDanach, 2145.3);
  assert.deepEqual(giro.map(u => u.buchungstag), [...giro.map(u => u.buchungstag)].sort().reverse());
  // Saldo danach geht rückwärts auf: jeder Vorgänger ist Saldo danach minus Betrag.
  for (let i = 1; i < giro.length; i++) assert.equal(Math.round((giro[i - 1].saldoDanach - giro[i - 1].betrag) * 100) / 100, giro[i].saldoDanach);
  assert.equal(umsaetzeVon(LENA, KARTE)![0].saldoDanach, -387.45);
});

test('C-001: Demo-Umsätze tragen keinen Suchtext der Szenarien', () => {
  ausgangsstand();
  for (const iban of [GIRO, KARTE]) assert.deepEqual(umsaetzeVon(LENA, iban, { suchtext: 'Möbel' }), []);
});

test('BR-0012/BR-0008: Überweisungen werden Umsätze, die zuletzt gebuchte oben, Saldo danach gemindert; doppelt bestätigt einmal', () => {
  ausgangsstand();
  ueberweisen('a1', 'Möbel Nord GmbH', 50, 'Rechnung 4711');
  ueberweisen('a2', 'Möbel Nord GmbH', 12, 'Rechnung 4712');
  ueberweisen('a2', 'Möbel Nord GmbH', 12, 'Rechnung 4712');
  const moebel = umsaetzeVon(LENA, GIRO, { suchtext: 'möbel' })!;
  assert.deepEqual(moebel.map(u => [u.verwendungszweck, u.betrag, u.saldoDanach]), [['Rechnung 4712', -12, 2083.3], ['Rechnung 4711', -50, 2095.3]]);
  assert.equal(moebel[0].buchungstag, moebel[0].gebuchtAm.slice(0, 10));
  assert.equal(umsaetzeVon(LENA, GIRO)![0].verwendungszweck, 'Rechnung 4712');
});

test('BR-0009/BR-0010: Richtung, Zeitraum mit eingeschlossenen Grenzen, Suche im Verwendungszweck', () => {
  ausgangsstand();
  assert.ok(umsaetzeVon(LENA, GIRO, { richtung: 'eingang' })!.every(u => u.betrag > 0));
  assert.ok(umsaetzeVon(LENA, GIRO, { richtung: 'ausgang' })!.every(u => u.betrag < 0));
  const tag = umsaetzeVon(LENA, GIRO)![0].buchungstag;
  assert.equal(umsaetzeVon(LENA, GIRO, { von: tag, bis: tag })!.length, 1);
  assert.deepEqual(umsaetzeVon(LENA, GIRO, { von: '2020-01-01', bis: '2020-12-31' }), []);
  assert.equal(umsaetzeVon(LENA, GIRO, { suchtext: 'GEHALT' })!.length, 1);
});

test('BR-0010: Von nach Bis ist 400 mit Meldung; Format und Richtung werden geprüft', () => {
  assert.throws(() => filterAus({ von: '2026-03-31', bis: '2026-03-01' }), (e: unknown) => e instanceof Abfragefehler && e.message === ZEITRAUM_FEHLER);
  assert.throws(() => filterAus({ von: '31.03.2026' }), Abfragefehler);
  assert.throws(() => filterAus({ richtung: 'seitwaerts' }), Abfragefehler);
  assert.deepEqual(filterAus({ von: '', bis: '', suchtext: '  ' }), {
    suchtext: undefined, von: undefined, bis: undefined, richtung: 'alle', betragVon: undefined, betragBis: undefined, kategorie: undefined,
  });
});

test('BR-0104: Betragshöhe ohne Vorzeichen, beide Grenzen eingeschlossen, offene Grenze schränkt nicht ein', () => {
  ausgangsstand();
  const namen = (f: Filter) => umsaetzeVon(LENA, GIRO, f)!.map(u => u.gegenpartei);
  assert.deepEqual(namen({ betragVon: 100, betragBis: 1000 }), ['Hausverwaltung Berger']);
  assert.deepEqual(namen({ betragVon: 950, betragBis: 950 }), ['Hausverwaltung Berger']);
  assert.deepEqual(namen({ betragVon: 500, betragBis: 3000, richtung: 'eingang' }), ['Lindner Logistik GmbH']);
  assert.deepEqual(namen({ betragVon: 1000 }), ['Lindner Logistik GmbH']);
  assert.deepEqual(namen({ betragBis: 12 }), ['Bäckerei Krause']);
});

test('BR-0104: Kategoriefilter und Zusammenwirken mit Textsuche und Betrag', () => {
  ausgangsstand();
  const namen = (f: Filter) => umsaetzeVon(LENA, GIRO, f)!.map(u => u.gegenpartei);
  assert.deepEqual(namen({ kategorie: 'Lebensmittel' }), ['Bäckerei Krause']);
  assert.deepEqual(namen({ kategorie: 'Freizeit' }), ['Fitnessstudio Vital', 'Zeitungsverlag Nord']);
  assert.deepEqual(namen({ suchtext: 'Nord', betragVon: 10, betragBis: 20, kategorie: 'Freizeit' }), ['Zeitungsverlag Nord']);
  assert.deepEqual(namen({ betragVon: 10, betragBis: 60, kategorie: 'Sonstiges' }), []);
});

test('BR-0104: Betrag von über Betrag bis ist 400 mit Meldung; Kategorie Alle und Unbekanntes sind 400', () => {
  assert.throws(() => filterAus({ betragVon: '100', betragBis: '50' }), (e: unknown) => e instanceof Abfragefehler && e.message === BETRAGSBEREICH_FEHLER);
  assert.throws(() => filterAus({ kategorie: 'Alle' }), Abfragefehler);
  assert.throws(() => filterAus({ kategorie: 'Urlaub' }), Abfragefehler);
  assert.throws(() => filterAus({ betragVon: '-5' }), Abfragefehler);
  assert.throws(() => filterAus({ betragBis: '1.000,00' }), Abfragefehler);
  const f = filterAus({ betragVon: '10', betragBis: '60.5', kategorie: 'Sonstiges' });
  assert.deepEqual([f.betragVon, f.betragBis, f.kategorie], [10, 60.5, 'Sonstiges']);
  assert.doesNotThrow(() => filterAus({ betragVon: '950', betragBis: '950' }));
});

test('BR-0105: 20 Treffer je Seite in der Reihenfolge nach BR-0008, Gesamtzahl über alle Seiten, hinter der letzten Seite leer', () => {
  ausgangsstand();
  const alle = umsaetzeVon('maria.schulz', MARIA)!;
  assert.equal(alle.length, 25);
  const eins = trefferseite(alle, seiteAus({}));
  const zwei = trefferseite(alle, seiteAus({ seite: '2', seitengroesse: '20' }));
  assert.deepEqual([eins.umsaetze.length, eins.gesamt, zwei.umsaetze.length, zwei.gesamt], [20, 25, 5, 25]);
  assert.deepEqual([...eins.umsaetze, ...zwei.umsaetze].map(u => u.umsatzId), alle.map(u => u.umsatzId));
  assert.deepEqual(trefferseite(alle, seiteAus({ seite: '3' })), { umsaetze: [], gesamt: 25 });
  // Saldo danach rückwärts aus dem Kontosaldo (C-001, BR-0008)
  assert.equal(alle[0].saldoDanach, 1850);
  for (let i = 1; i < alle.length; i++) assert.equal(Math.round((alle[i - 1].saldoDanach - alle[i - 1].betrag) * 100) / 100, alle[i].saldoDanach);
});

test('BR-0105: Seite und Seitengröße ab 1, sonst 400', () => {
  for (const abfrage of [{ seite: '0' }, { seite: '-1' }, { seite: 'zwei' }, { seitengroesse: '0' }, { seite: '1.5' }]) {
    assert.throws(() => seiteAus(abfrage), Abfragefehler);
  }
  assert.deepEqual(seiteAus({ seite: '3', seitengroesse: '5' }), { seite: 3, seitengroesse: 5 });
});

test('BR-0105: UC-003 A14 Seitengröße über 100 begrenzt der Dienst auf 100, ohne Fehler; Reihenfolge und Gesamtzahl bleiben', () => {
  assert.equal(SEITENGROESSE_MAX, 100);
  for (const angefragt of ['101', '1000', '999999']) assert.deepEqual(seiteAus({ seitengroesse: angefragt }), { seite: 1, seitengroesse: 100 });
  assert.deepEqual(seiteAus({ seite: '2', seitengroesse: '100' }), { seite: 2, seitengroesse: 100 });
  const treffer = Array.from({ length: 250 }, (_, i) => i);
  const eins = trefferseite(treffer, seiteAus({ seitengroesse: '1000' }));
  const zwei = trefferseite(treffer, seiteAus({ seite: '2', seitengroesse: '1000' }));
  const drei = trefferseite(treffer, seiteAus({ seite: '3', seitengroesse: '1000' }));
  assert.deepEqual([eins.umsaetze.length, zwei.umsaetze.length, drei.umsaetze.length], [100, 100, 50]);
  assert.deepEqual([eins.gesamt, zwei.gesamt, drei.gesamt], [250, 250, 250]);
  assert.deepEqual([...eins.umsaetze, ...zwei.umsaetze, ...drei.umsaetze], treffer);
});

test('BR-0011: fremde IBAN liefert nichts, Leerzeichen in der IBAN zählen nicht', () => {
  ausgangsstand();
  assert.equal(umsaetzeVon(LENA, 'DE00123456789012345678'), undefined);
  assert.ok(umsaetzeVon(LENA, 'DE02 5001 0517 5407 3249 11')?.length);
});

test('UC-003/BR-0075: CSV mit BOM, Kopfzeile, CRLF, Datum TT.MM.JJJJ und Dezimalkomma, in der Reihenfolge der Liste', () => {
  ausgangsstand();
  const csv = csvAus(umsaetzeVon(LENA, GIRO, { von: '2026-02-10', bis: '2026-02-12' })!);
  assert.equal(csv, '﻿Buchungstag;Gegenpartei;Verwendungszweck;Betrag;Saldo danach\r\n'
    + '12.02.2026;Bäckerei Krause;Einkauf;-12,00;2190,10\r\n'
    + '10.02.2026;Energieversorgung Nord;Abschlag Februar;-86,00;2202,10\r\n');
});

test('UC-003/BR-0075: Texte mit Semikolon oder Anführungszeichen stehen in Anführungszeichen', () => {
  const csv = csvAus([{ buchungstag: '2026-02-01', gebuchtAm: '2026-02-01T00:00:00.000Z', gegenpartei: 'A "B"', verwendungszweck: 'Teil 1; Rest 2', betrag: 1250, kategorie: 'Sonstiges', waehrung: 'EUR', saldoDanach: 3000.5, umsatzId: 'U-1', sepaLastschrift: false, zurueckgegeben: false }]);
  assert.ok(csv.endsWith('01.02.2026;"A ""B""";"Teil 1; Rest 2";1250,00;3000,50\r\n'));
});

test('BR-0075/BR-0076: eine leere Auswahl hat keine Umsätze, der Export hat sonst eine Zeile je Umsatz der Liste', () => {
  ausgangsstand();
  assert.deepEqual(umsaetzeVon(LENA, GIRO, { suchtext: 'Möbel', richtung: 'eingang' }), []);
  const ausgang = umsaetzeVon(LENA, GIRO, { richtung: 'ausgang' })!;
  assert.equal(csvAus(ausgang).split('\r\n').length - 2, ausgang.length);
});
