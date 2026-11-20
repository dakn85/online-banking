/* Rahmen nach der Anmeldung: Kunde in der Leiste, Navigation, und je Adresse eine Seite.
   Eine Seite (Skript in app.html nach diesem) meldet sich mit Aventa.seite(pfad, { titel, zeigen(flaeche, kunde) }) an.
   Die Bausteine (Liste, Blatt, Rückfrage, Meldung) beschreibt .claude/skills/oberflaeche/SKILL.md. */
(function () {
  const seiten = {};
  const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  const html = wert => String(wert ?? '').replace(/[&<>"]/g, z => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[z]);

  /** Symbole auf 20×20, Strich wie die Navigation. */
  const SYMBOLE = {
    ueberweisen: 'M3.5 7h12m-3.5-3.5L15.5 7 12 10.5M16.5 13h-12M8 9.5 4.5 13 8 16.5',
    umbuchen: 'M6 3.5v13M6 16.5 3.5 14M6 16.5 8.5 14M14 16.5v-13M14 3.5 11.5 6M14 3.5 16.5 6',
    dauerauftrag: 'M16 10a6 6 0 1 1-1.8-4.3M16 3.5v3h-3M10 7v3.2l2 1.3',
    tageslimit: 'M3.5 15.5a6.5 6.5 0 1 1 13 0M10 15.5l3-4.5M3.5 15.5h13',
    person: 'M10 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 16.5c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5',
    postfach: 'M3.5 5.5h13v9h-13zM3.5 6l6.5 5 6.5-5',
    plus: 'M10 4v12M4 10h12',
    stift: 'M12.5 4.5l3 3L7 16H4v-3zM11 6l3 3',
    muell: 'M4 6h12M8 6V4.5h4V6M6 6l.7 9.5h6.6L14 6',
    schliessen: 'M5 5l10 10M15 5L5 15',
    zurueck: 'M12 4.5 6.5 10l5.5 5.5',
    weiter: 'M8 4.5l5.5 5.5L8 15.5',
    herunterladen: 'M10 3.5v9M6 9l4 4 4-4M4 16.5h12',
    analyse: 'M10 3.5a6.5 6.5 0 1 0 6.5 6.5H10zM12.5 2.5v5h5a5 5 0 0 0-5-5z',
    auszug: 'M5 2.5h7l3 3v12H5zM8 9h4M8 12h4M8 15h2',
    karte: 'M3 5.5h14v9H3zM3 8.5h14M6 12h3',
    uhr: 'M10 16.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM10 6.5V10l2.5 1.5',
    tauschen: 'M7 3.5v13M7 16.5 4.5 14M7 16.5 9.5 14M13 16.5v-13M13 3.5 10.5 6M13 3.5 15.5 6',
    schloss: 'M5.5 9h9v7.5h-9zM7.5 9V6.5a2.5 2.5 0 0 1 5 0V9',
    offen: 'M5.5 9h9v7.5h-9zM7.5 9V6.5a2.5 2.5 0 0 1 4.8-1',
    vorlage: 'M7.5 9a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5zM2.5 16c.6-2.7 2.6-4.2 5-4.2s4.4 1.5 5 4.2M13 4a2.5 2.5 0 0 1 0 4.8M14.5 11.9c1.6.4 2.7 1.7 3 4',
    giro: 'M3 7h14v9H3zM3 10h14',
    tagesgeld: 'M4 14l4-4 3 3 5-6M12 7h4v4',
    leer: 'M3.5 11.5 6 4.5h8l2.5 7v4h-13zM3.5 11.5h4l1 2h3l1-2h4',
  };
  const symbol = (name, groesse = 20) => `<svg class="symbol" width="${groesse}" height="${groesse}" viewBox="0 0 20 20" aria-hidden="true"><path d="${SYMBOLE[name] || ''}"/></svg>`;

  window.Aventa = {
    seite(pfad, definition) { seiten[pfad] = definition; },
    euro: betrag => euro.format(betrag),
    html,
    symbol,
    /** „DE02500105175407324911“ → „DE02 5001 0517 5407 3249 11“ */
    iban: wert => String(wert ?? '').replace(/\s+/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim(),
    /** „2026-12-24“ → „24.12.2026“ (Anzeigeformat TT.MM.JJJJ) */
    datum: iso => (iso ? String(iso).slice(0, 10).split('-').reverse().join('.') : ''),
    /** Zwei Anfangsbuchstaben für das Rund an einer Listenzeile. */
    kuerzel(name) {
      const woerter = String(name ?? '').replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean);
      return ((woerter[0]?.[0] || '') + (woerter[1]?.[0] || woerter[0]?.[1] || '')).toUpperCase();
    },
    /** Erfolg und Fehler über der Liste; leer bleibt unsichtbar (die Tests lesen role status und alert). */
    meldungen({ erfolg = '', fehler = '' } = {}) {
      return `<p class="meldung meldung--erfolg" role="status"${erfolg ? '' : ' hidden'}>${html(erfolg)}</p>
        <p class="meldung meldung--fehler" role="alert"${fehler ? '' : ' hidden'}>${html(fehler)}</p>`;
    },
    /** Seitenblatt zum Anlegen und Ändern: Kopf, Felder, Fuß mit Abbrechen und der Hauptaktion. */
    blatt({ id, titel, unter = '', formular, inhalt, aktion, fehler = '' }) {
      return `<dialog class="blatt" id="${id}" aria-labelledby="${id}-titel">
        <form novalidate aria-label="${html(formular || titel)}">
          <div class="blatt__kopf"><div><h2 id="${id}-titel">${html(titel)}</h2>${unter ? `<p>${html(unter)}</p>` : ''}</div>
            <button type="button" class="symbolknopf" data-schliessen aria-label="Schließen" title="Schließen">${symbol('schliessen')}</button></div>
          <div class="blatt__inhalt">
            <p class="meldung meldung--fehler" role="alert"${fehler ? '' : ' hidden'}>${html(fehler)}</p>
            ${inhalt}
          </div>
          <div class="blatt__fuss"><button type="button" class="knopf knopf--still" data-schliessen>Abbrechen</button><button type="submit" class="knopf knopf--haupt">${html(aktion)}</button></div>
        </form>
      </dialog>`;
    },
    /** Sicherheitsabfrage als kleiner Dialog; „nein“ steht links und hat den Fokus. */
    rueckfrage({ frage, text = '', nein = 'Nein', ja = 'Ja', gefahr = true }) {
      return `<dialog class="rueckfrage" id="rueckfrage" aria-label="Sicherheitsabfrage" aria-describedby="rueckfrage-frage">
        <h2 id="rueckfrage-frage">${html(frage)}</h2>
        ${text ? `<p>${html(text)}</p>` : ''}
        <div class="rueckfrage__aktionen"><button type="button" class="knopf" data-nein autofocus>${html(nein)}</button><button type="button" class="knopf ${gefahr ? 'knopf--gefahr' : 'knopf--haupt'}" data-ja>${html(ja)}</button></div>
      </dialog>`;
    },
    /** Öffnet einen Dialog der Fläche modal; „Schließen“ und Esc rufen beiZu. still: ohne Einblenden (nach einer Ablehnung). */
    oeffnen(dialog, { beiZu = () => {}, still = false } = {}) {
      if (!dialog) return;
      if (still) dialog.style.animation = 'none';
      dialog.showModal();
      dialog.querySelectorAll('[data-schliessen]').forEach(k => k.addEventListener('click', () => { dialog.close(); beiZu(); }));
      dialog.addEventListener('cancel', () => beiZu());
      dialog.addEventListener('click', e => { if (e.target === dialog && dialog.classList.contains('blatt')) { dialog.close(); beiZu(); } });
    },
    /** BR-0086: Zahl ungelesener Nachrichten am Navigationseintrag; ab 1 sichtbar, sonst ohne Zahl. */
    postfachZahl(anzahl) {
      const zahl = document.getElementById('postfach-zahl');
      for (const ort of [zahl, ...document.querySelectorAll('[data-postfach-zahl]')]) {
        ort.textContent = anzahl > 0 ? String(anzahl) : '';
        ort.hidden = !(anzahl > 0);
      }
      zahl.dataset.geladen = '1';
    },
    /** Ruft den Dienst; ohne Sitzung (401) geht es zur Anmeldung. nebenbei: Abrufe, die nur ergänzen (Vorschau, Zähler), leiten nicht um. */
    async api(pfad, { nebenbei = false, ...optionen } = {}) {
      const antwort = await fetch(pfad, { headers: { 'Content-Type': 'application/json' }, ...optionen });
      if (antwort.status === 401 && !nebenbei) { location.href = '/anmelden'; throw new Error('abgemeldet'); }
      const daten = antwort.status === 204 ? null : await antwort.json().catch(() => null);
      if (!antwort.ok) throw Object.assign(new Error((daten && daten.fehler) || 'Anfrage fehlgeschlagen'), { status: antwort.status, daten });
      return daten;
    },
  };

  const BEREICH = {
    '/umsaetze': '/finanzstatus', '/ausgabenanalyse': '/finanzstatus', '/debitkarte': '/finanzstatus', '/kontoauszug': '/finanzstatus',
    '/vorgemerkte-ueberweisungen': '/ueberweisung',
  };

  function tageszeit() {
    const h = new Date().getHours();
    return h < 11 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend';
  }

  async function start() {
    document.getElementById('zeichen').outerHTML = Marke.zeichen();
    const kunde = await Aventa.api('/api/sitzung');
    document.getElementById('kunde-name').textContent = `${kunde.vorname} ${kunde.nachname}`;
    // Die Nummer bleibt zusammen; umbrechen darf nur davor.
    document.getElementById('kunde-nummer').innerHTML = `Kundennummer <span class="nummer">${Aventa.html(kunde.kundennummer)}</span>`;
    document.getElementById('kunde-kuerzel').textContent = `${kunde.vorname[0] || ''}${kunde.nachname[0] || ''}`;
    // Telefon: „Mehr“ schiebt die ganze Navigation von unten herein; ein Tipp daneben schließt sie.
    const rahmen = document.querySelector('.rahmen');
    const menue = document.getElementById('menue');
    const umschalten = offen => {
      menue.setAttribute('aria-expanded', String(offen));
      rahmen.classList.toggle('rahmen--menue', offen);
    };
    menue.addEventListener('click', () => umschalten(menue.getAttribute('aria-expanded') !== 'true'));
    rahmen.addEventListener('click', e => { if (rahmen.classList.contains('rahmen--menue') && !e.target.closest('.leiste, #menue')) umschalten(false); });
    document.getElementById('abmelden').addEventListener('click', async () => {
      await fetch('/api/abmeldung', { method: 'POST' });
      location.href = '/anmelden';
    });
    const pfad = location.pathname;
    // Seiten eines Kontos gehören zum Finanzstatus, vorgemerkte Aufträge zur Überweisung: Die Navigation zeigt, wo man ist.
    const bereich = BEREICH[pfad] || pfad;
    document.querySelectorAll('.navigation a, .tableiste a').forEach(a => {
      if (a.dataset.seite === bereich) a.setAttribute('aria-current', 'page');
    });
    // Die Begrüßung steht auf der Startseite, nicht über jeder Seite.
    if (pfad === '/finanzstatus' || !seiten[pfad]) document.getElementById('begruessung').textContent = `${tageszeit()}, ${kunde.vorname}`;
    const seite = seiten[pfad] || seiten['/finanzstatus'];
    document.getElementById('seitentitel').textContent = seite.titel;
    document.title = `${seite.titel} · Aventa Bank`;
    // Die Zahl steht auf jeder Seite; eine Antwort, die ausbleibt, hält die Seite nicht auf.
    Aventa.api('/api/nachrichten', { nebenbei: true }).then(l => Aventa.postfachZahl(l.anzahlUngelesen), () => {});
    await seite.zeigen(document.getElementById('seite'), kunde, new URLSearchParams(location.search));
  }
  // Seitenskripte stehen in app.html hinter diesem und melden sich vorher an.
  document.addEventListener('DOMContentLoaded', start);
})();
