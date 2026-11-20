import assert from 'node:assert/strict';
import test from 'node:test';
import { finanzstatus, zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { GRENZE_FEHLER, MINDESTBETRAG_FEHLER, PAARUNG_FEHLER, Umbuchungsfehler, ausfuehren, zuruecksetzen } from '../src/umbuchung';
import { umsaetzeVon, zuruecksetzen as umsaetzeZuruecksetzen } from '../src/umsaetze';

const LENA = { kennung: 'lena.hoffmann' };
const GIRO = 'DE02500105175407324911';
const KARTE = 'DE44500105175407325028';
const TAGESGELD = 'DE97500105175407324947';
const FREMD = 'DE89370400440532013000';
const auftrag = (mehr = {}) => ({ auftragsId: 'u-1', quellIban: GIRO, zielIban: TAGESGELD, betrag: 500, ...mehr });
const frisch = () => { kontenZuruecksetzen(); zuruecksetzen(); umsaetzeZuruecksetzen(); };
const fehler = (fn: () => unknown) => { try { fn(); } catch (e) { return e as Umbuchungsfehler; } return undefined; };
const salden = () => finanzstatus(LENA.kennung).konten.map(k => k.saldo);

test('BR-0091: die Umbuchung mindert den Quell- und erhöht den Zielsaldo, das Gesamtvermögen bleibt', () => {
  frisch();
  assert.equal(ausfuehren(LENA, auftrag()).neu, true);
  assert.deepEqual(salden(), [1645.3, -387.45, 500]);
  assert.equal(finanzstatus(LENA.kennung).gesamtvermoegen, 1757.85);
});

test('BR-0091: die Umbuchung vom Tagesgeldkonto zurück aufs Girokonto', () => {
  frisch();
  ausfuehren(LENA, auftrag());
  ausfuehren(LENA, auftrag({ auftragsId: 'u-2', quellIban: TAGESGELD, zielIban: GIRO, betrag: 200 }));
  assert.deepEqual(salden(), [1845.3, -387.45, 300]);
});

test('BR-0092: dieselbe Auftrags-Kennung bucht nur einmal und prüft nichts weiter', () => {
  frisch();
  ausfuehren(LENA, auftrag());
  assert.equal(ausfuehren(LENA, auftrag({ betrag: 3000 })).neu, false, 'auch wenn der Betrag nicht mehr zulässig wäre');
  assert.deepEqual(salden(), [1645.3, -387.45, 500]);
  assert.equal(umsaetzeVon(LENA.kennung, TAGESGELD)!.length, 1);
});

test('BR-0090: je ein Umsatz auf beiden Konten mit Gegenpartei, Verwendungszweck und Saldo danach', () => {
  frisch();
  ausfuehren(LENA, auftrag());
  const [aus] = umsaetzeVon(LENA.kennung, GIRO)!;
  const [ein] = umsaetzeVon(LENA.kennung, TAGESGELD)!;
  assert.deepEqual([aus.gegenpartei, aus.verwendungszweck, aus.betrag, aus.saldoDanach], ['Tagesgeldkonto', 'Umbuchung', -500, 1645.3]);
  assert.deepEqual([ein.gegenpartei, ein.verwendungszweck, ein.betrag, ein.saldoDanach], ['Girokonto', 'Umbuchung', 500, 500]);
});

test('BR-0088: dasselbe Konto, Kreditkarte und zwei Konten gleicher Art werden mit 422 abgelehnt', () => {
  frisch();
  for (const [quellIban, zielIban] of [[GIRO, GIRO], [GIRO, KARTE], [KARTE, TAGESGELD]]) {
    const f = fehler(() => ausfuehren(LENA, auftrag({ quellIban, zielIban })));
    assert.deepEqual([f?.status, f?.message], [422, PAARUNG_FEHLER]);
  }
  assert.deepEqual(salden(), [2145.3, -387.45, 0]);
});

test('BR-0088: ein Konto, das nicht der Kundin gehört, wird vor Paarung und Betragsgrenze mit 403 abgelehnt', () => {
  frisch();
  assert.equal(fehler(() => ausfuehren(LENA, auftrag({ quellIban: FREMD, betrag: 1000000 })))?.status, 403);
  assert.equal(fehler(() => ausfuehren(LENA, auftrag({ zielIban: FREMD })))?.status, 403);
});

test('BR-0089: Betragsgrenze beim Girokonto Saldo plus Rahmen, beim Tagesgeldkonto der Saldo', () => {
  frisch();
  assert.equal(fehler(() => ausfuehren(LENA, auftrag({ betrag: 3145.31 })))?.message, GRENZE_FEHLER);
  assert.equal(ausfuehren(LENA, auftrag({ betrag: 3145.3 })).neu, true, 'genau der verfügbare Betrag geht');
  assert.deepEqual(salden(), [-1000, -387.45, 3145.3]);
  frisch();
  const f = fehler(() => ausfuehren(LENA, auftrag({ quellIban: TAGESGELD, zielIban: GIRO, betrag: 10 })));
  assert.deepEqual([f?.status, f?.message], [422, GRENZE_FEHLER]);
});

test('BR-0088: Prüfreihenfolge Kontenpaarung vor Betragsgrenze', () => {
  frisch();
  assert.equal(fehler(() => ausfuehren(LENA, auftrag({ zielIban: GIRO, betrag: 1000000 })))?.message, PAARUNG_FEHLER);
});

test('Feldregeln: Betrag unter 0,10 € und fehlerhafte Felder werden mit 400 abgelehnt', () => {
  frisch();
  const f = fehler(() => ausfuehren(LENA, auftrag({ betrag: 0.09 })));
  assert.deepEqual([f?.status, f?.message], [400, MINDESTBETRAG_FEHLER]);
  assert.equal(fehler(() => ausfuehren(LENA, auftrag({ quellIban: 'DE02' })))?.status, 400);
  assert.equal(fehler(() => ausfuehren(LENA, auftrag({ auftragsId: '' })))?.status, 400);
  assert.equal(fehler(() => ausfuehren(LENA, auftrag({ betrag: '500' })))?.status, 400);
  assert.deepEqual(salden(), [2145.3, -387.45, 0]);
});

test('BR-0092: die Auftrags-Kennung gilt je Kundin', () => {
  frisch();
  ausfuehren(LENA, auftrag());
  const jonas = { kennung: 'jonas.weber' };
  assert.equal(ausfuehren(jonas, auftrag({ quellIban: 'DE61500105175407325013', zielIban: 'DE38500105175407325039' })).neu, true);
});
