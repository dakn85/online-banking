import { AfterScenario, AfterSuite, BeforeSuite, Step, Table } from 'gauge-ts';
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

  @Step('Die Kundin öffnet die Überweisung vom Girokonto')
  public async ueberweisungOeffnen() {
    const page = await this.kontentabelle();
    await page.locator('.kontentabelle tbody tr[data-konto="Girokonto"]').getByRole('link', { name: 'Überweisen' }).click();
    const konto = page.getByRole('form', { name: 'Überweisung' }).getByLabel('Auftraggeberkonto', { exact: true });
    await konto.waitFor();
    assert.match(await konto.inputValue(), /DE02 5001 0517 5407 3249 31/, 'Auftraggeberkonto ist nicht das Girokonto');
  }

  /** Füllt das Formular der Überweisung und wählt „Weiter“. */
  private async erfassen(empfaenger: string, iban: string, betrag: string, zweck: string): Promise<Page> {
    const page = await this.seite();
    const form = page.getByRole('form', { name: 'Überweisung' });
    await form.getByLabel('Empfänger', { exact: true }).fill(text(empfaenger));
    await form.getByLabel('IBAN des Empfängers').fill(text(iban));
    await form.getByLabel('Betrag in Euro').fill(text(betrag));
    await form.getByLabel('Verwendungszweck').fill(text(zweck));
    await form.getByRole('button', { name: 'Weiter' }).click();
    return page;
  }

  @Step('Die Kundin erfasst Empfänger <empfaenger>, IBAN <iban>, Betrag <betrag>, Verwendungszweck <zweck> und prüft die Zusammenfassung')
  public async erfassenUndPruefen(empfaenger: string, iban: string, betrag: string, zweck: string) {
    const page = await this.erfassen(empfaenger, iban, betrag, zweck);
    const zusammenfassung = page.getByRole('region', { name: 'Zusammenfassung' });
    await zusammenfassung.waitFor();
    const werte = Object.fromEntries(await zusammenfassung.locator('dl > div').evaluateAll(zeilen =>
      zeilen.map(z => [z.querySelector('dt')!.textContent!.trim(), z.querySelector('dd')!.textContent!.trim()])));
    assert.strictEqual(werte['Empfänger'], text(empfaenger));
    assert.strictEqual(werte['IBAN des Empfängers'], text(iban));
    assert.strictEqual(sichtbar(werte['Betrag in Euro']), sichtbar(text(betrag)));
    assert.strictEqual(werte['Verwendungszweck'], text(zweck));
  }

  @Step('Die Kundin erfasst Empfänger <empfaenger>, IBAN <iban>, Betrag <betrag>, Verwendungszweck <zweck> und wählt „Weiter“')
  public async erfassenUndWeiter(empfaenger: string, iban: string, betrag: string, zweck: string) {
    await this.erfassen(empfaenger, iban, betrag, zweck);
  }

  @Step('Die Überweisung zeigt die Meldung <meldung>')
  public async ueberweisungMeldet(meldung: string) {
    const page = await this.seite();
    await page.getByRole('form', { name: 'Überweisung' }).getByRole('alert').filter({ hasText: text(meldung) }).waitFor();
  }

  /** „2“ Mal: beide Klicks gehen an den Knopf, bevor die Seite wechselt (Doppelklick). */
  @Step('Die Kundin bestätigt die Überweisung <anzahl> Mal und sieht die Meldung <meldung>')
  public async bestaetigen(anzahl: string, meldung: string) {
    const page = await this.seite();
    await page.getByRole('button', { name: 'Bestätigen' }).click({ clickCount: Number(anzahl) });
    await page.getByRole('status').filter({ hasText: text(meldung) }).waitFor();
    await page.locator('.kontentabelle').waitFor();
  }

  @Step('Die Überweisung zeigt keine Zusammenfassung')
  public async dieUeberweisungZeigtKeineZusammenfassung() {
    const page = await this.seite();
    const form = page.getByRole('form', { name: 'Überweisung' });
    await form.waitFor();
    // Die Zusammenfassung ist eine Region „Zusammenfassung“, die das Formular ersetzt; darum auf der ganzen Seite suchen.
    const zusammenfassung = page.getByRole('region', { name: 'Zusammenfassung' });
    assert.strictEqual(await zusammenfassung.count(), 0, 'Die Überweisung zeigt unerwartet eine Zusammenfassung');
  }

  /* ---------------------------------------------------------------- UC-003 Umsätze */

  /** Wartet, bis die Umsätze zur Abfrage `abfrage` stehen (die Seite setzt data-abfrage nach dem Laden). */
  private async umsaetzeGeladen(abfrage?: string): Promise<Page> {
    const page = await this.seite();
    const ergebnis = page.locator('#umsaetze-ergebnis');
    if (abfrage === undefined) await page.locator('#umsaetze-ergebnis[data-abfrage]').waitFor();
    else await page.locator(`#umsaetze-ergebnis[data-abfrage="${abfrage.replace(/"/g, '\\"')}"]`).waitFor();
    return ergebnis.page();
  }

  @Step('Die Kundin öffnet die Umsätze des Kontos <konto>')
  public async umsaetzeOeffnen(konto: string) {
    const page = await this.kontentabelle();
    await page.locator(`.kontentabelle tbody tr[data-konto="${text(konto)}"]`).getByRole('link', { name: 'Umsätze' }).click();
    await page.waitForURL(/\/umsaetze\?/);
    await this.umsaetzeGeladen();
  }

  @Step('Die Kundin öffnet die Umsätze des Kontos mit der IBAN <iban>')
  public async umsaetzeMitIban(iban: string) {
    const page = await this.seite();
    await page.goto(`${basisUrl}/umsaetze?iban=${encodeURIComponent(text(iban))}`, { waitUntil: 'domcontentloaded' });
    await this.umsaetzeGeladen();
  }

  /** Füllt Suche und Filter; leere Zellen leeren das Feld. Wartet auf die Umsätze genau dieser Abfrage. */
  @Step('Die Kundin filtert die Umsätze mit den Einträgen <tabelle>')
  public async umsaetzeFiltern(tabelle: Table) {
    const page = await this.umsaetzeGeladen();
    const [zeile] = tabelle.getTableRows();
    const zelle = (spalte: string) => text(zeile.getCell(spalte) ?? '').trim();
    const form = page.getByRole('form', { name: 'Filter' });
    await form.getByLabel('Suche').fill(zelle('Suchtext'));
    await form.getByLabel('Zeitraum von').fill(zelle('Zeitraum von'));
    await form.getByLabel('Zeitraum bis').fill(zelle('Zeitraum bis'));
    await form.getByLabel('Ein-/Ausgang').selectOption({ label: zelle('Ein-/Ausgang') || 'Alle' });
    // Dieselbe Abfrage, die die Seite baut: Reihenfolge suchtext, von, bis, richtung; Leeres fehlt.
    const q = new URLSearchParams();
    if (zelle('Suchtext')) q.set('suchtext', zelle('Suchtext'));
    if (zelle('Zeitraum von')) q.set('von', zelle('Zeitraum von'));
    if (zelle('Zeitraum bis')) q.set('bis', zelle('Zeitraum bis'));
    const richtung = (zelle('Ein-/Ausgang') || 'Alle').toLowerCase();
    if (richtung !== 'alle') q.set('richtung', richtung);
    await this.umsaetzeGeladen(q.toString());
  }

  @Step('Die Umsätze zeigen die Zeilen <tabelle>')
  public async umsaetzeZeigen(tabelle: Table) {
    const page = await this.umsaetzeGeladen();
    const spalten = tabelle.getColumnNames();
    const erwartet = tabelle.getTableRows().map(z => spalten.map(s => sichtbar(text(z.getCell(s)))));
    const tab = page.locator('#umsaetze-ergebnis table');
    let ist: string[][] = [];
    if (await tab.count()) {
      const kopf = (await tab.locator('thead th').allInnerTexts()).map(sichtbar);
      const index = spalten.map(s => {
        const i = kopf.indexOf(s);
        assert.ok(i >= 0, `Spalte „${s}“ fehlt, da sind: ${kopf.join(', ')}`);
        return i;
      });
      const zeilen = tab.locator('tbody tr');
      for (let n = 0; n < await zeilen.count(); n++) {
        const zellen = (await zeilen.nth(n).locator('th, td').allInnerTexts()).map(sichtbar);
        ist.push(index.map(i => zellen[i]));
      }
    }
    assert.deepStrictEqual(ist, erwartet);
  }

  @Step('Die Umsätze zeigen die Meldung <meldung>')
  public async umsaetzeMeldung(meldung: string) {
    const page = await this.umsaetzeGeladen();
    await page.locator('#umsaetze-ergebnis').getByRole('alert').filter({ hasText: text(meldung) }).waitFor();
  }

  @Step('Die Umsätze zeigen den Hinweis <hinweis> nicht')
  public async umsaetzeOhneHinweis(hinweis: string) {
    const page = await this.umsaetzeGeladen();
    assert.strictEqual(await page.locator('#umsaetze-ergebnis').getByText(text(hinweis)).count(), 0, `Der Hinweis „${hinweis}“ ist zu sehen`);
  }

  @Step('Die Umsatzseite ist ohne Anmeldung nicht erreichbar')
  public async umsaetzeOhneAnmeldung() {
    const page = await this.seite();
    await page.context().clearCookies();
    const api = await fetch(`${basisUrl}/api/konten/DE02500105175407324931/umsaetze`);
    assert.strictEqual(api.status, 401, 'GET /api/konten/{iban}/umsaetze ohne Sitzung');
    await page.goto(`${basisUrl}/umsaetze?iban=DE02500105175407324931`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }
}
