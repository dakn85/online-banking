import { AfterScenario, AfterSuite, BeforeSuite, Step } from 'gauge-ts';
import assert = require('assert');
import { Browser, chromium, Page } from 'playwright';

const basisUrl = process.env.BANKING_URL || 'http://localhost:18300';

// gauge-ts liefert Parameter aus Ziffern als Zahl; Kennungen und PINs bleiben Text.
const text = (wert: unknown) => String(wert);
// Beträge stehen mit geschütztem Leerzeichen vor „€“ und je nach Browser mit typografischem Minus.
const sichtbar = (wert: string | null) => (wert ?? '').replace(/\u00a0/g, ' ').replace(/\u2212/g, '-').trim();

export default class StepImplementation {
  private static browser?: Browser;
  /** Eine Seite für die ganze Suite: In der Live View bleibt so dasselbe Bild stehen, Szenarien trennt das Löschen der Cookies. */
  private static page?: Page;

  /** Der Dienst muss aus einem der Commits gebaut sein, die der Plattformlauf nennt (AGENTS.md). Lokal ohne Prüfung. */
  @BeforeSuite()
  public async standPruefen() {
    const erlaubt = (process.env.KNIPPQ_ACCEPTED_COMMITS || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!erlaubt.length) return;
    const antwort = await fetch(`${basisUrl}/api/version`);
    const { version } = await antwort.json() as { version: string };
    const passt = erlaubt.some(c => version.startsWith(c.slice(0, 7)) || c.startsWith(version.replace('+lokal', '')));
    assert.ok(passt, `Testumgebung läuft mit ${version}, erwartet einer von ${erlaubt.join(', ')}; Testumgebung neu bauen`);
  }

  @AfterScenario()
  public async cookiesLoeschen() {
    await StepImplementation.page?.context().clearCookies();
  }

  @AfterSuite()
  public async browserSchliessen() {
    await StepImplementation.browser?.close();
    StepImplementation.browser = undefined;
    StepImplementation.page = undefined;
  }

  /** Ein Browser und eine Seite für die ganze Suite. */
  protected async seite(): Promise<Page> {
    StepImplementation.browser ??= await chromium.launch();
    StepImplementation.page ??= await (await StepImplementation.browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' })).newPage();
    return StepImplementation.page;
  }

  @Step('Testdaten sind zurückgesetzt')
  public async zuruecksetzen() {
    const antwort = await fetch(`${basisUrl}/api/test/reset`, { method: 'POST' });
    assert.strictEqual(antwort.status, 204, 'Testdaten ließen sich nicht zurücksetzen (läuft der Dienst mit TEST_MODE=1?)');
  }

  @Step('<kennung> meldet sich mit der PIN <pin> an')
  public async anmelden(kennung: string, pin: string) {
    const page = await this.seite();
    await page.goto(`${basisUrl}/anmelden`, { waitUntil: 'domcontentloaded' });
    await page.getByLabel('Kennung').pressSequentially(text(kennung), { delay: 25 });
    await page.getByLabel('PIN').pressSequentially(text(pin), { delay: 25 });
    await page.getByRole('button', { name: 'Anmelden' }).click();
    // Angemeldet steht die Kundin im Rahmen, sonst die Meldung unter dem Formular.
    await page.locator('#kunde-name').filter({ hasText: /\S/ })
      .or(page.getByRole('alert').filter({ hasText: /\S/ })).first().waitFor();
  }

  @Step('Der Rahmen zeigt die Kundin <name>')
  public async rahmenZeigtKundin(name: string) {
    const page = await this.seite();
    await page.locator('#kunde-name', { hasText: text(name) }).waitFor();
  }

  @Step('Die Navigation bietet <erster> und <zweiter>')
  public async navigationBietet(erster: string, zweiter: string) {
    const nav = (await this.seite()).getByRole('navigation', { name: 'Hauptnavigation' });
    for (const eintrag of [erster, zweiter]) {
      assert.ok(await nav.getByRole('link', { name: text(eintrag) }).isVisible(), `„${eintrag}“ fehlt in der Navigation`);
    }
  }

  @Step('Die Anmeldung meldet <meldung>')
  public async anmeldungMeldet(meldung: string) {
    const page = await this.seite();
    await page.getByRole('alert').filter({ hasText: text(meldung) }).waitFor();
  }

  @Step('Die Kundin meldet sich ab')
  public async abmelden() {
    const page = await this.seite();
    await page.getByRole('button', { name: 'Abmelden' }).click();
    await page.waitForURL(/\/anmelden$/);
  }

  @Step('Die Anmeldeseite ist zu sehen')
  public async anmeldeseite() {
    const page = await this.seite();
    await page.getByRole('heading', { name: 'Anmelden' }).waitFor();
  }

  /** Die Kontentabelle des Finanzstatus; ruft ihn auf, wenn die Seite woanders steht. */
  private async kontentabelle(): Promise<Page> {
    const page = await this.seite();
    if (!new URL(page.url()).pathname.startsWith('/finanzstatus')) await page.goto(`${basisUrl}/finanzstatus`, { waitUntil: 'domcontentloaded' });
    await page.locator('.kontentabelle').waitFor();
    return page;
  }

  @Step('Die Zeile <konto> zeigt <spalte> <wert>')
  public async zeileZeigt(konto: string, spalte: string, wert: string) {
    const page = await this.kontentabelle();
    const kopf = (await page.locator('.kontentabelle thead th').allInnerTexts()).map(sichtbar);
    const index = kopf.indexOf(text(spalte));
    assert.ok(index >= 0, `Spalte „${spalte}“ fehlt, da sind: ${kopf.join(', ')}`);
    const zeile = page.locator(`.kontentabelle tbody tr[data-konto="${text(konto)}"]`);
    await zeile.waitFor();
    const zellen = (await zeile.locator('th, td').allInnerTexts()).map(sichtbar);
    assert.strictEqual(zellen[index], sichtbar(text(wert)), `Zeile „${konto}“, Spalte „${spalte}“`);
  }

  @Step('Der Finanzstatus zeigt das Gesamtvermögen <betrag>')
  public async gesamtvermoegen(betrag: string) {
    const page = await this.kontentabelle();
    assert.strictEqual(sichtbar(await page.locator('#gesamtvermoegen').textContent()), sichtbar(text(betrag)));
  }

  @Step('Der Finanzstatus ist ohne Anmeldung nicht erreichbar')
  public async ohneAnmeldung() {
    const page = await this.seite();
    await page.context().clearCookies();
    const api = await fetch(`${basisUrl}/api/konten`);
    assert.strictEqual(api.status, 401, 'GET /api/konten ohne Sitzung');
    await page.goto(`${basisUrl}/finanzstatus`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }
}
