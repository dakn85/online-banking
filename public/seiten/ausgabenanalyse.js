/* UC-019 Ausgabenanalyse des Girokontos: Monat wählen, Gesamtausgaben mit Verteilung, darunter die Kategorien als Balken.
   Maske: docs/ui/ausgabenanalyse.html (Inhalt und Namen). Die Prüfung des Monats macht der Dienst; die Seite zeigt seine Meldung (ADR-004). */
(function () {
  const { html, symbol } = Aventa;
  const prozent = wert => `${wert.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
  const laufenderMonat = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
  /** „2026-02“ um n Monate verschoben; was kein Monat ist, bleibt. */
  const verschoben = (monat, n) => {
    const m = /^(\d{4})-(\d{2})$/.exec(monat);
    if (!m) return monat;
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1 + n, 1));
    return d.toISOString().slice(0, 7);
  };
  const MONATSNAME = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const monatsname = monat => (/^\d{4}-(0[1-9]|1[0-2])$/.test(monat) ? MONATSNAME.format(new Date(`${monat}-01T00:00:00Z`)) : monat);

  Aventa.seite('/ausgabenanalyse', {
    titel: 'Ausgabenanalyse',
    async zeigen(flaeche, _kunde, parameter) {
      const { konten } = await Aventa.api('/api/konten');
      const gesucht = ((parameter && parameter.get('iban')) || '').replace(/\s+/g, '').toUpperCase();
      const konto = konten.find(k => k.iban === gesucht) || (gesucht ? null : konten.find(k => k.art === 'Girokonto'));
      const adresse = konto ? konto.iban : gesucht || '-';
      const start = (parameter && parameter.get('monat')) ?? laufenderMonat();
      flaeche.innerHTML = `<a class="zurueck" href="/finanzstatus">${symbol('zurueck', 16)}Finanzstatus</a>
        <div class="seite">
          <div class="kontokopf">
            ${konto ? `<div class="kontokopf__konto"><span class="konto__symbol">${symbol('analyse')}</span>
              <div><strong>${html(konto.kontoname)}</strong><span class="iban">${Aventa.iban(konto.iban)}</span></div></div>` : '<div></div>'}
            <form class="monatswahl" aria-label="Monatswahl" onsubmit="return false">
              <button type="button" class="symbolknopf" data-monat="-1" aria-label="Vormonat" title="Vormonat">${symbol('zurueck')}</button>
              <label class="feld"><span class="unsichtbar">Monat</span><input name="monat" placeholder="2026-02" autocomplete="off" value="${html(start)}" aria-label="Monat"></label>
              <button type="button" class="symbolknopf" data-monat="1" aria-label="Folgemonat" title="Folgemonat">${symbol('weiter')}</button>
            </form>
          </div>
          <section id="ausgaben-ergebnis" class="seite" aria-label="Ausgaben nach Kategorien" aria-live="polite"></section>
        </div>`;
      const ergebnis = flaeche.querySelector('#ausgaben-ergebnis');
      const form = flaeche.querySelector('form.monatswahl');

      let laufend = 0;
      async function laden() {
        const monat = form.monat.value.trim();
        const nummer = ++laufend;
        let inhalt;
        try {
          const a = await Aventa.api(`/api/konten/${encodeURIComponent(adresse)}/ausgabenanalyse?monat=${encodeURIComponent(monat)}`);
          const balken = a.kategorien.map((k, i) => `<span class="farbe-${Math.min(i, 6)}" style="width:${Math.max(k.anteil, 1)}%" title="${html(k.kategorie)} ${prozent(k.anteil)}"></span>`).join('');
          inhalt = `<div class="flaeche ausgaben__summe">
              <dl><div><dt>Gesamtausgaben im ${html(monatsname(monat))}</dt><dd class="zahl" data-feld="gesamtausgaben">${Aventa.euro(a.gesamtausgaben)}</dd></div></dl>
              ${a.kategorien.length ? `<div class="verteilung" aria-hidden="true">${balken}</div>` : ''}
            </div>`
            + (a.kategorien.length ? `<section class="flaeche" aria-label="Kategorien"><ul class="liste" data-felder="Kategorie|Summe|Anteil">${a.kategorien.map((k, i) => `<li data-zeile><div class="zeile">
                <span class="zeile__symbol" aria-hidden="true"><span class="punkt farbe-${Math.min(i, 6)}" style="width:12px;height:12px"></span></span>
                <div class="zeile__haupt"><span class="zeile__titel" data-feld="Kategorie">${html(k.kategorie)}</span>
                  <div class="kategorie__balken" aria-hidden="true"><span class="farbe-${Math.min(i, 6)}" style="width:${k.anteil}%"></span></div></div>
                <div class="zeile__wert"><span class="zeile__betrag zahl" data-feld="Summe">${Aventa.euro(k.summe)}</span><small data-feld="Anteil">${prozent(k.anteil)}</small></div>
                <span></span>
              </div></li>`).join('')}</ul></section>`
              : `<div class="flaeche leer">${symbol('analyse')}<strong data-feld="hinweis">Für diesen Monat gibt es keine Ausgaben.</strong></div>`);
        } catch (fehler) {
          if (![400, 404, 422].includes(fehler.status)) throw fehler;
          // A3 bis A5: nur die Meldung, keine Kategorien und kein Hinweis nach A2.
          inhalt = `<p class="meldung" role="alert">${html(fehler.message)}</p>`;
        }
        if (nummer !== laufend) return;
        ergebnis.innerHTML = inhalt;
        ergebnis.dataset.abfrage = monat;
      }

      let warten;
      form.addEventListener('input', () => { clearTimeout(warten); warten = setTimeout(laden, 250); });
      form.addEventListener('change', () => { clearTimeout(warten); laden(); });
      form.querySelectorAll('[data-monat]').forEach(k => k.addEventListener('click', () => {
        form.monat.value = verschoben(form.monat.value.trim(), Number(k.dataset.monat));
        laden();
      }));
      await laden();
    },
  });
})();
