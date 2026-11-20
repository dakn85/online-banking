/* UC-023 Persönliche Daten anzeigen und ändern: Anschrift, E-Mail-Adresse und Telefonnummer zeigen, mit TAN (Mock) speichern.
   Maske: docs/ui/persoenliche-daten.html. Die Seite prüft vorab (ADR-004), maßgeblich ist der Dienst (BR-0096, BR-0097). */
(function () {
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);

  const FELDER = [
    { name: 'strasse', label: 'Straße und Hausnummer', platzhalter: 'Lindenallee 12', autocomplete: 'street-address' },
    { name: 'postleitzahl', label: 'Postleitzahl', platzhalter: '50667', autocomplete: 'postal-code' },
    { name: 'ort', label: 'Ort', platzhalter: 'Köln', autocomplete: 'address-level2' },
    { name: 'email', label: 'E-Mail-Adresse', platzhalter: 'lena.hoffmann@example.org', autocomplete: 'email' },
    { name: 'telefonnummer', label: 'Telefonnummer', platzhalter: '+49 221 1234567', autocomplete: 'tel' },
    { name: 'tan', label: 'TAN', platzhalter: '123456', autocomplete: 'off' },
  ];

  /** Feldregeln des Datenmodells (Kunde) auf den bereinigten Werten; erste Verletzung als [Feld, Meldung] oder null. */
  function pruefen(w) {
    const strasse = w.strasse.trim(), ort = w.ort.trim(), email = w.email.trim(), telefon = w.telefonnummer.trim();
    if (!strasse) return ['strasse', 'Bitte geben Sie Straße und Hausnummer an.'];
    if (strasse.length > 100) return ['strasse', 'Die Straße darf höchstens 100 Zeichen lang sein.'];
    if (!/^[0-9]{5}$/.test(w.postleitzahl)) return ['postleitzahl', 'Die Postleitzahl muss aus 5 Ziffern bestehen.'];
    if (!ort) return ['ort', 'Bitte geben Sie den Ort an.'];
    if (ort.length > 60) return ['ort', 'Der Ort darf höchstens 60 Zeichen lang sein.'];
    if (email.length < 3 || email.length > 254 || !/^[^@ ]+@[^@ ]+\.[^@ ]+$/.test(email)) return ['email', 'Die E-Mail-Adresse ist ungültig.'];
    if (telefon.length < 6 || telefon.length > 20 || !/^\+?[0-9 /()-]+$/.test(telefon)) return ['telefonnummer', 'Die Telefonnummer ist ungültig.'];
    if (!/^[0-9]{6}$/.test(w.tan)) return ['tan', 'Die TAN muss aus 6 Ziffern bestehen.'];
    return null;
  }

  Aventa.seite('/persoenliche-daten', {
    titel: 'Persönliche Daten',
    async zeigen(flaeche) {
      let stand = await Aventa.api('/api/kunde');
      // Nach einer Ablehnung bleibt die Eingabe stehen (UC-023 A1, A2).
      let werte = { ...stand, tan: '' };

      function zeigen({ erfolg = '', fehler = '', feld = '' } = {}) {
        const felder = FELDER.map(f => `<div class="feld${feld === f.name ? ' feld--fehler' : ''}"><label for="pd-${f.name}">${f.label}</label>
          <input id="pd-${f.name}" name="${f.name}" autocomplete="${f.autocomplete}" placeholder="${html(f.platzhalter)}" value="${html(werte[f.name])}"${feld === f.name ? ' aria-invalid="true"' : ''}></div>`).join('');
        flaeche.innerHTML = `<div class="tageslimit persoenlich">
          <p class="meldung meldung--erfolg" role="status"${erfolg ? '' : ' hidden'}>${html(erfolg)}</p>
          <p class="meldung meldung--fehler" role="alert"${fehler ? '' : ' hidden'}>${html(fehler)}</p>
          <form class="ueberweisung__form" novalidate aria-label="Persönliche Daten ändern">
            <div><h2>Persönliche Daten ändern</h2><p class="ueberweisung__unter">Ihre Anschrift, E-Mail-Adresse und Telefonnummer. Jede Änderung bestätigen Sie mit einer TAN.</p></div>
            ${felder}
            <div class="ueberweisung__aktionen"><button class="knopf knopf--haupt" type="submit">Speichern</button></div>
          </form>
        </div>`;
        const form = flaeche.querySelector('form');
        form.addEventListener('submit', e => {
          e.preventDefault();
          speichern(Object.fromEntries(FELDER.map(f => [f.name, form.elements[f.name].value])));
        });
        if (feld) form.elements[feld].focus();
      }

      async function speichern(eingabe) {
        werte = eingabe;
        const verletzt = pruefen(eingabe);
        if (verletzt) return zeigen({ feld: verletzt[0], fehler: verletzt[1] });
        try {
          stand = await Aventa.api('/api/kunde', { method: 'PUT', body: JSON.stringify(eingabe) });
          werte = { ...stand, tan: '' };
          zeigen({ erfolg: 'Persönliche Daten gespeichert.' });
          Aventa.api('/api/nachrichten').then(l => Aventa.postfachZahl(l.anzahlUngelesen), () => {});
        } catch (fehler) {
          zeigen({ feld: fehler.status === 422 ? 'tan' : '', fehler: fehler.message });
        }
      }

      zeigen();
    },
  });
})();
