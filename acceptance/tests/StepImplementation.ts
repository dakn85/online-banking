import { AfterScenario, AfterSuite, BeforeSuite, Step, Table } from 'gauge-ts';
import assert = require('assert');
import { Browser, chromium, Locator, Page } from 'playwright';

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
    await StepImplementation.page?.unrouteAll({ behavior: 'ignoreErrors' });
    StepImplementation.export = undefined;
    StepImplementation.umsatzstaende = [];
    StepImplementation.umsaetzeGefiltert = false;
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

  @Step('<kennung> meldet sich mit der Vorgabe-PIN der Lastkunden an')
  public async anmeldenMitVorgabePin(kennung: string) {
    // Vorgabe wie LASTTEST_PIN_STANDARD im Dienst; LASTTEST_PIN überschreibt sie, falls gesetzt.
    await this.anmelden(kennung, process.env.LASTTEST_PIN || '97531');
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
    const zeile = page.locator('.kontentabelle tbody tr[data-konto="Girokonto"]');
    // Das Girokonto der angemeldeten Kundin (Lena und Jonas haben eigene IBANs).
    const iban = sichtbar(await zeile.locator('td.iban').textContent());
    await zeile.getByRole('link', { name: 'Überweisen' }).click();
    const konto = page.getByRole('form', { name: 'Überweisung' }).getByLabel('Auftraggeberkonto', { exact: true });
    await konto.waitFor();
    assert.ok((await konto.inputValue()).includes(iban), `Auftraggeberkonto ist nicht das Girokonto ${iban}`);
  }

  /** Füllt das Formular der Überweisung und wählt „Weiter“. */
  private async erfassen(empfaenger: string, iban: string, betrag: string, zweck: string, ausfuehrungstag?: string): Promise<Page> {
    const page = await this.seite();
    const form = page.getByRole('form', { name: 'Überweisung' });
    await form.getByLabel('Empfänger', { exact: true }).fill(text(empfaenger));
    await form.getByLabel('IBAN des Empfängers').fill(text(iban));
    await form.getByLabel('Betrag in Euro').fill(text(betrag));
    await form.getByLabel('Verwendungszweck').fill(text(zweck));
    if (ausfuehrungstag !== undefined) await form.getByLabel('Ausführungstag').fill(StepImplementation.tag(ausfuehrungstag));
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

  @Step('Die Kundin bestätigt die Überweisung')
  public async bestaetigenEinmal() {
    const page = await this.seite();
    await page.getByRole('button', { name: 'Bestätigen' }).click();
  }

  @Step('Die Kundin bricht die Überweisung ab')
  public async ueberweisungAbbrechen() {
    const page = await this.seite();
    await page.getByRole('form', { name: 'Überweisung' }).getByRole('link', { name: 'Abbrechen' }).click();
    await page.locator('.kontentabelle').waitFor();
  }

  @Step('Die Kundin führt die Überweisung an <empfaenger> mit IBAN <iban> und Betrag <betrag> direkt beim Dienst aus und der Dienst antwortet mit dem Status <status> und der Meldung <meldung>')
  public async ueberweisungDirekt(empfaenger: string, iban: string, betrag: string, status: string, meldung: string) {
    const page = await this.seite();
    const { konten } = await (await page.context().request.get(`${basisUrl}/api/konten`)).json() as { konten: { kontoname: string; iban: string }[] };
    const giro = konten.find(k => k.kontoname === 'Girokonto');
    assert.ok(giro, 'Die Kundin hat kein Girokonto');
    const antwort = await page.context().request.post(`${basisUrl}/api/ueberweisungen`, {
      data: {
        auftragsId: `test-${Date.now()}-${Math.random().toString(16).slice(2)}`, auftraggeberIban: giro.iban, empfaenger: text(empfaenger).trim(),
        empfaengerIban: text(iban).trim(), betrag: StepImplementation.betrag(betrag), verwendungszweck: 'Rechnung 4711', waehrung: 'EUR',
      },
    });
    const koerper = await antwort.text();
    assert.strictEqual(antwort.status(), Number(status), `POST /api/ueberweisungen: ${koerper}`);
    assert.strictEqual((JSON.parse(koerper) as { fehler: string }).fehler, text(meldung));
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
    // Stand der Umsätze je Aufruf, für „gegenüber vorher unverändert“.
    StepImplementation.umsatzstaende.push(await page.locator('#umsaetze-ergebnis tbody tr').allInnerTexts());
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
    StepImplementation.umsaetzeGefiltert = true;
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
    // Ohne Filter zählen die neuesten Zeilen: Das Girokonto trägt Demo-Umsätze (C-001), die ein Szenario zur Umbuchung nicht wiederholt.
    // Mit Filter und bei einer leeren Erwartung muss die Liste genau stimmen.
    const vergleich = StepImplementation.umsaetzeGefiltert || !erwartet.length ? ist : ist.slice(0, erwartet.length);
    assert.deepStrictEqual(vergleich, erwartet);
  }

  @Step('Die Umsätze zeigen die Meldung <meldung>')
  public async umsaetzeMeldung(meldung: string) {
    const page = await this.umsaetzeGeladen();
    const ergebnis = page.locator('#umsaetze-ergebnis');
    // Fehler als alert, die Erfolgsmeldung einer Rückgabe (UC-022) als status.
    await ergebnis.getByRole('alert').or(ergebnis.getByRole('status')).filter({ hasText: text(meldung) }).waitFor();
  }

  @Step('Die Umsätze zeigen den Hinweis <hinweis> nicht')
  public async umsaetzeOhneHinweis(hinweis: string) {
    const page = await this.umsaetzeGeladen();
    assert.strictEqual(await page.locator('#umsaetze-ergebnis').getByText(text(hinweis)).count(), 0, `Der Hinweis „${hinweis}“ ist zu sehen`);
  }

  /* ---------------------------------------------------------------- UC-022 Lastschrift zurückgeben */

  @Step('Die Kundin wählt bei der Lastschrift von <gegenpartei> die Rückgabe')
  public async rueckgabeWaehlen(gegenpartei: string) {
    const page = await this.umsaetzeGeladen();
    const zeile = page.locator('#umsaetze-ergebnis tbody tr').filter({ hasText: text(gegenpartei) }).filter({ has: page.getByRole('button', { name: 'Zurückgeben' }) });
    await zeile.getByRole('button', { name: 'Zurückgeben' }).click();
  }

  @Step('Die Umsätze zeigen die Rückfrage <rueckfrage>')
  public async rueckfrageZeigt(rueckfrage: string) {
    const page = await this.umsaetzeGeladen();
    await page.locator('#umsaetze-rueckfrage').filter({ hasText: text(rueckfrage) }).waitFor();
  }

  @Step('Die Kundin bestätigt die Rückgabe')
  public async rueckgabeBestaetigen() {
    const page = await this.umsaetzeGeladen();
    await page.locator('#umsaetze-rueckfrage').getByRole('button', { name: 'Bestätigen' }).click();
    // Die Rückfrage schließt erst, wenn die Umsätze neu geladen sind.
    await page.locator('#umsaetze-rueckfrage').waitFor({ state: 'hidden' });
  }

  @Step('Die Kundin bricht die Rückgabe ab')
  public async rueckgabeAbbrechen() {
    const page = await this.umsaetzeGeladen();
    await page.locator('#umsaetze-rueckfrage').getByRole('button', { name: 'Abbrechen' }).click();
    await page.locator('#umsaetze-rueckfrage').waitFor({ state: 'hidden' });
  }

  @Step('Die Umsätze zeigen keine Rückgabe')
  public async keineRueckgabe() {
    const page = await this.umsaetzeGeladen();
    const ergebnis = page.locator('#umsaetze-ergebnis');
    assert.strictEqual(await ergebnis.getByRole('button', { name: 'Zurückgeben' }).count(), 0, 'Zurückgeben ist zu sehen');
    assert.strictEqual(await ergebnis.getByText('Zurückgegeben').count(), 0, 'Zurückgegeben ist zu sehen');
  }

  private async girokontoIban(page: Page): Promise<string> {
    const konten = await (await page.context().request.get(`${basisUrl}/api/konten`)).json() as { konten: { kontoname: string; iban: string }[] };
    return konten.konten.find(k => k.kontoname === 'Girokonto')!.iban;
  }

  private async rueckgabeAbgewiesen(iban: string, umsatzId: string, status: string, meldung?: string) {
    const page = await this.seite();
    const antwort = await page.context().request.post(`${basisUrl}/api/konten/${encodeURIComponent(iban)}/umsaetze/${encodeURIComponent(umsatzId)}/rueckgaben`);
    assert.strictEqual(antwort.status(), Number(status), `POST Rückgabe ${umsatzId}`);
    if (meldung !== undefined) assert.strictEqual(((await antwort.json()) as { fehler: string }).fehler, text(meldung));
  }

  @Step('Der Dienst weist die Rückgabe der Lastschrift von <gegenpartei> mit Status <status> und der Meldung <meldung> ab')
  public async dienstWeistRueckgabeAb(gegenpartei: string, status: string, meldung: string) {
    const page = await this.seite();
    const iban = await this.girokontoIban(page);
    const liste = await (await page.context().request.get(`${basisUrl}/api/konten/${iban}/umsaetze`)).json() as { umsaetze: { umsatzId: string; gegenpartei: string; sepaLastschrift: boolean }[] };
    // Unbekannte Gegenpartei: keine Zeile, also eine Kennung, die es nicht gibt.
    // Nach einer Rückgabe trägt auch die Gutschrift diese Gegenpartei: die Lastschrift selbst zählt.
    const treffer = liste.umsaetze.filter(u => u.gegenpartei === text(gegenpartei));
    const umsatz = treffer.find(u => u.sepaLastschrift) ?? treffer[0];
    await this.rueckgabeAbgewiesen(iban, umsatz?.umsatzId ?? 'unbekannt', status, meldung);
  }

  @Step('Der Dienst weist die Rückgabe auf dem Konto mit der IBAN <iban> mit Status <status> und der Meldung <meldung> ab')
  public async dienstWeistRueckgabeFremdAb(iban: string, status: string, meldung: string) {
    await this.rueckgabeAbgewiesen(text(iban).replace(/\s+/g, ''), 'unbekannt', status, meldung);
  }

  @Step('Der Dienst weist die Rückgabe mit einer umsatzId von <laenge> Zeichen mit Status <status> ab')
  public async dienstWeistRueckgabeLangAb(laenge: string, status: string) {
    const page = await this.seite();
    await this.rueckgabeAbgewiesen(await this.girokontoIban(page), 'u'.repeat(Number(laenge)), status);
  }

  @Step('Ohne Anmeldung weist der Dienst die Rückgabe einer Lastschrift mit Status <status> ab')
  public async ohneAnmeldungRueckgabe(status: string) {
    const page = await this.seite();
    await page.context().clearCookies();
    const antwort = await fetch(`${basisUrl}/api/konten/DE02500105175407324931/umsaetze/unbekannt/rueckgaben`, { method: 'POST' });
    assert.strictEqual(antwort.status, Number(status), 'POST Rückgabe ohne Sitzung');
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

  /* ---------------------------------------------------------------- UC-003 CSV-Export */

  /** Die letzte Export-Antwort: Status, Kopfzeilen und Rohbytes der Datei. */
  private static export?: { status: number; headers: Record<string, string>; body: Buffer };

  /** Wählt „Als CSV exportieren“ und hält die Antwort des Dienstes fest. */
  private async exportieren(): Promise<number> {
    const page = await this.umsaetzeGeladen();
    const antwort = page.waitForResponse(r => /\/umsaetze\/export(\?|$)/.test(r.url()));
    await page.getByRole('button', { name: 'Als CSV exportieren' }).click();
    const r = await antwort;
    // Den Rumpf liest die Seite selbst als Blob; die Prüfung holt dieselbe Abfrage mit der Sitzung der Seite noch einmal.
    const rumpf = r.ok() ? await page.request.get(r.url()) : r;
    StepImplementation.export = { status: r.status(), headers: rumpf.headers(), body: await rumpf.body().catch(() => Buffer.alloc(0)) };
    return r.status();
  }

  private csvZeilen(): string[][] {
    const datei = StepImplementation.export;
    assert.ok(datei && datei.status === 200, 'Es gibt keine exportierte Datei');
    const inhalt = datei.body.toString('utf8').replace(/^﻿/, '');
    const zeilen: string[][] = [];
    let zeile: string[] = [];
    let zelle = '';
    let gequotet = false;
    for (let i = 0; i < inhalt.length; i++) {
      const z = inhalt[i];
      if (gequotet) {
        if (z === '"' && inhalt[i + 1] === '"') { zelle += '"'; i++; }
        else if (z === '"') gequotet = false;
        else zelle += z;
      } else if (z === '"') gequotet = true;
      else if (z === ';') { zeile.push(zelle); zelle = ''; }
      else if (z === '\r' && inhalt[i + 1] === '\n') { zeile.push(zelle); zeilen.push(zeile); zeile = []; zelle = ''; i++; }
      else zelle += z;
    }
    if (zelle || zeile.length) { zeile.push(zelle); zeilen.push(zeile); }
    return zeilen;
  }

  @Step('Die Kundin exportiert die Umsätze und der Dienst antwortet mit dem Status <status>')
  public async umsaetzeExportierenMitStatus(status: string) {
    assert.strictEqual(await this.exportieren(), Number(status), 'Status der Export-Antwort');
  }

  @Step('Die Kundin exportiert die Umsätze als CSV-Datei')
  public async umsaetzeExportieren() {
    await this.exportieren();
  }

  @Step('Die CSV-Datei <name> beginnt mit dem UTF-8-BOM und der Kopfzeile <kopfzeile>')
  public async csvBeginn(name: string, kopfzeile: string) {
    const datei = StepImplementation.export;
    assert.ok(datei && datei.status === 200, 'Es gibt keine exportierte Datei');
    assert.ok(datei.headers['content-disposition']?.includes(`filename="${text(name)}"`), `Dateiname ${text(name)}, Kopf: ${datei.headers['content-disposition']}`);
    assert.deepStrictEqual([...datei.body.subarray(0, 3)], [0xef, 0xbb, 0xbf], 'UTF-8-BOM fehlt');
    assert.strictEqual(this.csvZeilen()[0].join(';'), text(kopfzeile));
  }

  @Step('Die CSV-Datei enthält die Zeilen <tabelle>')
  public async csvZeilenPruefen(tabelle: Table) {
    const [kopf, ...daten] = this.csvZeilen();
    const erwartet = tabelle.getTableRows();
    assert.strictEqual(daten.length, erwartet.length, `Zeilen in der Datei: ${daten.length}, erwartet ${erwartet.length}`);
    const spalten = tabelle.getColumnNames();
    erwartet.forEach((zeile, i) => {
      for (const spalte of spalten) {
        const nr = kopf.indexOf(spalte);
        assert.ok(nr >= 0, `Spalte ${spalte} fehlt in der Kopfzeile`);
        assert.strictEqual(daten[i][nr], text(zeile.getCell(spalte) ?? ''), `Zeile ${i + 1}, Spalte ${spalte}`);
      }
    });
  }

  @Step('Die CSV-Datei hat den Content-Type <typ> und das Zeilenende <ende>')
  public async csvFormat(typ: string, ende: string) {
    const datei = StepImplementation.export;
    assert.ok(datei && datei.status === 200, 'Es gibt keine exportierte Datei');
    assert.ok(datei.headers['content-type']?.startsWith(text(typ)), `Content-Type: ${datei.headers['content-type']}`);
    const inhalt = datei.body.toString('utf8');
    const crlf = (inhalt.match(/\r\n/g) ?? []).length;
    const lf = (inhalt.match(/\n/g) ?? []).length;
    if (text(ende) === 'CRLF') assert.ok(crlf > 0 && crlf === lf, 'Zeilenende ist nicht durchgehend CRLF');
    else assert.fail(`Unbekanntes Zeilenende ${text(ende)}`);
  }

  @Step('Der CSV-Export antwortet ohne Anmeldung mit dem Status <status>')
  public async csvOhneAnmeldung(status: string) {
    const page = await this.seite();
    await page.context().clearCookies();
    const antwort = await fetch(`${basisUrl}/api/konten/DE02500105175407324931/umsaetze/export`);
    assert.strictEqual(antwort.status, Number(status), 'GET /api/konten/{iban}/umsaetze/export ohne Sitzung');
  }

  /** Der Dienst antwortet auf den Export mit 500; die Umleitung gilt bis zum Ende des Szenarios. */
  @Step('Der Export-Dienst antwortet mit einem Fehler')
  public async exportFehler() {
    const page = await this.seite();
    await page.route(/\/umsaetze\/export(\?|$)/, route => route.fulfill({ status: 500, contentType: 'application/json', body: '{"fehler":"Interner Fehler"}' }));
  }

  /* ---------------------------------------------------------------- UC-004 Empfängervorlagen */

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

  /* ---------------------------------------------------------------- UC-015 Tageslimit */

  /** Die Seite Tageslimit; ruft sie auf, wenn die Seite woanders steht. */
  private async tageslimitSeite(): Promise<Page> {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/tageslimit') await page.goto(`${basisUrl}/tageslimit`, { waitUntil: 'domcontentloaded' });
    await page.locator('.tageslimit').waitFor();
    return page;
  }

  /** UC-015 Schritt 1: „Tageslimit“ im Finanzstatus. */
  @Step('Die Kundin öffnet das Tageslimit')
  public async tageslimitOeffnen() {
    const page = await this.kontentabelle();
    await page.locator('#kopf-aktion').getByRole('link', { name: 'Tageslimit' }).click();
    await page.waitForURL(/\/tageslimit$/);
    await page.locator('.tageslimit').waitFor();
  }

  /** Gibt den Betrag so ein, wie er im Szenario steht, und wählt „Speichern“; wartet auf die neu gezeichnete Seite. */
  @Step('Die Kundin setzt das Tageslimit auf <betrag>')
  public async tageslimitSetzen(betrag: string) {
    const page = await this.tageslimitSeite();
    const form = page.getByRole('form', { name: 'Tageslimit ändern' });
    await form.getByLabel('Neues Tageslimit in Euro').fill(text(betrag));
    await page.locator('.tageslimit').evaluate(e => e.setAttribute('data-alt', ''));
    await form.getByRole('button', { name: 'Speichern' }).click();
    await page.locator('.tageslimit:not([data-alt])').waitFor();
  }

  @Step('Das Tageslimit zeigt die Meldung <meldung>')
  public async tageslimitMeldet(meldung: string) {
    const page = await this.tageslimitSeite();
    await page.locator('.tageslimit > [role="status"], .tageslimit > [role="alert"]').filter({ hasText: text(meldung) }).waitFor();
  }

  @Step('Das Tageslimit zeigt das aktuelle Limit <aktuell> und das Standardlimit <standard>')
  public async tageslimitZeigt(aktuell: string, standard: string) {
    const page = await this.tageslimitSeite();
    const werte = Object.fromEntries(await page.locator('.tageslimit dl > div').evaluateAll(zeilen =>
      zeilen.map(z => [z.querySelector('dt')!.textContent!.trim(), z.querySelector('dd')!.textContent!])));
    assert.deepStrictEqual(
      { aktuell: sichtbar(werte['Aktuelles Tageslimit']), standard: sichtbar(werte['Standardlimit']) },
      { aktuell: sichtbar(text(aktuell)), standard: sichtbar(text(standard)) });
  }

  @Step('Das Tageslimit ist ohne Anmeldung nicht erreichbar')
  public async tageslimitOhneAnmeldung() {
    const page = await this.seite();
    await page.context().clearCookies();
    const lesen = await fetch(`${basisUrl}/api/tageslimit`);
    assert.strictEqual(lesen.status, 401, 'GET /api/tageslimit ohne Sitzung');
    const setzen = await fetch(`${basisUrl}/api/tageslimit`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tageslimit: 1000 }),
    });
    assert.strictEqual(setzen.status, 401, 'PUT /api/tageslimit ohne Sitzung');
    await page.goto(`${basisUrl}/tageslimit`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }

  /* ---------------------------------------------------------------- UC-016 Daueraufträge */

  /** „heute“, „gestern“, „in 5 Tagen“, „vor 30 Tagen“ als JJJJ-MM-TT in UTC (BR-0077); leer bleibt leer. */
  private datum(angabe: string): string {
    const a = text(angabe).trim();
    if (!a) return '';
    const m = /^(heute|gestern|in (\d+) Tagen|vor (\d+) Tagen)$/.exec(a);
    assert.ok(m, `Unbekannte Datumsangabe „${a}“`);
    const tage = a === 'heute' ? 0 : a === 'gestern' ? -1 : m[2] ? Number(m[2]) : -Number(m[3]);
    const jetzt = new Date();
    return new Date(Date.UTC(jetzt.getUTCFullYear(), jetzt.getUTCMonth(), jetzt.getUTCDate() + tage)).toISOString().slice(0, 10);
  }

  private anzeigeDatum(angabe: string): string {
    return this.datum(angabe).split('-').reverse().join('.');
  }

  /** Die Seite Daueraufträge; ruft sie auf, wenn die Seite woanders steht. */
  private async dauerauftraegeSeite(): Promise<Page> {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/dauerauftraege') await page.goto(`${basisUrl}/dauerauftraege`, { waitUntil: 'domcontentloaded' });
    await page.locator('.dauerauftraege').waitFor();
    return page;
  }

  /** Die Seite zeichnet nach jeder Antwort des Dienstes neu; gewartet wird auf die neu gezeichnete Fläche. */
  private async dauerauftragNeuzeichnen(page: Page, aktion: () => Promise<void>) {
    await page.locator('.dauerauftraege').evaluate(e => e.setAttribute('data-alt', ''));
    await aktion();
    await page.locator('.dauerauftraege:not([data-alt])').waitFor();
  }

  /** UC-016 Schritt 1: „Daueraufträge“ im Finanzstatus. */
  @Step('Die Kundin öffnet die Daueraufträge')
  public async dauerauftraegeOeffnen() {
    const page = await this.kontentabelle();
    await page.locator('#kopf-aktion').getByRole('link', { name: 'Daueraufträge' }).click();
    await page.waitForURL(/\/dauerauftraege$/);
    await page.locator('.dauerauftraege').waitFor();
  }

  @Step('Die Kundin legt einen Dauerauftrag an Empfänger <empfaenger> mit IBAN <iban>, Betrag <betrag>, Verwendungszweck <zweck>, Turnus <turnus>, erstem Ausführungstag <tag> und Enddatum <ende> an')
  public async dauerauftragAnlegen(empfaenger: string, iban: string, betrag: string, zweck: string, turnus: string, tag: string, ende: string) {
    const page = await this.dauerauftraegeSeite();
    const form = page.getByRole('form', { name: 'Neuer Dauerauftrag' });
    await form.getByLabel('Name des Empfängers').fill(text(empfaenger));
    await form.getByLabel('IBAN des Empfängers').fill(text(iban));
    await form.getByLabel('Betrag in Euro').fill(text(betrag));
    await form.getByLabel('Verwendungszweck').fill(text(zweck));
    await form.getByLabel('Turnus des Dauerauftrags').selectOption({ label: text(turnus) });
    await form.getByLabel('Erster Ausführungstag am').fill(this.datum(tag));
    await form.getByLabel('Enddatum (optional)').fill(this.datum(ende));
    await this.dauerauftragNeuzeichnen(page, () => form.getByRole('button', { name: 'Speichern' }).click());
  }

  @Step('Die Daueraufträge zeigen die Meldung <meldung>')
  public async dauerauftraegeMelden(meldung: string) {
    const page = await this.dauerauftraegeSeite();
    await page.locator('.dauerauftraege > [role="status"], .dauerauftraege > [role="alert"]').filter({ hasText: text(meldung) }).waitFor();
  }

  @Step('Die Daueraufträge zeigen die Einträge <tabelle>')
  public async dauerauftraegeZeigen(tabelle: Table) {
    const page = await this.dauerauftraegeSeite();
    const spalten = tabelle.getColumnNames();
    const datumsspalten = ['Erster Ausführungstag', 'Enddatum'];
    const erwartet = tabelle.getTableRows().map(z => spalten.map(s =>
      datumsspalten.includes(s) ? this.anzeigeDatum(text(z.getCell(s))) : sichtbar(text(z.getCell(s)))));
    const tab = page.locator('.dauerauftraege__tabelle');
    await tab.waitFor();
    const kopf = (await tab.locator('thead th').allInnerTexts()).map(sichtbar);
    const index = spalten.map(s => {
      const i = kopf.indexOf(s);
      assert.ok(i >= 0, `Spalte „${s}“ fehlt, da sind: ${kopf.join(', ')}`);
      return i;
    });
    const zeilen = tab.locator('tbody tr');
    const ist: string[][] = [];
    for (let n = 0; n < await zeilen.count(); n++) {
      const zellen = (await zeilen.nth(n).locator('th, td').allInnerTexts()).map(sichtbar);
      ist.push(index.map(i => zellen[i]));
    }
    assert.deepStrictEqual(ist, erwartet, 'Einträge der Daueraufträge');
  }

  /** Wählt in der Auswahl den Dauerauftrag mit diesem Empfänger; die Optionen beginnen mit dem Empfänger. */
  private async dauerauftragWaehlen(select: Locator, empfaenger: string) {
    const wert = await select.locator('option').evaluateAll((os, name) =>
      (os as HTMLOptionElement[]).find(o => o.text.startsWith(`${name},`))?.value, text(empfaenger));
    assert.ok(wert, `Kein Dauerauftrag „${empfaenger}“ in der Auswahl`);
    await select.selectOption(wert);
  }

  @Step('Die Kundin ändert beim Dauerauftrag <empfaenger> das Feld <feld> auf <wert>')
  public async dauerauftragAendern(empfaenger: string, feld: string, wert: string) {
    const page = await this.dauerauftraegeSeite();
    const form = page.getByRole('form', { name: 'Dauerauftrag ändern' });
    await this.dauerauftragWaehlen(form.getByLabel('Dauerauftrag zum Ändern'), empfaenger);
    const felder: Record<string, string> = {
      'Empfänger': 'Neuer Empfängername', 'IBAN': 'Neue IBAN des Empfängers', 'Betrag': 'Neuer Betrag in Euro',
      'Verwendungszweck': 'Neuer Verwendungszweck', 'Turnus': 'Neuer Turnus',
      'Erster Ausführungstag': 'Neuer erster Ausführungstag', 'Enddatum': 'Neues Enddatum (optional)',
    };
    const name = text(feld);
    const label = felder[name];
    assert.ok(label, `Unbekanntes Feld „${feld}“`);
    const eingabe = form.getByLabel(label);
    if (name === 'Turnus') await eingabe.selectOption({ label: text(wert) });
    else if (name === 'Erster Ausführungstag' || name === 'Enddatum') await eingabe.fill(this.datum(wert));
    else await eingabe.fill(text(wert));
    await this.dauerauftragNeuzeichnen(page, () => form.getByRole('button', { name: 'Änderung speichern' }).click());
  }

  @Step('Die Kundin wählt den Dauerauftrag <empfaenger> zum Löschen und antwortet auf die Sicherheitsabfrage <antwort>')
  public async dauerauftragLoeschen(empfaenger: string, antwort: string) {
    const page = await this.dauerauftraegeSeite();
    const form = page.getByRole('form', { name: 'Dauerauftrag löschen' });
    await this.dauerauftragWaehlen(form.getByLabel('Dauerauftrag zum Löschen'), empfaenger);
    await this.dauerauftragNeuzeichnen(page, () => form.getByRole('button', { name: 'Löschen' }).click());
    const abfrage = page.getByRole('group', { name: 'Sicherheitsabfrage' });
    await abfrage.getByText('Dauerauftrag löschen?').waitFor();
    await this.dauerauftragNeuzeichnen(page, () => abfrage.getByRole('button', { name: text(antwort), exact: true }).click());
  }

  @Step('Die Daueraufträge sind ohne Anmeldung nicht erreichbar')
  public async dauerauftraegeOhneAnmeldung() {
    const page = await this.seite();
    await page.context().clearCookies();
    const aufrufe: [string, string, string | undefined][] = [
      ['GET', '/api/dauerauftraege', undefined],
      ['POST', '/api/dauerauftraege', '{}'],
      ['PUT', '/api/dauerauftraege/x', '{}'],
      ['DELETE', '/api/dauerauftraege/x', undefined],
    ];
    for (const [methode, pfad, body] of aufrufe) {
      const antwort = await fetch(`${basisUrl}${pfad}`, { method: methode, headers: { 'Content-Type': 'application/json' }, body });
      assert.strictEqual(antwort.status, 401, `${methode} ${pfad} ohne Sitzung`);
    }
    await page.goto(`${basisUrl}/dauerauftraege`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }

  /* ---------------------------------------------------------------- UC-002 A9 Terminüberweisung, UC-017 Vorgemerkte Überweisungen */

  /** Stände der Umsatzliste je „Die Kundin öffnet die Umsätze des Kontos …“ im laufenden Szenario. */
  private static umsatzstaende: string[][] = [];
  /** Hat das Szenario die Umsatzliste gefiltert? Dann prüft „Die Umsätze zeigen die Zeilen“ die ganze Liste. */
  private static umsaetzeGefiltert = false;

  /** BR-0079: heute in Europe/Berlin plus n Tage, JJJJ-MM-TT. */
  private static inTagen(n: number): string {
    const heute = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const d = new Date(`${heute}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  /** „heute“, „morgen“, „in 5 Tagen“ relativ zu heute; „31.02.2027“ wörtlich als „2027-02-31“. */
  private static tag(wert: unknown): string {
    const t = text(wert).trim();
    if (t === 'heute') return StepImplementation.inTagen(0);
    if (t === 'morgen') return StepImplementation.inTagen(1);
    const relativ = /^in (\d+) Tagen?$/.exec(t);
    if (relativ) return StepImplementation.inTagen(Number(relativ[1]));
    const datum = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(t);
    if (datum) return `${datum[3]}-${datum[2]}-${datum[1]}`;
    return t;
  }

  /** Der Tag im Anzeigeformat TT.MM.JJJJ. */
  private static anzeigetag(wert: unknown): string {
    return StepImplementation.tag(wert).split('-').reverse().join('.');
  }

  /** „3.200,00 €“ → 3200 */
  private static betrag(wert: unknown): number {
    return Number(text(wert).replace(/[\s€ ]/g, '').replace(/\./g, '').replace(',', '.'));
  }

  @Step('Die Kundin erfasst Empfänger <empfaenger>, IBAN <iban>, Betrag <betrag>, Verwendungszweck <zweck> und Ausführungstag <tag> und wählt „Weiter“')
  public async erfassenMitTagUndWeiter(empfaenger: string, iban: string, betrag: string, zweck: string, tag: string) {
    await this.erfassen(empfaenger, iban, betrag, zweck, tag);
  }

  @Step('Die Zusammenfassung zeigt die Zeile <zeile> mit dem Wert <tag> im Format TT.MM.JJJJ')
  public async zusammenfassungZeigtTag(zeile: string, tag: string) {
    const page = await this.seite();
    const zusammenfassung = page.getByRole('region', { name: 'Zusammenfassung' });
    await zusammenfassung.waitFor();
    const werte = Object.fromEntries(await zusammenfassung.locator('dl > div').evaluateAll(zeilen =>
      zeilen.map(z => [z.querySelector('dt')!.textContent!.trim(), z.querySelector('dd')!.textContent!.trim()])));
    assert.strictEqual(werte[text(zeile)], StepImplementation.anzeigetag(tag), `Zeile „${zeile}“ der Zusammenfassung`);
  }

  @Step('Die Umsätze des Kontos sind gegenüber vorher unverändert')
  public async umsaetzeUnveraendert() {
    const staende = StepImplementation.umsatzstaende;
    assert.ok(staende.length >= 2, 'Die Umsätze wurden im Szenario nicht zweimal geöffnet');
    assert.deepStrictEqual(staende[staende.length - 1], staende[staende.length - 2]);
  }

  /** Ein gültiger Terminauftrag von Lenas Girokonto, den die Tabelle des Szenarios Feld für Feld überschreibt. */
  private static terminauftrag(tabelle: Table): Record<string, unknown> {
    const auftrag: Record<string, unknown> = {
      auftragsId: `test-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      auftraggeberIban: 'DE02500105175407324931', empfaenger: 'Möbel Nord GmbH', empfaengerIban: 'DE89370400440532013000',
      betrag: 50, waehrung: 'EUR', verwendungszweck: 'Rechnung 4711', ausfuehrungstag: StepImplementation.inTagen(5),
    };
    for (const zeile of tabelle.getTableRows()) {
      const feld = text(zeile.getCell('feld')).trim();
      const wert = zeile.getCell('wert');
      auftrag[feld] = feld === 'betrag' ? StepImplementation.betrag(wert) : feld === 'ausfuehrungstag' ? StepImplementation.tag(wert) : text(wert).trim();
    }
    return auftrag;
  }

  /** „POST /api/…“ → Methode und Pfad; {auftragsId} kommt aus den Angaben. */
  private static aufruf(operation: string, angaben: Record<string, unknown>): { methode: string; pfad: string } {
    const [methode, pfad] = text(operation).trim().split(/\s+/);
    return { methode, pfad: pfad.replace('{auftragsId}', encodeURIComponent(text(angaben.auftragsId))) };
  }

  @Step('Die angemeldete Kundin ruft <operation> mit den Angaben auf und erhält den Status <status> <tabelle>')
  public async angemeldetAufrufen(operation: string, status: string, tabelle: Table) {
    const page = await this.seite();
    const angaben = StepImplementation.terminauftrag(tabelle);
    const { methode, pfad } = StepImplementation.aufruf(operation, angaben);
    // page.request teilt die Cookies der Seite, also die Sitzung der angemeldeten Kundin.
    const antwort = await page.request.fetch(`${basisUrl}${pfad}`, {
      method: methode, ...(methode === 'POST' ? { data: angaben } : {}),
    });
    assert.strictEqual(antwort.status(), Number(status), `${methode} ${pfad}: ${await antwort.text()}`);
  }

  @Step('Der Aufruf <operation> ohne Anmeldung antwortet mit dem Status <status>')
  public async ohneAnmeldungAufrufen(operation: string, status: string) {
    const { methode, pfad } = StepImplementation.aufruf(operation, { auftragsId: 'ohne-anmeldung' });
    const antwort = await fetch(`${basisUrl}${pfad}`, {
      method: methode,
      ...(methode === 'POST' ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ auftragsId: 'ohne-anmeldung', ausfuehrungstag: StepImplementation.inTagen(5) }) } : {}),
    });
    assert.strictEqual(antwort.status, Number(status), `${methode} ${pfad} ohne Sitzung`);
  }

  /** Die Seite der vorgemerkten Überweisungen, fertig gezeichnet. */
  private async vorgemerktSeite(): Promise<Page> {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/vorgemerkte-ueberweisungen') await page.goto(`${basisUrl}/vorgemerkte-ueberweisungen`, { waitUntil: 'domcontentloaded' });
    await page.locator('.vorgemerkt:not([data-alt])').waitFor();
    return page;
  }

  /** UC-017 Schritt 1: „Vorgemerkte Überweisungen“ in der Überweisung; ruft die Überweisung auf, wenn die Seite woanders steht. */
  @Step('Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen')
  public async vorgemerktOeffnen() {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/ueberweisung') await page.goto(`${basisUrl}/ueberweisung`, { waitUntil: 'domcontentloaded' });
    await page.getByRole('form', { name: 'Überweisung' }).getByRole('link', { name: 'Vorgemerkte Überweisungen' }).click();
    await page.waitForURL(/\/vorgemerkte-ueberweisungen$/);
    await this.vorgemerktSeite();
  }

  @Step('Die vorgemerkten Überweisungen zeigen <anzahl> Aufträge')
  public async vorgemerktAnzahl(anzahl: string) {
    const page = await this.vorgemerktSeite();
    assert.strictEqual(await page.locator('.vorgemerkt table tbody tr').count(), Number(anzahl), 'Zahl der vorgemerkten Aufträge');
  }

  @Step('Die vorgemerkten Überweisungen zeigen die Aufträge <tabelle>')
  public async vorgemerktZeigen(tabelle: Table) {
    const page = await this.vorgemerktSeite();
    const spalten = tabelle.getColumnNames();
    const erwartet = tabelle.getTableRows().map(z => spalten.map(s =>
      s === 'Ausführungstag' ? StepImplementation.anzeigetag(z.getCell(s)) : sichtbar(text(z.getCell(s)))));
    const tab = page.locator('.vorgemerkt table');
    const ist: string[][] = [];
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

  @Step('Die vorgemerkten Überweisungen zeigen die Meldung <meldung>')
  public async vorgemerktMeldung(meldung: string) {
    const page = await this.vorgemerktSeite();
    await page.locator('.vorgemerkt').getByText(text(meldung), { exact: true }).waitFor();
  }

  /** Die Seite zeichnet nach jeder Aktion neu; gewartet wird auf die neu gezeichnete Fläche. */
  private async vorgemerktNeu(page: Page, aktion: () => Promise<void>) {
    await page.locator('.vorgemerkt').evaluate(e => e.setAttribute('data-alt', ''));
    await aktion();
    await page.locator('.vorgemerkt:not([data-alt])').waitFor();
  }

  @Step('Die Kundin wählt den vorgemerkten Auftrag an <empfaenger> zum Löschen und antwortet auf die Sicherheitsabfrage <antwort>')
  public async vorgemerktLoeschen(empfaenger: string, antwort: string) {
    const page = await this.vorgemerktSeite();
    const form = page.getByRole('form', { name: 'Auftrag löschen' });
    const auswahl = form.getByLabel('Auftrag zum Löschen');
    const wert = await auswahl.locator('option').filter({ hasText: text(empfaenger) }).first().getAttribute('value');
    assert.ok(wert, `Kein vorgemerkter Auftrag an „${empfaenger}“ zur Auswahl`);
    await auswahl.selectOption(wert);
    await this.vorgemerktNeu(page, () => form.getByRole('button', { name: 'Löschen' }).click());
    const abfrage = page.getByRole('group', { name: 'Sicherheitsabfrage' });
    await abfrage.getByText('Vorgemerkten Auftrag löschen?').waitFor();
    await this.vorgemerktNeu(page, () => abfrage.getByRole('button', { name: text(antwort), exact: true }).click());
  }

  @Step('Die Seite der vorgemerkten Überweisungen ist ohne Anmeldung nicht erreichbar')
  public async vorgemerktOhneAnmeldung() {
    const page = await this.seite();
    await page.context().clearCookies();
    const api = await fetch(`${basisUrl}/api/terminueberweisungen`);
    assert.strictEqual(api.status, 401, 'GET /api/terminueberweisungen ohne Sitzung');
    await page.goto(`${basisUrl}/vorgemerkte-ueberweisungen`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }

  /* ---------------------------------------------------------------- UC-018 Debitkarte */

  /** Die Seite Debitkarte; ruft sie auf (Girokonto), wenn die Seite woanders steht. */
  private async debitkarteSeite(): Promise<Page> {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/debitkarte') await page.goto(`${basisUrl}/debitkarte`, { waitUntil: 'domcontentloaded' });
    await page.locator('.debitkarte').waitFor();
    return page;
  }

  /** Löst die Aktion aus und wartet, bis die Seite neu gezeichnet ist. */
  private async debitkarteNeuzeichnen(page: Page, aktion: () => Promise<unknown>) {
    await page.locator('.debitkarte').evaluate(e => e.setAttribute('data-alt', ''));
    await aktion();
    await page.locator('.debitkarte:not([data-alt])').waitFor();
  }

  /** UC-018 Schritt 1: „Debitkarte“ in der Zeile des Girokontos im Finanzstatus. */
  @Step('Die Kundin öffnet die Debitkarte des Girokontos')
  public async debitkarteOeffnen() {
    const page = await this.kontentabelle();
    await page.locator('.kontentabelle tbody tr[data-konto="Girokonto"]').getByRole('link', { name: 'Debitkarte' }).click();
    await page.waitForURL(/\/debitkarte/);
    await page.locator('.debitkarte').waitFor();
  }

  @Step('Die Kundin sperrt die Debitkarte vorübergehend')
  public async debitkarteSperren() {
    const page = await this.debitkarteSeite();
    await this.debitkarteNeuzeichnen(page, () => page.getByRole('button', { name: 'Vorübergehend sperren' }).click());
  }

  @Step('Die Kundin entsperrt die Debitkarte')
  public async debitkarteEntsperren() {
    const page = await this.debitkarteSeite();
    await this.debitkarteNeuzeichnen(page, () => page.getByRole('button', { name: 'Entsperren', exact: true }).click());
  }

  @Step('Die Kundin sperrt die Debitkarte endgültig wegen <grund> und antwortet auf die Sicherheitsabfrage <antwort>')
  public async debitkarteEndgueltigSperren(grund: string, antwort: string) {
    const page = await this.debitkarteSeite();
    const form = page.getByRole('form', { name: 'Endgültig sperren' });
    await form.getByLabel('Grund der endgültigen Sperre').selectOption({ label: text(grund ?? '') });
    await this.debitkarteNeuzeichnen(page, () => form.getByRole('button', { name: 'Endgültig sperren' }).click());
    const abfrage = page.getByRole('group', { name: 'Sicherheitsabfrage' });
    await abfrage.getByText('Debitkarte endgültig sperren?').waitFor();
    await this.debitkarteNeuzeichnen(page, () => abfrage.getByRole('button', { name: text(antwort), exact: true }).click());
  }

  @Step('Die Debitkarte zeigt die Meldung <meldung>')
  public async debitkarteMeldet(meldung: string) {
    const page = await this.debitkarteSeite();
    await page.locator('.debitkarte > [role="status"], .debitkarte > [role="alert"]').filter({ hasText: text(meldung) }).waitFor();
  }

  /** Die Werte der Karte als Beschriftung → Wert. */
  private async debitkarteWerte(page: Page): Promise<Record<string, string>> {
    return Object.fromEntries(await page.locator('.debitkarte dl > div').evaluateAll(zeilen =>
      zeilen.map(z => [z.querySelector('dt')!.textContent!.trim(), z.querySelector('dd')!.textContent!.trim()])));
  }

  @Step('Die Debitkarte zeigt die Kartennummer <nummer> und den Status <status>')
  public async debitkarteZeigt(nummer: string, status: string) {
    const page = await this.debitkarteSeite();
    await page.locator('.debitkarte dl').waitFor();
    const werte = await this.debitkarteWerte(page);
    assert.deepStrictEqual({ nummer: werte['Kartennummer'], status: werte['Status'] }, { nummer: text(nummer), status: text(status) });
  }

  @Step('Die Debitkarte zeigt keinen Sperrgrund')
  public async debitkarteOhneSperrgrund() {
    const page = await this.debitkarteSeite();
    await page.locator('.debitkarte dl').waitFor();
    assert.ok(!('Sperrgrund' in await this.debitkarteWerte(page)), 'Die Debitkarte zeigt einen Sperrgrund');
  }

  @Step('Die Debitkarte des Kontos mit der IBAN <iban> zeigt die Meldung <meldung>')
  public async debitkarteKontoMeldet(iban: string, meldung: string) {
    const page = await this.seite();
    await page.goto(`${basisUrl}/debitkarte?iban=${encodeURIComponent(text(iban).replace(/\s+/g, ''))}`, { waitUntil: 'domcontentloaded' });
    await page.locator('.debitkarte > [role="alert"]').filter({ hasText: text(meldung) }).waitFor();
    assert.strictEqual(await page.getByRole('button').filter({ hasText: /sperren|Entsperren/ }).count(), 0, 'Die Seite bietet Aktionen an');
  }

  private debitkarteAdresse(iban: string): string {
    return `${basisUrl}/api/konten/${encodeURIComponent(text(iban).replace(/\s+/g, ''))}/debitkarte`;
  }

  @Step('Der Abruf der Debitkarte zur IBAN <iban> antwortet mit dem Status <status>')
  public async debitkarteAbrufStatus(iban: string, status: string) {
    const page = await this.seite();
    const antwort = await page.context().request.get(this.debitkarteAdresse(iban));
    assert.strictEqual(antwort.status(), Number(status), 'GET /api/konten/{iban}/debitkarte');
  }

  private async debitkarteSetzenPerAufruf(iban: string, status: string, grund: string) {
    const page = await this.seite();
    const daten: Record<string, string> = { status: text(status) };
    if (text(grund ?? '') !== '') daten.sperrgrund = text(grund);
    return page.context().request.put(this.debitkarteAdresse(iban), { data: daten });
  }

  @Step('Das Setzen der Debitkarte zur IBAN <iban> auf den Zielstatus <status> mit dem Sperrgrund <grund> antwortet mit dem Status <code>')
  public async debitkarteSetzenStatus(iban: string, status: string, grund: string, code: string) {
    const antwort = await this.debitkarteSetzenPerAufruf(iban, status, grund);
    assert.strictEqual(antwort.status(), Number(code), 'PUT /api/konten/{iban}/debitkarte');
  }

  /* ---------------------------------------------------------------- UC-019 Ausgabenanalyse */

  /** Status der letzten Abfrage der Ausgabenanalyse. */
  private static ausgabenStatus?: number;

  private static laufenderMonat(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  /** Wartet auf die Antwort der Abfrage, die `aktion` auslöst, und die gezeichnete Seite dazu. */
  private async ausgabenAbfrage(page: Page, monat: string, aktion: () => Promise<unknown>) {
    const antwort = page.waitForResponse(r => /\/api\/konten\/[^/]+\/ausgabenanalyse\?/.test(r.url()) && new URL(r.url()).searchParams.get('monat') === monat);
    await aktion();
    StepImplementation.ausgabenStatus = (await antwort).status();
    await page.locator(`#ausgaben-ergebnis[data-abfrage="${monat.replace(/"/g, '\\"')}"]`).waitFor();
  }

  private async ausgabenSeite(): Promise<Page> {
    const page = await this.seite();
    await page.locator('#ausgaben-ergebnis[data-abfrage]').waitFor();
    return page;
  }

  @Step('Die Kundin öffnet die Ausgabenanalyse des Kontos <konto> für den Monat <monat>')
  public async ausgabenanalyseOeffnen(konto: string, monat: string) {
    const page = await this.seite();
    let iban = text(konto).replace(/\s+/g, '');
    if (!/^[A-Z]{2}\d/.test(iban)) {
      const konten = await (await page.context().request.get(`${basisUrl}/api/konten`)).json() as { konten: { kontoname: string; iban: string }[] };
      const gefunden = konten.konten.find(k => k.kontoname === text(konto));
      assert.ok(gefunden, `Konto „${konto}“ nicht gefunden`);
      iban = gefunden.iban;
    }
    const m = text(monat) === 'aktueller Monat' ? StepImplementation.laufenderMonat() : text(monat);
    await this.ausgabenAbfrage(page, m, () => page.goto(`${basisUrl}/ausgabenanalyse?iban=${encodeURIComponent(iban)}&monat=${encodeURIComponent(m)}`, { waitUntil: 'domcontentloaded' }));
  }

  @Step('Die Kundin wählt in der Ausgabenanalyse den Monat <monat>')
  public async ausgabenanalyseMonat(monat: string) {
    const page = await this.ausgabenSeite();
    await this.ausgabenAbfrage(page, text(monat), () => page.getByLabel('Monat', { exact: true }).fill(text(monat)));
  }

  @Step('Die Kundin wählt im Finanzstatus in der Zeile des Kontos <konto> die Ausgabenanalyse')
  public async ausgabenanalyseAusFinanzstatus(konto: string) {
    const page = await this.kontentabelle();
    await page.locator(`.kontentabelle tbody tr[data-konto="${text(konto)}"]`).getByRole('link', { name: 'Ausgabenanalyse' }).click();
    await page.waitForURL(/\/ausgabenanalyse\?/);
    await this.ausgabenSeite();
  }

  @Step('Das Feld Monat der Ausgabenanalyse enthält den laufenden Monat')
  public async ausgabenanalyseLaufenderMonat() {
    const page = await this.ausgabenSeite();
    assert.strictEqual(await page.getByLabel('Monat', { exact: true }).inputValue(), StepImplementation.laufenderMonat());
  }

  @Step('Die Ausgabenanalyse zeigt die Kategorien <tabelle>')
  public async ausgabenanalyseKategorien(tabelle: Table) {
    const page = await this.ausgabenSeite();
    const spalten = tabelle.getColumnNames();
    const erwartet = tabelle.getTableRows().map(z => spalten.map(s => sichtbar(text(z.getCell(s)))));
    const zeilen = page.locator('#ausgaben-ergebnis table tbody tr');
    const ist: string[][] = [];
    const kopf = (await page.locator('#ausgaben-ergebnis table thead th').allInnerTexts()).map(sichtbar);
    for (let n = 0; n < await zeilen.count(); n++) {
      const zellen = (await zeilen.nth(n).locator('td').allInnerTexts()).map(sichtbar);
      ist.push(spalten.map(s => zellen[kopf.indexOf(s)]));
    }
    assert.deepStrictEqual(ist, erwartet);
  }

  /** Ohne Tabelle im Szenario: Es gibt keine Kategorie (Fehlermeldung statt Tabelle, Spec Zeilen 77 ff.). */
  @Step('Die Ausgabenanalyse zeigt die Kategorien')
  public async ausgabenanalyseOhneKategorien() {
    const page = await this.ausgabenSeite();
    assert.strictEqual(await page.locator('#ausgaben-ergebnis table tbody tr').count(), 0, 'Die Ausgabenanalyse zeigt Kategorien');
  }

  @Step('Die Ausgabenanalyse zeigt <feld> mit dem Text <erwartet>')
  public async ausgabenanalyseFeld(feld: string, erwartet: string) {
    const page = await this.ausgabenSeite();
    const ort = text(feld) === 'Meldung' ? page.locator('#ausgaben-ergebnis [role="alert"]')
      : text(feld) === 'Hinweis' ? page.locator('#ausgaben-ergebnis [data-feld="hinweis"]')
      : page.locator('#ausgaben-ergebnis [data-feld="gesamtausgaben"]');
    assert.strictEqual(sichtbar(await ort.first().textContent({ timeout: 5000 })), sichtbar(text(erwartet)), text(feld));
  }

  @Step('Die Ausgabenanalyse zeigt <feld> nicht')
  public async ausgabenanalyseOhne(feld: string) {
    const page = await this.ausgabenSeite();
    assert.strictEqual(text(feld), 'Hinweis');
    assert.strictEqual(await page.locator('#ausgaben-ergebnis [data-feld="hinweis"]').count(), 0, `Der ${feld} ist zu sehen`);
  }

  @Step('Die Abfrage der Ausgabenanalyse antwortet mit dem Status <status>')
  public async ausgabenanalyseStatus(status: string) {
    assert.strictEqual(StepImplementation.ausgabenStatus, Number(status), 'GET /api/konten/{iban}/ausgabenanalyse');
  }

  @Step('Die Ausgabenanalyse ist ohne Anmeldung nicht erreichbar')
  public async ausgabenanalyseOhneAnmeldung() {
    const page = await this.seite();
    await page.context().clearCookies();
    const api = await fetch(`${basisUrl}/api/konten/DE02500105175407324931/ausgabenanalyse?monat=2026-02`);
    StepImplementation.ausgabenStatus = api.status;
    await page.goto(`${basisUrl}/ausgabenanalyse?iban=DE02500105175407324931`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }

  /* ---------------------------------------------------------------- UC-020 Postfach */

  /** Das geöffnete Postfach; ruft es über die Navigation auf, wenn die Seite woanders steht. */
  private async postfachSeite(): Promise<Page> {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/postfach') {
      await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: /^Postfach/ }).click();
      await page.waitForURL(/\/postfach$/);
    }
    await page.locator('.postfach').waitFor();
    return page;
  }

  /** Löst die Aktion aus und wartet, bis die Seite neu gezeichnet ist. */
  private async postfachNeuzeichnen(page: Page, aktion: () => Promise<unknown>) {
    await page.locator('.postfach').evaluate(e => e.setAttribute('data-alt', ''));
    await aktion();
    await page.locator('.postfach:not([data-alt])').waitFor();
  }

  @Step('Die Kundin öffnet das Postfach')
  public async postfachOeffnen() {
    await this.postfachSeite();
  }

  @Step('Das Postfach zeigt die Nachrichten <tabelle>')
  public async postfachZeigtNachrichten(tabelle: Table) {
    const page = await this.postfachSeite();
    const spalten = tabelle.getColumnNames();
    const erwartet = tabelle.getTableRows().map(z => spalten.map(s => sichtbar(text(z.getCell(s)))));
    const kopf = (await page.locator('.postfach__tabelle thead th').allInnerTexts()).map(sichtbar);
    const zeilen = page.locator('.postfach__tabelle tbody tr');
    const ist: string[][] = [];
    for (let n = 0; n < await zeilen.count(); n++) {
      const zellen = (await zeilen.nth(n).locator('td').allInnerTexts()).map(sichtbar);
      ist.push(spalten.map(s => zellen[kopf.indexOf(s)]));
    }
    assert.deepStrictEqual(ist, erwartet);
  }

  @Step('Das Postfach zeigt die Meldung <meldung>')
  public async postfachMeldet(meldung: string) {
    const page = await this.postfachSeite();
    await page.locator('.postfach > [role="status"], .postfach > [role="alert"], .postfach > .vorlagen__leer').filter({ hasText: text(meldung) }).waitFor();
  }

  @Step('Die Kundin öffnet die Nachricht <betreff> und sieht den Text <erwartet>')
  public async nachrichtOeffnen(betreff: string, erwartet: string) {
    const page = await this.postfachSeite();
    const form = page.getByRole('form', { name: 'Nachricht lesen' });
    await form.getByLabel('Nachricht zum Öffnen').selectOption({ label: text(betreff) });
    await this.postfachNeuzeichnen(page, () => form.getByRole('button', { name: 'Öffnen' }).click());
    assert.strictEqual(sichtbar(await page.locator('#nachrichtText').textContent()), sichtbar(text(erwartet)), `Text von „${betreff}“`);
  }

  @Step('Die Kundin löscht die Nachricht <betreff> und antwortet auf die Sicherheitsabfrage <antwort>')
  public async nachrichtLoeschen(betreff: string, antwort: string) {
    const page = await this.postfachSeite();
    const form = page.getByRole('form', { name: 'Nachricht löschen' });
    await form.getByLabel('Nachricht zum Löschen').selectOption({ label: text(betreff) });
    await this.postfachNeuzeichnen(page, () => form.getByRole('button', { name: 'Löschen' }).click());
    const abfrage = page.getByRole('group', { name: 'Sicherheitsabfrage' });
    await abfrage.getByText('Nachricht löschen?').waitFor();
    await this.postfachNeuzeichnen(page, () => abfrage.getByRole('button', { name: text(antwort), exact: true }).click());
  }

  /** „keine Zahl“ oder die Zahl; gewartet wird, bis die Navigation die Zahl vom Dienst bekommen hat. */
  @Step('Die Navigation zeigt am Eintrag Postfach <zahl>')
  public async navigationZeigtPostfachZahl(zahl: string) {
    const page = await this.seite();
    const eintrag = page.getByRole('navigation', { name: 'Hauptnavigation' }).locator('#postfach-zahl[data-geladen]');
    await eintrag.waitFor({ state: 'attached' });
    if (text(zahl) === 'keine Zahl') assert.strictEqual(await eintrag.isVisible(), false, 'Die Navigation zeigt eine Zahl am Postfach');
    else assert.strictEqual(sichtbar(await eintrag.textContent()), text(zahl), 'Zahl am Eintrag Postfach');
  }

  /** „METHODE /pfad“ wie im Szenario. */
  private aufruf(beschreibung: string): { method: string; url: string } {
    const [method, pfad] = text(beschreibung).split(' ');
    return { method, url: `${basisUrl}${pfad}` };
  }

  @Step('Ohne Anmeldung wird der Aufruf <aufruf> mit Status <status> abgelehnt')
  public async ohneAnmeldungAbgelehnt(aufruf: string, status: string) {
    const page = await this.seite();
    await page.context().clearCookies();
    const { method, url } = this.aufruf(aufruf);
    const antwort = await fetch(url, { method });
    assert.strictEqual(antwort.status, Number(status), text(aufruf));
  }

  private async aufrufAngemeldet(aufruf: string, status: string) {
    const page = await this.seite();
    const { method, url } = this.aufruf(aufruf);
    const antwort = await page.context().request.fetch(url, { method });
    assert.strictEqual(antwort.status(), Number(status), text(aufruf));
  }

  @Step('Die Kundin ruft <aufruf> mit einer unbekannten Nachrichten-Kennung auf und erhält Status <status>')
  public async unbekannteNachricht(aufruf: string, status: string) {
    await this.aufrufAngemeldet(aufruf, status);
  }

  @Step('Die Kundin ruft <aufruf> mit einer ungültigen Nachrichten-Kennung auf und erhält Status <status>')
  public async ungueltigeNachricht(aufruf: string, status: string) {
    await this.aufrufAngemeldet(aufruf, status);
  }

  @Step('Das Postfach ist ohne Anmeldung nicht erreichbar')
  public async postfachOhneAnmeldung() {
    const page = await this.seite();
    await page.context().clearCookies();
    const api = await fetch(`${basisUrl}/api/nachrichten`);
    assert.strictEqual(api.status, 401, 'GET /api/nachrichten ohne Sitzung');
    await page.goto(`${basisUrl}/postfach`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }

  @Step('Die Kundin setzt die Debitkarte per Aufruf auf den Status <status> mit dem Sperrgrund <grund>')
  public async debitkarteSetzenAufruf(status: string, grund: string) {
    const page = await this.seite();
    const konten = await (await page.context().request.get(`${basisUrl}/api/konten`)).json() as { konten: { art: string; iban: string }[] };
    const iban = konten.konten.find(k => k.art === 'Girokonto')!.iban;
    const antwort = await this.debitkarteSetzenPerAufruf(iban, status, grund);
    assert.strictEqual(antwort.status(), 200, 'PUT /api/konten/{iban}/debitkarte');
  }

  /* ---------------------------------------------------------------- UC-021 Umbuchung */

  @Step('Die Kundin öffnet die Umbuchung')
  public async umbuchungOeffnen() {
    const page = await this.kontentabelle();
    await page.getByRole('link', { name: 'Umbuchen' }).click();
    await page.getByRole('form', { name: 'Umbuchung' }).waitFor();
  }

  /** Wählt in der Auswahl das Konto mit diesem Namen; gibt es keines (kein Tagesgeldkonto), bleibt die Vorbelegung stehen. */
  private async kontoWaehlen(page: Page, feld: string, konto: string) {
    const auswahl = page.getByRole('form', { name: 'Umbuchung' }).getByLabel(feld, { exact: true });
    const optionen = (await auswahl.locator('option').allInnerTexts()).map(sichtbar);
    const index = optionen.findIndex(o => o.startsWith(`${text(konto)} ·`));
    if (index >= 0) await auswahl.selectOption({ index });
  }

  @Step('Die Kundin erfasst Quellkonto <quelle>, Zielkonto <ziel> und Betrag <betrag>')
  public async umbuchungErfassen(quelle: string, ziel: string, betrag: string) {
    const page = await this.seite();
    await this.kontoWaehlen(page, 'Quellkonto', quelle);
    await this.kontoWaehlen(page, 'Zielkonto', ziel);
    await page.getByRole('form', { name: 'Umbuchung' }).getByLabel('Betrag in Euro').fill(text(betrag));
  }

  /** „2“ Mal: beide Klicks gehen an den Knopf, bevor die Seite wechselt (Doppelklick). */
  @Step('Die Kundin wählt „Umbuchen“ <anzahl> Mal')
  public async umbuchenWaehlen(anzahl: string) {
    const page = await this.seite();
    const maske = page.getByRole('form', { name: 'Umbuchung' });
    await maske.getByRole('button', { name: 'Umbuchen' }).click({ clickCount: Number(anzahl) });
    // Ergebnis abwarten: Die App wechselt selbst auf /finanzstatus oder meldet in der Maske.
    // Sonst sieht der nächste Step noch /umbuchung und startet parallel eine eigene Navigation.
    await Promise.race([
      page.waitForURL(url => url.pathname.startsWith('/finanzstatus'), { waitUntil: 'domcontentloaded' }),
      maske.getByRole('alert').waitFor(),
    ]).catch(() => { /* kein Ergebnis: die folgenden Steps prüfen und melden es */ });
  }

  @Step('Der Finanzstatus zeigt die Meldung <meldung>')
  public async finanzstatusMeldet(meldung: string) {
    const page = await this.seite();
    await page.getByRole('status').filter({ hasText: text(meldung) }).waitFor();
    await page.locator('.kontentabelle').waitFor();
  }

  @Step('Die Umbuchung zeigt die Meldung <meldung>')
  public async umbuchungMeldet(meldung: string) {
    const page = await this.seite();
    await page.getByRole('form', { name: 'Umbuchung' }).getByRole('alert').filter({ hasText: text(meldung) }).waitFor();
  }

  @Step('Der Knopf „Umbuchen“ ist freigegeben')
  public async umbuchenFreigegeben() {
    const page = await this.seite();
    const knopf = page.getByRole('form', { name: 'Umbuchung' }).getByRole('button', { name: 'Umbuchen' });
    await knopf.waitFor();
    assert.ok(await knopf.isEnabled(), 'Der Knopf „Umbuchen“ ist gesperrt');
  }

  @Step('Der Dienst antwortet auf die Umbuchung mit dem Status <status>')
  public async dienstAntwortetAufUmbuchung(status: string) {
    const page = await this.seite();
    await page.route('**/api/umbuchungen', route => route.fulfill({
      status: Number(status), contentType: 'application/json', body: JSON.stringify({ fehler: 'Interner Fehler.' }),
    }));
  }

  /** „<IBAN des Tagesgeldkontos von lena.hoffmann>“ → die IBAN dieses Kontos der angemeldeten Kundin; sonst die IBAN wörtlich. */
  private async umbuchungIban(wert: string): Promise<string> {
    const platzhalter = /^<IBAN des (\w+) von [\w.]+>$/.exec(text(wert).trim());
    if (!platzhalter) return text(wert).trim();
    const page = await this.seite();
    const { konten } = await (await page.context().request.get(`${basisUrl}/api/konten`)).json() as { konten: { kontoname: string; iban: string }[] };
    const name = platzhalter[1].replace(/s$/, ''); // Genitiv: „des Tagesgeldkontos“
    const konto = konten.find(k => k.kontoname === name);
    assert.ok(konto, `Die Kundin hat kein Konto „${name}“`);
    return konto.iban;
  }

  /** Ruft POST /api/umbuchungen mit der Sitzung der angemeldeten Kundin auf. */
  private async umbuchungAufrufen(quelle: string, ziel: string, betrag: string, auftragsId = `test-${Date.now()}-${Math.random().toString(16).slice(2)}`) {
    const page = await this.seite();
    return page.context().request.post(`${basisUrl}/api/umbuchungen`, {
      data: { auftragsId, quellIban: await this.umbuchungIban(quelle), zielIban: await this.umbuchungIban(ziel), betrag: StepImplementation.betrag(betrag), waehrung: 'EUR' },
    });
  }

  @Step('Die Schnittstelle lehnt die Umbuchung von der IBAN <quelle> auf die IBAN <ziel> über <betrag> mit dem Status <status> ab')
  public async umbuchungAbgelehnt(quelle: string, ziel: string, betrag: string, status: string) {
    const antwort = await this.umbuchungAufrufen(quelle, ziel, betrag);
    assert.strictEqual(antwort.status(), Number(status), `POST /api/umbuchungen: ${await antwort.text()}`);
  }

  @Step('Die Schnittstelle lehnt die Umbuchung von der IBAN <quelle> auf die IBAN <ziel> über <betrag> mit dem Status <status> und der Meldung <meldung> ab')
  public async umbuchungAbgelehntMitMeldung(quelle: string, ziel: string, betrag: string, status: string, meldung: string) {
    const antwort = await this.umbuchungAufrufen(quelle, ziel, betrag);
    const koerper = await antwort.text();
    assert.strictEqual(antwort.status(), Number(status), `POST /api/umbuchungen: ${koerper}`);
    assert.strictEqual((JSON.parse(koerper) as { fehler: string }).fehler, text(meldung));
  }

  @Step('Die Schnittstelle bucht von der IBAN <quelle> auf das Tagesgeldkonto über <betrag> mit derselben Auftrags-Kennung zweimal um und erhält die Status <erster> und <zweiter>')
  public async umbuchungZweimal(quelle: string, betrag: string, erster: string, zweiter: string) {
    const ziel = '<IBAN des Tagesgeldkontos von lena.hoffmann>';
    const kennung = `test-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ersteAntwort = await this.umbuchungAufrufen(quelle, ziel, betrag, kennung);
    assert.strictEqual(ersteAntwort.status(), Number(erster), `1. POST /api/umbuchungen: ${await ersteAntwort.text()}`);
    const zweiteAntwort = await this.umbuchungAufrufen(quelle, ziel, betrag, kennung);
    assert.strictEqual(zweiteAntwort.status(), Number(zweiter), `2. POST /api/umbuchungen: ${await zweiteAntwort.text()}`);
  }

  @Step('Die Umbuchung ist ohne Anmeldung nicht erreichbar, die Schnittstelle antwortet mit dem Status <status>')
  public async umbuchungOhneAnmeldung(status: string) {
    const page = await this.seite();
    await page.context().clearCookies();
    const api = await fetch(`${basisUrl}/api/umbuchungen`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auftragsId: 'ohne-anmeldung', quellIban: 'DE02500105175407324931', zielIban: 'DE97500105175407324947', betrag: 10 }),
    });
    assert.strictEqual(api.status, Number(status), 'POST /api/umbuchungen ohne Sitzung');
    await page.goto(`${basisUrl}/umbuchung`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }

  /* ---------------------------------------------------------------- UC-023 Persönliche Daten */

  /** Die Maske Persönliche Daten, fertig gezeichnet; ruft sie auf, wenn die Seite woanders steht. */
  private async datenSeite(): Promise<Page> {
    const page = await this.seite();
    if (new URL(page.url()).pathname !== '/persoenliche-daten') await page.goto(`${basisUrl}/persoenliche-daten`, { waitUntil: 'domcontentloaded' });
    await page.locator('.persoenlich').waitFor();
    return page;
  }

  /** UC-023 Schritt 1: „Persönliche Daten“ im Finanzstatus; ein erneutes Öffnen lädt die gespeicherten Daten. */
  @Step('Die Kundin öffnet die persönlichen Daten')
  public async datenOeffnen() {
    const page = await this.seite();
    if (new URL(page.url()).pathname === '/persoenliche-daten') {
      await page.goto(`${basisUrl}/finanzstatus`, { waitUntil: 'domcontentloaded' });
    }
    const kontentabelle = await this.kontentabelle();
    await kontentabelle.locator('#kopf-aktion').getByRole('link', { name: 'Persönliche Daten' }).click();
    await page.waitForURL(/\/persoenliche-daten$/);
    await page.locator('.persoenlich').waitFor();
  }

  @Step('Die persönlichen Daten zeigen bei <feld> den Wert <wert>')
  public async datenZeigenWert(feld: string, wert: string) {
    const page = await this.datenSeite();
    assert.strictEqual(await page.getByLabel(text(feld), { exact: true }).inputValue(), text(wert), `Feld „${feld}“`);
  }

  /** Trägt die Angaben ein, wählt „Speichern“ und wartet auf die neu gezeichnete Maske. */
  private async datenSpeichern(angaben: Record<string, string>, tan: string) {
    const page = await this.datenSeite();
    const form = page.getByRole('form', { name: 'Persönliche Daten ändern' });
    for (const [feld, wert] of Object.entries(angaben)) await form.getByLabel(feld, { exact: true }).fill(wert);
    await form.getByLabel('TAN', { exact: true }).fill(tan);
    await page.locator('.persoenlich').evaluate(e => e.setAttribute('data-alt', ''));
    await form.getByRole('button', { name: 'Speichern' }).click();
    await page.locator('.persoenlich:not([data-alt])').waitFor();
  }

  @Step('Die Kundin ändert in den persönlichen Daten <feld> auf <wert> und bestätigt mit der TAN <tan>')
  public async datenAendern(feld: string, wert: string, tan: string) {
    await this.datenSpeichern({ [text(feld)]: text(wert) }, text(tan));
  }

  @Step('Die Kundin ändert mehrere Angaben der persönlichen Daten und bestätigt mit der TAN <tan> <tabelle>')
  public async datenMehrereAendern(tan: string, tabelle: Table) {
    const angaben: Record<string, string> = {};
    for (const zeile of tabelle.getTableRows()) angaben[text(zeile.getCell('feld'))] = text(zeile.getCell('wert'));
    await this.datenSpeichern(angaben, text(tan));
  }

  @Step('Die persönlichen Daten zeigen die Meldung <meldung>')
  public async datenMelden(meldung: string) {
    const page = await this.datenSeite();
    await page.locator('.persoenlich > [role="status"], .persoenlich > [role="alert"]').filter({ hasText: text(meldung) }).waitFor();
  }

  /** Ändert per Aufruf nur die Postleitzahl; die übrigen Angaben sind die gespeicherten. */
  @Step('Die Änderung der persönlichen Daten mit Postleitzahl <plz> und TAN <tan> antwortet mit dem Status <status>')
  public async datenAendernAufruf(plz: string, tan: string, status: string) {
    const page = await this.seite();
    const anfrage = page.context().request;
    const aktuell = await (await anfrage.get(`${basisUrl}/api/kunde`)).json();
    const antwort = await anfrage.put(`${basisUrl}/api/kunde`, { data: { ...aktuell, postleitzahl: text(plz), tan: text(tan) } });
    assert.strictEqual(antwort.status(), Number(status), `PUT /api/kunde: ${await antwort.text()}`);
  }

  @Step('Der Aufruf <methode> <pfad> ohne Anmeldung antwortet mit dem Status <status>')
  public async aufrufOhneAnmeldung(methode: string, pfad: string, status: string) {
    const page = await this.seite();
    await page.context().clearCookies();
    const antwort = await fetch(`${basisUrl}${text(pfad)}`, {
      method: text(methode),
      ...(text(methode) === 'PUT' ? { headers: { 'Content-Type': 'application/json' }, body: '{}' } : {}),
    });
    assert.strictEqual(antwort.status, Number(status), `${methode} ${pfad} ohne Sitzung`);
  }

  @Step('Die persönlichen Daten sind ohne Anmeldung nicht erreichbar')
  public async datenOhneAnmeldung() {
    const page = await this.seite();
    await page.context().clearCookies();
    await page.goto(`${basisUrl}/persoenliche-daten`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/anmelden$/);
  }

  /** Postfachnachrichten der angemeldeten Kundin über die Testschnittstelle, älteste zuerst. */
  private async postfachNachrichten(): Promise<{ absender: string; betreff: string; text: string; versendetAm: string; gelesen: boolean }[]> {
    const page = await this.seite();
    const antwort = await page.context().request.get(`${basisUrl}/api/test/postfachnachrichten`);
    assert.strictEqual(antwort.status(), 200, 'GET /api/test/postfachnachrichten');
    return antwort.json();
  }

  @Step('Das Postfach der Kundin enthält <anzahl> Nachrichten')
  public async postfachEnthaeltAnzahl(anzahl: string) {
    assert.strictEqual((await this.postfachNachrichten()).length, Number(anzahl), 'Zahl der Nachrichten im Postfach');
  }

  @Step('Das Postfach der Kundin enthält die Nachricht <satz>')
  public async postfachEnthaeltNachricht(satz: string) {
    const alle = await this.postfachNachrichten();
    assert.ok(alle.some(n => n.text.includes(text(satz))), `Keine Nachricht mit „${satz}“, da sind: ${alle.map(n => n.text).join(' | ')}`);
  }

  private async neuesteNachricht() {
    const alle = await this.postfachNachrichten();
    assert.ok(alle.length > 0, 'Das Postfach ist leer');
    return alle[alle.length - 1];
  }

  @Step('Die neueste Nachricht im Postfach der Kundin ist ungelesen und hat den Betreff <betreff>')
  public async neuesteUngelesenMitBetreff(betreff: string) {
    const nachricht = await this.neuesteNachricht();
    assert.strictEqual(nachricht.gelesen, false, 'Lesestatus der neuesten Nachricht');
    assert.strictEqual(nachricht.betreff, text(betreff), 'Betreff der neuesten Nachricht');
  }

  @Step('Die neueste Nachricht im Postfach der Kundin hat den Text <inhalt>')
  public async neuesteMitText(inhalt: string) {
    assert.strictEqual((await this.neuesteNachricht()).text, text(inhalt), 'Text der neuesten Nachricht');
  }

  @Step('Die neueste Nachricht im Postfach der Kundin stammt von <absender> und wurde <tag> versendet')
  public async neuesteVonAm(absender: string, tag: string) {
    const nachricht = await this.neuesteNachricht();
    assert.strictEqual(nachricht.absender, text(absender), 'Absender der neuesten Nachricht');
    assert.strictEqual(nachricht.versendetAm, this.datum(tag), 'versendetAm der neuesten Nachricht');
  }
}
