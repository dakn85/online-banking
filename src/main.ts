import express from 'express';
import { join } from 'node:path';
import { Datenfehler, finanzstatus, kontoMitIban } from './konten';
import { kundeMitKennung } from './kunden';
import { Ablehnung, ausfuehren, vormerken, vorgemerkteAuftraege, vorgemerktenLoeschen } from './ueberweisung';
import { Abfragefehler, EXPORT_LEER, ausgabenanalyse, csvAus, filterAus, monatPruefen, seiteAus, trefferseite, umsaetzeVon } from './umsaetze';
import { Monatsfehler, auszugAus, monatPruefen as auszugMonatPruefen, pdfAus } from './kontoauszug';
import { Rueckgabefehler, zurueckgeben } from './lastschrift';
import { Umbuchungsfehler, ausfuehren as umbuchen } from './umbuchung';
import * as vorlagen from './empfaengervorlagen';
import * as dauerauftraege from './dauerauftraege';
import * as tageslimit from './tageslimit';
import * as debitkarte from './debitkarte';
import * as nachrichten from './nachrichten';
import * as kundendaten from './kundendaten';
import { angemeldeterKunde, anlegen, beenden, nurAngemeldet } from './sitzung';
import { demoZuruecksetzen, lastdatenZuruecksetzen, lastkundenAnlegen } from './testdaten';

const port = Number(process.env.PORT ?? 8080);
const testbetrieb = process.env.TEST_MODE === '1';
const oeffentlich = join(__dirname, '..', 'public');

const app = express();
app.use(express.json());
app.use('/assets', express.static(oeffentlich, { index: false }));

// Anmeldung (Dummy: feste Demo-Kunden, siehe kunden.ts; im Testbetrieb auch die Lastkunden, siehe testdaten.ts)
app.post('/api/anmeldung', (req, res) => {
  const kunde = kundeMitKennung(String(req.body?.kennung ?? ''));
  if (!kunde || String(req.body?.pin ?? '') !== kunde.pin) {
    return res.status(401).json({ fehler: 'Kennung oder PIN ist falsch.' });
  }
  anlegen(res, kunde);
  res.json({ name: `${kunde.vorname} ${kunde.nachname}` });
});

app.post('/api/abmeldung', (req, res) => {
  beenden(req, res);
  res.status(204).end();
});

app.get('/api/sitzung', nurAngemeldet('api'), (_req, res) => {
  const k = res.locals.kunde;
  res.json({ vorname: k.vorname, nachname: k.nachname, kundennummer: k.kundennummer });
});

// UC-001: Finanzstatus der angemeldeten Kundin, nur ihre Konten
app.get('/api/konten', nurAngemeldet('api'), (_req, res) => {
  try {
    res.json(finanzstatus(res.locals.kunde.kennung));
  } catch (fehler) {
    if (!(fehler instanceof Datenfehler)) throw fehler;
    console.error(fehler.message);
    res.status(500).json({ fehler: 'Der Finanzstatus ist derzeit nicht möglich.' });
  }
});

// UC-002: Überweisung vom Girokonto, genau einmal je Auftrags-Kennung (BR-0005)
const PFLICHT = ['auftragsId', 'auftraggeberIban', 'empfaenger', 'empfaengerIban', 'verwendungszweck'] as const;
app.post('/api/ueberweisungen', nurAngemeldet('api'), (req, res) => {
  const b = req.body ?? {};
  if (PFLICHT.some(feld => typeof b[feld] !== 'string' || !b[feld].trim()) || typeof b.betrag !== 'number') {
    return res.status(400).json({ fehler: 'Der Auftrag ist unvollständig.' });
  }
  try {
    const { neu, ueberweisung } = ausfuehren(res.locals.kunde, {
      auftragsId: b.auftragsId, auftraggeberIban: b.auftraggeberIban, empfaenger: b.empfaenger.trim(),
      empfaengerIban: b.empfaengerIban, betrag: b.betrag, verwendungszweck: b.verwendungszweck.trim(),
    });
    res.status(neu ? 201 : 200).json(ueberweisung);
  } catch (fehler) {
    if (!(fehler instanceof Ablehnung)) throw fehler;
    res.status(fehler.status).json({ fehler: fehler.message });
  }
});

