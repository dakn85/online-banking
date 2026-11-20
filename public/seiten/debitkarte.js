/* UC-018 Debitkarte sperren und entsperren. Maske: docs/ui/debitkarte.html.
   Die Maske bietet die Aktionen immer an und prüft den Sperrgrund nicht vorab: Prüfung und Meldung kommen vom Dienst (BR-0081, ADR-004). */
(function () {
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const iban = wert => wert.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();

  Aventa.seite('/debitkarte', {
    titel: 'Debitkarte',
    async zeigen(flaeche, _kunde, parameter) {
      let konto = parameter && parameter.get('iban');
      if (!konto) {
        const status = await Aventa.api('/api/konten');
        const giro = status.konten.find(k => k.art === 'Girokonto');
        konto = giro ? giro.iban : '';
      }
      const adresse = `/api/konten/${encodeURIComponent(konto)}/debitkarte`;
      let karte = null;
      // Auswahl des Sperrgrunds bleibt zwischen Sicherheitsabfrage und Formular erhalten.
      let grund = '';

      function zeigen({ erfolg = '', fehler = '', abfrage = false } = {}) {
        const meldung = (erfolg ? `<p class="meldung meldung--erfolg" role="status">${html(erfolg)}</p>` : '')
          + (fehler ? `<p class="meldung meldung--fehler" role="alert">${html(fehler)}</p>` : '');
        if (!karte) {
          flaeche.innerHTML = `<div class="debitkarte">${meldung}</div>`;
          return;
        }
        flaeche.innerHTML = `<div class="debitkarte">
          ${meldung}
          <div class="ueberweisung__raster">
            <div class="ueberweisung__form">
              <div><h2>Debitkarte</h2><p class="ueberweisung__unter">Debitkarte zu Ihrem Girokonto sperren und entsperren.</p></div>
              <div class="ueberweisung__aktionen" role="group" aria-label="Aktionen">
                <button class="knopf knopf--klein" type="button" data-aktion="sperren">Vorübergehend sperren</button>
                <button class="knopf knopf--klein" type="button" data-aktion="entsperren">Entsperren</button>
              </div>
              ${abfrage ? `<section role="group" aria-label="Sicherheitsabfrage">
                  <h2>Sicherheitsabfrage</h2>
                  <p class="meldung" role="status">Debitkarte endgültig sperren?</p>
                  <div class="ueberweisung__aktionen">
                    <button class="knopf knopf--haupt" type="button" data-aktion="bestaetigen">Bestätigen</button>
                    <button class="knopf knopf--klein" type="button" data-aktion="abbrechen">Abbrechen</button>
                  </div>
                </section>`
              : `<form role="form" aria-label="Endgültig sperren" novalidate>
                  <h2>Endgültig sperren</h2>
                  <div class="feld"><label for="sperrgrund">Grund der endgültigen Sperre</label>
                    <select id="sperrgrund" name="sperrgrund">
                      <option value=""${grund === '' ? ' selected' : ''}></option>
                      <option${grund === 'Verlust' ? ' selected' : ''}>Verlust</option>
                      <option${grund === 'Diebstahl' ? ' selected' : ''}>Diebstahl</option>
                    </select></div>
                  <div class="ueberweisung__aktionen"><button class="knopf knopf--haupt" type="submit">Endgültig sperren</button></div>
                </form>`}
            </div>
            <aside class="ueberweisung__konto" aria-label="Ihre Debitkarte">
              <p class="ueberweisung__klein">Debitkarte</p>
              <dl>
                <div><dt>Girokonto</dt><dd>${html(iban(konto))}</dd></div>
                <div><dt>Kartennummer</dt><dd>${html(karte.kartennummerMaskiert)}</dd></div>
                <div><dt>Status</dt><dd>${html(karte.status)}</dd></div>
                ${karte.sperrgrund ? `<div><dt>Sperrgrund</dt><dd>${html(karte.sperrgrund)}</dd></div>` : ''}
              </dl>
            </aside>
          </div>
        </div>`;
        flaeche.querySelectorAll('[data-aktion]').forEach(b => b.addEventListener('click', () => aktion(b.dataset.aktion)));
        const form = flaeche.querySelector('form');
        if (form) form.addEventListener('submit', e => {
          e.preventDefault();
          grund = form.sperrgrund.value;
          zeigen({ abfrage: true });
        });
      }

      async function setzen(status, sperrgrund) {
        const body = { status };
        if (sperrgrund !== undefined) body.sperrgrund = sperrgrund;
        return Aventa.api(adresse, { method: 'PUT', body: JSON.stringify(body) });
      }

      async function aktion(name) {
        if (name === 'abbrechen') return zeigen();
        try {
          if (name === 'sperren') {
            karte = await setzen('vorübergehend gesperrt');
            zeigen({ erfolg: 'Die Debitkarte ist vorübergehend gesperrt.' });
          } else if (name === 'entsperren') {
            karte = await setzen('aktiv');
            zeigen({ erfolg: 'Die Debitkarte ist wieder aktiv.' });
          } else if (name === 'bestaetigen') {
            karte = await setzen('endgültig gesperrt', grund);
            zeigen({ erfolg: `Die Debitkarte ist endgültig gesperrt. Grund: ${karte.sperrgrund}.` });
          }
        } catch (fehler) {
          if (!fehler.status) throw fehler;
          if (name === 'bestaetigen') grund = fehler.status === 400 ? '' : grund;
          zeigen({ fehler: fehler.message });
        }
      }

      try {
        karte = await Aventa.api(adresse);
        zeigen();
      } catch (fehler) {
        if (fehler.status !== 404) throw fehler;
        karte = null;
        zeigen({ fehler: fehler.message });
      }
    },
  });
})();
