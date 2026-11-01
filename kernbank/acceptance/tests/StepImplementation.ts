import { BeforeSuite, Step } from 'gauge-ts';
import assert = require('assert');

const basisUrl = (process.env.KERNBANK_URL || 'http://localhost:18400').replace(/\/+$/, '');

/** HTTP-Aufruf gegen die Kernbank; JSON hin und zurück. */
async function aufruf(methode: string, pfad: string, inhalt?: unknown): Promise<{ status: number; daten: any }> {
  const antwort = await fetch(`${basisUrl}${pfad}`, {
    method: methode,
    headers: inhalt === undefined ? undefined : { 'content-type': 'application/json' },
    body: inhalt === undefined ? undefined : JSON.stringify(inhalt),
  });
  const text = await antwort.text();
  let daten: any = text;
  try { daten = text ? JSON.parse(text) : undefined; } catch { /* kein JSON */ }
  return { status: antwort.status, daten };
}

export default class StepImplementation {
  /** Der Dienst muss aus einem der Commits gebaut sein, die der Plattformlauf nennt (AGENTS.md). Lokal ohne Prüfung. */
  @BeforeSuite()
  public async standPruefen() {
    const erlaubt = (process.env.KNIPPQ_ACCEPTED_COMMITS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!erlaubt.length) return;
    const { daten } = await aufruf('GET', '/api/version');
    const version = String(daten?.version ?? '');
    const passt = erlaubt.some(c => version.startsWith(c.slice(0, 7)) || c.startsWith(version.replace('+lokal', '')));
    assert.ok(passt, `Testumgebung läuft mit ${version}, erwartet einer von ${erlaubt.join(', ')}; Testumgebung neu bauen`);
  }

  @Step('Testdaten sind zurückgesetzt')
  public async zuruecksetzen() {
    const { status } = await aufruf('POST', '/api/test/reset');
    assert.strictEqual(status, 204, 'Testdaten ließen sich nicht zurücksetzen (läuft die Kernbank mit TEST_MODE=1?)');
  }

  @Step('Die Kernbank ist erreichbar')
  public async erreichbar() {
    const gesund = await aufruf('GET', '/health');
    assert.strictEqual(gesund.status, 200, `GET /health antwortet mit ${gesund.status}`);
    const { status, daten } = await aufruf('GET', '/api/version');
    assert.strictEqual(status, 200, `GET /api/version antwortet mit ${status}`);
    assert.ok(typeof daten?.version === 'string' && daten.version, 'GET /api/version nennt keinen Stand');
  }
}