// UC-002 A9: Terminüberweisung vormerken, genau einmal je Auftrags-Kennung (BR-0005, BR-0079); bucht nichts.
app.post('/api/terminueberweisungen', nurAngemeldet('api'), (req, res) => {
  const b = req.body ?? {};
  if (PFLICHT.some(feld => typeof b[feld] !== 'string' || !b[feld].trim()) || typeof b.betrag !== 'number' || typeof b.ausfuehrungstag !== 'string') {
    return res.status(400).json({ fehler: 'Der Auftrag ist unvollständig.' });
  }
  try {
    const { neu, terminueberweisung } = vormerken(res.locals.kunde, {
      auftragsId: b.auftragsId, auftraggeberIban: b.auftraggeberIban, empfaenger: b.empfaenger.trim(),
      empfaengerIban: b.empfaengerIban, betrag: b.betrag, verwendungszweck: b.verwendungszweck.trim(), ausfuehrungstag: b.ausfuehrungstag,
    });
    res.status(neu ? 201 : 200).json(terminueberweisung);
  } catch (fehler) {
    if (!(fehler instanceof Ablehnung)) throw fehler;
    res.status(fehler.status).json({ fehler: fehler.message });
  }
});

// UC-017: vorgemerkte Aufträge der angemeldeten Kundin liefern und löschen (BR-0080)
app.get('/api/terminueberweisungen', nurAngemeldet('api'), (_req, res) => {
  res.json(vorgemerkteAuftraege(res.locals.kunde.kennung));
});
app.delete('/api/terminueberweisungen/:auftragsId', nurAngemeldet('api'), (req, res) => {
  if (!vorgemerktenLoeschen(res.locals.kunde.kennung, req.params.auftragsId)) {
    return res.status(404).json({ fehler: 'Der vorgemerkte Auftrag wurde nicht gefunden.' });
  }
  res.status(204).end();
});

// UC-021: Umbuchung zwischen Girokonto und Tagesgeldkonto, sofort und genau einmal je Auftrags-Kennung (BR-0088 bis BR-0092)
app.post('/api/umbuchungen', nurAngemeldet('api'), (req, res) => {
  try {
    const { neu, umbuchung } = umbuchen(res.locals.kunde, req.body ?? {});
    res.status(neu ? 201 : 200).json(umbuchung);
  } catch (fehler) {
    if (!(fehler instanceof Umbuchungsfehler)) throw fehler;
    res.status(fehler.status).json({ fehler: fehler.message });
  }
});

// UC-016: Daueraufträge der angemeldeten Kundin (BR-0077, BR-0078)
const dauerauftragsfehler = (res: express.Response, fehler: unknown) => {
  if (!(fehler instanceof dauerauftraege.Dauerauftragsfehler)) throw fehler;
  res.status(fehler.status).json({ fehler: fehler.message });
};
app.get('/api/dauerauftraege', nurAngemeldet('api'), (_req, res) => {
  res.json(dauerauftraege.liste(res.locals.kunde.kennung));
});
app.post('/api/dauerauftraege', nurAngemeldet('api'), (req, res) => {
  try { res.status(201).json(dauerauftraege.anlegen(res.locals.kunde.kennung, req.body ?? {})); } catch (fehler) { dauerauftragsfehler(res, fehler); }
});
app.put('/api/dauerauftraege/:dauerauftragId', nurAngemeldet('api'), (req, res) => {
  try { res.json(dauerauftraege.aendern(res.locals.kunde.kennung, req.params.dauerauftragId, req.body ?? {})); } catch (fehler) { dauerauftragsfehler(res, fehler); }
});
app.delete('/api/dauerauftraege/:dauerauftragId', nurAngemeldet('api'), (req, res) => {
  try { dauerauftraege.loeschen(res.locals.kunde.kennung, req.params.dauerauftragId); res.status(204).end(); } catch (fehler) { dauerauftragsfehler(res, fehler); }
});

