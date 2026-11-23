import assert from 'node:assert/strict';
import test from 'node:test';
import type { Response } from 'express';
import { finanzstatus, ibansJeKennung, kontoMitIban } from '../src/konten';
import { kundeMitKennung } from '../src/kunden';
import { anlegen, anzahl } from '../src/sitzung';
import { Ablehnung, ausfuehren, ibanGueltig } from '../src/ueberweisung';
import { KATEGORIEN, LAST_UMSAETZE, umsaetzeVon } from '../src/umsaetze';
import * as vorlagen from '../src/empfaengervorlagen';
import {
  demoZuruecksetzen, LAST_SPEICHERGRENZE, lastdatenZuruecksetzen, lastIban, lastKennung, LASTKUNDEN_ANZAHL, lastkundenAnlegen, LASTTEST_PIN_STANDARD,
} from '../src/testdaten';

const LENA = { kennung: 'lena.hoffmann' };
const JONAS = { kennung: 'jonas.weber' };
const LENA_GIRO = 'DE02500105175407324911';
const JONAS_GIRO = 'DE61500105175407325013';
const EMPFAENGER = 'DE89370400440532013000';
const auftrag = (auftragsId: string, auftraggeberIban: string, betrag = 50) => ({
  auftragsId, auftraggeberIban, empfaenger: 'Möbel Nord GmbH', empfaengerIban: EMPFAENGER, betrag, verwendungszweck: 'Rechnung 4711',
});
const status = (fn: () => unknown) => { try { fn(); } catch (e) { return (e as Ablehnung).status; } return 0; };
const ohneCookie = { cookie: () => undefined } as unknown as Response;
const lastkunde = (nr: number) => kundeMitKennung(lastKennung(nr))!;

test('Lastkunden gibt es nur, wenn der Testbetrieb sie anlegt', () => {
  assert.equal(kundeMitKennung('lasttest-001'), undefined);
  assert.equal(finanzstatus('lasttest-001').konten.length, 0);
});

test('Jede Kundin sieht nur ihre Konten: Jonas hat eine eigene Kopie des Demo-Bestands', () => {
  demoZuruecksetzen();
  const lena = finanzstatus(LENA.kennung);
  const jonas = finanzstatus(JONAS.kennung);
  assert.deepEqual(lena.konten.map(k => k.iban), [LENA_GIRO, 'DE44500105175407325028', 'DE97500105175407324947'], 'Lena behält ihre Konten');
  assert.equal(lena.gesamtvermoegen, 1757.85);
  assert.equal(jonas.gesamtvermoegen, 1757.85);
  assert.deepEqual(jonas.konten.map(k => [k.kontoname, k.saldo]), lena.konten.map(k => [k.kontoname, k.saldo]));
  assert.ok(jonas.konten.every(k => ibanGueltig(k.iban) && !lena.konten.some(l => l.iban === k.iban)), 'eigene, gültige IBANs');
  assert.equal(umsaetzeVon(JONAS.kennung, JONAS_GIRO)!.length, umsaetzeVon(LENA.kennung, LENA_GIRO)!.length, 'dieselben Demo-Umsätze');
});

test('BR-0007/BR-0011: fremde Konten sind für die Kundin nicht da (403 bei der Überweisung, keine Umsätze)', () => {
  demoZuruecksetzen();
  assert.equal(status(() => ausfuehren(LENA, auftrag('fremd-1', JONAS_GIRO))), 403);
  assert.equal(umsaetzeVon(LENA.kennung, JONAS_GIRO), undefined);
  assert.equal(umsaetzeVon(JONAS.kennung, LENA_GIRO), undefined);
  assert.equal(kontoMitIban(LENA.kennung, JONAS_GIRO), undefined);
  assert.equal(finanzstatus(JONAS.kennung).konten[0].saldo, 2145.3, 'nichts gebucht');
});

test('Eine Überweisung bucht nur bei der Kundin; dieselbe Auftrags-Kennung einer anderen Kundin ist ein eigener Auftrag', () => {
  demoZuruecksetzen();
  assert.equal(ausfuehren(LENA, auftrag('a-1', LENA_GIRO)).neu, true);
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2095.3);
  assert.equal(finanzstatus(JONAS.kennung).konten[0].saldo, 2145.3);
  assert.equal(umsaetzeVon(JONAS.kennung, JONAS_GIRO, { suchtext: 'Möbel' })!.length, 0);
  const vonJonas = ausfuehren(JONAS, auftrag('a-1', JONAS_GIRO, 20));
  assert.equal(vonJonas.neu, true, 'kein Rückgriff auf Lenas Auftrag');
  assert.equal(vonJonas.ueberweisung.auftraggeberIban, JONAS_GIRO);
  assert.equal(finanzstatus(JONAS.kennung).konten[0].saldo, 2125.3);
  assert.equal(ausfuehren(LENA, auftrag('a-1', LENA_GIRO)).neu, false, 'Lenas Wiederholung bucht weiter nicht');
});

