/* UC-004 Empfängervorlagen verwalten: Liste, anlegen und umbenennen im Seitenblatt, löschen nach Sicherheitsabfrage.
   Maske: docs/ui/empfaengervorlagen.html (Inhalt und Namen). Die Regeln prüft der Dienst (BR-0013 bis BR-0016, BR-0018); die Seite zeigt seine Meldung. */
(function () {
  const { html, symbol } = Aventa;
  const HOECHSTZAHL = 50;

  const zeile = v => `<li data-zeile data-vorlage="${html(v.name)}"><div class="zeile">
      <span class="zeile__symbol zeile__symbol--messing" aria-hidden="true">${html(Aventa.kuerzel(v.name))}</span>
      <div class="zeile__haupt">
        <span class="zeile__titel" data-feld="Vorlage">${html(v.name)}</span>
        <span class="zeile__unter iban" data-feld="IBAN">${Aventa.iban(v.empfaengerIban)}</span>
        ${v.verwendungszweck ? `<span class="zeile__meta"><span data-feld="Verwendungszweck der Vorlage">${html(v.verwendungszweck)}</span></span>` : ''}
      </div>
      <span></span>
      <div class="zeile__aktionen">
        <a class="knopf knopf--klein knopf--still" href="/ueberweisung?vorlage=${encodeURIComponent(v.vorlagenId)}">${symbol('ueberweisen', 18)}Überweisen</a>
        <button type="button" class="symbolknopf" data-umbenennen="${html(v.vorlagenId)}" aria-label="Umbenennen" title="Umbenennen">${symbol('stift')}</button>
        <button type="button" class="symbolknopf symbolknopf--gefahr" data-loeschen="${html(v.vorlagenId)}" aria-label="Löschen" title="Löschen">${symbol('muell')}</button>
      </div>
    </div></li>`;

  Aventa.seite('/empfaengervorlagen', {
    titel: 'Empfängervorlagen',
    async zeigen(flaeche) {
      let vorlagen = [];
      // Eingaben bleiben nach einer Ablehnung stehen (UC-004 A1, A2).
      let neu = { name: '', empfaengerIban: '', verwendungszweck: '' };
      let umbenennen = null; // { vorlagenId, name, alt }
      let loeschenId = '';

      const kopf = document.getElementById('kopf-aktion');
      kopf.innerHTML = `<button type="button" class="knopf knopf--haupt" id="neue-vorlage">${symbol('plus', 18)}Neue Vorlage</button>`;
      kopf.querySelector('button').addEventListener('click', () => zeigen({ offen: 'neu' }));

      function zeigen({ erfolg = '', fehler = '', offen = '', blattFehler = '' } = {}) {
        const v = loeschenId && vorlagen.find(x => x.vorlagenId === loeschenId);
        flaeche.innerHTML = `<div class="seite vorlagen">
          ${Aventa.meldungen({ erfolg, fehler })}
          <section class="abschnitt" aria-labelledby="liste-titel">
            <div class="abschnitt__kopf"><h2 id="liste-titel">Ihre Empfängervorlagen</h2>
              <span class="zusatz">Vorlagen <strong id="vorlagen-zahl">${vorlagen.length} von ${HOECHSTZAHL}</strong></span></div>
            ${vorlagen.length ? `<div class="flaeche"><ul class="liste" data-felder="Vorlage|IBAN|Verwendungszweck der Vorlage">${vorlagen.map(zeile).join('')}</ul></div>`
              : `<div class="flaeche leer">${symbol('vorlage')}<strong>Sie haben noch keine Empfängervorlage.</strong>Mit einer Vorlage füllt die Überweisung Empfänger, IBAN und Verwendungszweck selbst aus.
                 <button type="button" class="knopf knopf--klein" data-neu style="margin-top:10px">${symbol('plus', 18)}Neue Vorlage</button></div>`}
          </section>
          ${Aventa.blatt({ id: 'blatt-neu', titel: 'Neue Vorlage', unter: 'Für Empfänger, an die Sie öfter überweisen.', aktion: 'Speichern', fehler: offen === 'neu' ? blattFehler : '', inhalt: `
            <div class="feld"><label for="name">Name</label><input id="name" name="name" maxlength="70" autocomplete="off" value="${html(neu.name)}"></div>
            <div class="feld"><label for="empfaengerIban">IBAN des Empfängers</label><input id="empfaengerIban" name="empfaengerIban" maxlength="42" autocomplete="off" spellcheck="false" value="${html(neu.empfaengerIban)}"></div>
            <div class="feld"><label for="verwendungszweck">Verwendungszweck</label><textarea id="verwendungszweck" name="verwendungszweck" maxlength="140" rows="2">${html(neu.verwendungszweck)}</textarea>
              <p class="hinweis">Optional</p></div>` })}
          ${umbenennen ? Aventa.blatt({ id: 'blatt-umbenennen', titel: 'Vorlage umbenennen', unter: `Bisher: ${umbenennen.alt}`, aktion: 'Umbenennen', fehler: offen === 'umbenennen' ? blattFehler : '', inhalt: `
            <div class="feld"><label for="neuerName">Neuer Name</label><input id="neuerName" name="neuerName" maxlength="70" autocomplete="off" value="${html(umbenennen.name)}"></div>` }) : ''}
          ${offen === 'loeschen' && v ? Aventa.rueckfrage({ frage: 'Vorlage löschen?', text: `„${v.name}“ verschwindet aus der Auswahl der Überweisung.`, nein: 'Abbrechen' }) : ''}
        </div>`;
        verdrahten(offen, Boolean(blattFehler));
      }

      async function laden() { vorlagen = await Aventa.api('/api/empfaengervorlagen'); }

      /** Führt die Anfrage aus; bei Erfolg neu laden und Meldung zeigen, sonst die Meldung des Dienstes im offenen Blatt. */
      async function ausfuehren(blatt, anfrage, erfolg, nachher = () => {}) {
        try {
          await anfrage();
          nachher();
          await laden();
          zeigen({ erfolg });
        } catch (fehler) {
          if (fehler.status === 404 || blatt === 'loeschen') { await laden(); return zeigen({ fehler: fehler.message }); }
          zeigen({ offen: blatt, blattFehler: fehler.message });
        }
      }

      function verdrahten(offen, still) {
        flaeche.querySelector('[data-neu]')?.addEventListener('click', () => zeigen({ offen: 'neu' }));
        flaeche.querySelectorAll('[data-umbenennen]').forEach(k => k.addEventListener('click', () => {
          const v = vorlagen.find(x => x.vorlagenId === k.dataset.umbenennen);
          umbenennen = { vorlagenId: v.vorlagenId, name: v.name, alt: v.name };
          zeigen({ offen: 'umbenennen' });
        }));
        flaeche.querySelectorAll('[data-loeschen]').forEach(k => k.addEventListener('click', () => {
          loeschenId = k.dataset.loeschen;
          zeigen({ offen: 'loeschen' });
        }));

        const blattNeu = flaeche.querySelector('#blatt-neu');
        const formNeu = blattNeu.querySelector('form');
        formNeu.addEventListener('submit', e => {
          e.preventDefault();
          neu = { name: formNeu.name.value, empfaengerIban: formNeu.empfaengerIban.value, verwendungszweck: formNeu.verwendungszweck.value };
          ausfuehren('neu', () => Aventa.api('/api/empfaengervorlagen', { method: 'POST', body: JSON.stringify(neu) }),
            'Empfängervorlage gespeichert.', () => { neu = { name: '', empfaengerIban: '', verwendungszweck: '' }; });
        });
        if (offen === 'neu') Aventa.oeffnen(blattNeu, { still });

        const blattUm = flaeche.querySelector('#blatt-umbenennen');
        if (blattUm) {
          const formUm = blattUm.querySelector('form');
          formUm.addEventListener('submit', e => {
            e.preventDefault();
            umbenennen = { ...umbenennen, name: formUm.neuerName.value };
            ausfuehren('umbenennen', () => Aventa.api(`/api/empfaengervorlagen/${encodeURIComponent(umbenennen.vorlagenId)}`, { method: 'PATCH', body: JSON.stringify({ name: umbenennen.name }) }),
              'Empfängervorlage umbenannt.', () => { umbenennen = null; });
          });
          if (offen === 'umbenennen') Aventa.oeffnen(blattUm, { still, beiZu: () => { umbenennen = null; } });
        }

        // UC-004 A5: erst nach „Ja“ löschen; „Abbrechen“ zeigt die Vorlagen ohne Meldung.
        const frage = flaeche.querySelector('#rueckfrage');
        if (frage) {
          Aventa.oeffnen(frage);
          frage.querySelector('[data-nein]').addEventListener('click', () => zeigen());
          frage.addEventListener('cancel', e => { e.preventDefault(); zeigen(); });
          frage.querySelector('[data-ja]').addEventListener('click', () =>
            ausfuehren('loeschen', () => Aventa.api(`/api/empfaengervorlagen/${encodeURIComponent(loeschenId)}`, { method: 'DELETE' }),
              'Empfängervorlage gelöscht.', () => { loeschenId = ''; }));
        }
      }

      await laden();
      zeigen();
    },
  });
})();