// UC-003: Umsätze eines Kontos der Kundin (BR-0008 bis BR-0011, BR-0104), seitenweise mit Gesamtzahl (BR-0105)
app.get('/api/konten/:iban/umsaetze', nurAngemeldet('api'), (req, res) => {
  let filter, seite;
  try {
    filter = filterAus(req.query as Record<string, unknown>);
    seite = seiteAus(req.query as Record<string, unknown>);
  } catch (fehler) {
    if (!(fehler instanceof Abfragefehler)) throw fehler;
    return res.status(400).json({ fehler: fehler.message });
  }
  const liste = umsaetzeVon(res.locals.kunde.kennung, req.params.iban, filter);
  if (!liste) return res.status(404).json({ fehler: 'Das Konto wurde nicht gefunden.' });
  res.json(trefferseite(liste, seite));
});

// UC-022: Lastschrift zurückgeben (BR-0093 bis BR-0095); Prüfreihenfolge 400, 404 Konto, 404 Umsatz, 422
app.post('/api/konten/:iban/umsaetze/:umsatzId/rueckgaben', nurAngemeldet('api'), (req, res) => {
  try {
    res.status(201).json(zurueckgeben(res.locals.kunde, req.params.iban, req.params.umsatzId));
  } catch (fehler) {
    if (!(fehler instanceof Rueckgabefehler)) throw fehler;
    res.status(fehler.status).json({ fehler: fehler.message });
  }
});

// UC-019: Ausgabenanalyse des Girokontos; Prüfreihenfolge Monat 400, Konto 404, Kreditkarte 422 (BR-0083, BR-0084)
app.get('/api/konten/:iban/ausgabenanalyse', nurAngemeldet('api'), (req, res) => {
  let monat;
  try {
    monat = monatPruefen(req.query.monat);
  } catch (fehler) {
    if (!(fehler instanceof Abfragefehler)) throw fehler;
    return res.status(400).json({ fehler: fehler.message });
  }
  const konto = kontoMitIban(res.locals.kunde.kennung, req.params.iban);
  if (!konto) return res.status(404).json({ fehler: 'Das Konto wurde nicht gefunden.' });
  if (konto.art !== 'Girokonto') return res.status(422).json({ fehler: 'Die Ausgabenanalyse gibt es nur für das Girokonto.' });
  res.json(ausgabenanalyse(konto.iban, monat));
});

// UC-003, BR-0075, BR-0076, BR-0104: Export der Umsätze als CSV über alle Seiten, ohne Seitenparameter; Prüfreihenfolge 404, 400, 422
app.get('/api/konten/:iban/umsaetze/export', nurAngemeldet('api'), (req, res) => {
  const kennung = res.locals.kunde.kennung;
  if (!umsaetzeVon(kennung, req.params.iban)) return res.status(404).json({ fehler: 'Das Konto wurde nicht gefunden.' });
  let filter;
  try {
    filter = filterAus(req.query as Record<string, unknown>);
  } catch (fehler) {
    if (!(fehler instanceof Abfragefehler)) throw fehler;
    return res.status(400).json({ fehler: fehler.message });
  }
  const liste = umsaetzeVon(kennung, req.params.iban, filter)!;
  if (!liste.length) return res.status(422).json({ fehler: EXPORT_LEER });
  res.type('text/csv; charset=utf-8')
    .set('Content-Disposition', `attachment; filename="umsaetze-${req.params.iban.replace(/\s+/g, '')}.csv"`)
    .send(csvAus(liste));
});

