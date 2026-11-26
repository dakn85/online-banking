/* UC-001 Finanzstatus: Gesamtvermögen, alle Konten als Karten mit eigenem Namen (A3), darunter die letzten Umsätze des Girokontos und die Aufträge.
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
          ${k.art !== k.kontoname ? `<span data-feld="Art">${html(k.art)}</span>` : ''}
          ${k.eigenerName ? `<span class="konto__eigener"><span class="unsichtbar">Eigener Name: </span><span data-feld="Eigener Name">${html(k.eigenerName)}</span></span>` : ''}</div>
        <button type="button" class="symbolknopf konto__benennen" data-name-vergeben="${html(k.iban)}" aria-label="Name vergeben" title="Name vergeben">${symbol('stift')}</button>
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
      await darstellen(flaeche, status, { erfolg: ausgefuehrt });
    },
  });

  /** Baut die Seite aus dem Finanzstatus; meldung: Erfolg oder Ablehnung über der Seite. */
  async function darstellen(flaeche, status, meldung) {
      const stand = new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const giro = status.konten.find(k => k.art === 'Girokonto');
      flaeche.innerHTML = `<div class="seite finanzstatus">
        ${Aventa.meldungen(meldung)}
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
          <div class="kontenliste" data-felder="Kontoname|Eigener Name|Art|IBAN|Saldo|Dispositionsrahmen|Verfügbarer Betrag">${status.konten.map(karte).join('')}</div>
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

      // UC-001 Schritt 9: „Name vergeben“ an jeder Kontokarte.
      flaeche.querySelectorAll('[data-name-vergeben]').forEach(knopf => knopf.addEventListener('click', () =>
        nameVergeben(flaeche, status.konten.find(k => k.iban === knopf.dataset.nameVergeben))));

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
  }

  /** Lädt den Finanzstatus neu und zeigt die Meldung über der Seite. */
  async function neuLaden(flaeche, meldung) {
    await darstellen(flaeche, await Aventa.api('/api/konten'), meldung);
  }

  const NAME_LEER = 'Bitte geben Sie den eigenen Namen an.';
  const NAME_LAENGE = 'Der eigene Name darf höchstens 60 Zeichen lang sein.';

  /** UC-001 A3 bis A5: Blatt „Eigenen Namen vergeben“ für genau dieses Konto, gefüllt mit dem bisherigen eigenen Namen. */
  function nameVergeben(flaeche, k) {
    flaeche.querySelector('#blatt-eigener-name')?.remove();
    flaeche.insertAdjacentHTML('beforeend', Aventa.blatt({
      id: 'blatt-eigener-name', titel: 'Eigenen Namen vergeben', unter: `${k.kontoname}, ${iban(k.iban).replace(/ /g, '\u00a0')}`,
      inhalt: `<p class="hinweis">Der eigene Name erscheint im Finanzstatus neben dem Kontonamen; der Kontoname bleibt unverändert.</p>
        <div class="feld"><label for="eigener-name">Eigener Name</label>
          <input id="eigener-name" name="eigenerName" required maxlength="60" autocomplete="off" placeholder="Urlaubskasse" value="${html(k.eigenerName || '')}"></div>`,
      aktion: 'Speichern',
    }));
    const blatt = flaeche.querySelector('#blatt-eigener-name');
    const form = blatt.querySelector('form');
    const hinweis = blatt.querySelector('.meldung--fehler');
    const feld = form.eigenerName;
    const zu = () => { if (blatt.open) blatt.close(); blatt.remove(); };
    Aventa.oeffnen(blatt, { beiZu: () => blatt.remove() });
    const ablehnen = meldung => {
      hinweis.textContent = meldung;
      hinweis.hidden = false;
      feld.setAttribute('aria-invalid', 'true');
      feld.focus();
    };

    // A3 Schritte 2 bis 5: Vorabprüfung im Browser (ADR-004), maßgeblich ist der Dienst. A4 am Feld, die Eingabe bleibt stehen; A5 über der Seite.
    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      const speichern = form.querySelector('[type="submit"]');
      if (speichern.disabled) return;
      hinweis.hidden = true;
      feld.removeAttribute('aria-invalid');
      const name = feld.value.trim();
      if (!name) return ablehnen(NAME_LEER);
      if ([...name].length > 60) return ablehnen(NAME_LAENGE);
      speichern.disabled = true;
      try {
        await Aventa.api(`/api/konten/${encodeURIComponent(k.iban)}/name`, { method: 'PUT', body: JSON.stringify({ eigenerName: name }) });
        zu();
        await neuLaden(flaeche, { erfolg: 'Eigener Name gespeichert.' });
      } catch (fehler) {
        if (fehler.status === 400) ablehnen(fehler.message);
        else if (fehler.status === 404) { zu(); await neuLaden(flaeche, { fehler: fehler.message }); }
        else throw fehler;
      } finally {
        speichern.disabled = false;
      }
    });
  }
})();
