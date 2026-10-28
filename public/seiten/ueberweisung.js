/* UC-002 Überweisung vom Girokonto: Auftrag erfassen, Zusammenfassung bestätigen.
   Masken: docs/ui/ueberweisung.html, docs/ui/ueberweisung-bestaetigen.html */
(function () {
  const SEPA = new Set(('AD AT BE BG CH CY CZ DE DK EE ES FI FR GB GI GR HR HU IE IS IT LI LT LU LV MC MT NL NO PL PT RO SE SI SK SM VA').split(' '));
  const IBAN_FEHLER = 'Die IBAN ist ungültig oder gehört zu keinem SEPA-Land.';
  const BETRAG_FEHLER = 'Der Betrag übersteigt den verfügbaren Betrag des Girokontos.';
  const ABGELEHNT = 'Die Überweisung konnte nicht ausgeführt werden.';
  const normal = wert => wert.replace(/\s+/g, '').toUpperCase();
  const gruppiert = wert => normal(wert).replace(/(.{4})/g, '$1 ').trim();
  const html = wert => String(wert).replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);

  // BR-0003 wie im Dienst (src/ueberweisung.ts); der Dienst prüft beim Bestätigen noch einmal.
  function ibanGueltig(eingabe) {
    const iban = normal(eingabe);
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(iban) || !SEPA.has(iban.slice(0, 2))) return false;
    let rest = 0;
    for (const z of iban.slice(4) + iban.slice(0, 4)) for (const d of (/[A-Z]/.test(z) ? String(z.charCodeAt(0) - 55) : z)) rest = (rest * 10 + Number(d)) % 97;
    return rest === 1;
  }
  /** „3.200,00 €“ → 3200; null, wenn es kein Betrag mit höchstens zwei Nachkommastellen ist. */
  function alsBetrag(text) {
    const t = text.replace(/[\s €]/g, '');
    if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(t)) return null;
    return Number(t.replace(/\./g, '').replace(',', '.'));
  }
  /** BR-0005: neue Auftrags-Kennung je Zusammenfassung und nach jeder Ablehnung. */
  const kennung = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');

  Aventa.seite('/ueberweisung', {
    titel: 'Überweisung',
    async zeigen(flaeche) {
      const { konten } = await Aventa.api('/api/konten');
      const giro = konten.find(k => k.art === 'Girokonto');
      let eingabe = { empfaenger: '', empfaengerIban: '', betrag: '', verwendungszweck: '' };

      const schritte = aktiv => `<ol class="schritte" aria-label="Schritte">${['Auftrag', 'Bestätigen'].map((s, i) =>
        `<li${i === aktiv ? ' aria-current="step"' : ''}${i < aktiv ? ' class="erledigt"' : ''}><span>${i + 1}</span>${s}</li>`).join('')}</ol>`;
      const kontoKarte = `<aside class="ueberweisung__konto" aria-label="Auftraggeberkonto">
          <p class="ueberweisung__klein">Von</p>
          <p class="ueberweisung__kontoname">${html(giro.kontoname)}</p>
          <p class="iban">${gruppiert(giro.iban)}</p>
          <dl><div><dt>Saldo</dt><dd>${Aventa.euro(giro.saldo)}</dd></div>
              <div><dt>Verfügbarer Betrag</dt><dd id="verfuegbar">${Aventa.euro(giro.verfuegbarerBetrag)}</dd></div></dl>
        </aside>`;

      function auftrag(meldung = '', fehlerfeld = '') {
        const feld = (name, label, attr, hinweis = '') => `
          <div class="feld${fehlerfeld === name ? ' feld--fehler' : ''}">
            <label for="${name}">${label}</label>
            <input id="${name}" name="${name}" ${attr} value="${html(eingabe[name])}"${fehlerfeld === name ? ' aria-invalid="true"' : ''}>
            ${hinweis ? `<p class="hinweis">${hinweis}</p>` : ''}
          </div>`;
        flaeche.innerHTML = `<div class="ueberweisung">${schritte(0)}<div class="ueberweisung__raster">
          <form class="ueberweisung__form" novalidate aria-label="Überweisung">
            <div><h2>Empfänger und Betrag</h2><p class="ueberweisung__unter">Einmalige Überweisung von Ihrem Girokonto.</p></div>
            <p class="meldung meldung--fehler" role="alert"${meldung ? '' : ' hidden'}>${html(meldung)}</p>
            <div class="feld"><label for="auftraggeberkonto">Auftraggeberkonto</label>
              <input id="auftraggeberkonto" name="auftraggeberkonto" value="${html(giro.kontoname)} · ${gruppiert(giro.iban)}" readonly></div>
            ${feld('empfaenger', 'Empfänger', 'autocomplete="off" maxlength="70"')}
            ${feld('empfaengerIban', 'IBAN des Empfängers', 'autocomplete="off" spellcheck="false" maxlength="42"', 'Inland und SEPA-Raum')}
            ${feld('betrag', 'Betrag in Euro', 'inputmode="decimal" autocomplete="off" placeholder="0,00"', `Höchstens ${Aventa.euro(giro.verfuegbarerBetrag)}`)}
            <div class="feld"><label for="verwendungszweck">Verwendungszweck</label>
              <textarea id="verwendungszweck" name="verwendungszweck" maxlength="140" rows="2">${html(eingabe.verwendungszweck)}</textarea></div>
            <div class="ueberweisung__aktionen"><a class="knopf knopf--still" href="/finanzstatus">Abbrechen</a><button class="knopf knopf--haupt" type="submit">Weiter</button></div>
          </form>${kontoKarte}</div></div>`;
        const form = flaeche.querySelector('form');
        form.addEventListener('submit', e => {
          e.preventDefault();
          eingabe = { empfaenger: form.empfaenger.value.trim(), empfaengerIban: form.empfaengerIban.value.trim(), betrag: form.betrag.value.trim(), verwendungszweck: form.verwendungszweck.value.trim() };
          const betrag = alsBetrag(eingabe.betrag);
          if (!eingabe.empfaenger || !eingabe.empfaengerIban || !eingabe.betrag || !eingabe.verwendungszweck) return auftrag('Bitte füllen Sie alle Felder aus.');
          if (!ibanGueltig(eingabe.empfaengerIban)) return auftrag(IBAN_FEHLER, 'empfaengerIban');
          // BR-0004: größer als 0 und höchstens der verfügbare Betrag
          if (betrag === null || !(betrag > 0) || Math.round(betrag * 100) > Math.round(giro.verfuegbarerBetrag * 100)) return auftrag(BETRAG_FEHLER, 'betrag');
          bestaetigen(betrag);
        });
        if (meldung) (flaeche.querySelector('[aria-invalid="true"]') || flaeche.querySelector('[role="alert"]')).focus?.();
      }

      function bestaetigen(betrag) {
        const auftragsId = kennung();
        flaeche.innerHTML = `<div class="ueberweisung">${schritte(1)}<div class="ueberweisung__raster">
          <section class="ueberweisung__form" aria-label="Zusammenfassung">
            <div><h2>Überweisung bestätigen</h2><p class="ueberweisung__unter">Bitte prüfen Sie Ihre Angaben.</p></div>
            <p class="ueberweisung__betrag">${Aventa.euro(betrag)}</p>
            <dl class="zusammenfassung">
              <div><dt>Auftraggeberkonto</dt><dd>${html(giro.kontoname)} · ${gruppiert(giro.iban)}</dd></div>
              <div><dt>Empfänger</dt><dd>${html(eingabe.empfaenger)}</dd></div>
              <div><dt>IBAN des Empfängers</dt><dd class="iban">${gruppiert(eingabe.empfaengerIban)}</dd></div>
              <div><dt>Betrag in Euro</dt><dd>${Aventa.euro(betrag)}</dd></div>
              <div><dt>Verwendungszweck</dt><dd>${html(eingabe.verwendungszweck)}</dd></div>
            </dl>
            <div class="ueberweisung__aktionen"><a class="knopf knopf--still" href="/finanzstatus">Abbrechen</a><button class="knopf knopf--haupt" type="button" id="bestaetigen">Bestätigen</button></div>
          </section>${kontoKarte}</div></div>`;
        const knopf = flaeche.querySelector('#bestaetigen');
        knopf.addEventListener('click', async () => {
          if (knopf.disabled) return;
          knopf.disabled = true; // BR-0005: Sperre während des Absendens
          try {
            await Aventa.api('/api/ueberweisungen', {
              method: 'POST',
              body: JSON.stringify({ auftragsId, auftraggeberIban: giro.iban, empfaenger: eingabe.empfaenger, empfaengerIban: normal(eingabe.empfaengerIban), betrag, verwendungszweck: eingabe.verwendungszweck, waehrung: 'EUR' }),
            });
            location.href = '/finanzstatus?ausgefuehrt=1';
          } catch (fehler) {
            if (fehler.status === 400) return auftrag(IBAN_FEHLER, 'empfaengerIban');
            if (fehler.status === 422) return auftrag(BETRAG_FEHLER, 'betrag');
            auftrag(ABGELEHNT); // A6
          }
        });
      }

      auftrag();
    },
  });
})();
