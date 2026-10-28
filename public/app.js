/* Rahmen nach der Anmeldung: Kunde im Kopf, Navigation, und je Adresse eine Seite.
   Eine Seite (Skript in app.html nach diesem) meldet sich mit Aventa.seite(pfad, { titel, zeigen(flaeche, kunde) }) an. */
(function () {
  const seiten = {};
  const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

  window.Aventa = {
    seite(pfad, definition) { seiten[pfad] = definition; },
    euro: betrag => euro.format(betrag),
    async api(pfad, optionen = {}) {
      const antwort = await fetch(pfad, { headers: { 'Content-Type': 'application/json' }, ...optionen });
      if (antwort.status === 401) { location.href = '/anmelden'; throw new Error('abgemeldet'); }
      const daten = antwort.status === 204 ? null : await antwort.json().catch(() => null);
      if (!antwort.ok) throw Object.assign(new Error((daten && daten.fehler) || 'Anfrage fehlgeschlagen'), { status: antwort.status, daten });
      return daten;
    },
  };

  const platzhalter = (titel, text) => ({
    titel,
    zeigen(flaeche) {
      flaeche.innerHTML = `<section class="vorbereitung">
        ${Marke.zeichen(96).replace('marke__zeichen', 'marke-klein')}
        <div><span class="etikett">In Vorbereitung</span><h2>${titel} folgt in Kürze</h2><p>${text}</p></div>
      </section>`;
    },
  });
  seiten['/finanzstatus'] = platzhalter('Finanzstatus', 'Hier sehen Sie bald alle Ihre Konten mit dem aktuellen Saldo auf einen Blick.');
  seiten['/ueberweisung'] = platzhalter('Überweisung', 'Hier überweisen Sie bald Geld von einem Ihrer Konten, im Inland und in den SEPA-Raum.');

  function tageszeit() {
    const h = new Date().getHours();
    return h < 11 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend';
  }

  async function start() {
    document.getElementById('zeichen').outerHTML = Marke.zeichen();
    const kunde = await Aventa.api('/api/sitzung');
    document.getElementById('kunde-name').textContent = `${kunde.vorname} ${kunde.nachname}`;
    document.getElementById('kunde-nummer').textContent = `Kundennummer ${kunde.kundennummer}`;
    document.getElementById('begruessung').textContent = `${tageszeit()}, ${kunde.vorname} ${kunde.nachname}`;
    document.getElementById('abmelden').addEventListener('click', async () => {
      await fetch('/api/abmeldung', { method: 'POST' });
      location.href = '/anmelden';
    });
    const pfad = location.pathname;
    document.querySelectorAll('.navigation a').forEach(a => {
      if (a.dataset.seite === pfad) a.setAttribute('aria-current', 'page');
    });
    const seite = seiten[pfad] || seiten['/finanzstatus'];
    document.getElementById('seitentitel').textContent = seite.titel;
    document.title = `${seite.titel} · Aventa Bank`;
    await seite.zeigen(document.getElementById('seite'), kunde, new URLSearchParams(location.search));
  }
  // Seitenskripte stehen in app.html hinter diesem und melden sich vorher an.
  document.addEventListener('DOMContentLoaded', start);
})();
