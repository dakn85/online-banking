/* UC-021 Umbuchung zwischen eigenen Konten: Girokonto und Tagesgeldkonto in beide Richtungen, sofort, ohne IBAN-Eingabe und ohne TAN.
   Maske: docs/ui/umbuchung.html. Die Seite prüft vorab (ADR-004), maßgeblich ist der Dienst (BR-0088, BR-0089, BR-0092). */
(function () {
  const PAARUNG_FEHLER = 'Eine Umbuchung ist nur zwischen Girokonto und Tagesgeldkonto möglich.';
  const GRENZE_FEHLER = 'Der Betrag übersteigt den verfügbaren Betrag des Quellkontos.';
  const MINDESTBETRAG_FEHLER = 'Der Betrag muss mindestens 0,10 € betragen.';
  const ABGELEHNT = 'Die Umbuchung konnte nicht ausgeführt werden.';
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);
  const gruppiert = wert => wert.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();

  /** „3.200,00 €“ → 3200; null, wenn es kein Betrag mit höchstens zwei Nachkommastellen ist. */
  function alsBetrag(text) {
    const t = text.replace(/[\s €]/g, '');
    if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(t)) return null;
    return Number(t.replace(/\./g, '').replace(',', '.'));
  }
  /** BR-0092: neue Auftrags-Kennung je Umbuchung und nach jeder Ablehnung. */
  const neueKennung = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
  /** BR-0089: Girokonto Saldo plus Dispositionsrahmen, Tagesgeldkonto der Saldo. */
  const verfuegbar = konto => konto.verfuegbarerBetrag ?? konto.saldo;
  const beschreibung = k => `${k.kontoname} · ${gruppiert(k.iban)} · Saldo ${Aventa.euro(k.saldo)}${k.art === 'Girokonto' ? ` · verfügbar ${Aventa.euro(k.verfuegbarerBetrag)}` : ''}`;

  Aventa.seite('/umbuchung', {
    titel: 'Umbuchung',
    async zeigen(flaeche) {
      const { konten } = await Aventa.api('/api/konten');
      const umbuchbar = konten.filter(k => k.art === 'Girokonto' || k.art === 'Tagesgeldkonto');
      const giro = umbuchbar.find(k => k.art === 'Girokonto');
      const tagesgeld = umbuchbar.find(k => k.art === 'Tagesgeldkonto');
      // UC-021 Schritt 1: Girokonto als Quelle, Tagesgeldkonto als Ziel vorbelegt (ohne Tagesgeldkonto das Girokonto: Paarung unzulässig)
      const quelleVorbelegt = giro ?? umbuchbar[0];
      const zielVorbelegt = tagesgeld ?? quelleVorbelegt;
      let auftragsId = neueKennung();

      const optionen = auswahl => umbuchbar.map(k => `<option value="${html(k.iban)}"${k === auswahl ? ' selected' : ''}>${html(beschreibung(k))}</option>`).join('');
      flaeche.innerHTML = `<div class="ueberweisung"><div class="ueberweisung__raster">
        <form class="ueberweisung__form" novalidate aria-label="Umbuchung">
          <div><h2>Konten und Betrag</h2><p class="ueberweisung__unter">Sofortige Umbuchung zwischen Ihrem Girokonto und Ihrem Tagesgeldkonto.</p></div>
          <p class="meldung meldung--fehler" role="alert" hidden></p>
          <div class="feld"><label for="quellkonto">Quellkonto</label><select id="quellkonto" name="quellkonto">${optionen(quelleVorbelegt)}</select></div>
          <div class="feld"><label for="zielkonto">Zielkonto</label><select id="zielkonto" name="zielkonto">${optionen(zielVorbelegt)}</select></div>
          <div class="feld"><label for="betrag">Betrag in Euro</label>
            <input id="betrag" name="betrag" inputmode="decimal" autocomplete="off" placeholder="500,00"></div>
          <div class="ueberweisung__aktionen"><a class="knopf knopf--still" href="/finanzstatus">Abbrechen</a><button class="knopf knopf--haupt" type="submit">Umbuchen</button></div>
        </form></div></div>`;
      const form = flaeche.querySelector('form');
      const meldung = form.querySelector('[role="alert"]');
      const knopf = form.querySelector('button[type="submit"]');

      /** Zeigt die Meldung im Formular, behält die Eingaben, gibt den Knopf frei und vergibt eine neue Kennung (BR-0092). */
      function abgelehnt(text, feld) {
        meldung.textContent = text;
        meldung.hidden = false;
        form.querySelectorAll('[aria-invalid]').forEach(e => e.removeAttribute('aria-invalid'));
        if (feld) form[feld].setAttribute('aria-invalid', 'true');
        knopf.disabled = false;
        auftragsId = neueKennung();
      }

      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (knopf.disabled) return; // BR-0092: Sperre während des Absendens
        const quelle = umbuchbar.find(k => k.iban === form.quellkonto.value);
        const ziel = umbuchbar.find(k => k.iban === form.zielkonto.value);
        const betrag = alsBetrag(form.betrag.value);
        // UC-021 Schritt 3: Betrag (A1), Konten (A3), Betragsgrenze des Quellkontos (A2)
        if (betrag === null || Math.round(betrag * 100) < 10) return abgelehnt(MINDESTBETRAG_FEHLER, 'betrag');
        if (!quelle || !ziel || quelle === ziel || quelle.art === ziel.art) return abgelehnt(PAARUNG_FEHLER, 'zielkonto');
        if (Math.round(betrag * 100) > Math.round(verfuegbar(quelle) * 100)) return abgelehnt(GRENZE_FEHLER, 'betrag');
        knopf.disabled = true;
        meldung.hidden = true;
        try {
          await Aventa.api('/api/umbuchungen', { method: 'POST', body: JSON.stringify({ auftragsId, quellIban: quelle.iban, zielIban: ziel.iban, betrag, waehrung: 'EUR' }) });
          location.href = '/finanzstatus?umgebucht=1';
        } catch (fehler) {
          // A1 bis A3 Schritt 2: der Dienst nennt den Fachtext; A6: jeder andere Fehler
          if (fehler.status === 400 && fehler.message === MINDESTBETRAG_FEHLER) return abgelehnt(MINDESTBETRAG_FEHLER, 'betrag');
          if (fehler.status === 422 && fehler.message === PAARUNG_FEHLER) return abgelehnt(PAARUNG_FEHLER, 'zielkonto');
          if (fehler.status === 422 && fehler.message === GRENZE_FEHLER) return abgelehnt(GRENZE_FEHLER, 'betrag');
          abgelehnt(ABGELEHNT);
        }
      });
    },
  });
})();
