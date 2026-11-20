/* UC-016 Daueraufträge vom Girokonto verwalten: anlegen, ändern, nach Sicherheitsabfrage löschen.
   Maske: docs/ui/dauerauftraege.html. Die Regeln prüft der Dienst (BR-0077, BR-0078); die Seite zeigt seine Meldung unverändert. */
(function () {
  const TURNUS = ['monatlich', 'vierteljährlich', 'jährlich'];
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const gruppiert = iban => iban.replace(/(.{4})/g, '$1 ').trim();
  const tag = iso => (iso ? iso.split('-').reverse().join('.') : '');
  const betragFeld = zahl => zahl.toFixed(2).replace('.', ',');
  /** „50,00 €“ oder „10,555“ wird zur Zahl; was keine Zahl ist, geht unverändert an den Dienst (Meldung A3). */
  const betragAus = eingabe => {
    const roh = String(eingabe).replace(/[€\s ]/g, '').replace(/\./g, '').replace(',', '.');
    return roh !== '' && /^-?\d+(\.\d+)?$/.test(roh) ? Number(roh) : String(eingabe);
  };

  Aventa.seite('/dauerauftraege', {
    titel: 'Daueraufträge',
    async zeigen(flaeche) {
      let liste = [];
      // Eingaben bleiben nach einer Ablehnung stehen (UC-016 A1 bis A5).
      const leerNeu = () => ({ empfaenger: '', empfaengerIban: '', betrag: '', verwendungszweck: '', turnus: 'monatlich', ersterAusfuehrungstag: '', enddatum: '' });
      let neu = leerNeu();
      let aendern = null; // { id, felder }
      let loeschenId = '';

      const felderVon = d => ({
        empfaenger: d.empfaenger, empfaengerIban: gruppiert(d.empfaengerIban), betrag: betragFeld(d.betrag),
        verwendungszweck: d.verwendungszweck, turnus: d.turnus, ersterAusfuehrungstag: d.ersterAusfuehrungstag, enddatum: d.enddatum ?? '',
      });
      const beschreibung = d => `${d.empfaenger}, ${Aventa.euro(d.betrag)}, ${d.turnus}, ab ${tag(d.ersterAusfuehrungstag)}`;
      const optionen = gewaehlt => liste.map(d =>
        `<option value="${html(d.dauerauftragId)}"${d.dauerauftragId === gewaehlt ? ' selected' : ''}>${html(beschreibung(d))}</option>`).join('');
      const turnusOptionen = gewaehlt => TURNUS.map(t => `<option${t === gewaehlt ? ' selected' : ''}>${t}</option>`).join('');

      function zeigen({ erfolg = '', fehler = '', abfrage = false } = {}) {
        const leer = !liste.length;
        if (!leer && !liste.some(d => d.dauerauftragId === aendern?.id)) aendern = { id: liste[0].dauerauftragId, felder: felderVon(liste[0]) };
        if (leer) aendern = null;
        const a = aendern ? aendern.felder : leerNeu();
        const aus = leer ? ' disabled' : '';
        flaeche.innerHTML = `<div class="dauerauftraege">
          <p class="meldung meldung--erfolg" role="status"${erfolg ? '' : ' hidden'}>${html(erfolg)}</p>
          <p class="meldung meldung--fehler" role="alert"${fehler ? '' : ' hidden'}>${html(fehler)}</p>
          <h2 class="abschnitt">Ihre Daueraufträge</h2>
          ${leer ? '<p class="vorlagen__leer">Sie haben keine Daueraufträge.</p>' : `
          <div class="konten"><table class="kontentabelle dauerauftraege__tabelle">
            <caption class="unsichtbar">Ihre Daueraufträge</caption>
            <thead><tr><th scope="col">Empfänger</th><th scope="col">IBAN</th><th scope="col">Betrag</th><th scope="col">Zweck</th><th scope="col">Turnus</th><th scope="col">Erster Ausführungstag</th><th scope="col">Enddatum</th></tr></thead>
            <tbody>${liste.map(d => `<tr data-dauerauftrag="${html(d.empfaenger)}"><td>${html(d.empfaenger)}</td><td class="iban">${gruppiert(d.empfaengerIban)}</td>
              <td>${Aventa.euro(d.betrag)}</td><td>${html(d.verwendungszweck)}</td><td>${d.turnus}</td><td>${tag(d.ersterAusfuehrungstag)}</td><td>${tag(d.enddatum)}</td></tr>`).join('')}</tbody>
          </table></div>`}
          <div class="vorlagen__raster">
            <form class="ueberweisung__form" id="neu" novalidate aria-label="Neuer Dauerauftrag">
              <h2>Neuer Dauerauftrag</h2>
              <div class="feld"><label for="empfaenger">Name des Empfängers</label><input id="empfaenger" name="empfaenger" autocomplete="off" value="${html(neu.empfaenger)}"></div>
              <div class="feld"><label for="empfaengerIban">IBAN des Empfängers</label><input id="empfaengerIban" name="empfaengerIban" autocomplete="off" spellcheck="false" value="${html(neu.empfaengerIban)}"></div>
              <div class="feld"><label for="betrag">Betrag in Euro</label><input id="betrag" name="betrag" inputmode="decimal" autocomplete="off" value="${html(neu.betrag)}"></div>
              <div class="feld"><label for="verwendungszweck">Verwendungszweck</label><textarea id="verwendungszweck" name="verwendungszweck" rows="2">${html(neu.verwendungszweck)}</textarea></div>
              <div class="feld"><label for="turnus">Turnus des Dauerauftrags</label><select id="turnus" name="turnus">${turnusOptionen(neu.turnus)}</select></div>
              <div class="feld"><label for="ersterAusfuehrungstag">Erster Ausführungstag am</label><input id="ersterAusfuehrungstag" name="ersterAusfuehrungstag" type="date" value="${html(neu.ersterAusfuehrungstag)}"></div>
              <div class="feld"><label for="enddatum">Enddatum (optional)</label><input id="enddatum" name="enddatum" type="date" value="${html(neu.enddatum)}"></div>
              <div class="ueberweisung__aktionen"><button class="knopf knopf--haupt" type="submit">Speichern</button></div>
            </form>
            <div class="vorlagen__spalte">
              <form class="ueberweisung__form" id="aendern" novalidate aria-label="Dauerauftrag ändern">
                <h2>Dauerauftrag ändern</h2>
                <div class="feld"><label for="dauerauftragAendern">Dauerauftrag zum Ändern</label><select id="dauerauftragAendern" name="dauerauftragAendern"${aus}>${optionen(aendern?.id)}</select></div>
                <div class="feld"><label for="neuerEmpfaenger">Neuer Empfängername</label><input id="neuerEmpfaenger" name="empfaenger" autocomplete="off" value="${html(a.empfaenger)}"${aus}></div>
                <div class="feld"><label for="neueEmpfaengerIban">Neue IBAN des Empfängers</label><input id="neueEmpfaengerIban" name="empfaengerIban" autocomplete="off" spellcheck="false" value="${html(a.empfaengerIban)}"${aus}></div>
                <div class="feld"><label for="neuerBetrag">Neuer Betrag in Euro</label><input id="neuerBetrag" name="betrag" inputmode="decimal" autocomplete="off" value="${html(a.betrag)}"${aus}></div>
                <div class="feld"><label for="neuerVerwendungszweck">Neuer Verwendungszweck</label><textarea id="neuerVerwendungszweck" name="verwendungszweck" rows="2"${aus}>${html(a.verwendungszweck)}</textarea></div>
                <div class="feld"><label for="neuerTurnus">Neuer Turnus</label><select id="neuerTurnus" name="turnus"${aus}>${turnusOptionen(a.turnus)}</select></div>
                <div class="feld"><label for="neuerErsterAusfuehrungstag">Neuer erster Ausführungstag</label><input id="neuerErsterAusfuehrungstag" name="ersterAusfuehrungstag" type="date" value="${html(a.ersterAusfuehrungstag)}"${aus}></div>
                <div class="feld"><label for="neuesEnddatum">Neues Enddatum (optional)</label><input id="neuesEnddatum" name="enddatum" type="date" value="${html(a.enddatum)}"${aus}></div>
                <div class="ueberweisung__aktionen"><button class="knopf knopf--haupt" type="submit"${aus}>Änderung speichern</button></div>
              </form>
              <form class="ueberweisung__form" id="loeschen" novalidate aria-label="Dauerauftrag löschen">
                <h2>Dauerauftrag löschen</h2>
                <div class="feld"><label for="dauerauftragLoeschen">Dauerauftrag zum Löschen</label><select id="dauerauftragLoeschen" name="dauerauftragLoeschen"${leer || abfrage ? ' disabled' : ''}>${optionen(loeschenId)}</select></div>
                ${abfrage ? `<div class="vorlagen__abfrage" role="group" aria-label="Sicherheitsabfrage">
                  <p role="status">Dauerauftrag löschen?</p>
                  <div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="button" id="nein">Nein</button><button class="knopf knopf--haupt" type="button" id="ja">Ja</button></div>
                </div>` : `<div class="ueberweisung__aktionen"><button class="knopf knopf--still" type="submit"${aus}>Löschen</button></div>`}
              </form>
            </div>
          </div>
        </div>`;
        verdrahten();
        if (abfrage) flaeche.querySelector('#nein').focus();
      }

      async function laden() { liste = await Aventa.api('/api/dauerauftraege'); }

      /** Führt die Anfrage aus; bei Erfolg neu laden und Meldung zeigen, sonst die Meldung des Dienstes (UC-016 A10: bei 404 mit neu geladener Liste). */
      async function ausfuehren(anfrage, erfolg, nachher = () => {}) {
        try {
          await anfrage();
          nachher();
          await laden();
          zeigen({ erfolg });
        } catch (fehler) {
          if (fehler.status === 404) { aendern = null; loeschenId = ''; await laden(); }
          zeigen({ fehler: fehler.message });
        }
      }

      const lesen = form => ({
        empfaenger: form.empfaenger.value, empfaengerIban: form.empfaengerIban.value, betrag: form.betrag.value,
        verwendungszweck: form.verwendungszweck.value, turnus: form.turnus.value,
        ersterAusfuehrungstag: form.ersterAusfuehrungstag.value, enddatum: form.enddatum.value,
      });
      const koerper = f => JSON.stringify({ ...f, betrag: betragAus(f.betrag), enddatum: f.enddatum || undefined });

      function verdrahten() {
        const formNeu = flaeche.querySelector('#neu');
        formNeu.addEventListener('submit', e => {
          e.preventDefault();
          neu = lesen(formNeu);
          ausfuehren(() => Aventa.api('/api/dauerauftraege', { method: 'POST', body: koerper(neu) }),
            'Dauerauftrag gespeichert.', () => { neu = leerNeu(); });
        });
        const formAe = flaeche.querySelector('#aendern');
        // UC-016 A6 Schritt 1: mit der Wahl die gespeicherten Angaben in die Felder übernehmen.
        formAe.dauerauftragAendern.addEventListener('change', () => {
          const d = liste.find(x => x.dauerauftragId === formAe.dauerauftragAendern.value);
          if (!d) return;
          const f = felderVon(d);
          for (const [name, wert] of Object.entries(f)) formAe[name].value = wert;
          aendern = { id: d.dauerauftragId, felder: f };
        });
        formAe.addEventListener('submit', e => {
          e.preventDefault();
          aendern = { id: formAe.dauerauftragAendern.value, felder: lesen(formAe) };
          const { id, felder } = aendern;
          ausfuehren(() => Aventa.api(`/api/dauerauftraege/${encodeURIComponent(id)}`, { method: 'PUT', body: koerper(felder) }),
            'Dauerauftrag geändert.', () => { aendern = null; });
        });
        const formLoe = flaeche.querySelector('#loeschen');
        formLoe.addEventListener('submit', e => {
          e.preventDefault();
          loeschenId = formLoe.dauerauftragLoeschen.value;
          zeigen({ abfrage: true });
        });
        // UC-016 A7, A9: erst nach „Ja“ löschen; „Nein“ zeigt die Daueraufträge ohne Meldung.
        flaeche.querySelector('#nein')?.addEventListener('click', () => zeigen());
        flaeche.querySelector('#ja')?.addEventListener('click', () =>
          ausfuehren(() => Aventa.api(`/api/dauerauftraege/${encodeURIComponent(loeschenId)}`, { method: 'DELETE' }),
            'Dauerauftrag gelöscht.', () => { loeschenId = ''; }));
      }

      await laden();
      zeigen();
    },
  });
})();
