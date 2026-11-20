/* UC-017 Vorgemerkte Überweisungen verwalten: Liste nach Ausführungstag, Löschen erst nach Sicherheitsabfrage.
   Maske: docs/ui/vorgemerkte-ueberweisungen.html. Welche Aufträge die Kundin sieht und löschen darf, entscheidet der Dienst (BR-0080). */
(function () {
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const gruppiert = iban => iban.replace(/(.{4})/g, '$1 ').trim();
  /** „2026-12-24“ → „24.12.2026“ (Anzeigeformat TT.MM.JJJJ) */
  const datum = tag => tag.split('-').reverse().join('.');

  Aventa.seite('/vorgemerkte-ueberweisungen', {
    titel: 'Vorgemerkte Überweisungen',
    async zeigen(flaeche) {
      let auftraege = [];
      let loeschenId = '';

      function zeigen({ erfolg = '', fehler = '', abfrage = false } = {}) {
        const leer = !auftraege.length;
        flaeche.innerHTML = `<div class="vorgemerkt">
          <p class="zurueck"><a href="/ueberweisung">← Zur Überweisung</a></p>
          <p class="meldung meldung--erfolg" role="status"${erfolg ? '' : ' hidden'}>${html(erfolg)}</p>
          <p class="meldung meldung--fehler" role="alert"${fehler ? '' : ' hidden'}>${html(fehler)}</p>
          <p class="vorgemerkt__unter">Terminüberweisungen ansehen und vor der Ausführung löschen.</p>
          ${leer ? '<p class="vorlagen__leer">Sie haben keine vorgemerkten Überweisungen.</p>' : `
          <div class="konten"><table class="kontentabelle vorgemerkt__tabelle">
            <caption class="unsichtbar">Ihre vorgemerkten Überweisungen</caption>
            <thead><tr><th scope="col">Ausführungstag</th><th scope="col">Empfänger</th><th scope="col">IBAN des Empfängers</th>
              <th scope="col" class="zahl">Betrag in Euro</th><th scope="col">Verwendungszweck</th></tr></thead>
            <tbody>${auftraege.map(a => `<tr data-auftrag="${html(a.auftragsId)}">
              <td>${datum(a.ausfuehrungstag)}</td><th scope="row">${html(a.empfaenger)}</th><td class="iban">${gruppiert(a.empfaengerIban)}</td>
              <td class="zahl">${Aventa.euro(a.betrag)}</td><td>${html(a.verwendungszweck)}</td></tr>`).join('')}</tbody>
          </table></div>
          <form class="ueberweisung__form vorgemerkt__loeschen" novalidate aria-label="Auftrag löschen">
            <h2>Auftrag löschen</h2>
            <div class="feld"><label for="auftragLoeschen">Auftrag zum Löschen</label>
              <select id="auftragLoeschen" name="auftragLoeschen"${abfrage ? ' disabled' : ''}>${auftraege.map(a =>
                `<option value="${html(a.auftragsId)}"${a.auftragsId === loeschenId ? ' selected' : ''}>${datum(a.ausfuehrungstag)} · ${html(a.empfaenger)} · ${Aventa.euro(a.betrag)}</option>`).join('')}</select></div>
            ${abfrage ? `<div class="vorlagen__abfrage" role="group" aria-label="Sicherheitsabfrage">
              <p role="status">Vorgemerkten Auftrag löschen?</p>
              <div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="button" id="nein">Nein</button><button class="knopf knopf--haupt" type="button" id="ja">Ja</button></div>
            </div>` : '<div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="submit">Löschen</button></div>'}
          </form>`}
        </div>`;
        verdrahten();
        if (abfrage) flaeche.querySelector('#nein').focus();
      }

      async function laden() { auftraege = await Aventa.api('/api/terminueberweisungen'); }

      function verdrahten() {
        const form = flaeche.querySelector('.vorgemerkt__loeschen');
        // UC-017 Schritt 3 und 4: erst nachfragen, nicht sofort löschen.
        form?.addEventListener('submit', e => {
          e.preventDefault();
          loeschenId = form.auftragLoeschen.value;
          zeigen({ abfrage: true });
        });
        // UC-017 A2: „Nein“ zeigt die Aufträge ohne Meldung.
        flaeche.querySelector('#nein')?.addEventListener('click', () => zeigen());
        // UC-017 Schritt 5 und 6: „Ja“ löscht endgültig.
        flaeche.querySelector('#ja')?.addEventListener('click', async () => {
          try {
            await Aventa.api(`/api/terminueberweisungen/${encodeURIComponent(loeschenId)}`, { method: 'DELETE' });
            loeschenId = '';
            await laden();
            zeigen({ erfolg: 'Vorgemerkter Auftrag gelöscht.' });
          } catch (fehler) {
            await laden();
            zeigen({ fehler: fehler.message });
          }
        });
      }

      await laden();
      zeigen();
    },
  });
})();