test('Lastkunden: 300 Kennungen mit der Test-PIN, je ein Girokonto mit gültiger, eindeutiger IBAN, 10.000 € und Rahmen, 200 Ausgangsumsätze', () => {
  const kunden = lastkundenAnlegen();
  assert.equal(kunden.length, LASTKUNDEN_ANZAHL);
  assert.deepEqual([kunden[0].kennung, kunden[299].kennung], ['lasttest-001', 'lasttest-300']);
  assert.ok(kunden.every(k => k.pin === LASTTEST_PIN_STANDARD));
  assert.equal(kundeMitKennung(' LASTTEST-042 ')?.kennung, 'lasttest-042');
  const ibans = new Set<string>();
  for (let nr = 1; nr <= LASTKUNDEN_ANZAHL; nr++) {
    const { konten, gesamtvermoegen } = finanzstatus(lastKennung(nr));
    assert.equal(konten.length, 1);
    const [giro] = konten;
    assert.equal(giro.iban, lastIban(nr));
    assert.ok(ibanGueltig(giro.iban), `${giro.iban} hat eine gültige Prüfziffer`);
    assert.match(giro.iban, /^DE\d{20}$/);
    assert.deepEqual([giro.art, giro.saldo, giro.dispositionsrahmen, giro.verfuegbarerBetrag, gesamtvermoegen], ['Girokonto', 10000, 1000, 11000, 10000]);
    const liste = umsaetzeVon(lastKennung(nr), giro.iban)!;
    assert.equal(liste.length, LAST_UMSAETZE);
    assert.equal(liste[0].saldoDanach, 10000, 'der jüngste trägt den Kontosaldo');
    ibans.add(giro.iban);
  }
  assert.equal(ibans.size, LASTKUNDEN_ANZAHL, 'jede IBAN nur einmal');
  for (const demo of [LENA, JONAS]) for (const k of finanzstatus(demo.kennung).konten) assert.ok(!ibans.has(k.iban));
  assert.equal(lastkundenAnlegen('24680')[0].pin, '24680', 'PIN aus LASTTEST_PIN');
  lastkundenAnlegen();
});

test('BR-0104/BR-0009: Lastumsätze liegen in den sechs Monaten vor dem Reset, decken alle sieben Kategorien und streuen in beiden Richtungen', () => {
  lastdatenZuruecksetzen();
  const heute = new Date().toISOString().slice(0, 10);
  const grenze = new Date(`${heute}T00:00:00Z`);
  grenze.setUTCMonth(grenze.getUTCMonth() - 6);
  const sechsMonate = grenze.toISOString().slice(0, 10);
  for (const nr of [1, 150, 300]) {
    const liste = umsaetzeVon(lastKennung(nr), lastIban(nr))!;
    assert.equal(liste.length, LAST_UMSAETZE);
    assert.ok(liste.every(u => u.buchungstag < heute && u.buchungstag >= sechsMonate), 'Buchungstage vor dem Reset, höchstens sechs Monate');
    assert.deepEqual(new Set(liste.map(u => u.kategorie)), new Set(KATEGORIEN), 'alle sieben Kategorien');
    const eingaenge = liste.filter(u => u.betrag > 0);
    const ausgaenge = liste.filter(u => u.betrag < 0);
    assert.ok(eingaenge.length > 0 && ausgaenge.length > 0, 'beide Richtungen');
    const hoehen = liste.map(u => Math.abs(u.betrag));
    assert.ok(Math.min(...hoehen) < 5 && Math.max(...hoehen) >= 1000, 'von wenigen Euro bis vierstellig');
    for (let i = 1; i < liste.length; i++) {
      assert.equal(liste[i].saldoDanach, Math.round((liste[i - 1].saldoDanach - liste[i - 1].betrag) * 100) / 100, 'Saldo danach rückwärts (BR-0008)');
    }
    for (const kategorie of KATEGORIEN) {
      assert.ok(umsaetzeVon(lastKennung(nr), lastIban(nr), { kategorie, betragVon: 1, betragBis: 60 })!.length > 0, `enger Betragsfilter mit ${kategorie} hat Treffer`);
    }
  }
  assert.notDeepEqual(umsaetzeVon(lastKennung(1), lastIban(1))!.map(u => u.betrag), umsaetzeVon(lastKennung(2), lastIban(2))!.map(u => u.betrag), 'je Lastkunde eigene Folge');
});

