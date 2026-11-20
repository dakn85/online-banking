---
name: oberflaeche
description: Gestaltungsleitbild der Aventa-Bank-Oberfläche (public/). Lesen vor jeder Änderung an Seiten, Stylesheet oder Rahmen – neue Seite, neue Liste, neues Formular, Meldung, Dialog. Legt Seitenmuster, Bausteine, Farben und die Regeln für Telefon und Akzeptanztests fest.
---

# Oberfläche der Aventa Bank

Online-Banking für Privatkunden. Die Oberfläche soll sich anfühlen wie eine gute Banking-App: ruhig, klar, vertrauenswürdig, auf dem Telefon genauso bedienbar wie am Schreibtisch.

## Woher was kommt

- **Inhalt und Namen** stehen in der Spezifikation: `docs/ui/*.html` (Masken), Use Cases und Regeln. Beschriftungen, Knöpfe, Meldungen und Spaltennamen übernimmst du wörtlich.
- **Anordnung und Aussehen** stehen hier. Die Masken sind Drahtmodelle: Sie zeigen, *was* auf einer Seite steht, nicht *wie*. Eine Maske mit Tabelle und drei Formularen untereinander wird hier zu einer Liste mit Aktionen an der Zeile und einem Seitenblatt.
- Weicht eine Seite von diesem Leitbild ab, gleiche sie an; braucht eine neue Funktion ein Muster, das es hier nicht gibt, ergänze es hier im selben Pull Request.

## Haltung

- **Eine kräftige Stelle je Seite, alles andere ruhig.** Kräftig sind nur die Vermögenskarte im Finanzstatus und die Debitkarte: Tannengrün mit dem Guillochen-Muster der Anmeldeseite (`Marke.guilloche`). Sonst weiße Flächen auf hellem Grau-Grün, feine Linien, keine Schatten (nur Blatt und Dialog schweben).
- **Geld steht rechts und ist groß.** Beträge mit Tabellenziffern, rechtsbündig; Eingänge grün (`.plus`), Ausgänge in Tinte, nur ein negativer Saldo rot (`.minus`).
- **Die Aktion sitzt am Gegenstand.** Ändern und Löschen stehen an der Zeile, nicht in einer Auswahlliste „… zum Ändern“. Überweisen steht am Girokonto und an der Vorlage.
- **Eine Hauptaktion je Seite**, rechts im Seitenkopf (`#kopf-aktion`, `.knopf--haupt`); auf dem Telefon schwebt sie über der Tab-Leiste.
- **Leere Zustände leiten.** Statt „Keine Einträge“: was hier erscheinen wird und der Knopf, um anzufangen (`.leer`).

## Marke und Grundlagen (styles.css, `:root`)

| Token | Wert | Wofür |
|---|---|---|
| `--tanne` | #0f3d36 | Hauptknöpfe, aktive Navigation, Vermögenskarte |
| `--messing` | #b8893a | Akzent: Zahl am Postfach, ungelesen, Fokusring |
| `--grund` / `--flaeche` | #f3f5f4 / #fff | Seitengrund / Flächen |
| `--tinte`, `--tinte-2`, `--tinte-3` | | Text, Nebentext, Hinweise |
| `--plus`, `--minus` (+ `-hell`) | | Eingang, negativer Saldo, Fehler |

Schrift: Inter 400/500/600, Ziffern tabellarisch. Seitentitel 30 px, Abschnitte 18 px, Text 15 px, Hinweise 13 px. Radien: Flächen 20 px, Felder 10 px, Knöpfe und Etiketten rund. Farben nie direkt im Seitenskript, nur über Tokens und Klassen.

## Rahmen

- Desktop: helle Seitenleiste links (Navigation in Gruppen „Zahlungen“ und „Service“, Kunde unten), Inhalt bis 1120 px.
- Telefon (≤ 860 px): Tab-Leiste unten (Übersicht, Überweisen, Aufträge, Postfach, Mehr); „Mehr“ schiebt die ganze Navigation von unten herein. Jede Funktion steht in der Navigation `#hauptnavigation`.
- Unterseiten eines Kontos (Umsätze, Ausgabenanalyse, Debitkarte, Kontoauszug) markieren „Finanzstatus“ (`BEREICH` in `app.js`) und haben oben einen Zurück-Verweis (`.zurueck`).

## Seitenmuster

1. **Übersicht** (Finanzstatus): Vermögenskarte mit Schnellzugriff, Konten als Karten (`.kontenliste`, das Girokonto doppelt breit), darunter Vorschau und Verweise (`.uebersicht`).
2. **Liste** (Umsätze, Daueraufträge, Vorlagen, Vorgemerkte): Kopf mit Hauptaktion, ggf. Filterleiste (`.filterleiste`, Segmentschalter `.segmente` statt Auswahlliste bei 2–4 Möglichkeiten), dann **eine** Fläche mit der Liste. Anlegen und Ändern im **Blatt**, Löschen über die **Rückfrage**.
3. **Lesen** (Postfach): Liste links, geöffneter Eintrag rechts; ein Klick auf die Zeile öffnet.
4. **Formular** (Überweisung, Umbuchung, Tageslimit, Daten, Kontoauszug): `.formseite` mit `.formkarte` links (bündig mit dem Titel) und `.seitenkarte` rechts für den Kontext (Konto, Limit, Verweise). Mehrstufig mit `.schritte`. Felder in sinnvollen Paaren (`.raster-2`), Beträge in `.feld--betrag`.

