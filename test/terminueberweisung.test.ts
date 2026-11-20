import assert from 'node:assert/strict';
import test from 'node:test';
import { finanzstatus, zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import {
  Ablehnung, AUSFUEHRUNGSTAG_FEHLER, ausfuehren, gueltigerTag, heute, KENNUNG_FEHLER, plusTage,
  vormerken, vorgemerkteAuftraege, vorgemerktenLoeschen, zuruecksetzen,
} from '../src/ueberweisung';
import { umsaetzeVon } from '../src/umsaetze';

const LENA = { kennung: 'lena.hoffmann' };
const JONAS = { kennung: 'jonas.weber' };
const GIRO = 'DE02500105175407324931';
/** 20.11.2026, 23:30 Uhr in Berlin (22:30 UTC): in UTC ist es noch derselbe Tag, in Berlin auch. */
const JETZT = new Date('2026-11-20T22:30:00Z');
const auftrag = (mehr = {}) => ({
  auftragsId: 't-1', auftraggeberIban: GIRO, empfaenger: 'Möbel Nord GmbH', empfaengerIban: 'DE89 3704 0044 0532 0130 00',
  betrag: 50, verwendungszweck: 'Rechnung 4711', ausfuehrungstag: '2026-11-25', ...mehr,
});
const frisch = () => { kontenZuruecksetzen(); zuruecksetzen(); };
const fehler = (fn: () => unknown) => { try { fn(); } catch (e) { return { status: (e as Ablehnung).status, text: (e as Error).message }; } return { status: 0, text: '' }; };

test('BR-0079: heute ist der Kalendertag in Europe/Berlin', () => {
  assert.equal(heute(new Date('2026-11-20T23:30:00Z')), '2026-11-21', 'nach Mitternacht in Berlin ist schon morgen');
  assert.equal(heute(new Date('2026-11-20T22:30:00Z')), '2026-11-20');
  assert.equal(plusTage('2026-11-20', 365), '2027-11-20');
  assert.ok(gueltigerTag('2027-02-28'));
  assert.ok(!gueltigerTag('2027-02-31'));
  assert.ok(!gueltigerTag('24.12.2026'));
});

test('BR-0079: Ausführungstag frühestens morgen, höchstens 365 Tage nach heute', () => {
  frisch();
  for (const [id, tag] of [['h', '2026-11-20'], ['g', '2026-11-19'], ['z', '2027-11-21']] as const) {
    assert.deepEqual(fehler(() => vormerken(LENA, auftrag({ auftragsId: id, ausfuehrungstag: tag }), JETZT)), { status: 422, text: AUSFUEHRUNGSTAG_FEHLER }, tag);
  }
  assert.equal(fehler(() => vormerken(LENA, auftrag({ auftragsId: 'x', ausfuehrungstag: '2027-02-31' }), JETZT)).status, 400);
  assert.equal(vormerken(LENA, auftrag({ auftragsId: 'm', ausfuehrungstag: '2026-11-21' }), JETZT).neu, true, 'morgen');
  assert.equal(vormerken(LENA, auftrag({ auftragsId: 'j', ausfuehrungstag: '2027-11-20' }), JETZT).neu, true, 'in 365 Tagen');
});

test('UC-002 A9: Vormerken bucht nichts und erzeugt keinen Umsatz; BR-0003, BR-0004, BR-0007 gelten', () => {
  frisch();
  const vorher = umsaetzeVon(LENA.kennung, GIRO)!.length;
  const { terminueberweisung } = vormerken(LENA, auftrag(), JETZT);
  assert.equal(terminueberweisung.status, 'vorgemerkt');
  assert.equal(terminueberweisung.empfaengerIban, 'DE89370400440532013000');
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2145.3);
  assert.equal(umsaetzeVon(LENA.kennung, GIRO)!.length, vorher);
  assert.equal(fehler(() => vormerken(LENA, auftrag({ auftragsId: 'i', empfaengerIban: 'DE00123456789012345678' }), JETZT)).status, 400);
  assert.equal(fehler(() => vormerken(LENA, auftrag({ auftragsId: 'b', betrag: 3145.31 }), JETZT)).status, 422);
  assert.equal(fehler(() => vormerken(LENA, auftrag({ auftragsId: 'k', auftraggeberIban: 'DE89370400440532013000' }), JETZT)).status, 403);
  assert.equal(fehler(() => vormerken(LENA, auftrag({ auftragsId: 'n', betrag: 0.09 }), JETZT)).status, 400);
});

