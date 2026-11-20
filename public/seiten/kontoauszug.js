/* UC-024 Kontoauszug als PDF: Konto und Monat wählen, den Auszug herunterladen. Maske: docs/ui/kontoauszug.html
   Konto und Monat prüft der Dienst; die Maske zeigt seine Meldung bei 400 und 404 (ADR-004), sonst die feste Meldung aus A5. */
(function () {
  const iban = wert => wert.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const laufenderMonat = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
  const fehlgeschlagen = 'Der Kontoauszug konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.';

  Aventa.seite('/kontoauszug', {
    titel: 'Kontoauszug',
    async zeigen(flaeche, _kunde, parameter) {
      document.querySelector('.navigation a[data-seite="/finanzstatus"]')?.setAttribute('aria-current', 'page');
      const { konten } = await Aventa.api('/api/konten');
      const gesucht = ((parameter && parameter.get('iban')) || '').replace(/\s+/g, '').toUpperCase();
      // Eine IBAN der Adresse bleibt Auswahl, auch wenn sie keinem Konto der Kundin gehört; der Dienst lehnt sie ab (A3).
      const auswahl = konten.map(k => ({ iban: k.iban, text: `${k.kontoname} (${iban(k.iban)})` }));
      if (gesucht && !konten.some(k => k.iban === gesucht)) auswahl.unshift({ iban: gesucht, text: iban(gesucht) });
      const vorgewaehlt = gesucht || (konten.find(k => k.art === 'Girokonto') || konten[0] || {}).iban;
      flaeche.innerHTML = `
        <p class="zurueck"><a href="/umsaetze${vorgewaehlt ? `?iban=${encodeURIComponent(vorgewaehlt)}` : ''}">← Umsätze</a></p>
        <form class="filter" aria-label="Kontoauszug" onsubmit="return false">
          <label class="feld"><span>Konto</span><select name="konto">${auswahl.map(a => `<option value="${html(a.iban)}"${a.iban === vorgewaehlt ? ' selected' : ''}>${html(a.text)}</option>`).join('')}</select></label>
          <label class="feld"><span>Monat</span><input name="monat" placeholder="2026-02" autocomplete="off" value="${laufenderMonat()}"></label>
          <div class="aktionen"><button type="submit" class="knopf" id="kontoauszug-laden">Kontoauszug herunterladen</button></div>
        </form>
        <section id="kontoauszug-meldung" aria-live="polite"></section>`;
      const form = flaeche.querySelector('form');
      const meldung = flaeche.querySelector('#kontoauszug-meldung');
      const zeigen = text => { meldung.innerHTML = text ? `<p class="meldung" role="alert">${html(text)}</p>` : ''; };

      async function herunterladen() {
        const konto = form.konto.value;
        const monat = form.monat.value.trim();
        zeigen('');
        try {
          const antwort = await fetch(`/api/konten/${encodeURIComponent(konto)}/kontoauszug?monat=${encodeURIComponent(monat)}`);
          if (antwort.status === 401) { location.href = '/anmelden'; return; }
          if (antwort.ok) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(await antwort.blob());
            link.download = `Kontoauszug_${konto}_${monat}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
          } else if (antwort.status === 400 || antwort.status === 404) {
            zeigen(((await antwort.json().catch(() => null)) || {}).fehler || fehlgeschlagen);
          } else {
            zeigen(fehlgeschlagen);
          }
        } catch {
          zeigen(fehlgeschlagen);
        }
      }
      form.addEventListener('submit', herunterladen);
    },
  });
})();
