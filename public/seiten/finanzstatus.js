/* UC-001 Finanzstatus: Gesamtvermögen über der Tabelle, darunter alle Konten. Maske: docs/ui/finanzstatus.html */
(function () {
  const ARTSYMBOL = {
    Girokonto: '<path d="M3 7h14v9H3zM3 10h14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    Tagesgeldkonto: '<path d="M4 14l4-4 3 3 5-6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    Kreditkarte: '<rect x="3" y="5" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 8.5h14M6 12h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  };
  const SCHNELL = [
    ['/ueberweisung', 'Überweisen', 'M3.5 7h12m-3.5-3.5L15.5 7 12 10.5M16.5 13h-12M8 9.5 4.5 13 8 16.5'],
    ['/umbuchung', 'Umbuchen', 'M6 3.5v13M6 16.5 3.5 14M6 16.5 8.5 14M14 16.5v-13M14 3.5 11.5 6M14 3.5 16.5 6'],
    ['/dauerauftraege', 'Daueraufträge', 'M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3h-3M10 7v3.2l2 1.3'],
    ['/tageslimit', 'Tageslimit', 'M3.5 15.5a6.5 6.5 0 1 1 13 0M10 15.5l3-4.5M3.5 15.5h13'],
    ['/persoenliche-daten', 'Persönliche Daten', 'M10 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 16.5c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5'],
  ];
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
      // Schnellzugriff im Kopf des Finanzstatus (UC-015 Schritt 1: „Tageslimit“, UC-021 „Umbuchen“, UC-016, UC-020).
      const kopf = document.getElementById('kopf-aktion');
      kopf.className = 'schnell';
      kopf.setAttribute('role', 'group');
      kopf.setAttribute('aria-label', 'Schnellzugriff');
      kopf.innerHTML = SCHNELL.map(([href, name, pfad]) => `<a class="schnell__eintrag" href="${href}">
          <span class="schnell__symbol"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="${pfad}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>${name}</a>`).join('');
      // UC-002 Schritt 9: nach der Überweisung einmal die Meldung, die Adresse wird wieder schlicht.
      // UC-002 A9 Schritt 6: nach dem Vormerken „Überweisung vorgemerkt.“ bei unverändertem Saldo.
      const ausgefuehrt = parameter && parameter.get('ausgefuehrt') === '1' ? 'Überweisung ausgeführt.'
        : parameter && parameter.get('vorgemerkt') === '1' ? 'Überweisung vorgemerkt.'
        : parameter && parameter.get('umgebucht') === '1' ? 'Umbuchung ausgeführt.' : ''; // UC-021 Schritt 7
      if (ausgefuehrt) history.replaceState(null, '', '/finanzstatus');
      const stand = new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      flaeche.innerHTML = `${ausgefuehrt ? `<p class="meldung meldung--erfolg finanzstatus__meldung" role="status">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m5.5 9.2 2.3 2.3 4.7-4.9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${ausgefuehrt}</p>` : ''}
        <section class="vermoegen" aria-label="Gesamtvermögen">
          ${Marke.guilloche(600, 260).replace('class="guilloche"', 'class="guilloche vermoegen__muster"')}
          <div class="vermoegen__zahl">
            <p class="vermoegen__titel">Gesamtvermögen</p>
            <p class="vermoegen__summe" id="gesamtvermoegen">${Aventa.euro(status.gesamtvermoegen)}</p>
            <p class="vermoegen__stand">${status.konten.length} Konten, Stand ${stand} Uhr</p>
          </div>
        </section>
        <section class="konten" aria-labelledby="konten-titel">
          <h2 class="abschnitt" id="konten-titel">Ihre Konten</h2>
          <table class="kontentabelle konten__liste">
            <thead class="unsichtbar"><tr>
              <th scope="col">Kontoname</th><th scope="col">Art</th><th scope="col">IBAN</th><th scope="col" class="zahl">Saldo</th>
              <th scope="col" class="zahl">Dispositionsrahmen</th><th scope="col" class="zahl">Verfügbarer Betrag</th><th scope="col"><span class="unsichtbar">Aktion</span></th>
            </tr></thead>
            <tbody>
              ${status.konten.map(k => `<tr data-konto="${k.kontoname}">
                <th scope="row" class="konten__name"><span class="konto"><span class="konto__symbol konto__symbol--${k.art.toLowerCase()}"><svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">${ARTSYMBOL[k.art] || ''}</svg></span>${k.kontoname}</span></th>
                <td class="konten__art">${k.art}</td>
                <td class="iban konten__iban">${iban(k.iban)}</td>
                <td class="zahl konten__saldo${k.saldo < 0 ? ' minus' : ''}" data-titel="Saldo">${Aventa.euro(k.saldo)}</td>
                <td class="zahl konten__dispo" data-titel="Dispositionsrahmen">${betrag(k.dispositionsrahmen)}</td>
                <td class="zahl konten__verfuegbar" data-titel="Verfügbar">${betrag(k.verfuegbarerBetrag)}</td>
                <td class="aktion konten__aktion">${k.art === 'Girokonto' ? `<a class="knopf knopf--klein knopf--haupt" href="/ueberweisung">Überweisen</a>` : ''}<a class="knopf knopf--klein knopf--text" href="/umsaetze?iban=${encodeURIComponent(k.iban)}">Umsätze</a>${k.art === 'Girokonto' ? `<a class="knopf knopf--klein knopf--text" href="/ausgabenanalyse?iban=${encodeURIComponent(k.iban)}">Ausgabenanalyse</a><a class="knopf knopf--klein knopf--text" href="/debitkarte?iban=${encodeURIComponent(k.iban)}">Debitkarte</a>` : ''}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </section>`;
      // Der Schnellzugriff steht im Gesamtvermögen: Was man mit dem Geld tun kann, steht neben dem Geld.
      flaeche.querySelector('.vermoegen').append(kopf);
    },
  });
})();
