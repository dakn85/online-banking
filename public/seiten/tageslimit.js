/* UC-015 Tageslimit für Überweisungen festlegen: aktuelles Tageslimit und Standardlimit zeigen, neues Limit speichern.
   Maske: docs/ui/tageslimit.html. Die Seite prüft vorab (ADR-004), maßgeblich ist der Dienst (BR-0070). */
(function () {
  const FEHLER = 'Das Tageslimit muss zwischen 0,00 EUR und 5.000,00 EUR liegen.';
  const { html } = Aventa;

  /** „1.000,00 €“ → 1000; null, wenn es kein Betrag mit höchstens zwei Nachkommastellen ist. */
  function alsBetrag(text) {
    const t = text.replace(/[\s €]/g, '');
    if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(t)) return null;
    return Number(t.replace(/\./g, '').replace(',', '.'));
  }

  Aventa.seite('/tageslimit', {
    titel: 'Tageslimit',
    async zeigen(flaeche) {
      let stand = await Aventa.api('/api/tageslimit');
      // Nach einer Ablehnung bleibt die Eingabe stehen (UC-015 A1).
      let eingabe = '';

      function zeigen({ erfolg = '', fehler = '' } = {}) {
        const anteil = stand.standardlimit ? Math.min(100, Math.round(stand.tageslimit / stand.standardlimit * 100)) : 0;
        flaeche.innerHTML = `<div class="seite tageslimit">
          ${Aventa.meldungen({ erfolg, fehler })}
          <div class="formseite">
            <form class="formkarte" novalidate aria-label="Tageslimit ändern">
              <div class="formkarte__kopf"><div><h2>Tageslimit ändern</h2><p>Höchstbetrag Ihrer Überweisungen je Kalendertag.</p></div></div>
              <div class="feld feld--betrag${fehler ? ' feld--fehler' : ''}"><label for="tageslimit">Neues Tageslimit in Euro</label>
                <input id="tageslimit" name="tageslimit" inputmode="decimal" autocomplete="off" placeholder="1.000,00" value="${html(eingabe)}"${fehler ? ' aria-invalid="true"' : ''}>
                <p class="hinweis">Von 0,00 € bis ${Aventa.euro(stand.standardlimit)}; 0,00 € sperrt alle Überweisungen.</p></div>
              <div class="formkarte__aktionen"><button class="knopf knopf--haupt" type="submit">Speichern</button></div>
            </form>
            <aside class="seitenkarte" aria-label="Ihr Tageslimit">
              <div><p class="seitenkarte__titel">Je Kalendertag</p><p class="seitenkarte__name">Tageslimit für Überweisungen</p></div>
              <div class="messung" aria-hidden="true"><div class="messung__balken"><span style="width:${anteil}%"></span></div>
                <div class="messung__skala"><span>0 €</span><span>${anteil} % des Standardlimits</span></div></div>
              <dl class="werte werte--gross"><div><dt>Aktuelles Tageslimit</dt><dd id="aktuelles-tageslimit">${Aventa.euro(stand.tageslimit)}</dd></div>
                  <div><dt>Standardlimit</dt><dd id="standardlimit">${Aventa.euro(stand.standardlimit)}</dd></div></dl>
            </aside>
          </div>
        </div>`;
        const form = flaeche.querySelector('form');
        form.addEventListener('submit', e => { e.preventDefault(); speichern(form.tageslimit.value.trim()); });
        if (fehler) form.tageslimit.focus();
      }

      async function speichern(text) {
        eingabe = text;
        const betrag = alsBetrag(text);
        if (betrag === null || Math.round(betrag * 100) > Math.round(stand.standardlimit * 100)) return zeigen({ fehler: FEHLER });
        try {
          stand = await Aventa.api('/api/tageslimit', { method: 'PUT', body: JSON.stringify({ tageslimit: betrag }) });
          eingabe = '';
          zeigen({ erfolg: 'Tageslimit gespeichert.' });
        } catch (fehler) {
          zeigen({ fehler: fehler.status === 400 ? FEHLER : fehler.message });
        }
      }

      zeigen();
    },
  });
})();
