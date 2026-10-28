import express from 'express';
import { join } from 'node:path';
import { Datenfehler, finanzstatus, zuruecksetzen } from './konten';
import { kundeMitKennung } from './kunden';
import { Ablehnung, ausfuehren, zuruecksetzen as auftraegeZuruecksetzen } from './ueberweisung';
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

app.get('/api/version', (_req, res) => res.json({ version: process.env.VERSION ?? 'lokal' }));

if (testbetrieb) {
  // Testdaten zurücksetzen: alle Sitzungen beenden, Demo-Konten auf den Ausgangsstand, keine Aufträge.
  app.post('/api/test/reset', (_req, res) => { alleBeenden(); zuruecksetzen(); auftraegeZuruecksetzen(); res.status(204).end(); });
}

// Seiten
app.get('/anmelden', (req, res) => {
  if (angemeldeterKunde(req)) return res.redirect('/finanzstatus');
  res.sendFile(join(oeffentlich, 'anmelden.html'));
});
app.get('/', (_req, res) => res.redirect('/finanzstatus'));
for (const seite of ['/finanzstatus', '/ueberweisung']) {
  app.get(seite, nurAngemeldet('seite'), (_req, res) => res.sendFile(join(oeffentlich, 'app.html')));
}

app.listen(port, () => console.log(`Online-Banking läuft auf Port ${port}${testbetrieb ? ' (Testbetrieb)' : ''}`));