test('Lastkunde: 2.000 Überweisungen zu 0,10 € gehen durch; Umsätze und Auftrags-Kennungen bleiben bei der Speichergrenze', () => {
  lastdatenZuruecksetzen();
  const kunde = lastkunde(7);
  for (let i = 1; i <= 2000; i++) assert.equal(ausfuehren(kunde, auftrag(`l-${i}`, lastIban(7), 0.1)).neu, true);
  assert.equal(finanzstatus(kunde.kennung).konten[0].saldo, 9800);
  const liste = umsaetzeVon(kunde.kennung, lastIban(7))!;
  assert.equal(liste.length, LAST_SPEICHERGRENZE);
  assert.equal(liste[0].saldoDanach, 9800, 'die jüngsten bleiben');
  assert.equal(ausfuehren(kunde, auftrag('l-2000', lastIban(7), 0.1)).neu, false, 'jüngste Kennung bleibt genau einmal');
  assert.equal(finanzstatus(kunde.kennung).konten[0].saldo, 9800);
});

test('Demo-Reset lässt Lastkunden stehen, Last-Reset lässt Demo-Kundinnen stehen', () => {
  lastdatenZuruecksetzen();
  demoZuruecksetzen();
  const last = lastkunde(1);
  for (const kunde of [kundeMitKennung(LENA.kennung)!, last, lastkunde(2)]) anlegen(ohneCookie, kunde);
  ausfuehren(LENA, auftrag('d-1', LENA_GIRO));
  ausfuehren(last, auftrag('d-1', lastIban(1), 0.1));
  vorlagen.anlegen(LENA.kennung, { name: 'Möbel Nord GmbH', empfaengerIban: EMPFAENGER });
  vorlagen.anlegen(last.kennung, { name: 'Lastvorlage', empfaengerIban: EMPFAENGER });

  demoZuruecksetzen();
  assert.equal(anzahl(k => k === LENA.kennung), 0, 'Demo-Sitzungen beendet');
  assert.equal(anzahl(k => k.startsWith('lasttest-')), 2, 'Last-Sitzungen bleiben');
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2145.3);
  assert.equal(vorlagen.liste(LENA.kennung).length, 0);
  assert.equal(vorlagen.liste(JONAS.kennung).length, 50);
  assert.equal(finanzstatus(last.kennung).konten[0].saldo, 9999.9, 'Lastkonto unberührt');
  assert.equal(umsaetzeVon(last.kennung, lastIban(1))!.length, LAST_SPEICHERGRENZE, 'der neue Umsatz verdrängt den ältesten');
  assert.equal(umsaetzeVon(last.kennung, lastIban(1), { suchtext: 'Rechnung 4711' })!.length, 1, 'der gebuchte Umsatz bleibt');
  assert.equal(vorlagen.liste(last.kennung).length, 1);
  assert.equal(ausfuehren(last, auftrag('d-1', lastIban(1), 0.1)).neu, false, 'Auftrags-Kennungen der Lastkunden bleiben');

  anlegen(ohneCookie, kundeMitKennung(LENA.kennung)!);
  ausfuehren(LENA, auftrag('d-2', LENA_GIRO));
  lastdatenZuruecksetzen();
  assert.equal(anzahl(k => k.startsWith('lasttest-')), 0, 'Last-Sitzungen beendet');
  assert.equal(anzahl(k => k === LENA.kennung), 1, 'Demo-Sitzung bleibt');
  assert.equal(finanzstatus(last.kennung).konten[0].saldo, 10000);
  assert.equal(umsaetzeVon(last.kennung, lastIban(1))!.length, LAST_UMSAETZE);
  assert.equal(umsaetzeVon(last.kennung, lastIban(1), { suchtext: 'Rechnung 4711' })!.length, 0, 'gebuchter Umsatz vergessen');
  assert.equal(vorlagen.liste(last.kennung).length, 0);
  assert.equal(ausfuehren(last, auftrag('d-1', lastIban(1), 0.1)).neu, true, 'Auftrags-Kennungen der Lastkunden vergessen');
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2095.3, 'Demo-Konto unberührt');
  assert.equal(ausfuehren(LENA, auftrag('d-2', LENA_GIRO)).neu, false, 'Demo-Auftrag bleibt genau einmal');
  assert.equal(umsaetzeVon(LENA.kennung, LENA_GIRO, { suchtext: 'Möbel' })!.length, 1);
});

test('UC-002/PK-64: jede IBAN der Demo-Konten besteht die IBAN-Prüfung (Prüfziffer nach ISO 7064 MOD 97-10)', () => {
  demoZuruecksetzen();
  const ibans = ibansJeKennung().flatMap(([, liste]) => liste);
  assert.ok(ibans.length >= 6);
  for (const iban of ibans) assert.ok(ibanGueltig(iban), `${iban} hat keine gültige Prüfziffer`);
});