test('BR-0005: dieselbe Auftrags-Kennung merkt nur einmal vor und bleibt nach dem Löschen verbraucht', () => {
  frisch();
  assert.equal(vormerken(LENA, auftrag(), JETZT).neu, true);
  assert.equal(vormerken(LENA, auftrag(), JETZT).neu, false);
  assert.equal(vorgemerkteAuftraege(LENA.kennung).length, 1);
  assert.ok(vorgemerktenLoeschen(LENA.kennung, 't-1'));
  assert.deepEqual(fehler(() => vormerken(LENA, auftrag(), JETZT)), { status: 422, text: KENNUNG_FEHLER });
  assert.equal(vorgemerkteAuftraege(LENA.kennung).length, 0);
});

test('BR-0005: eine Kennung gilt je Kundin über sofortige Überweisung und Terminüberweisung', () => {
  frisch();
  ausfuehren(LENA, auftrag({ auftragsId: 's-1' }));
  assert.deepEqual(fehler(() => vormerken(LENA, auftrag({ auftragsId: 's-1' }), JETZT)), { status: 422, text: KENNUNG_FEHLER });
  vormerken(LENA, auftrag({ auftragsId: 't-2' }), JETZT);
  assert.deepEqual(fehler(() => ausfuehren(LENA, auftrag({ auftragsId: 't-2' }))), { status: 422, text: KENNUNG_FEHLER });
  assert.equal(finanzstatus(LENA.kennung).konten[0].saldo, 2095.3, 'nur die sofortige Überweisung ist gebucht');
  assert.equal(ausfuehren(LENA, auftrag({ auftragsId: 's-1' })).neu, false, 'Wiederholung der sofortigen Überweisung bleibt 200');
  vormerken(JONAS, auftrag({ auftragsId: 't-2', auftraggeberIban: finanzstatus(JONAS.kennung).konten[0].iban }), JETZT);
  assert.equal(vorgemerkteAuftraege(JONAS.kennung).length, 1, 'dieselbe Kennung einer anderen Kundin ist ein eigener Auftrag');
});

test('BR-0080: Liste und Löschen nur für vorgemerkte Aufträge der angemeldeten Kundin, nach Ausführungstag', () => {
  frisch();
  vormerken(LENA, auftrag({ auftragsId: 'spaet', ausfuehrungstag: '2026-12-20' }), JETZT);
  vormerken(LENA, auftrag({ auftragsId: 'frueh-1', ausfuehrungstag: '2026-11-25' }), JETZT);
  vormerken(LENA, auftrag({ auftragsId: 'frueh-2', ausfuehrungstag: '2026-11-25' }), JETZT);
  ausfuehren(LENA, auftrag({ auftragsId: 'sofort' }));
  assert.deepEqual(vorgemerkteAuftraege(LENA.kennung).map(a => a.auftragsId), ['frueh-1', 'frueh-2', 'spaet']);
  assert.deepEqual(vorgemerkteAuftraege(JONAS.kennung), [], 'fremde Aufträge sieht Jonas nicht');
  assert.equal(vorgemerktenLoeschen(JONAS.kennung, 'spaet'), false, 'fremder Auftrag: 404');
  assert.equal(vorgemerktenLoeschen(LENA.kennung, 'unbekannt'), false, 'unbekannte Kennung: 404');
  assert.equal(vorgemerktenLoeschen(LENA.kennung, 'sofort'), false, 'ausgeführter Auftrag: 404');
  assert.equal(vorgemerktenLoeschen(LENA.kennung, 'spaet'), true);
  assert.equal(vorgemerktenLoeschen(LENA.kennung, 'spaet'), false, 'gelöscht ist endgültig');
  assert.deepEqual(vorgemerkteAuftraege(LENA.kennung).map(a => a.auftragsId), ['frueh-1', 'frueh-2']);
});

test('ADR-002: der Demo-Reset vergisst vorgemerkte Aufträge und verbrauchte Kennungen', () => {
  frisch();
  vormerken(LENA, auftrag(), JETZT);
  zuruecksetzen();
  assert.deepEqual(vorgemerkteAuftraege(LENA.kennung), []);
  assert.equal(vormerken(LENA, auftrag(), JETZT).neu, true);
});
