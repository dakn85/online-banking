/* UC-001 Finanzstatus: Gesamtvermögen über der Tabelle, darunter alle Konten. Maske: docs/ui/finanzstatus.html */
(function () {
  const ARTSYMBOL = {
    Girokonto: '<path d="M3 7h14v9H3zM3 10h14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    Kreditkarte: '<rect x="3" y="5" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 8.5h14M6 12h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  };
  const iban = wert => wert.replace(/(.{4})/g, '$1 ').trim();
  // Konten ohne Dispositionsrahmen: Die Spalten bleiben, die Zellen sind leer.
  const betrag = wert => wert === undefined || wert === null ? '' : Aventa.euro(wert);

  Aventa.seite('/finanzstatus', {
    titel: 'Finanzstatus',
    async zeigen(flaeche, _kunde, parameter) {
      let status;
      try {
        status = await Aventa.api('/api/konten');
      } catch (fehler) {
        if (fehler.status !== 500) throw fehler;
        flaeche.innerHTML = `<p class="meldung" role="alert">Der Finanzstatus ist derzeit nicht möglich.</p>`;
        return;
      }
      // UC-002 Schritt 9: nach der Überweisung einmal die Meldung, die Adresse wird wieder schlicht.
      const ausgefuehrt = parameter && parameter.get('ausgefuehrt') === '1';
      if (ausgefuehrt) history.replaceState(null, '', '/finanzstatus');
      const stand = new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      flaeche.innerHTML = `${ausgefuehrt ? `<p class="meldung meldung--erfolg finanzstatus__meldung" role="status">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m5.5 9.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Überweisung ausgeführt.</p>` : ''}
        <section class="vermoegen" aria-label="Gesamtvermögen">
          <div>
            <p class="vermoegen__titel">Gesamtvermögen</p>
            <p class="vermoegen__summe" id="gesamtvermoegen">${Aventa.euro(status.gesamtvermoegen)}</p>
            <p class="vermoegen__stand">${status.konten.length} Konten · Stand ${stand} Uhr</p>
          </div>
          ${Marke.guilloche(600, 260).replace('class="guilloche"', 'class="guilloche vermoegen__muster"')}
        </section>
        <section class="konten">
          <h2 class="abschnitt">Ihre Konten</h2>
          <table class="kontentabelle">
            <thead><tr>
              <th scope="col">Kontoname</th><th scope="col">Art</th><th scope="col">IBAN</th><th scope="col" class="zahl">Saldo</th>
              <th scope="col" class="zahl">Dispositionsrahmen</th><th scope="col" class="zahl">Verfügbarer Betrag</th><th scope="col"><span class="unsichtbar">Aktion</span></th>
            </tr></thead>
            <tbody>
              ${status.konten.map(k => `<tr data-konto="${k.kontoname}">
                <th scope="row"><span class="konto"><span class="konto__symbol konto__symbol--${k.art.toLowerCase()}"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">${ARTSYMBOL[k.art] || ''}</svg></span>${k.kontoname}</span></th>
                <td class="leise">${k.art}</td>
                <td class="iban">${iban(k.iban)}</td>
                <td class="zahl${k.saldo < 0 ? ' minus' : ''}">${Aventa.euro(k.saldo)}</td>
                <td class="zahl leise">${betrag(k.dispositionsrahmen)}</td>
                <td class="zahl">${betrag(k.verfuegbarerBetrag)}</td>
                <td class="aktion"><a class="knopf knopf--klein knopf--text" href="/umsaetze?iban=${encodeURIComponent(k.iban)}">Umsätze</a>${k.art === 'Girokonto' ? ' <a class="knopf knopf--klein" href="/ueberweisung">Überweisen</a>' : ''}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </section>`;
    },
  });
})();
