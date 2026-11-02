/* UC-003 Umsätze eines Kontos: Konto, Suche und Filter, darunter die Umsätze, neueste zuerst. Maske: docs/ui/umsaetze.html */
(function () {
  const iban = wert => wert.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
  const datum = wert => new Date(`${wert}T00:00:00Z`).toLocaleDateString('de-DE', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
  const html = wert => String(wert).replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);

  /** Die Abfrage in fester Reihenfolge; ein leerer Filter fehlt (BR-0010). Das Ergebnis trägt sie als data-abfrage. */
  function abfrage(form) {
    const p = new URLSearchParams();
    const suchtext = form.suchtext.value.trim();
    if (suchtext) p.set('suchtext', suchtext);
    if (form.zeitraumVon.value) p.set('von', form.zeitraumVon.value);
    if (form.zeitraumBis.value) p.set('bis', form.zeitraumBis.value);
    if (form.richtung.value !== 'alle') p.set('richtung', form.richtung.value);
    return p.toString();
  }

  Aventa.seite('/umsaetze', {
    titel: 'Umsätze',
    async zeigen(flaeche, _kunde, parameter) {
      const gesucht = (parameter && parameter.get('iban') || '').replace(/\s+/g, '').toUpperCase();
      document.querySelector('.navigation a[data-seite="/finanzstatus"]')?.setAttribute('aria-current', 'page');
      const { konten } = await Aventa.api('/api/konten');
      const konto = konten.find(k => k.iban === gesucht);
      flaeche.innerHTML = `
        <p class="zurueck"><a href="/finanzstatus">← Finanzstatus</a></p>
        ${konto ? `<dl class="kontokopf">
          <div><dt>Konto</dt><dd>${html(konto.kontoname)}</dd></div>
          <div><dt>IBAN</dt><dd class="iban">${iban(konto.iban)}</dd></div>
        </dl>
        <form class="filter" aria-label="Filter" onsubmit="return false">
          <label class="feld"><span>Suche</span><input name="suchtext" type="search" placeholder="Gegenpartei oder Verwendungszweck" autocomplete="off"></label>
          <label class="feld"><span>Zeitraum von</span><input name="zeitraumVon" type="date"></label>
          <label class="feld"><span>Zeitraum bis</span><input name="zeitraumBis" type="date"></label>
          <label class="feld"><span>Ein-/Ausgang</span><select name="richtung"><option value="alle">Alle</option><option value="eingang">Eingang</option><option value="ausgang">Ausgang</option></select></label>
        </form>` : ''}
        <section id="umsaetze-ergebnis" class="umsaetze" aria-label="Umsätze" aria-live="polite"></section>`;
      const ergebnis = flaeche.querySelector('#umsaetze-ergebnis');
      const form = flaeche.querySelector('form.filter');

      let laufend = 0;
      async function laden() {
        const q = form ? abfrage(form) : '';
        const nummer = ++laufend;
        let inhalt;
        try {
          const { umsaetze } = await Aventa.api(`/api/konten/${encodeURIComponent(gesucht || '-')}/umsaetze${q ? `?${q}` : ''}`);
          inhalt = umsaetze.length ? `<table class="umsatztabelle">
              <caption class="unsichtbar">Umsätze ${html(konto ? konto.kontoname : '')}</caption>
              <thead><tr><th scope="col">Buchungstag</th><th scope="col">Gegenpartei</th><th scope="col">Verwendungszweck</th><th scope="col" class="zahl">Betrag</th><th scope="col" class="zahl">Saldo danach</th></tr></thead>
              <tbody>${umsaetze.map(u => `<tr>
                <td>${datum(u.buchungstag)}</td><td>${html(u.gegenpartei)}</td><td class="leise">${html(u.verwendungszweck)}</td>
                <td class="zahl${u.betrag < 0 ? ' minus' : ' plus'}">${Aventa.euro(u.betrag)}</td><td class="zahl">${Aventa.euro(u.saldoDanach)}</td>
              </tr>`).join('')}</tbody>
            </table>`
            : `<p class="leer">Für diese Auswahl gibt es keine Umsätze.</p>`;
        } catch (fehler) {
          if (fehler.status !== 400 && fehler.status !== 404) throw fehler;
          // A3 und A4: nur die Meldung, keine Tabelle und kein Hinweis nach A2.
          inhalt = `<p class="meldung" role="alert">${html(fehler.message)}</p>`;
        }
        if (nummer !== laufend) return;
        ergebnis.innerHTML = inhalt;
        ergebnis.dataset.abfrage = q;
      }

      if (form) {
        let warten;
        form.addEventListener('input', () => { clearTimeout(warten); warten = setTimeout(laden, 250); });
        form.addEventListener('change', () => { clearTimeout(warten); laden(); });
      }
      await laden();
    },
  });
})();
