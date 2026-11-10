/* UC-005 Dauerauftrag einrichten, ansehen und löschen. Maske: docs/ui/dauerauftraege.html.
   Die Regeln prüft der Dienst in der Reihenfolge des Use Case (BR-0020 bis BR-0024); die Seite wandelt die Eingaben
   in den Vertrag um und zeigt seine Meldung. Was sich nicht umwandeln lässt, geht als null hin und wird dort abgelehnt. */
(function () {
  const ABGELEHNT = 'Der Dauerauftrag konnte nicht angelegt werden.';
  const NICHT_GELOESCHT = 'Der Dauerauftrag konnte nicht gelöscht werden.';
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const gruppiert = iban => iban.replace(/(.{4})/g, '$1 ').trim();
  const datum = wert => new Date(`${wert}T00:00:00Z`).toLocaleDateString('de-DE', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' });
  /** „1.250,00“ → 1250; null, wenn es kein Betrag mit höchstens zwei Nachkommastellen ist. */
  function alsBetrag(text) {
    const t = text.replace(/[\s €]/g, '');
    if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(t)) return null;
    return Number(t.replace(/\./g, '').replace(',', '.'));
  }
  const alsTag = text => /^\d{1,4}$/.test(text.trim()) ? Number(text.trim()) : null;
  const LEER = { empfaenger: '', empfaengerIban: '', betrag: '', ausfuehrungstag: '', ersteAusfuehrung: '', verwendungszweck: '' };

  Aventa.seite('/dauerauftraege', {
    titel: 'Daueraufträge',
    async zeigen(flaeche) {
      // Erreichbar über die Zeile des Girokontos im Finanzstatus (UC-001 Schritt 8), nicht über die Navigation.
      document.querySelector('.navigation a[data-seite="/finanzstatus"]')?.setAttribute('aria-current', 'page');
      const { konten } = await Aventa.api('/api/konten');
      // BR-0024: Das Auftraggeberkonto ist fest das Girokonto der Kundin.
      const giro = konten.find(k => k.art === 'Girokonto');
      let dauerauftraege = [];
      // Eingaben bleiben nach einer Ablehnung stehen (UC-005 A3, A8).
      let neu = { ...LEER };
      let loeschenId = '';

      function zeigen({ erfolg = '', fehler = '', formularfehler = '', abfrage = false } = {}) {
        const leer = !dauerauftraege.length;
        if (!dauerauftraege.some(d => d.dauerauftragsId === loeschenId)) loeschenId = leer ? '' : dauerauftraege[0].dauerauftragsId;
        flaeche.innerHTML = `<div class="vorlagen dauerauftraege">
          <p class="zurueck"><a href="/finanzstatus">← Finanzstatus</a></p>
          <p class="dauerauftraege__unter">Monatliche Zahlungen vom Girokonto einrichten, ansehen und löschen.</p>
          <p class="meldung meldung--erfolg" role="status"${erfolg ? '' : ' hidden'}>${html(erfolg)}</p>
          <p class="meldung meldung--fehler" role="alert"${fehler ? '' : ' hidden'}>${html(fehler)}</p>
          <h2 class="abschnitt">Ihre Daueraufträge</h2>
          ${leer ? '<p class="vorlagen__leer">Sie haben noch keinen Dauerauftrag.</p>' : `
          <div class="konten"><table class="kontentabelle dauerauftraege__tabelle">
            <caption class="unsichtbar">Ihre Daueraufträge</caption>
            <thead><tr><th scope="col">Empfänger</th><th scope="col">IBAN</th><th scope="col" class="zahl">Betrag</th>
              <th scope="col" class="zahl">Ausführungstag</th><th scope="col">Erste Ausführung</th><th scope="col">Verwendungszweck</th></tr></thead>
            <tbody>${dauerauftraege.map(d => `<tr data-dauerauftrag="${html(d.dauerauftragsId)}"${d.dauerauftragsId === loeschenId ? ' class="gewaehlt"' : ''}>
              <th scope="row">${html(d.empfaenger)}</th><td class="iban">${gruppiert(d.empfaengerIban)}</td>
              <td class="zahl">${Aventa.euro(d.betrag)}</td><td class="zahl">${html(d.ausfuehrungstag)}</td>
              <td>${datum(d.ersteAusfuehrung)}</td><td>${html(d.verwendungszweck)}</td></tr>`).join('')}</tbody>
          </table></div>`}
          <div class="vorlagen__raster">
            <form class="ueberweisung__form" id="neu" novalidate aria-label="Neuer Dauerauftrag">
              <h2>Neuer Dauerauftrag</h2>
              <p class="meldung meldung--fehler" role="alert"${formularfehler ? '' : ' hidden'}>${html(formularfehler)}</p>
              <div class="feld"><label for="empfaenger">Empfänger</label><input id="empfaenger" name="empfaenger" maxlength="70" autocomplete="off" value="${html(neu.empfaenger)}"></div>
              <div class="feld"><label for="empfaengerIban">IBAN des Empfängers</label><input id="empfaengerIban" name="empfaengerIban" maxlength="42" autocomplete="off" spellcheck="false" value="${html(neu.empfaengerIban)}"></div>
              <div class="dauerauftraege__paar">
                <div class="feld"><label for="betrag">Betrag in Euro</label><input id="betrag" name="betrag" inputmode="decimal" autocomplete="off" placeholder="0,00" value="${html(neu.betrag)}"></div>
                <div class="feld"><label for="ausfuehrungstag">Ausführungstag im Monat</label><input id="ausfuehrungstag" name="ausfuehrungstag" inputmode="numeric" autocomplete="off" maxlength="4" value="${html(neu.ausfuehrungstag)}"></div>
              </div>
              <div class="feld"><label for="ersteAusfuehrung">Erste Ausführung</label><input type="date" id="ersteAusfuehrung" name="ersteAusfuehrung" value="${html(neu.ersteAusfuehrung)}"></div>
              <div class="feld"><label for="verwendungszweck">Verwendungszweck</label><textarea id="verwendungszweck" name="verwendungszweck" maxlength="140" rows="2">${html(neu.verwendungszweck)}</textarea></div>
              <div class="ueberweisung__aktionen"><button class="knopf knopf--haupt" type="submit">Anlegen</button></div>
            </form>
            <form class="ueberweisung__form" id="loeschen" novalidate aria-label="Dauerauftrag löschen">
              <h2>Dauerauftrag löschen</h2>
              <div class="feld"><label for="dauerauftragLoeschen">Dauerauftrag zum Löschen</label><select id="dauerauftragLoeschen" name="dauerauftragLoeschen"${leer || abfrage ? ' disabled' : ''}>${dauerauftraege.map(d =>
                `<option value="${html(d.dauerauftragsId)}"${d.dauerauftragsId === loeschenId ? ' selected' : ''}>${html(d.empfaenger)}</option>`).join('')}</select></div>
              ${abfrage ? `<div class="vorlagen__abfrage" role="group" aria-label="Sicherheitsabfrage">
                <p role="status">Dauerauftrag löschen?</p>
                <div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="button" id="abbrechen">Abbrechen</button><button class="knopf knopf--haupt" type="button" id="ja">Ja</button></div>
              </div>` : `<div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="submit"${leer ? ' disabled' : ''}>Löschen</button></div>`}
            </form>
          </div>
        </div>`;
        verdrahten(abfrage);
        if (abfrage) flaeche.querySelector('#abbrechen').focus();
      }

      async function laden() { dauerauftraege = await Aventa.api('/api/dauerauftraege'); }

      function verdrahten(abfrage) {
        const formNeu = flaeche.querySelector('#neu');
        formNeu.addEventListener('submit', async e => {
          e.preventDefault();
          neu = Object.fromEntries(Object.keys(LEER).map(feld => [feld, formNeu[feld].value]));
          try {
            await Aventa.api('/api/dauerauftraege', { method: 'POST', body: JSON.stringify({
              auftraggeberIban: giro ? giro.iban : '', empfaenger: neu.empfaenger, empfaengerIban: neu.empfaengerIban,
              betrag: alsBetrag(neu.betrag), waehrung: 'EUR', ausfuehrungstag: alsTag(neu.ausfuehrungstag),
              ersteAusfuehrung: neu.ersteAusfuehrung, verwendungszweck: neu.verwendungszweck,
            }) });
          } catch (fehler) {
            // UC-005 Schritt 4: die Meldung der Regel im Formular; A8: bei 403 und allem anderen die allgemeine Meldung.
            return zeigen({ formularfehler: fehler.status === 400 ? fehler.message : ABGELEHNT });
          }
          neu = { ...LEER };
          await laden();
          zeigen({ erfolg: 'Dauerauftrag angelegt.' });
        });

        // UC-005 A7: in der Liste oder im Feld wählen, dann „Löschen“; gelöscht wird erst nach „Ja“.
        const formLoe = flaeche.querySelector('#loeschen');
        if (!abfrage) flaeche.querySelectorAll('tr[data-dauerauftrag]').forEach(zeile => zeile.addEventListener('click', () => {
          loeschenId = zeile.dataset.dauerauftrag;
          formLoe.dauerauftragLoeschen.value = loeschenId;
          flaeche.querySelectorAll('tr[data-dauerauftrag]').forEach(z => z.classList.toggle('gewaehlt', z === zeile));
        }));
        formLoe.dauerauftragLoeschen.addEventListener('change', () => {
          loeschenId = formLoe.dauerauftragLoeschen.value;
          flaeche.querySelectorAll('tr[data-dauerauftrag]').forEach(z => z.classList.toggle('gewaehlt', z.dataset.dauerauftrag === loeschenId));
        });
        formLoe.addEventListener('submit', e => {
          e.preventDefault();
          loeschenId = formLoe.dauerauftragLoeschen.value;
          if (loeschenId) zeigen({ abfrage: true });
        });
        flaeche.querySelector('#abbrechen')?.addEventListener('click', () => zeigen());
        flaeche.querySelector('#ja')?.addEventListener('click', async () => {
          try {
            await Aventa.api(`/api/dauerauftraege/${encodeURIComponent(loeschenId)}`, { method: 'DELETE' });
          } catch (fehler) {
            // A7 Schritt 4: fremde oder unbekannte Kennung; die Liste zeigt danach den Stand des Dienstes.
            if (fehler.status === 404) await laden();
            return zeigen({ fehler: fehler.status === 404 ? fehler.message : NICHT_GELOESCHT });
          }
          await laden();
          zeigen({ erfolg: 'Dauerauftrag gelöscht.' });
        });
      }

      await laden();
      zeigen();
    },
  });
})();
