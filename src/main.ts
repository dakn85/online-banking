import express from 'express';
import { join } from 'node:path';
import { Datenfehler, finanzstatus, zuruecksetzen } from './konten';
import { kundeMitKennung } from './kunden';
import { Ablehnung, ausfuehren, zuruecksetzen as auftraegeZuruecksetzen } from './ueberweisung';
import { Abfragefehler, filterAus, umsaetzeVon, zuruecksetzen as umsaetzeZuruecksetzen } from './umsaetze';
import * as vorlagen from './empfaengervorlagen';
import * as dauerauftraege from './dauerauftraege';
import { alleBeenden, angemeldeterKunde, anlegen, beenden, nurAngemeldet } from './sitzung';

const port = Number(process.env.PORT ?? 8080);
const testbetrieb = process.env.TEST_MODE === '1';
const oeffentlich = join(__dirname, '..', 'public');

const app = express();
app.use(express.json());
app.use('/assets', express.static(oeffentlich, { index: false }));

// Anmeldung (Dummy: feste Demo-Kunden, siehe kunden.ts)
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

// UC-001: Finanzstatus der angemeldeten Kundin
app.get('/api/konten', nurAngemeldet('api'), (_req, res) => {
  try {
    res.json(finanzstatus());
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
    const { neu, ueberweisung } = ausfuehren({
      auftragsId: b.auftragsId, auftraggeberIban: b.auftraggeberIban, empfaenger: b.empfaenger.trim(),
      empfaengerIban: b.empfaengerIban, betrag: b.betrag, verwendungszweck: b.verwendungszweck.trim(),
    });
    res.status(neu ? 201 : 200).json(ueberweisung);
  } catch (fehler) {
    if (!(fehler instanceof Ablehnung)) throw fehler;
    res.status(fehler.status).json({ fehler: fehler.message });
  }
});

// UC-003: Umsätze eines Kontos der Kundin (BR-0008 bis BR-0011)
app.get('/api/konten/:iban/umsaetze', nurAngemeldet('api'), (req, res) => {
  let filter;
  try {
    filter = filterAus(req.query as Record<string, unknown>);
  } catch (fehler) {
    if (!(fehler instanceof Abfragefehler)) throw fehler;
    return res.status(400).json({ fehler: fehler.message });
  }
  const liste = umsaetzeVon(req.params.iban, filter);
  if (!liste) return res.status(404).json({ fehler: 'Das Konto wurde nicht gefunden.' });
  res.json({ umsaetze: liste });
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

// UC-005: Daueraufträge der angemeldeten Kundin (BR-0020 bis BR-0024)
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
app.delete('/api/dauerauftraege/:dauerauftragsId', nurAngemeldet('api'), (req, res) => {
  try { dauerauftraege.loeschen(res.locals.kunde.kennung, req.params.dauerauftragsId); res.status(204).end(); } catch (fehler) { dauerauftragsfehler(res, fehler); }
});

app.get('/api/version', (_req, res) => res.json({ version: process.env.VERSION ?? 'lokal' }));

if (testbetrieb) {
  // Testdaten zurücksetzen: alle Sitzungen beenden, Demo-Konten und Demo-Umsätze sowie Empfängervorlagen auf den Ausgangsstand, keine Aufträge, keine Daueraufträge.
  app.post('/api/test/reset', (_req, res) => { alleBeenden(); zuruecksetzen(); auftraegeZuruecksetzen(); umsaetzeZuruecksetzen(); vorlagen.zuruecksetzen(); dauerauftraege.zuruecksetzen(); res.status(204).end(); });
}

// Seiten
app.get('/anmelden', (req, res) => {
  if (angemeldeterKunde(req)) return res.redirect('/finanzstatus');
  res.sendFile(join(oeffentlich, 'anmelden.html'));
});
app.get('/', (_req, res) => res.redirect('/finanzstatus'));
for (const seite of ['/finanzstatus', '/ueberweisung', '/umsaetze', '/empfaengervorlagen', '/dauerauftraege']) {
  app.get(seite, nurAngemeldet('seite'), (_req, res) => res.sendFile(join(oeffentlich, 'app.html')));
}

app.listen(port, () => console.log(`Online-Banking läuft auf Port ${port}${testbetrieb ? ' (Testbetrieb)' : ''}`));
