/* UC-018 Debitkarte sperren und entsperren. Maske: docs/ui/debitkarte.html.
   Die Maske bietet die Aktionen immer an und prüft den Sperrgrund nicht vorab: Prüfung und Meldung kommen vom Dienst (BR-0081, ADR-004). */
(function () {
  const { html } = Aventa;
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
          flaeche.innerHTML = `<div class="seite debitkarte">${meldung}</div>`;
          return;
        }
        const gesperrt = karte.status !== 'aktiv';
        const endgueltig = karte.status === 'endgültig gesperrt';
        flaeche.innerHTML = `<a class="zurueck" href="/finanzstatus">${Aventa.symbol('zurueck', 16)}Finanzstatus</a>
        <div class="seite debitkarte">
          ${meldung}
          <div class="debitkarte__raster">
            <div class="debitkarte__links">
              <div class="karte${gesperrt ? ' karte--gesperrt' : ''}" aria-hidden="true">
                ${Marke.guilloche(380, 240)}
                <div class="karte__kopf"><span>Aventa Bank</span><span>Debit</span></div>
                <span class="karte__chip"></span>
                <div><p class="karte__nummer">${html(karte.kartennummerMaskiert)}</p>
                  <div class="karte__fuss"><span>${html(iban(konto))}</span></div></div>
                ${gesperrt ? `<span class="karte__siegel">${endgueltig ? 'Endgültig gesperrt' : 'Gesperrt'}</span>` : ''}
              </div>
              <div class="flaeche" style="padding:18px 20px">
                <dl class="werte">
                  <div><dt>Girokonto</dt><dd class="iban">${html(iban(konto))}</dd></div>
                  <div><dt>Kartennummer</dt><dd>${html(karte.kartennummerMaskiert)}</dd></div>
                  <div><dt>Status</dt><dd>${html(karte.status)}</dd></div>
                  ${karte.sperrgrund ? `<div><dt>Sperrgrund</dt><dd>${html(karte.sperrgrund)}</dd></div>` : ''}
                </dl>
              </div>
            </div>
            <div class="seite">
              <section class="formkarte" aria-labelledby="sperren-titel">
                <div class="formkarte__kopf"><div><h2 id="sperren-titel">Vorübergehend sperren</h2><p>Karte verlegt? Sperren Sie sie vorübergehend und geben Sie sie wieder frei, sobald Sie sie gefunden haben.</p></div></div>
                <div class="formkarte__aktionen" style="justify-content:flex-start" role="group" aria-label="Aktionen">
                  <button class="knopf" type="button" data-aktion="sperren">${Aventa.symbol('schloss', 18)}Vorübergehend sperren</button>
                  <button class="knopf" type="button" data-aktion="entsperren">${Aventa.symbol('offen', 18)}Entsperren</button>
                </div>
              </section>
              <form class="formkarte gefahrzone" aria-label="Endgültig sperren" novalidate>
                <div class="formkarte__kopf"><div><h2>Endgültig sperren</h2><p>Bei Verlust oder Diebstahl. Eine endgültig gesperrte Karte lässt sich nicht wieder freigeben.</p></div></div>
                <div class="feld"><label for="sperrgrund">Grund der endgültigen Sperre</label>
                  <select id="sperrgrund" name="sperrgrund">
                    <option value=""${grund === '' ? ' selected' : ''}></option>
                    <option${grund === 'Verlust' ? ' selected' : ''}>Verlust</option>
                    <option${grund === 'Diebstahl' ? ' selected' : ''}>Diebstahl</option>
                  </select></div>
                <div class="formkarte__aktionen"><button class="knopf knopf--gefahr" type="submit">Endgültig sperren</button></div>
              </form>
            </div>
          </div>
          ${abfrage ? Aventa.rueckfrage({ frage: 'Debitkarte endgültig sperren?', text: grund ? `Grund: ${grund}. Die Karte lässt sich danach nicht wieder freigeben.` : 'Die Karte lässt sich danach nicht wieder freigeben.', nein: 'Abbrechen', ja: 'Bestätigen' }) : ''}
        </div>`;
        const frage = flaeche.querySelector('#rueckfrage');
        if (frage) {
          Aventa.oeffnen(frage);
          frage.querySelector('[data-nein]').addEventListener('click', () => aktion('abbrechen'));
          frage.addEventListener('cancel', e => { e.preventDefault(); aktion('abbrechen'); });
          frage.querySelector('[data-ja]').addEventListener('click', () => aktion('bestaetigen'));
        }
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