// UC-024, BR-0098: Kontoauszug als PDF; Prüfreihenfolge 401, Konto 404, Monat 400, Erzeugen 500
app.get('/api/konten/:iban/kontoauszug', nurAngemeldet('api'), async (req, res) => {
  const kennung = res.locals.kunde.kennung;
  const konto = kontoMitIban(kennung, req.params.iban);
  const liste = konto && umsaetzeVon(kennung, konto.iban);
  if (!konto || !liste) return res.status(404).json({ fehler: 'Das Konto wurde nicht gefunden.' });
  let monat;
  try {
    monat = auszugMonatPruefen(req.query.monat);
  } catch (fehler) {
    if (!(fehler instanceof Monatsfehler)) throw fehler;
    return res.status(400).json({ fehler: fehler.message });
  }
  try {
    const pdf = await pdfAus(konto, auszugAus(konto, liste, monat));
    res.type('application/pdf').set('Content-Disposition', `attachment; filename="Kontoauszug_${konto.iban}_${monat}.pdf"`).send(pdf);
  } catch (fehler) {
    console.error('Kontoauszug konnte nicht erzeugt werden', fehler instanceof Error ? fehler.name : 'Fehler');
    res.status(500).json({ fehler: 'Der Kontoauszug konnte nicht erstellt werden.' });
  }
});

// UC-004: Empfängervorlagen der angemeldeten Kundin (BR-0013 bis BR-0016, BR-0018)
const vorlagenfehler = (res: express.Response, fehler: unknown) => {
  if (!(fehler instanceof vorlagen.Vorlagenfehler)) throw fehler;
  res.status(fehler.status).json({ fehler: fehler.message });
};
app.get('/api/empfaengervorlagen', nurAngemeldet('api'), (_req, res) => {
  res.json(vorlagen.liste(res.locals.kunde.kennung));
});
app.post('/api/empfaengervorlagen', nurAngemeldet('api'), (req, res) => {
  try { res.status(201).json(vorlagen.anlegen(res.locals.kunde.kennung, req.body ?? {})); } catch (fehler) { vorlagenfehler(res, fehler); }
});
app.patch('/api/empfaengervorlagen/:vorlagenId', nurAngemeldet('api'), (req, res) => {
  try { res.json(vorlagen.umbenennen(res.locals.kunde.kennung, req.params.vorlagenId, req.body?.name)); } catch (fehler) { vorlagenfehler(res, fehler); }
});
app.delete('/api/empfaengervorlagen/:vorlagenId', nurAngemeldet('api'), (req, res) => {
  try { vorlagen.loeschen(res.locals.kunde.kennung, req.params.vorlagenId); res.status(204).end(); } catch (fehler) { vorlagenfehler(res, fehler); }
});

// UC-015: Tageslimit der angemeldeten Kundin lesen und setzen (BR-0070); eine Kennung im Aufruf gibt es nicht.
app.get('/api/tageslimit', nurAngemeldet('api'), (_req, res) => {
  res.json(tageslimit.lesen(res.locals.kunde.kennung));
});
app.put('/api/tageslimit', nurAngemeldet('api'), (req, res) => {
  try {
    res.json(tageslimit.setzen(res.locals.kunde.kennung, req.body?.tageslimit));
  } catch (fehler) {
    if (!(fehler instanceof tageslimit.Tageslimitfehler)) throw fehler;
    res.status(fehler.status).json({ fehler: fehler.message });
  }
});

// UC-018: Debitkarte zum Girokonto der Kundin lesen und den Status setzen (BR-0081, BR-0082)
const kartenfehler = (res: express.Response, fehler: unknown) => {
  if (!(fehler instanceof debitkarte.Kartenfehler)) throw fehler;
  res.status(fehler.status).json({ fehler: fehler.message });
};
app.get('/api/konten/:iban/debitkarte', nurAngemeldet('api'), (req, res) => {
  try { res.json(debitkarte.lesen(res.locals.kunde.kennung, req.params.iban)); } catch (fehler) { kartenfehler(res, fehler); }
});
app.put('/api/konten/:iban/debitkarte', nurAngemeldet('api'), (req, res) => {
  try {
    res.json(debitkarte.setzen(res.locals.kunde.kennung, req.params.iban, req.body?.status, req.body?.sperrgrund));
  } catch (fehler) { kartenfehler(res, fehler); }
});

