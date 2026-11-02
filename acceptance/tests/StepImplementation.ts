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

  /** Die Seite Empfängervorlagen; ruft sie auf, wenn die Seite woanders steht. */
  private async vorlagenSeite(): Promise<Page> {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/empfaengervorlagen') await page.goto(`${basisUrl}/empfaengervorlagen`, { waitUntil: 'domcontentloaded' });
    await page.locator('.vorlagen').waitFor();
    return page;
  }

  /** Die Seite zeichnet nach jeder Antwort des Dienstes neu; gewartet wird auf die neu gezeichnete Fläche. */
  private async nachNeuzeichnen(page: Page, aktion: () => Promise<void>) {
    await page.locator('.vorlagen').evaluate(e => e.setAttribute('data-alt', ''));
    await aktion();
    await page.locator('.vorlagen:not([data-alt])').waitFor();
  }

  private async vorlageAnlegen(name: string, iban: string, zweck: string) {
    const page = await this.vorlagenSeite();
    const form = page.getByRole('form', { name: 'Neue Vorlage' });
    await form.getByLabel('Name', { exact: true }).fill(text(name));
    await form.getByLabel('IBAN des Empfängers').fill(text(iban));
    await form.getByLabel('Verwendungszweck').fill(text(zweck));
    await this.nachNeuzeichnen(page, () => form.getByRole('button', { name: 'Speichern' }).click());
  }

  @Step('Die Kundin legt die Vorlage <name> mit IBAN <iban> und Verwendungszweck <zweck> an')
  public async vorlageMitZweck(name: string, iban: string, zweck: string) {
    await this.vorlageAnlegen(name, iban, zweck);
  }

  @Step('Die Kundin legt die Vorlage <name> mit IBAN <iban> ohne Verwendungszweck an')
  public async vorlageOhneZweck(name: string, iban: string) {
    await this.vorlageAnlegen(name, iban, '');
  }

  @Step('Die Empfängervorlagen zeigen die Meldung <meldung>')
  public async vorlagenMelden(meldung: string) {
    const page = await this.vorlagenSeite();
    await page.locator('.vorlagen > [role="status"], .vorlagen > [role="alert"]').filter({ hasText: text(meldung) }).waitFor();
  }

  @Step('Die Kundin wählt die Vorlage <name> zum Löschen und antwortet auf die Sicherheitsabfrage <antwort>')
  public async vorlageLoeschen(name: string, antwort: string) {
    const page = await this.vorlagenSeite();
    const form = page.getByRole('form', { name: 'Vorlage löschen' });
    await form.getByLabel('Vorlage zum Löschen').selectOption({ label: text(name) });
    await this.nachNeuzeichnen(page, () => form.getByRole('button', { name: 'Löschen' }).click());
    const abfrage = page.getByRole('group', { name: 'Sicherheitsabfrage' });
    await abfrage.getByText('Vorlage löschen?').waitFor();
    await this.nachNeuzeichnen(page, () => abfrage.getByRole('button', { name: text(antwort), exact: true }).click());
  }

  @Step('Die Kundin benennt die Vorlage <alt> in <neu> um und sieht IBAN <iban>, Verwendungszweck <zweck> und die Meldung <meldung>')
  public async vorlageUmbenennen(alt: string, neu: string, iban: string, zweck: string, meldung: string) {
    const page = await this.vorlagenSeite();
    const form = page.getByRole('form', { name: 'Vorlage umbenennen' });
    await form.getByLabel('Vorlage zum Umbenennen').selectOption({ label: text(alt) });
    await form.getByLabel('Neuer Name').fill(text(neu));
    await this.nachNeuzeichnen(page, () => form.getByRole('button', { name: 'Umbenennen' }).click());
    await this.vorlagenMelden(meldung);
    const zeile = page.locator('.vorlagen__tabelle tbody tr').filter({ has: page.getByRole('rowheader', { name: text(neu), exact: true }) });
    const zellen = (await zeile.locator('td').allInnerTexts()).map(sichtbar);
    assert.deepStrictEqual(zellen, [text(iban), text(zweck)], `Vorlage „${neu}“`);
  }

  /** Wählt in der Überweisung die Vorlage und liest die vorbelegten Felder; ruft die Überweisung auf, wenn die Seite woanders steht. */
  private async vorlageInUeberweisung(name: string): Promise<Record<string, string>> {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/ueberweisung') await page.goto(`${basisUrl}/ueberweisung`, { waitUntil: 'domcontentloaded' });
    const form = page.getByRole('form', { name: 'Überweisung' });
    await form.getByLabel('Vorlage', { exact: true }).selectOption({ label: text(name) });
    return {
      empfaenger: await form.getByLabel('Empfänger', { exact: true }).inputValue(),
      iban: await form.getByLabel('IBAN des Empfängers').inputValue(),
      zweck: await form.getByLabel('Verwendungszweck').inputValue(),
    };
  }

  @Step('Die Kundin wählt in der Überweisung die Vorlage <name> und sieht Empfänger <empfaenger>, IBAN <iban> und Verwendungszweck <zweck>')
  public async vorlageWaehlenMitZweck(name: string, empfaenger: string, iban: string, zweck: string) {
    const felder = await this.vorlageInUeberweisung(name);
    assert.deepStrictEqual(felder, { empfaenger: text(empfaenger), iban: text(iban), zweck: text(zweck) });
  }

  @Step('Die Kundin wählt in der Überweisung die Vorlage <name> und sieht Empfänger <empfaenger>, IBAN <iban> und einen leeren Verwendungszweck')
  public async vorlageWaehlenOhneZweck(name: string, empfaenger: string, iban: string) {
    const felder = await this.vorlageInUeberweisung(name);
    assert.deepStrictEqual(felder, { empfaenger: text(empfaenger), iban: text(iban), zweck: '' });
  }
}
