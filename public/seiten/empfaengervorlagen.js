/* UC-004 Empfängervorlagen verwalten: anlegen, umbenennen, nach Sicherheitsabfrage löschen.
   Maske: docs/ui/empfaengervorlagen.html. Die Regeln prüft der Dienst (BR-0013 bis BR-0016, BR-0018); die Seite zeigt seine Meldung. */
(function () {
  const HOECHSTZAHL = 50;
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const gruppiert = iban => iban.replace(/(.{4})/g, '$1 ').trim();

  Aventa.seite('/empfaengervorlagen', {
    titel: 'Empfängervorlagen',
    async zeigen(flaeche) {
      let vorlagen = [];
      // Eingaben bleiben nach einer Ablehnung stehen (UC-004 A1, A2).
      let neu = { name: '', empfaengerIban: '', verwendungszweck: '' };
      let umbenennen = { vorlagenId: '', name: '' };
      let loeschenId = '';

      const optionen = gewaehlt => vorlagen.map(v =>
        `<option value="${html(v.vorlagenId)}"${v.vorlagenId === gewaehlt ? ' selected' : ''}>${html(v.name)}</option>`).join('');

      function zeigen({ erfolg = '', fehler = '', abfrage = false } = {}) {
        const leer = !vorlagen.length;
        flaeche.innerHTML = `<div class="vorlagen">
          <p class="meldung meldung--erfolg" role="status"${erfolg ? '' : ' hidden'}>${html(erfolg)}</p>
          <p class="meldung meldung--fehler" role="alert"${fehler ? '' : ' hidden'}>${html(fehler)}</p>
          <div class="vorlagen__kopf">
            <h2 class="abschnitt">Ihre Empfängervorlagen</h2>
            <p class="vorlagen__zahl"><span>Vorlagen</span> <strong id="vorlagen-zahl">${vorlagen.length} von ${HOECHSTZAHL}</strong></p>
          </div>
          ${leer ? '<p class="vorlagen__leer">Sie haben noch keine Empfängervorlage. Legen Sie unten die erste an.</p>' : `
          <div class="konten"><table class="kontentabelle vorlagen__tabelle">
            <caption class="unsichtbar">Ihre Empfängervorlagen</caption>
            <thead><tr><th scope="col">Vorlage</th><th scope="col">IBAN</th><th scope="col">Verwendungszweck der Vorlage</th></tr></thead>
            <tbody>${vorlagen.map(v => `<tr data-vorlage="${html(v.name)}"><th scope="row">${html(v.name)}</th>
              <td class="iban">${gruppiert(v.empfaengerIban)}</td><td>${html(v.verwendungszweck ?? '')}</td></tr>`).join('')}</tbody>
          </table></div>`}
          <div class="vorlagen__raster">
            <form class="ueberweisung__form" id="neu" novalidate aria-label="Neue Vorlage">
              <h2>Neue Vorlage</h2>
              <div class="feld"><label for="name">Name</label><input id="name" name="name" maxlength="70" autocomplete="off" value="${html(neu.name)}"></div>
              <div class="feld"><label for="empfaengerIban">IBAN des Empfängers</label><input id="empfaengerIban" name="empfaengerIban" maxlength="42" autocomplete="off" spellcheck="false" value="${html(neu.empfaengerIban)}"></div>
              <div class="feld"><label for="verwendungszweck">Verwendungszweck</label><textarea id="verwendungszweck" name="verwendungszweck" maxlength="140" rows="2">${html(neu.verwendungszweck)}</textarea>
                <p class="hinweis">Optional</p></div>
              <div class="ueberweisung__aktionen"><button class="knopf knopf--haupt" type="submit">Speichern</button></div>
            </form>
            <div class="vorlagen__spalte">
              <form class="ueberweisung__form" id="umbenennen" novalidate aria-label="Vorlage umbenennen">
                <h2>Vorlage umbenennen</h2>
                <div class="feld"><label for="vorlageUmbenennen">Vorlage zum Umbenennen</label><select id="vorlageUmbenennen" name="vorlageUmbenennen"${leer ? ' disabled' : ''}>${optionen(umbenennen.vorlagenId)}</select></div>
                <div class="feld"><label for="neuerName">Neuer Name</label><input id="neuerName" name="neuerName" maxlength="70" autocomplete="off" value="${html(umbenennen.name)}"${leer ? ' disabled' : ''}></div>
                <div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="submit"${leer ? ' disabled' : ''}>Umbenennen</button></div>
              </form>
              <form class="ueberweisung__form" id="loeschen" novalidate aria-label="Vorlage löschen">
                <h2>Vorlage löschen</h2>
                <div class="feld"><label for="vorlageLoeschen">Vorlage zum Löschen</label><select id="vorlageLoeschen" name="vorlageLoeschen"${leer || abfrage ? ' disabled' : ''}>${optionen(loeschenId)}</select></div>
                ${abfrage ? `<div class="vorlagen__abfrage" role="group" aria-label="Sicherheitsabfrage">
                  <p role="status">Vorlage löschen?</p>
                  <div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="button" id="abbrechen">Abbrechen</button><button class="knopf knopf--haupt" type="button" id="ja">Ja</button></div>
                </div>` : `<div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="submit"${leer ? ' disabled' : ''}>Löschen</button></div>`}
              </form>
            </div>
          </div>
        </div>`;
        verdrahten();
        if (abfrage) flaeche.querySelector('#abbrechen').focus();
      }

      async function laden() { vorlagen = await Aventa.api('/api/empfaengervorlagen'); }

      /** Führt die Anfrage aus; bei Erfolg neu laden und Meldung zeigen, sonst die Meldung des Dienstes. */
      async function ausfuehren(anfrage, erfolg, nachher = () => {}) {
        try {
          await anfrage();
          nachher();
          await laden();
          zeigen({ erfolg });
        } catch (fehler) {
          if (fehler.status === 404) await laden();
          zeigen({ fehler: fehler.message });
        }
      }

      function verdrahten() {
        const formNeu = flaeche.querySelector('#neu');
        formNeu.addEventListener('submit', e => {
          e.preventDefault();
          neu = { name: formNeu.name.value, empfaengerIban: formNeu.empfaengerIban.value, verwendungszweck: formNeu.verwendungszweck.value };
          ausfuehren(() => Aventa.api('/api/empfaengervorlagen', { method: 'POST', body: JSON.stringify(neu) }),
            'Empfängervorlage gespeichert.', () => { neu = { name: '', empfaengerIban: '', verwendungszweck: '' }; });
        });
        const formUm = flaeche.querySelector('#umbenennen');
        formUm.addEventListener('submit', e => {
          e.preventDefault();
          umbenennen = { vorlagenId: formUm.vorlageUmbenennen.value, name: formUm.neuerName.value };
          ausfuehren(() => Aventa.api(`/api/empfaengervorlagen/${encodeURIComponent(umbenennen.vorlagenId)}`, { method: 'PATCH', body: JSON.stringify({ name: umbenennen.name }) }),
            'Empfängervorlage umbenannt.', () => { umbenennen.name = ''; });
        });
        const formLoe = flaeche.querySelector('#loeschen');
        formLoe.addEventListener('submit', e => {
          e.preventDefault();
          loeschenId = formLoe.vorlageLoeschen.value;
          zeigen({ abfrage: true });
        });
        // UC-004 A5: erst nach „Ja“ löschen; „Abbrechen“ zeigt die Vorlagen ohne Meldung.
        flaeche.querySelector('#abbrechen')?.addEventListener('click', () => zeigen());
        flaeche.querySelector('#ja')?.addEventListener('click', () =>
          ausfuehren(() => Aventa.api(`/api/empfaengervorlagen/${encodeURIComponent(loeschenId)}`, { method: 'DELETE' }),
            'Empfängervorlage gelöscht.', () => { loeschenId = ''; }));
      }

      await laden();
      zeigen();
    },
  });
})();
