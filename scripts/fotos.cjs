/* Fotos aller Seiten für die Sichtprüfung (.claude/skills/oberflaeche/SKILL.md): Desktop 1440×900 und Telefon 390×844.
   Aufruf: node scripts/fotos.cjs <basis-url> <ausgabeordner>; der Dienst läuft mit TEST_MODE=1 (setzt die Testdaten zurück). */
const { join } = require('path');
const { mkdirSync } = require('fs');
const { chromium } = require(join(__dirname, '..', 'acceptance', 'node_modules', 'playwright'));

const [basis = 'http://localhost:18300', ziel = 'fotos'] = process.argv.slice(2);
const SEITEN = ['finanzstatus', 'umsaetze?iban=DE02500105175407324911', 'ausgabenanalyse?iban=DE02500105175407324911&monat=2026-02',
  'debitkarte', 'kontoauszug', 'ueberweisung', 'umbuchung', 'dauerauftraege', 'empfaengervorlagen', 'vorgemerkte-ueberweisungen',
  'postfach', 'tageslimit', 'persoenliche-daten'];
const inTagen = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

(async () => {
  mkdirSync(ziel, { recursive: true });
  const browser = await chromium.launch();
  for (const [geraet, viewport] of [['desktop', { width: 1440, height: 900 }], ['telefon', { width: 390, height: 844 }]]) {
    await fetch(`${basis}/api/test/reset`, { method: 'POST' });
    const seite = await browser.newPage({ viewport, locale: 'de-DE' });
    await seite.goto(`${basis}/anmelden`);
    await seite.screenshot({ path: join(ziel, `${geraet}-anmelden.png`) });
    await seite.getByLabel('Kennung').fill('lena.hoffmann');
    await seite.getByLabel('PIN').fill('24680');
    await seite.getByRole('button', { name: 'Anmelden' }).click();
    await seite.waitForURL(/finanzstatus/);
    // Ein Dauerauftrag und eine Vorlage, damit die Listen etwas zeigen.
    await seite.request.post(`${basis}/api/dauerauftraege`, { data: { empfaenger: 'Hausverwaltung Berger', empfaengerIban: 'DE89370400440532013000', betrag: 950, verwendungszweck: 'Miete', turnus: 'monatlich', ersterAusfuehrungstag: inTagen(10) } });
    await seite.request.post(`${basis}/api/empfaengervorlagen`, { data: { name: 'Hausverwaltung Berger', empfaengerIban: 'DE89370400440532013000', verwendungszweck: 'Miete' } });
    for (const pfad of SEITEN) {
      await seite.goto(`${basis}/${pfad}`);
      await seite.waitForLoadState('networkidle');
      await seite.screenshot({ path: join(ziel, `${geraet}-${pfad.split('?')[0]}.png`), fullPage: true });
    }
    // UC-003: eine Notiz in der Zeile und das Blatt „Notiz zum Umsatz“.
    await seite.goto(`${basis}/umsaetze?iban=DE02500105175407324911`);
    await seite.getByRole('button', { name: 'Notiz erfassen' }).first().click();
    await seite.getByLabel('Notiz', { exact: true }).fill('Beitrag prüfen');
    await seite.getByRole('button', { name: 'Speichern' }).click();
    await seite.getByRole('button', { name: 'Notiz ändern' }).click();
    await seite.locator('#blatt-notiz').evaluate(blatt => Promise.all(blatt.getAnimations().map(a => a.finished)));
    await seite.screenshot({ path: join(ziel, `${geraet}-notiz.png`) });
    await seite.goto(`${basis}/dauerauftraege`);
    await seite.locator('#neuer-dauerauftrag').click();
    await seite.screenshot({ path: join(ziel, `${geraet}-blatt.png`) });
    await seite.goto(`${basis}/postfach`);
    await seite.locator('[data-oeffnen]').first().click();
    await seite.waitForLoadState('networkidle');
    await seite.screenshot({ path: join(ziel, `${geraet}-postfach-offen.png`), fullPage: true });
    await seite.locator('.liste [data-loeschen]').first().click();
    await seite.screenshot({ path: join(ziel, `${geraet}-rueckfrage.png`) });
    await seite.close();
  }
  await browser.close();
  console.log(`Fotos in ${ziel}`);
})().catch(fehler => { console.error(fehler.message); process.exit(1); });
