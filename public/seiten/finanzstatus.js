/* UC-001 Finanzstatus: Gesamtvermögen, alle Konten als Karten, darunter die letzten Umsätze des Girokontos und die Aufträge.
   Maske: docs/ui/finanzstatus.html (Inhalt und Namen; Anordnung nach .claude/skills/oberflaeche/SKILL.md). */
(function () {
  const { html, symbol, iban } = Aventa;
  const ARTSYMBOL = { Girokonto: 'giro', Tagesgeldkonto: 'tagesgeld', Kreditkarte: 'karte' };
  // Schnellzugriff (UC-015 Schritt 1: „Tageslimit“, UC-021 „Umbuchen“, UC-016, UC-023).
  const SCHNELL = [
    ['/ueberweisung', 'Überweisen', 'ueberweisen'],
    ['/umbuchung', 'Umbuchen', 'umbuchen'],
    ['/dauerauftraege', 'Daueraufträge', 'dauerauftrag'],
    ['/tageslimit', 'Tageslimit', 'tageslimit'],
    ['/persoenliche-daten', 'Persönliche Daten', 'person'],
  ];
  const betrag = wert => (wert === undefined || wert === null ? '' : Aventa.euro(wert));

  /** Eine Kontokarte; jeder Wert trägt data-feld mit dem Namen aus der Maske. */
  function karte(k) {
    const giro = k.art === 'Girokonto';
    const zusatz = [
      k.verfuegbarerBetrag !== undefined && k.verfuegbarerBetrag !== null ? `<span>Verfügbarer Betrag<b data-feld="Verfügbarer Betrag">${betrag(k.verfuegbarerBetrag)}</b></span>` : '',
      k.dispositionsrahmen !== undefined && k.dispositionsrahmen !== null ? `<span>Dispositionsrahmen<b data-feld="Dispositionsrahmen">${betrag(k.dispositionsrahmen)}</b></span>` : '',
    ].join('');
    const umsaetze = `/umsaetze?iban=${encodeURIComponent(k.iban)}`;
    return `<article class="konto${giro ? ' konto--haupt' : ''}" data-zeile data-konto="${html(k.kontoname)}" aria-labelledby="konto-${html(k.iban)}">
      <div class="konto__kopf">
        <span class="konto__symbol konto__symbol--${html(k.art.toLowerCase())}">${symbol(ARTSYMBOL[k.art] || 'giro')}</span>
        <div class="konto__name"><strong id="konto-${html(k.iban)}" data-feld="Kontoname">${html(k.kontoname)}</strong>
          ${k.art !== k.kontoname ? `<span data-feld="Art">${html(k.art)}</span>` : ''}</div>
      </div>
      <p class="konto__iban iban" data-feld="IBAN">${iban(k.iban)}</p>
      <div>
        <p class="konto__saldo-titel">Saldo</p>
        <p class="konto__saldo zahl${k.saldo < 0 ? ' minus' : ''}" data-feld="Saldo">${Aventa.euro(k.saldo)}</p>
      </div>
      ${zusatz ? `<div class="konto__werte">${zusatz}</div>` : ''}
      <div class="konto__aktionen">
        ${giro ? `<a class="knopf knopf--klein knopf--haupt" href="/ueberweisung">Überweisen</a>` : ''}
        <a class="knopf knopf--klein" href="${umsaetze}">Umsätze</a>
        ${giro ? `<a class="knopf knopf--klein knopf--still" href="/ausgabenanalyse?iban=${encodeURIComponent(k.iban)}">Ausgabenanalyse</a>
        <a class="knopf knopf--klein knopf--still" href="/debitkarte?iban=${encodeURIComponent(k.iban)}">Debitkarte</a>` : ''}
      </div>
    </article>`;
  }

  /** Eine Umsatzzeile ohne Aktionen (Vorschau im Finanzstatus). */
  const umsatzzeile = u => `<li><div class="zeile">
      <span class="zeile__symbol${u.betrag >= 0 ? ' zeile__symbol--plus' : ''}" aria-hidden="true">${html(Aventa.kuerzel(u.gegenpartei))}</span>
      <div class="zeile__haupt"><span class="zeile__titel">${html(u.gegenpartei)}</span><span class="zeile__unter">${html(u.verwendungszweck)}</span></div>
      <div class="zeile__wert"><span class="zeile__betrag zahl${u.betrag < 0 ? '' : ' plus'}">${Aventa.euro(u.betrag)}</span><small>${Aventa.datum(u.buchungstag)}</small></div>
      <span></span>
    </div></li>`;

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
      // UC-002 A9 Schritt 6: nach dem Vormerken „Überweisung vorgemerkt.“ bei unverändertem Saldo. UC-021 Schritt 7: Umbuchung.
      const ausgefuehrt = parameter && parameter.get('ausgefuehrt') === '1' ? 'Überweisung ausgeführt.'
        : parameter && parameter.get('vorgemerkt') === '1' ? 'Überweisung vorgemerkt.'
        : parameter && parameter.get('umgebucht') === '1' ? 'Umbuchung ausgeführt.' : '';
      if (ausgefuehrt) history.replaceState(null, '', '/finanzstatus');
      const stand = new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const giro = status.konten.find(k => k.art === 'Girokonto');
      flaeche.innerHTML = `<div class="seite finanzstatus">
        ${ausgefuehrt ? `<p class="meldung meldung--erfolg" role="status">${ausgefuehrt}</p>` : ''}
        <section class="vermoegen" aria-label="Gesamtvermögen">
          ${Marke.guilloche(900, 300).replace('class="guilloche"', 'class="guilloche vermoegen__muster"')}
          <div>
            <p class="vermoegen__titel">Gesamtvermögen</p>
            <p class="vermoegen__summe zahl" id="gesamtvermoegen">${Aventa.euro(status.gesamtvermoegen)}</p>
            <p class="vermoegen__stand">${status.konten.length} Konten, Stand ${stand} Uhr</p>
          </div>
          <div class="schnell" role="group" aria-label="Schnellzugriff">
            ${SCHNELL.map(([href, name, s]) => `<a class="schnell__eintrag" href="${href}"><span class="schnell__symbol">${symbol(s, 18)}</span>${name}</a>`).join('')}
          </div>
        </section>
        <section class="abschnitt" aria-labelledby="konten-titel">
          <div class="abschnitt__kopf"><h2 id="konten-titel">Ihre Konten</h2></div>
          <div class="kontenliste" data-felder="Kontoname|Art|IBAN|Saldo|Dispositionsrahmen|Verfügbarer Betrag">${status.konten.map(karte).join('')}</div>
        </section>
        <div class="abschnitt uebersicht">
          <section class="flaeche" aria-labelledby="letzte-titel">
            <div class="uebersicht__kopf"><h2 id="letzte-titel">Letzte Umsätze</h2>${giro ? `<a href="/umsaetze?iban=${encodeURIComponent(giro.iban)}">Alle anzeigen</a>` : ''}</div>
            <ul class="liste" id="letzte-umsaetze" aria-label="Letzte Umsätze des Girokontos"><li class="leer">Wird geladen …</li></ul>
          </section>
          <section class="flaeche" aria-labelledby="auftraege-titel">
            <div class="uebersicht__kopf"><h2 id="auftraege-titel">Aufträge und Service</h2></div>
            <ul class="verweise" id="auftraege"></ul>
          </section>
        </div>
      </div>`;

      // Vorschau und Zähler laden nach; was ausbleibt, lässt die Karten stehen.
      const liste = flaeche.querySelector('#letzte-umsaetze');
      if (giro) {
        Aventa.api(`/api/konten/${encodeURIComponent(giro.iban)}/umsaetze`, { nebenbei: true }).then(({ umsaetze }) => {
          liste.innerHTML = umsaetze.length ? umsaetze.slice(0, 5).map(umsatzzeile).join('') : '<li class="leer">Noch keine Umsätze.</li>';
        }, () => { liste.innerHTML = '<li class="leer">Die Umsätze lassen sich gerade nicht laden.</li>'; });
      } else liste.innerHTML = '<li class="leer">Kein Girokonto.</li>';
      const [dauer, termin, post] = await Promise.all([
        Aventa.api('/api/dauerauftraege', { nebenbei: true }).catch(() => null),
        Aventa.api('/api/terminueberweisungen', { nebenbei: true }).catch(() => null),
        Aventa.api('/api/nachrichten', { nebenbei: true }).catch(() => null),
      ]);
      const zahl = (liste, ein, mehr, keine) => !liste ? '' : liste.length === 1 ? ein : liste.length ? `${liste.length} ${mehr}` : keine;
      flaeche.querySelector('#auftraege').innerHTML = [
        ['/dauerauftraege', 'dauerauftrag', 'Ihre Daueraufträge', zahl(dauer, '1 Dauerauftrag', 'Daueraufträge', 'Keine Daueraufträge')],
        ['/vorgemerkte-ueberweisungen', 'uhr', 'Vorgemerkt', zahl(termin, '1 Terminüberweisung', 'Terminüberweisungen', 'Keine Terminüberweisung')],
        ['/postfach', 'postfach', 'Nachrichten', post ? (post.anzahlUngelesen ? `${post.anzahlUngelesen} ungelesen` : 'Alles gelesen') : ''],
        ['/empfaengervorlagen', 'vorlage', 'Vorlagen', 'Empfänger für Überweisungen'],
      ].map(([href, s, titel, unter]) => `<li><a href="${href}"><span class="zeile__symbol zeile__symbol--tanne">${symbol(s, 18)}</span><span>${titel}<small>${html(unter)}</small></span></a></li>`).join('');
    },
  });
})();
