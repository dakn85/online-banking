/* UC-016 Daueraufträge vom Girokonto verwalten: Liste, anlegen und ändern im Seitenblatt, löschen nach Sicherheitsabfrage.
   Maske: docs/ui/dauerauftraege.html (Inhalt und Namen). Die Regeln prüft der Dienst (BR-0077, BR-0078); die Seite zeigt seine Meldung unverändert. */
(function () {
  const { html, symbol } = Aventa;
  const TURNUS = ['monatlich', 'vierteljährlich', 'jährlich'];
  const betragFeld = zahl => zahl.toFixed(2).replace('.', ',');
  /** „50,00 €“ oder „10,555“ wird zur Zahl; was keine Zahl ist, geht unverändert an den Dienst (Meldung A3). */
  const betragAus = eingabe => {
    const roh = String(eingabe).replace(/[€\s ]/g, '').replace(/\./g, '').replace(',', '.');
    return roh !== '' && /^-?\d+(\.\d+)?$/.test(roh) ? Number(roh) : String(eingabe);
  };
  const leer = () => ({ empfaenger: '', empfaengerIban: '', betrag: '', verwendungszweck: '', turnus: 'monatlich', ersterAusfuehrungstag: '', enddatum: '' });
  const felderVon = d => ({
    empfaenger: d.empfaenger, empfaengerIban: Aventa.iban(d.empfaengerIban), betrag: betragFeld(d.betrag),
    verwendungszweck: d.verwendungszweck, turnus: d.turnus, ersterAusfuehrungstag: d.ersterAusfuehrungstag, enddatum: d.enddatum ?? '',
  });

  /** Die Felder eines Dauerauftrags; die Beschriftungen kommen aus der Maske (Neu und Ändern haben eigene). */
  function felder(praefix, f, namen) {
    const feld = (name, label, eingabe, klasse = '') => `<div class="feld ${klasse}"><label for="${praefix}-${name}">${label}</label>${eingabe(`id="${praefix}-${name}" name="${name}"`)}</div>`;
    return `
      ${feld('empfaenger', namen.empfaenger, a => `<input ${a} autocomplete="off" value="${html(f.empfaenger)}">`)}
      ${feld('empfaengerIban', namen.iban, a => `<input ${a} autocomplete="off" spellcheck="false" value="${html(f.empfaengerIban)}">`)}
      ${feld('betrag', namen.betrag, a => `<input ${a} inputmode="decimal" autocomplete="off" placeholder="0,00" value="${html(f.betrag)}">`, 'feld--betrag')}
      ${feld('verwendungszweck', namen.zweck, a => `<textarea ${a} rows="2">${html(f.verwendungszweck)}</textarea>`)}
      ${feld('turnus', namen.turnus, a => `<select ${a}>${TURNUS.map(t => `<option${t === f.turnus ? ' selected' : ''}>${t}</option>`).join('')}</select>`)}
      <div class="raster-2">
        ${feld('ersterAusfuehrungstag', namen.erster, a => `<input ${a} type="date" value="${html(f.ersterAusfuehrungstag)}">`)}
        ${feld('enddatum', namen.ende, a => `<input ${a} type="date" value="${html(f.enddatum)}">`)}
      </div>`;
  }
  const NEU = { empfaenger: 'Name des Empfängers', iban: 'IBAN des Empfängers', betrag: 'Betrag in Euro', zweck: 'Verwendungszweck', turnus: 'Turnus des Dauerauftrags', erster: 'Erster Ausführungstag am', ende: 'Enddatum (optional)' };
  const AENDERN = { empfaenger: 'Neuer Empfängername', iban: 'Neue IBAN des Empfängers', betrag: 'Neuer Betrag in Euro', zweck: 'Neuer Verwendungszweck', turnus: 'Neuer Turnus', erster: 'Neuer erster Ausführungstag', ende: 'Neues Enddatum (optional)' };

  const zeile = d => `<li data-zeile data-dauerauftrag="${html(d.dauerauftragId)}"><div class="zeile">
      <span class="zeile__symbol zeile__symbol--tanne" aria-hidden="true">${html(Aventa.kuerzel(d.empfaenger))}</span>
      <div class="zeile__haupt">
        <span class="zeile__titel" data-feld="Empfänger">${html(d.empfaenger)}</span>
        <span class="zeile__unter" data-feld="Zweck">${html(d.verwendungszweck)}</span>
        <span class="zeile__meta">
          <span class="iban" data-feld="IBAN">${Aventa.iban(d.empfaengerIban)}</span>
          <span>ab <span data-feld="Erster Ausführungstag">${Aventa.datum(d.ersterAusfuehrungstag)}</span></span>
          ${d.enddatum ? `<span>bis <span data-feld="Enddatum">${Aventa.datum(d.enddatum)}</span></span>` : '<span>unbefristet</span>'}
        </span>
      </div>
      <div class="zeile__wert"><span class="zeile__betrag zahl" data-feld="Betrag">${Aventa.euro(d.betrag)}</span><small data-feld="Turnus">${html(d.turnus)}</small></div>
      <div class="zeile__aktionen">
        <button type="button" class="symbolknopf" data-aendern="${html(d.dauerauftragId)}" aria-label="Ändern" title="Ändern">${symbol('stift')}</button>
        <button type="button" class="symbolknopf symbolknopf--gefahr" data-loeschen="${html(d.dauerauftragId)}" aria-label="Löschen" title="Löschen">${symbol('muell')}</button>
      </div>
    </div></li>`;

  Aventa.seite('/dauerauftraege', {
    titel: 'Daueraufträge',
    async zeigen(flaeche) {
      let liste = [];
      // Eingaben bleiben nach einer Ablehnung stehen (UC-016 A1 bis A5).
      let neu = leer();
      let aendern = null; // { id, felder }
      let loeschenId = '';

      const kopf = document.getElementById('kopf-aktion');
      kopf.innerHTML = `<button type="button" class="knopf knopf--haupt" id="neuer-dauerauftrag">${symbol('plus', 18)}Neuer Dauerauftrag</button>`;
      kopf.querySelector('button').addEventListener('click', () => zeigen({ offen: 'neu' }));

      /** offen: welches Blatt oder welche Rückfrage nach dem Zeichnen offen ist; blattFehler steht im Blatt. */
      function zeigen({ erfolg = '', fehler = '', offen = '', blattFehler = '' } = {}) {
        const summe = liste.reduce((s, d) => s + (d.turnus === 'monatlich' ? d.betrag : d.turnus === 'vierteljährlich' ? d.betrag / 3 : d.betrag / 12), 0);
        flaeche.innerHTML = `<div class="seite dauerauftraege">
          ${Aventa.meldungen({ erfolg, fehler })}
          <section class="abschnitt" aria-labelledby="liste-titel">
            <div class="abschnitt__kopf"><h2 id="liste-titel">Ihre Daueraufträge</h2>
              ${liste.length ? `<span class="zusatz">${liste.length === 1 ? '1 Auftrag' : `${liste.length} Aufträge`}, im Schnitt ${Aventa.euro(summe)} im Monat</span>` : ''}</div>
            ${liste.length ? `<div class="flaeche"><ul class="liste" data-felder="Empfänger|IBAN|Betrag|Zweck|Turnus|Erster Ausführungstag|Enddatum">${liste.map(zeile).join('')}</ul></div>`
              : `<div class="flaeche leer">${symbol('dauerauftrag')}<strong>Sie haben keine Daueraufträge.</strong>Miete, Sparrate oder Beiträge: einmal anlegen, die Bank führt sie aus.
                 <button type="button" class="knopf knopf--klein" data-neu style="margin-top:10px">${symbol('plus', 18)}Neuer Dauerauftrag</button></div>`}
          </section>
          ${Aventa.blatt({ id: 'blatt-neu', titel: 'Neuer Dauerauftrag', unter: 'Vom Girokonto, ausgeführt im gewählten Turnus.', inhalt: felder('neu', neu, NEU), aktion: 'Speichern', fehler: offen === 'neu' ? blattFehler : '' })}
          ${aendern ? Aventa.blatt({ id: 'blatt-aendern', titel: 'Dauerauftrag ändern', unter: aendern.titel, inhalt: felder('aendern', aendern.felder, AENDERN), aktion: 'Änderung speichern', fehler: offen === 'aendern' ? blattFehler : '' }) : ''}
          ${offen === 'loeschen' ? Aventa.rueckfrage({ frage: 'Dauerauftrag löschen?', text: beschreibung(liste.find(d => d.dauerauftragId === loeschenId)) }) : ''}
        </div>`;
        verdrahten(offen, Boolean(blattFehler));
      }
      const beschreibung = d => (d ? `${d.empfaenger}, ${Aventa.euro(d.betrag)} ${d.turnus}. Ab dem Löschen führt die Bank ihn nicht mehr aus.` : '');

      async function laden() { liste = await Aventa.api('/api/dauerauftraege'); }

      const lesen = form => ({
        empfaenger: form.empfaenger.value, empfaengerIban: form.empfaengerIban.value, betrag: form.betrag.value,
        verwendungszweck: form.verwendungszweck.value, turnus: form.turnus.value,
        ersterAusfuehrungstag: form.ersterAusfuehrungstag.value, enddatum: form.enddatum.value,
      });
      const koerper = f => JSON.stringify({ ...f, betrag: betragAus(f.betrag), enddatum: f.enddatum || undefined });

      /** Führt die Anfrage aus; bei Erfolg neu laden und Meldung zeigen, sonst die Meldung des Dienstes im offenen Blatt
          (UC-016 A10: bei 404 mit neu geladener Liste und Meldung über der Liste). */
      async function ausfuehren(blatt, anfrage, erfolg, nachher = () => {}) {
        try {
          await anfrage();
          nachher();
          await laden();
          zeigen({ erfolg });
        } catch (fehler) {
          if (fehler.status === 404) { aendern = null; loeschenId = ''; await laden(); return zeigen({ fehler: fehler.message }); }
          if (blatt === 'loeschen') return zeigen({ fehler: fehler.message });
          zeigen({ offen: blatt, blattFehler: fehler.message });
        }
      }

      function verdrahten(offen, still) {
        flaeche.querySelector('[data-neu]')?.addEventListener('click', () => zeigen({ offen: 'neu' }));
        flaeche.querySelectorAll('[data-aendern]').forEach(k => k.addEventListener('click', () => {
          const d = liste.find(x => x.dauerauftragId === k.dataset.aendern);
          aendern = { id: d.dauerauftragId, titel: `An ${d.empfaenger}`, felder: felderVon(d) };
          zeigen({ offen: 'aendern' });
        }));
        flaeche.querySelectorAll('[data-loeschen]').forEach(k => k.addEventListener('click', () => {
          loeschenId = k.dataset.loeschen;
          zeigen({ offen: 'loeschen' });
        }));

        const blattNeu = flaeche.querySelector('#blatt-neu');
        const formNeu = blattNeu.querySelector('form');
        formNeu.addEventListener('submit', e => {
          e.preventDefault();
          neu = lesen(formNeu);
          ausfuehren('neu', () => Aventa.api('/api/dauerauftraege', { method: 'POST', body: koerper(neu) }),
            'Dauerauftrag gespeichert.', () => { neu = leer(); });
        });
        if (offen === 'neu') Aventa.oeffnen(blattNeu, { still });

        const blattAe = flaeche.querySelector('#blatt-aendern');
        if (blattAe) {
          const formAe = blattAe.querySelector('form');
          formAe.addEventListener('submit', e => {
            e.preventDefault();
            aendern = { ...aendern, felder: lesen(formAe) };
            const { id, felder: f } = aendern;
            ausfuehren('aendern', () => Aventa.api(`/api/dauerauftraege/${encodeURIComponent(id)}`, { method: 'PUT', body: koerper(f) }),
              'Dauerauftrag geändert.', () => { aendern = null; });
          });
          if (offen === 'aendern') Aventa.oeffnen(blattAe, { still, beiZu: () => { aendern = null; } });
        }

        // UC-016 A7, A9: erst nach „Ja“ löschen; „Nein“ zeigt die Daueraufträge ohne Meldung.
        const frage = flaeche.querySelector('#rueckfrage');
        if (frage) {
          Aventa.oeffnen(frage);
          frage.querySelector('[data-nein]').addEventListener('click', () => zeigen());
          frage.addEventListener('cancel', e => { e.preventDefault(); zeigen(); });
          frage.querySelector('[data-ja]').addEventListener('click', () =>
            ausfuehren('loeschen', () => Aventa.api(`/api/dauerauftraege/${encodeURIComponent(loeschenId)}`, { method: 'DELETE' }),
              'Dauerauftrag gelöscht.', () => { loeschenId = ''; }));
        }
      }

      await laden();
      zeigen();
    },
  });
})();
