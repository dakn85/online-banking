/* UC-019 Ausgabenanalyse des Girokontos: Konto, Monat, darunter Gesamtausgaben und Kategorien. Maske: docs/ui/ausgabenanalyse.html
   Die Prüfung des Monats macht der Dienst; die Seite zeigt seine Meldung (ADR-004). */
(function () {
  const iban = wert => wert.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const prozent = wert => `${wert.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`;
  const laufenderMonat = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };

  Aventa.seite('/ausgabenanalyse', {
    titel: 'Ausgabenanalyse',
    async zeigen(flaeche, _kunde, parameter) {
      document.querySelector('.navigation a[data-seite="/finanzstatus"]')?.setAttribute('aria-current', 'page');
      const { konten } = await Aventa.api('/api/konten');
      const gesucht = ((parameter && parameter.get('iban')) || '').replace(/\s+/g, '').toUpperCase();
      const konto = konten.find(k => k.iban === gesucht) || (gesucht ? null : konten.find(k => k.art === 'Girokonto'));
      const adresse = konto ? konto.iban : gesucht || '-';
      const start = (parameter && parameter.get('monat')) ?? laufenderMonat();
      flaeche.innerHTML = `
        <p class="zurueck"><a href="/finanzstatus">← Finanzstatus</a></p>
        ${konto ? `<dl class="kontokopf">
          <div><dt>Konto</dt><dd>${html(konto.kontoname)}</dd></div>
          <div><dt>IBAN</dt><dd class="iban">${iban(konto.iban)}</dd></div>
        </dl>` : ''}
        <form class="filter" aria-label="Monat" onsubmit="return false">
          <label class="feld"><span>Monat</span><input name="monat" placeholder="2026-02" autocomplete="off" value="${html(start)}"></label>
        </form>
        <section id="ausgaben-ergebnis" class="umsaetze" aria-label="Ausgaben nach Kategorien" aria-live="polite"></section>`;
      const ergebnis = flaeche.querySelector('#ausgaben-ergebnis');
      const form = flaeche.querySelector('form.filter');

      let laufend = 0;
      async function laden() {
        const monat = form.monat.value.trim();
        const nummer = ++laufend;
        let inhalt;
        try {
          const a = await Aventa.api(`/api/konten/${encodeURIComponent(adresse)}/ausgabenanalyse?monat=${encodeURIComponent(monat)}`);
          inhalt = `<dl class="kontokopf"><div><dt>Gesamtausgaben</dt><dd data-feld="gesamtausgaben">${Aventa.euro(a.gesamtausgaben)}</dd></div></dl>`
            + (a.kategorien.length ? `<table class="umsatztabelle">
              <caption class="unsichtbar">Ausgaben ${html(konto ? konto.kontoname : '')} nach Kategorien</caption>
              <thead><tr><th scope="col">Kategorie</th><th scope="col" class="zahl">Summe</th><th scope="col" class="zahl">Anteil</th></tr></thead>
              <tbody>${a.kategorien.map(k => `<tr><td>${html(k.kategorie)}</td><td class="zahl">${Aventa.euro(k.summe)}</td><td class="zahl">${prozent(k.anteil)}</td></tr>`).join('')}</tbody>
            </table>` : `<p class="leer" data-feld="hinweis">Für diesen Monat gibt es keine Ausgaben.</p>`);
        } catch (fehler) {
          if (![400, 404, 422].includes(fehler.status)) throw fehler;
          // A3 bis A5: nur die Meldung, keine Tabelle und kein Hinweis nach A2.
          inhalt = `<p class="meldung" role="alert">${html(fehler.message)}</p>`;
        }
        if (nummer !== laufend) return;
        ergebnis.innerHTML = inhalt;
        ergebnis.dataset.abfrage = monat;
      }

      let warten;
      form.addEventListener('input', () => { clearTimeout(warten); warten = setTimeout(laden, 250); });
      form.addEventListener('change', () => { clearTimeout(warten); laden(); });
      await laden();
    },
  });
})();
