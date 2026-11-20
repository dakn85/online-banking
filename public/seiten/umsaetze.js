/* UC-003 Umsätze eines Kontos: Konto, Suche und Filter, darunter die Umsätze nach Buchungstag, neueste zuerst.
   UC-022 Lastschrift zurückgeben an der Zeile, Rückfrage als Dialog. Maske: docs/ui/umsaetze.html */
(function () {
  const { html, symbol } = Aventa;
  const WOCHENTAG = new Intl.DateTimeFormat('de-DE', { weekday: 'long', timeZone: 'UTC' });

  /** Die Abfrage in fester Reihenfolge; ein leerer Filter fehlt (BR-0010). Das Ergebnis trägt sie als data-abfrage. */
  function abfrage(form) {
    const p = new URLSearchParams();
    const suchtext = form.suchtext.value.trim();
    if (suchtext) p.set('suchtext', suchtext);
    if (form.zeitraumVon.value) p.set('von', form.zeitraumVon.value);
    if (form.zeitraumBis.value) p.set('bis', form.zeitraumBis.value);
    if (form.richtung.value !== 'alle') p.set('richtung', form.richtung.value);
    return p.toString();
  }

  /** UC-022: „Zurückgeben“ an einer SEPA-Lastschrift, „Zurückgegeben“ nach der Rückgabe, sonst nichts. */
  function rueckgabe(u) {
    if (u.zurueckgegeben) return '<span class="etikett" data-feld="Rückgabe">Zurückgegeben</span>';
    if (!u.sepaLastschrift) return '';
    return `<span data-feld="Rückgabe"><button type="button" class="knopf knopf--klein" data-rueckgabe="${html(u.umsatzId)}" data-gegenpartei="${html(u.gegenpartei)}" data-betrag="${html(Aventa.euro(Math.abs(u.betrag)))}">Zurückgeben</button></span>`;
  }

  const zeile = u => `<li data-zeile><div class="zeile">
      <span class="zeile__symbol${u.betrag >= 0 ? ' zeile__symbol--plus' : ''}" aria-hidden="true">${html(Aventa.kuerzel(u.gegenpartei))}</span>
      <div class="zeile__haupt">
        <span class="zeile__titel" data-feld="Gegenpartei">${html(u.gegenpartei)}</span>
        <span class="zeile__unter" data-feld="Verwendungszweck">${html(u.verwendungszweck)}</span>
        <span class="zeile__meta"><span class="etikett" data-feld="Kategorie">${html(u.kategorie)}</span></span>
      </div>
      <div class="zeile__wert">
        <span class="zeile__betrag zahl${u.betrag < 0 ? '' : ' plus'}" data-feld="Betrag">${Aventa.euro(u.betrag)}</span>
        <small>Saldo <span class="zahl" data-feld="Saldo danach">${Aventa.euro(u.saldoDanach)}</span></small>
      </div>
      <div class="zeile__aktionen">${rueckgabe(u)}</div>
    </div></li>`;

  /** Umsätze nach Buchungstag gruppiert; der Tag steht einmal über seinen Umsätzen (TT.MM.JJJJ). */
  function gruppen(umsaetze) {
    const tage = [];
    for (const u of umsaetze) {
      const letzter = tage[tage.length - 1];
      if (letzter && letzter.tag === u.buchungstag) letzter.umsaetze.push(u);
      else tage.push({ tag: u.buchungstag, umsaetze: [u] });
    }
    return tage.map(t => `<section class="tag" data-gruppe aria-label="${Aventa.datum(t.tag)}">
        <h3 class="tag__kopf"><span>${WOCHENTAG.format(new Date(`${t.tag}T00:00:00Z`))}, <span data-feld="Buchungstag">${Aventa.datum(t.tag)}</span></span></h3>
        <ul class="liste">${t.umsaetze.map(zeile).join('')}</ul>
      </section>`).join('');
  }

  Aventa.seite('/umsaetze', {
    titel: 'Umsätze',
    async zeigen(flaeche, _kunde, parameter) {
      const gesucht = (parameter && parameter.get('iban') || '').replace(/\s+/g, '').toUpperCase();
      const { konten } = await Aventa.api('/api/konten');
      const konto = konten.find(k => k.iban === gesucht);
      flaeche.innerHTML = `<a class="zurueck" href="/finanzstatus">${symbol('zurueck', 16)}Finanzstatus</a>
        <div class="seite">
          <div class="kontokopf">
            ${konto ? `<div class="kontokopf__konto"><span class="konto__symbol">${symbol(konto.art === 'Kreditkarte' ? 'karte' : konto.art === 'Tagesgeldkonto' ? 'tagesgeld' : 'giro')}</span>
              <div><strong>${html(konto.kontoname)}</strong><span class="iban">${Aventa.iban(konto.iban)}</span> · <span class="zahl">Saldo ${Aventa.euro(konto.saldo)}</span></div></div>` : '<div></div>'}
            <div class="kontokopf__aktionen">
              ${konto && konto.art === 'Girokonto' ? `<a class="knopf knopf--klein knopf--still" href="/ausgabenanalyse?iban=${encodeURIComponent(konto.iban)}">${symbol('analyse', 18)}Ausgabenanalyse</a>` : ''}
              ${konto ? `<a class="knopf knopf--klein knopf--still" href="/kontoauszug?iban=${encodeURIComponent(konto.iban)}">${symbol('auszug', 18)}Kontoauszug</a>` : ''}
              <button type="button" class="knopf knopf--klein" id="umsaetze-export">${symbol('herunterladen', 18)}Als CSV exportieren</button>
            </div>
          </div>
          ${konto ? `<form class="filterleiste flaeche" aria-label="Filter" onsubmit="return false">
            <label class="feld feld--suche"><span>Suche</span><input name="suchtext" type="search" placeholder="Gegenpartei oder Verwendungszweck" autocomplete="off"></label>
            <label class="feld feld--datum"><span>Zeitraum von</span><input name="zeitraumVon" type="date"></label>
            <label class="feld feld--datum"><span>Zeitraum bis</span><input name="zeitraumBis" type="date"></label>
            <div class="feld"><span id="richtung-titel">Ein-/Ausgang</span>
              <div class="segmente" role="radiogroup" aria-labelledby="richtung-titel">
                ${[['alle', 'Alle'], ['eingang', 'Eingang'], ['ausgang', 'Ausgang']].map(([w, t]) => `<label><input type="radio" name="richtung" value="${w}"${w === 'alle' ? ' checked' : ''}>${t}</label>`).join('')}
              </div></div>
          </form>` : ''}
          <section id="umsaetze-ergebnis" class="umsaetze" aria-label="Umsätze" aria-live="polite"></section>
        </div>
        <dialog id="umsaetze-rueckfrage" class="rueckfrage" aria-label="Lastschrift zurückgeben"></dialog>`;
      const ergebnis = flaeche.querySelector('#umsaetze-ergebnis');
      const form = flaeche.querySelector('form.filterleiste');

      let laufend = 0;
      async function laden(meldung) {
        const q = form ? abfrage(form) : '';
        const nummer = ++laufend;
        let inhalt;
        try {
          const { umsaetze } = await Aventa.api(`/api/konten/${encodeURIComponent(gesucht || '-')}/umsaetze${q ? `?${q}` : ''}`);
          inhalt = umsaetze.length ? `<div class="flaeche umsatzliste" data-felder="Buchungstag|Gegenpartei|Verwendungszweck|Kategorie|Betrag|Saldo danach|Rückgabe">${gruppen(umsaetze)}</div>`
            : `<div class="flaeche leer">${symbol('leer')}<strong>Keine Umsätze</strong>Für diese Auswahl gibt es keine Umsätze.</div>`;
        } catch (fehler) {
          if (fehler.status !== 400 && fehler.status !== 404) throw fehler;
          // A3 und A4: nur die Meldung, keine Liste und kein Hinweis nach A2.
          inhalt = `<p class="meldung" role="alert">${html(fehler.message)}</p>`;
        }
        if (nummer !== laufend) return;
        ergebnis.innerHTML = inhalt;
        if (meldung) ergebnis.insertAdjacentHTML('afterbegin', meldung);
        ergebnis.dataset.abfrage = q;
      }

      /** UC-022 Schritte 1 bis 7: Rückfrage zeigen, bei „Bestätigen“ die Rückgabe auslösen, Umsätze neu laden und die Meldung zeigen. */
      const rueckfrage = flaeche.querySelector('#umsaetze-rueckfrage');
      ergebnis.addEventListener('click', ev => {
        const knopf = ev.target.closest('button[data-rueckgabe]');
        if (!knopf) return;
        rueckfrage.innerHTML = `<h2>Lastschrift über ${html(knopf.dataset.betrag)} von ${html(knopf.dataset.gegenpartei)} zurückgeben?</h2>
          <p>Die Rückgabe lässt sich nicht rückgängig machen.</p>
          <div class="rueckfrage__aktionen"><button type="button" class="knopf" data-abbrechen autofocus>Abbrechen</button><button type="button" class="knopf knopf--haupt" data-bestaetigen>Bestätigen</button></div>`;
        rueckfrage.dataset.umsatz = knopf.dataset.rueckgabe;
        rueckfrage.showModal();
      });
      rueckfrage.addEventListener('click', async ev => {
        if (ev.target.closest('[data-abbrechen]')) { rueckfrage.close(); return; }
        const bestaetigen = ev.target.closest('[data-bestaetigen]');
        if (!bestaetigen || bestaetigen.disabled) return;
        bestaetigen.disabled = true;
        let meldung;
        try {
          const r = await Aventa.api(`/api/konten/${encodeURIComponent(gesucht)}/umsaetze/${encodeURIComponent(rueckfrage.dataset.umsatz)}/rueckgaben`, { method: 'POST' });
          meldung = `<p class="meldung meldung--erfolg" role="status">Lastschrift zurückgegeben: ${html(Aventa.euro(r.gutschrift.betrag))} gutgeschrieben, neuer Saldo ${html(Aventa.euro(r.gutschrift.saldoDanach))}.</p>`;
        } catch (fehler) {
          if (![400, 404, 422].includes(fehler.status)) throw fehler;
          meldung = `<p class="meldung" role="alert">${html(fehler.message)}</p>`;
        }
        await laden(meldung);
        rueckfrage.close();
      });

      /** UC-003 Schritte 9 und 10: die Datei mit den Filtern der Liste holen und herunterladen; Fehler als Meldung über der Liste. */
      async function exportieren() {
        const q = form ? abfrage(form) : '';
        const fehlgeschlagen = 'Der Export ist fehlgeschlagen. Bitte versuchen Sie es später erneut.';
        let meldung = '';
        try {
          const antwort = await fetch(`/api/konten/${encodeURIComponent(gesucht)}/umsaetze/export${q ? `?${q}` : ''}`);
          if (antwort.status === 401) { location.href = '/anmelden'; return; }
          if (antwort.ok) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(await antwort.blob());
            link.download = `umsaetze-${gesucht}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
          } else if ([400, 404, 422].includes(antwort.status)) {
            meldung = ((await antwort.json().catch(() => null)) || {}).fehler || fehlgeschlagen;
          } else {
            meldung = fehlgeschlagen;
          }
        } catch {
          meldung = fehlgeschlagen;
        }
        ergebnis.querySelector('.exportmeldung')?.remove();
        if (meldung) ergebnis.insertAdjacentHTML('afterbegin', `<p class="meldung exportmeldung" role="alert">${html(meldung)}</p>`);
      }

      flaeche.querySelector('#umsaetze-export').addEventListener('click', exportieren);
      if (form) {
        let warten;
        form.addEventListener('input', () => { clearTimeout(warten); warten = setTimeout(laden, 250); });
        form.addEventListener('change', () => { clearTimeout(warten); laden(); });
      }
      await laden();
    },
  });
})();
