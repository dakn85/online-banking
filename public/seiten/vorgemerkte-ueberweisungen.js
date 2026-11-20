/* UC-017 Vorgemerkte Überweisungen: Liste nach Ausführungstag, Löschen an der Zeile erst nach Sicherheitsabfrage.
   Maske: docs/ui/vorgemerkte-ueberweisungen.html (Inhalt und Namen). Welche Aufträge die Kundin sieht und löschen darf, entscheidet der Dienst (BR-0080). */
(function () {
  const { html, symbol } = Aventa;

  const zeile = a => `<li data-zeile data-auftrag="${html(a.auftragsId)}"><div class="zeile">
      <span class="zeile__symbol zeile__symbol--messing" aria-hidden="true">${symbol('uhr', 18)}</span>
      <div class="zeile__haupt">
        <span class="zeile__titel" data-feld="Empfänger">${html(a.empfaenger)}</span>
        <span class="zeile__unter" data-feld="Verwendungszweck">${html(a.verwendungszweck)}</span>
        <span class="zeile__meta"><span class="iban" data-feld="IBAN des Empfängers">${Aventa.iban(a.empfaengerIban)}</span></span>
      </div>
      <div class="zeile__wert"><span class="zeile__betrag zahl" data-feld="Betrag in Euro">${Aventa.euro(a.betrag)}</span><small>am <span data-feld="Ausführungstag">${Aventa.datum(a.ausfuehrungstag)}</span></small></div>
      <div class="zeile__aktionen"><button type="button" class="symbolknopf symbolknopf--gefahr" data-loeschen="${html(a.auftragsId)}" aria-label="Löschen" title="Löschen">${symbol('muell')}</button></div>
    </div></li>`;

  Aventa.seite('/vorgemerkte-ueberweisungen', {
    titel: 'Vorgemerkte Überweisungen',
    async zeigen(flaeche) {
      let auftraege = [];
      let loeschenId = '';
      const kopf = document.getElementById('kopf-aktion');
      kopf.innerHTML = `<a class="knopf knopf--haupt" href="/ueberweisung">${symbol('plus', 18)}Neue Überweisung</a>`;

      function zeigen({ erfolg = '', fehler = '', abfrage = false } = {}) {
        const a = auftraege.find(x => x.auftragsId === loeschenId);
        flaeche.innerHTML = `<a class="zurueck" href="/ueberweisung">${symbol('zurueck', 16)}Zur Überweisung</a>
          <div class="seite vorgemerkt">
          ${Aventa.meldungen({ erfolg, fehler })}
          <section class="abschnitt" aria-labelledby="liste-titel">
            <div class="abschnitt__kopf"><h2 id="liste-titel">Terminüberweisungen</h2><span class="zusatz">Ansehen und vor der Ausführung löschen</span></div>
            ${auftraege.length ? `<div class="flaeche"><ul class="liste" data-felder="Ausführungstag|Empfänger|IBAN des Empfängers|Betrag in Euro|Verwendungszweck">${auftraege.map(zeile).join('')}</ul></div>`
              : `<div class="flaeche leer">${symbol('uhr')}<strong>Sie haben keine vorgemerkten Überweisungen.</strong>Eine Überweisung mit Ausführungstag erscheint hier, bis die Bank sie ausführt.</div>`}
          </section>
          ${abfrage && a ? Aventa.rueckfrage({ frage: 'Vorgemerkten Auftrag löschen?', text: `${a.empfaenger}, ${Aventa.euro(a.betrag)} am ${Aventa.datum(a.ausfuehrungstag)}. Die Bank führt ihn dann nicht aus.` }) : ''}
        </div>`;
        verdrahten();
      }

      async function laden() { auftraege = await Aventa.api('/api/terminueberweisungen'); }

      function verdrahten() {
        // UC-017 Schritt 3 und 4: erst nachfragen, nicht sofort löschen.
        flaeche.querySelectorAll('[data-loeschen]').forEach(k => k.addEventListener('click', () => {
          loeschenId = k.dataset.loeschen;
          zeigen({ abfrage: true });
        }));
        const frage = flaeche.querySelector('#rueckfrage');
        if (!frage) return;
        Aventa.oeffnen(frage);
        // UC-017 A2: „Nein“ zeigt die Aufträge ohne Meldung.
        frage.querySelector('[data-nein]').addEventListener('click', () => zeigen());
        frage.addEventListener('cancel', e => { e.preventDefault(); zeigen(); });
        // UC-017 Schritt 5 und 6: „Ja“ löscht endgültig.
        frage.querySelector('[data-ja]').addEventListener('click', async () => {
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
