import assert from 'node:assert/strict';
import test from 'node:test';
import { zuruecksetzen as kontenZuruecksetzen } from '../src/konten';
import { Abfragefehler, MONAT_FEHLER, ausgabenanalyse, buchen, zuruecksetzen } from '../src/umsaetze';

const GIRO = 'DE02500105175407324911';

function ausgangsstand() {
  kontenZuruecksetzen();
  zuruecksetzen();
}

const ausgang = (tag: string, betrag: number, kategorie: 'Wohnen' | 'Freizeit' | 'Sonstiges' = 'Sonstiges', grenze?: number) =>
  buchen(GIRO, { buchungstag: tag, gebuchtAm: `${tag}T10:00:00.000Z`, gegenpartei: 'X', verwendungszweck: 'Y', betrag, kategorie, saldoDanach: 0 }, grenze);

test('BR-0083: Ausgänge des Monats je Kategorie, Eingänge zählen nicht, größte Summe zuerst', () => {
  ausgangsstand();
  assert.deepEqual(ausgabenanalyse(GIRO, '2026-02'), {
    monat: '2026-02', gesamtausgaben: 98,
    kategorien: [{ kategorie: 'Wohnen', summe: 86, anteil: 87.8 }, { kategorie: 'Lebensmittel', summe: 12, anteil: 12.2 }],
  });
  assert.deepEqual(ausgabenanalyse(GIRO, '2026-01').kategorien, [{ kategorie: 'Wohnen', summe: 950, anteil: 100 }]);
});

test('BR-0083: Monat ohne Ausgänge liefert leere Liste und Gesamtausgaben 0', () => {
  ausgangsstand();
  assert.deepEqual(ausgabenanalyse(GIRO, '2020-01'), { monat: '2020-01', gesamtausgaben: 0, kategorien: [] });
});

test('BR-0083: erster und letzter Tag zählen, bei gleicher Summe alphabetisch', () => {
  ausgangsstand();
  ausgang('2025-03-01', -10, 'Wohnen');
  ausgang('2025-03-31', -10, 'Freizeit');
  ausgang('2025-04-01', -5);
  const a = ausgabenanalyse(GIRO, '2025-03');
  assert.deepEqual(a.kategorien.map(k => k.kategorie), ['Freizeit', 'Wohnen']);
  assert.equal(a.gesamtausgaben, 20);
});

test('BR-0083: die Grenze von 200 Umsätzen gilt nicht für die Ausgabenanalyse', () => {
  ausgangsstand();
  for (let i = 0; i < 250; i++) ausgang('2025-05-10', -1, 'Sonstiges', 200);
  assert.equal(ausgabenanalyse(GIRO, '2025-05').gesamtausgaben, 250);
});

test('BR-0083: Anteil kaufmännisch auf eine Nachkommastelle, ohne Ausgleich auf 100 %', () => {
  ausgangsstand();
  ausgang('2025-06-01', -1, 'Wohnen');
  ausgang('2025-06-02', -1, 'Freizeit');
  ausgang('2025-06-03', -1, 'Sonstiges');
  assert.deepEqual(ausgabenanalyse(GIRO, '2025-06').kategorien.map(k => k.anteil), [33.3, 33.3, 33.3]);
});

test('BR-0084: ungültiger oder fehlender Monat ist ein Abfragefehler', () => {
  for (const monat of ['2026-13', '2026-00', '2026-2', '26-02', '', undefined]) {
    assert.throws(() => ausgabenanalyse(GIRO, monat as string), (e: Error) => e instanceof Abfragefehler && e.message === MONAT_FEHLER);
  }
});
