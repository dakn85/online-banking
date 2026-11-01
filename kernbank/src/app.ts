import express from 'express';
import { allesZuruecksetzen } from './daten';

/** Der Dienst ohne Port: main.ts startet ihn, die Tests rufen ihn direkt. */
export function dienst(optionen: { testbetrieb: boolean }) {
  const app = express();
  app.use(express.json());

  app.get('/api/version', (_req, res) => res.json({ version: process.env.VERSION ?? 'lokal' }));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  if (optionen.testbetrieb) {
    // Testdaten zurücksetzen: alle In-Memory-Daten auf den Ausgangsstand.
    app.post(['/api/test/reset', '/api/test/zuruecksetzen'], (_req, res) => {
      allesZuruecksetzen();
      res.status(204).end();
    });
  }

  return app;
}