// UC-020: Postfach der angemeldeten Kundin (BR-0085 bis BR-0087); eine Kundenkennung im Aufruf gibt es nicht.
const nachrichtenfehler = (res: express.Response, fehler: unknown) => {
  if (!(fehler instanceof nachrichten.Nachrichtenfehler)) throw fehler;
  res.status(fehler.status).json({ fehler: fehler.message });
};
app.get('/api/nachrichten', nurAngemeldet('api'), (_req, res) => {
  res.json(nachrichten.liste(res.locals.kunde.kennung));
});
app.patch('/api/nachrichten/:nachrichtId', nurAngemeldet('api'), (req, res) => {
  try { res.json(nachrichten.oeffnen(res.locals.kunde.kennung, req.params.nachrichtId)); } catch (fehler) { nachrichtenfehler(res, fehler); }
});
app.delete('/api/nachrichten/:nachrichtId', nurAngemeldet('api'), (req, res) => {
  try { nachrichten.loeschen(res.locals.kunde.kennung, req.params.nachrichtId); res.status(204).end(); } catch (fehler) { nachrichtenfehler(res, fehler); }
});

// UC-023: persönliche Daten der angemeldeten Kundin lesen und mit TAN ändern (BR-0096, BR-0097); eine Kennung im Aufruf gibt es nicht.
app.get('/api/kunde', nurAngemeldet('api'), (_req, res) => {
  res.json(kundendaten.lesen(res.locals.kunde.kennung));
});
app.put('/api/kunde', nurAngemeldet('api'), (req, res) => {
  try {
    res.json(kundendaten.aendern(res.locals.kunde.kennung, req.body));
  } catch (fehler) {
    if (!(fehler instanceof kundendaten.Kundendatenfehler)) throw fehler;
    res.status(fehler.status).json({ fehler: fehler.message });
  }
});

app.get('/api/version', (_req, res) => res.json({ version: process.env.VERSION ?? 'lokal' }));

if (testbetrieb) {
  // UC-023: Postfachnachrichten der angemeldeten Kundin, älteste zuerst; prüft die Bestätigungsnachricht.
  app.get('/api/test/postfachnachrichten', nurAngemeldet('api'), (_req, res) => {
    res.json(nachrichten.aeltesteZuerst(res.locals.kunde.kennung));
  });
  // Lastkunden lasttest-001 bis lasttest-300, alle mit der PIN aus LASTTEST_PIN (öffentliche Testdaten, Vorgabe in testdaten.ts).
  lastkundenAnlegen(process.env.LASTTEST_PIN || undefined);
  // Demo-Testdaten zurücksetzen: Sitzungen der Demo-Kundinnen beenden, ihre Konten, Umsätze, Empfängervorlagen und Tageslimits auf den Ausgangsstand, keine ausgeführten oder vorgemerkten Aufträge. Lastkunden bleiben.
  app.post('/api/test/reset', (_req, res) => { demoZuruecksetzen(); res.status(204).end(); });
  // Lastdaten zurücksetzen: dasselbe nur für die Lastkunden. Demo-Kundinnen bleiben.
  app.post('/api/test/lasttest/reset', (_req, res) => { lastdatenZuruecksetzen(); res.status(204).end(); });
}

// Seiten
app.get('/anmelden', (req, res) => {
  if (angemeldeterKunde(req)) return res.redirect('/finanzstatus');
  res.sendFile(join(oeffentlich, 'anmelden.html'));
});
app.get('/', (_req, res) => res.redirect('/finanzstatus'));
for (const seite of ['/finanzstatus', '/ueberweisung', '/umsaetze', '/empfaengervorlagen', '/tageslimit', '/dauerauftraege', '/umbuchung', '/vorgemerkte-ueberweisungen', '/debitkarte', '/ausgabenanalyse', '/postfach', '/kontoauszug', '/persoenliche-daten']) {
  app.get(seite, nurAngemeldet('seite'), (_req, res) => res.sendFile(join(oeffentlich, 'app.html')));
}

app.listen(port, () => console.log(`Online-Banking läuft auf Port ${port}${testbetrieb ? ' (Testbetrieb)' : ''}`));