## Bausteine (app.js `Aventa.*`, styles.css)

- **Listenzeile** `.liste > li > .zeile`: Rund mit Kürzel (`Aventa.kuerzel`) oder Symbol, `.zeile__haupt` (Titel, Unterzeile, `.zeile__meta` mit `.etikett`), `.zeile__wert` (Betrag, darunter klein), `.zeile__aktionen` (`.symbolknopf` mit `aria-label` und `title`). Ganze Zeile anklickbar: `button.zeile__oeffnen` mit unsichtbarem Text.
- **Gruppen** (Umsätze nach Tag): `section.tag[data-gruppe]` mit `.tag__kopf`, alle in einer `.flaeche`.
- **Blatt** `Aventa.blatt({ id, titel, unter, inhalt, aktion, fehler })` + `Aventa.oeffnen(dialog, { still, beiZu })`: Seitenblatt rechts, auf dem Telefon von unten. Ablehnungen des Dienstes erscheinen im Blatt, die Eingaben bleiben stehen (`still: true` öffnet ohne Einblenden).
- **Rückfrage** `Aventa.rueckfrage({ frage, text, nein, ja })`: kleiner Dialog „Sicherheitsabfrage“, „Nein“/„Abbrechen“ links mit Fokus, die gefährliche Aktion rot.
- **Meldungen** `Aventa.meldungen({ erfolg, fehler })` oben auf der Seite (`role="status"` / `role="alert"`).
- **Symbole** `Aventa.symbol(name)`: 20×20, Strich 1,6, Liste in `SYMBOLE` (app.js). Neue Symbole im selben Stil ergänzen.
- **Format**: `Aventa.euro`, `Aventa.datum` (TT.MM.JJJJ), `Aventa.iban` (Vierergruppen), `Aventa.html` für jeden Text aus dem Dienst.
- **Abrufe** `Aventa.api(pfad)`; was nur ergänzt (Vorschau, Zähler), mit `{ nebenbei: true }`: Es leitet ohne Sitzung nicht zur Anmeldung um.

## Verbote

- Keine `<table>` für Listen von Gegenständen (Umsätze, Aufträge, Nachrichten, Vorlagen). Eine Tabelle nur, wenn Werte wirklich spaltenweise verglichen werden.
- Keine Formulare „Neu“, „Ändern“, „Löschen“ untereinander auf einer Seite; keine Auswahlliste, um den Gegenstand einer Aktion zu wählen.
- Keine Begrüßung außer auf dem Finanzstatus, keine Großbuchstaben-Etiketten, keine erfundenen Produktaussagen in Hinweisen.

## Akzeptanztests und Oberfläche

Die Steps (`acceptance/tests/StepImplementation.ts`) lesen die Oberfläche über feste Merkmale, nicht über das Aussehen:

- Eine Liste trägt `data-felder="Name|Name|…"` mit den Spaltennamen der Szenarien (wie ein Tabellenkopf), jede Zeile `data-zeile`, jeder Wert `data-feld="Name"` um genau den angezeigten Text. Ein Feld, das eine Zeile nicht zeigt, gilt als leer; ein Feld der Gruppe außerhalb der Zeilen (Buchungstag) gilt für jede Zeile der Gruppe. Helfer: `listenzeilen`, `zeileMit`.
- Formulare haben `aria-label` mit dem Namen aus der Maske, Felder sichtbare `<label>`. Die Sicherheitsabfrage ist ein `dialog` mit dem Namen „Sicherheitsabfrage“ (Helfer `sicherheitsabfrage`).
- Wer eine Seite umbaut, zieht die Steps mit, ohne eine Prüfung abzuschwächen: gleiche Werte, gleiche Reihenfolge, gleiche Meldungen. Szenarien unter `acceptance/specs/` bleiben unverändert.

## Prüfen, bevor du fertig meldest

1. `npm run build`, Dienst mit `PORT=18300 TEST_MODE=1 node dist/main.js` starten.
2. Fotos: `node scripts/fotos.cjs http://localhost:18300 /tmp/fotos` (Desktop 1440×900 und Telefon 390×844, alle Seiten, Blatt und Rückfrage) und **ansehen**: Nichts abgeschnitten oder überlappend, Inhalt bündig mit dem Titel, Telefon ohne waagerechtes Scrollen.
3. Ganze Suite: `scripts/akzeptanztests.sh`, dazu `npm test`.
