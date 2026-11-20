/* UC-020 Postfach der Bank: Nachrichten links, die geöffnete rechts (Öffnen = Klick auf die Nachricht, BR-0087),
   Löschen an der Zeile nach Sicherheitsabfrage. Maske: docs/ui/postfach.html (Inhalt und Namen).
   Die Regeln prüft der Dienst (BR-0085 bis BR-0087); die Zahl in der Navigation setzt Aventa.postfachZahl (BR-0086). */
(function () {
  const { html, symbol } = Aventa;

  Aventa.seite('/postfach', {
    titel: 'Postfach',
    async zeigen(flaeche) {
      let liste = { nachrichten: [], anzahlUngelesen: 0 };
      let geoeffnet = null; // { nachrichtId, text, betreff, absender, versendetAm }
      let loeschenId = '';

      const zeile = n => `<li data-zeile data-nachricht="${html(n.nachrichtId)}"><div class="zeile${n.gelesen ? '' : ' zeile--ungelesen'}${geoeffnet && geoeffnet.nachrichtId === n.nachrichtId ? ' zeile--offen' : ''}">
          <button type="button" class="zeile__oeffnen" data-oeffnen="${html(n.nachrichtId)}"><span class="unsichtbar">Öffnen: ${html(n.betreff)}</span></button>
          <span class="zeile__symbol zeile__symbol--tanne" aria-hidden="true">${html(Aventa.kuerzel(n.absender))}</span>
          <div class="zeile__haupt">
            <span class="zeile__unter" data-feld="Absender">${html(n.absender)}</span>
            <span class="zeile__titel" data-feld="Betreff">${html(n.betreff)}</span>
            <span class="zeile__meta"><span data-feld="Datum">${Aventa.datum(n.versendetAm)}</span>
              ${n.gelesen ? '<span data-feld="Status">gelesen</span>' : '<span class="etikett etikett--messing"><span class="punkt"></span><span data-feld="Status">ungelesen</span></span>'}</span>
          </div>
          <span></span>
          <div class="zeile__aktionen"><button type="button" class="symbolknopf symbolknopf--gefahr" data-loeschen="${html(n.nachrichtId)}" aria-label="Löschen" title="Löschen">${symbol('muell')}</button></div>
        </div></li>`;

      function zeigen({ erfolg = '', fehler = '', abfrage = false } = {}) {
        const leer = !liste.nachrichten.length;
        const zuLoeschen = liste.nachrichten.find(n => n.nachrichtId === loeschenId);
        flaeche.innerHTML = `<div class="seite postfach">
          ${Aventa.meldungen({ erfolg, fehler })}
          <div class="abschnitt__kopf"><h2>Ihre Nachrichten</h2>
            <span class="zusatz">Ungelesen <strong id="postfach-ungelesen">${liste.anzahlUngelesen}</strong></span></div>
          ${leer ? `<div class="flaeche leer">${symbol('postfach')}<strong role="status">Keine Nachrichten.</strong>Neue Nachrichten der Bank erscheinen hier.</div>` : `
          <div class="postfach__raster">
            <section class="flaeche postfach__liste" aria-label="Nachrichten"><ul class="liste" data-felder="Absender|Betreff|Datum|Status">${liste.nachrichten.map(zeile).join('')}</ul></section>
            ${geoeffnet ? `<article class="flaeche lesen" aria-labelledby="lesen-betreff">
              <div class="lesen__kopf"><div>
                <h2 id="lesen-betreff">${html(geoeffnet.betreff)}</h2>
                <p class="lesen__von"><span class="zeile__symbol zeile__symbol--tanne" aria-hidden="true">${html(Aventa.kuerzel(geoeffnet.absender))}</span><span><strong>${html(geoeffnet.absender)}</strong><br>${Aventa.datum(geoeffnet.versendetAm)}</span></p>
              </div>
              <button type="button" class="symbolknopf symbolknopf--gefahr" data-loeschen="${html(geoeffnet.nachrichtId)}" aria-label="Nachricht löschen" title="Löschen">${symbol('muell')}</button></div>
              <div id="nachrichtText">${html(geoeffnet.text)}</div>
            </article>` : `<div class="flaeche lesen lesen--leer">${symbol('postfach', 28)}<p>Wählen Sie eine Nachricht, um sie zu lesen.</p></div>`}
          </div>`}
          ${abfrage && zuLoeschen ? Aventa.rueckfrage({ frage: 'Nachricht löschen?', text: `„${zuLoeschen.betreff}“ wird endgültig entfernt.` }) : ''}
        </div>`;
        verdrahten();
      }

      /** Lädt die Liste neu und setzt die Zahl in der Navigation. */
      async function laden() {
        liste = await Aventa.api('/api/nachrichten');
        Aventa.postfachZahl(liste.anzahlUngelesen);
      }

      /** UC-020 A4, A5: bei 400 oder 404 ändert der Dienst nichts; die Seite zeigt Liste und Zahl neu. */
      async function fehlerbehandeln(fehler) {
        if (fehler.status === 400 || fehler.status === 404) await laden();
        zeigen({ fehler: fehler.message });
      }

      function verdrahten() {
        flaeche.querySelectorAll('[data-oeffnen]').forEach(k => k.addEventListener('click', async () => {
          const id = k.dataset.oeffnen;
          try {
            const nachricht = await Aventa.api(`/api/nachrichten/${encodeURIComponent(id)}`, { method: 'PATCH' });
            await laden();
            geoeffnet = { ...liste.nachrichten.find(n => n.nachrichtId === id), ...nachricht, nachrichtId: id };
            zeigen();
          } catch (fehler) { geoeffnet = null; await fehlerbehandeln(fehler); }
        }));
        flaeche.querySelectorAll('[data-loeschen]').forEach(k => k.addEventListener('click', () => {
          loeschenId = k.dataset.loeschen;
          zeigen({ abfrage: true });
        }));
        // UC-020 A2: „Nein“ lässt alles unverändert und zeigt die Nachrichten ohne Meldung.
        const frage = flaeche.querySelector('#rueckfrage');
        if (!frage) return;
        Aventa.oeffnen(frage);
        frage.querySelector('[data-nein]').addEventListener('click', () => zeigen());
        frage.addEventListener('cancel', e => { e.preventDefault(); zeigen(); });
        frage.querySelector('[data-ja]').addEventListener('click', async () => {
          try {
            await Aventa.api(`/api/nachrichten/${encodeURIComponent(loeschenId)}`, { method: 'DELETE' });
            if (geoeffnet && loeschenId === geoeffnet.nachrichtId) geoeffnet = null;
            loeschenId = '';
            await laden();
            zeigen({ erfolg: 'Nachricht gelöscht.' });
          } catch (fehler) { await fehlerbehandeln(fehler); }
        });
      }

      await laden();
      zeigen();
    },
  });
})();
