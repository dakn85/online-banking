/* UC-020 Postfach der Bank lesen und verwalten: Nachrichten ansehen, öffnen (BR-0087), nach Sicherheitsabfrage löschen.
   Maske: docs/ui/postfach.html. Die Regeln prüft der Dienst (BR-0085 bis BR-0087); die Zahl in der Navigation setzt Aventa.postfachZahl (BR-0086). */
(function () {
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const datum = iso => iso.split('-').reverse().join('.');

  Aventa.seite('/postfach', {
    titel: 'Postfach',
    async zeigen(flaeche) {
      let liste = { nachrichten: [], anzahlUngelesen: 0 };
      let geoeffnet = ''; // Text der zuletzt geöffneten Nachricht
      let oeffnenId = '';
      let loeschenId = '';

      const optionen = gewaehlt => liste.nachrichten.map(n =>
        `<option value="${html(n.nachrichtId)}"${n.nachrichtId === gewaehlt ? ' selected' : ''}>${html(n.betreff)}</option>`).join('');

      function zeigen({ erfolg = '', fehler = '', abfrage = false } = {}) {
        const leer = !liste.nachrichten.length;
        flaeche.innerHTML = `<div class="vorlagen postfach">
          <p class="meldung meldung--erfolg" role="status"${erfolg ? '' : ' hidden'}>${html(erfolg)}</p>
          <p class="meldung meldung--fehler" role="alert"${fehler ? '' : ' hidden'}>${html(fehler)}</p>
          <div class="vorlagen__kopf">
            <h2 class="abschnitt">Ihre Nachrichten</h2>
            <p class="vorlagen__zahl"><span>Ungelesen</span> <strong id="postfach-ungelesen">${liste.anzahlUngelesen}</strong></p>
          </div>
          ${leer ? '<p class="vorlagen__leer" role="status">Keine Nachrichten.</p>' : `
          <div class="konten"><table class="kontentabelle postfach__tabelle">
            <caption class="unsichtbar">Ihre Nachrichten</caption>
            <thead><tr><th scope="col">Absender</th><th scope="col">Betreff</th><th scope="col">Datum</th><th scope="col">Status</th></tr></thead>
            <tbody>${liste.nachrichten.map(n => `<tr><td>${html(n.absender)}</td><td>${html(n.betreff)}</td>
              <td>${datum(n.versendetAm)}</td><td>${n.gelesen ? 'gelesen' : 'ungelesen'}</td></tr>`).join('')}</tbody>
          </table></div>`}
          <div class="vorlagen__raster">
            <form class="ueberweisung__form" id="oeffnen" novalidate aria-label="Nachricht lesen">
              <h2>Nachricht lesen</h2>
              <div class="feld"><label for="nachrichtOeffnen">Nachricht zum Öffnen</label><select id="nachrichtOeffnen" name="nachrichtOeffnen"${leer ? ' disabled' : ''}>${optionen(oeffnenId)}</select></div>
              <div class="ueberweisung__aktionen"><button class="knopf knopf--haupt" type="submit"${leer ? ' disabled' : ''}>Öffnen</button></div>
              <dl class="postfach__text"><div><dt>Text</dt><dd id="nachrichtText">${leer ? '' : html(geoeffnet)}</dd></div></dl>
            </form>
            <form class="ueberweisung__form" id="loeschen" novalidate aria-label="Nachricht löschen">
              <h2>Nachricht löschen</h2>
              <div class="feld"><label for="nachrichtLoeschen">Nachricht zum Löschen</label><select id="nachrichtLoeschen" name="nachrichtLoeschen"${leer || abfrage ? ' disabled' : ''}>${optionen(loeschenId)}</select></div>
              ${abfrage ? `<div class="vorlagen__abfrage" role="group" aria-label="Sicherheitsabfrage">
                <p role="status">Nachricht löschen?</p>
                <div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="button" id="nein">Nein</button><button class="knopf knopf--haupt" type="button" id="ja">Ja</button></div>
              </div>` : `<div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="submit"${leer ? ' disabled' : ''}>Löschen</button></div>`}
            </form>
          </div>
        </div>`;
        verdrahten();
        if (abfrage) flaeche.querySelector('#nein').focus();
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
        flaeche.querySelector('#oeffnen').addEventListener('submit', async e => {
          e.preventDefault();
          oeffnenId = e.target.nachrichtOeffnen.value;
          try {
            const nachricht = await Aventa.api(`/api/nachrichten/${encodeURIComponent(oeffnenId)}`, { method: 'PATCH' });
            geoeffnet = nachricht.text;
            await laden();
            zeigen();
          } catch (fehler) { geoeffnet = ''; await fehlerbehandeln(fehler); }
        });
        flaeche.querySelector('#loeschen').addEventListener('submit', e => {
          e.preventDefault();
          loeschenId = e.target.nachrichtLoeschen.value;
          zeigen({ abfrage: true });
        });
        // UC-020 A2: „Nein“ lässt alles unverändert und zeigt die Nachrichten ohne Meldung.
        flaeche.querySelector('#nein')?.addEventListener('click', () => zeigen());
        flaeche.querySelector('#ja')?.addEventListener('click', async () => {
          try {
            await Aventa.api(`/api/nachrichten/${encodeURIComponent(loeschenId)}`, { method: 'DELETE' });
            if (loeschenId === oeffnenId) { geoeffnet = ''; oeffnenId = ''; }
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
