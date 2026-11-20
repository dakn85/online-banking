# PK-53: Terminüberweisung vormerken, anzeigen und vor Ausführung löschen

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich eine Überweisung für einen späteren Ausführungstag vormerken, meine vorgemerkten Aufträge sehen und vor der Ausführung löschen, damit ich Zahlungen zum Termin planen und zurücknehmen kann.

## Nicht im Scope

- Automatische Ausführung am Ausführungstag: Die Idee nennt nur Vormerken, Anzeigen und Löschen; ein zeitgesteuerter Ausführungsprozess mit Buchung und Umsatz ist eine spätere Stufe.
- Ändern eines vorgemerkten Auftrags: Die Idee nennt nur Anlegen, Anzeigen und Löschen, nicht das Ändern.
- Deckungsprüfung und Reservierung am Ausführungstag: Wird erst bei der Ausführung relevant, die nicht gefordert ist.
- Benachrichtigung über Vormerkung, Ausführung oder Fehlschlag: Nicht gefordert.
- Daueraufträge / wiederkehrende Überweisungen: Andere Funktion, nicht in der Idee.
- Anzeige vorgemerkter Aufträge im Finanzstatus oder in den Umsätzen: Nicht gefordert; Umsätze entstehen erst bei Ausführung.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Zustand nur im Speicher, Ausgangsstand über den Test-Reset | Geändert | Entscheidung geändert, Folgen geändert |
| Genau einmalige Ausführung über die von der Oberfläche vergebene Auftrags-Kennung | Geändert | Entscheidung geändert |
| Überweisung vom Girokonto ausführen | Geändert | Beschreibung geändert, Antwort 422 geändert |
| Demo-Testdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert |
| Lastdaten zurücksetzen (nur Testbetrieb) | Geändert | Beschreibung geändert |
| Vorgemerkte Aufträge der angemeldeten Kundin | Neu | Endpunkt neu |
| Terminüberweisung vormerken | Neu | Endpunkt neu |
| Vorgemerkten Auftrag löschen | Neu | Endpunkt neu |
| Terminueberweisungsauftrag | Neu | Schema neu |
| Terminueberweisung | Neu | Schema neu |
| Architektur | Geändert | Bausteinsicht geändert, Querschnittliche Konzepte geändert |
| Überweisung | Geändert | Beschreibung geändert, Attribut status geändert, Attribut erfasstAm geändert, und 1 weitere, Use Case UC-017 neu, Feld Ausführungstag neu, Aktion Vorgemerkte Überweisungen neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Genau einmalige Ausführung einer Überweisung | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Skizze geändert |
| Überweisung bestätigen | Geändert | Feld Ausführungstag neu, Aktion Bestätigen neu, Skizze geändert |
| Vorgemerkte Überweisungen | Neu | Maske neu |
| UC-002 Überweisung vom Girokonto | Geändert | Notizen geändert, A9 neu: Terminüberweisung vormerken, A10 neu: Ausführungstag nicht zulässig, und 4 weitere |
| BR-0005 Genau einmalige Ausführung | Geändert | Text geändert |
| BR-0079 Ausführungstag der Terminüberweisung | Neu | Neu in UC-002 |
| UC-017 Vorgemerkte Überweisungen verwalten | Neu | Use Case neu |
| BR-0080 Vorgemerkte Aufträge der angemeldeten Kundin | Neu | Neu in UC-017 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/terminueberweisung.spec`: Beim Vormerken gilt das Tageslimit nicht
- `acceptance/specs/terminueberweisung.spec`: Die Zusammenfassung zeigt bei einer Terminüberweisung den Ausführungstag
- `acceptance/specs/terminueberweisung.spec`: Ein Ausführungstag heute wird abgelehnt und keine Zusammenfassung gezeigt
- `acceptance/specs/terminueberweisung.spec`: Ein Ausführungstag heute wird beim Vormerken mit 422 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Ein Ausführungstag in 366 Tagen wird beim Vormerken mit 422 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Ein Ausführungstag in genau 365 Tagen wird angenommen
- `acceptance/specs/terminueberweisung.spec`: Ein Ausführungstag morgen wird beim Vormerken angenommen
- `acceptance/specs/terminueberweisung.spec`: Ein Betrag über dem verfügbaren Betrag wird beim Vormerken mit 422 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Ein doppelter Klick auf Bestätigen merkt die Terminüberweisung nur einmal vor
- `acceptance/specs/terminueberweisung.spec`: Ein fremdes Auftraggeberkonto wird beim Vormerken mit 403 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Ein Terminüberweisungsauftrag mit ungültiger IBAN wird mit 400 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Ein ungültiges Datum als Ausführungstag wird beim Vormerken mit 400 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Eine gelöschte Auftrags-Kennung kann beim Vormerken nicht erneut verwendet werden
- `acceptance/specs/terminueberweisung.spec`: Eine Terminüberweisung wird vorgemerkt und nichts gebucht
- `acceptance/specs/terminueberweisung.spec`: Eine wiederholte Auftrags-Kennung beim Vormerken legt keinen zweiten Auftrag an
- `acceptance/specs/terminueberweisung.spec`: Nach dem Vormerken entsteht kein Umsatz
- `acceptance/specs/terminueberweisung.spec`: Ohne Anmeldung wird das Vormerken mit 401 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Bricht die Kundin die Sicherheitsabfrage ab, bleibt der Auftrag vorgemerkt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Der vorgemerkte Auftrag einer Kundin erscheint nicht in der Liste einer anderen Kundin
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Die vorgemerkten Aufträge stehen nach Ausführungstag aufsteigend
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ein Auftrag einer anderen Kundin wird beim Löschen mit 404 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ein vorgemerkter Auftrag wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Eine unbekannte Auftrags-Kennung wird beim Löschen mit 404 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Eine vorgemerkte Überweisung steht mit Ausführungstag, Empfänger, Betrag und Verwendungszweck in der Liste
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne Anmeldung sind die vorgemerkten Überweisungen nicht erreichbar
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne Anmeldung wird das Löschen eines vorgemerkten Auftrags mit 401 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne Anmeldung wird die Liste der vorgemerkten Aufträge mit 401 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne vorgemerkten Auftrag zeigt die Maske einen Hinweis statt der Liste

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine
- **Überweisungsauftrag** (`src/ueberweisung.ts`, neues Modul `src/terminueberweisung.ts`): Vormerken, Liste, Löschen; gemeinsame Prüfungen (BR-0003, BR-0004, BR-0007, Mindestbetrag) werden aus `ausfuehren` herausgelöst und von beiden Wegen genutzt.
- **Seitenauslieferung** (`src/main.ts`): POST/GET `/api/terminueberweisungen`, DELETE `/api/terminueberweisungen/:auftragsId` hinter `nurAngemeldet('api')`; Seite `/vorgemerkte-ueberweisungen` hinter `nurAngemeldet('seite')` (NFR-001).
- **Testbetrieb** (`src/testdaten.ts`): beide Resets vergessen auch die vorgemerkten Aufträge und verbrauchten Kennungen der jeweiligen Gruppe (ADR-002).
- **Oberfläche** (`public/seiten/ueberweisung.js`, neu `public/seiten/vorgemerkte-ueberweisungen.js`, `finanzstatus.js`).

## Schritte
1. UC-002 A9/A10, BR-0079: Ausführungstag als `YYYY-MM-DD`; kein gültiges Kalenderdatum → 400; „heute“ ist der Kalendertag in Europe/Berlin (über `Intl` mit `timeZone`), zulässig morgen bis heute + 365 Tage, sonst 422 mit dem Text aus BR-0079.
2. UC-002 A9, BR-0005/ADR-003: eigene Ablage `vorgemerkt` je Kundin (Kennung → Auftrag) und eine Menge `verbraucht` je Kundin (nie gekappt). Wiederholung eines noch vorgemerkten Auftrags → 200 mit dem gespeicherten Auftrag; Kennung einer sofortigen Überweisung oder eines gelöschten Auftrags → 422 „Diese Auftrags-Kennung wurde bereits verwendet.“. Umgekehrt lehnt `POST /api/ueberweisungen` eine für eine Terminüberweisung verbrauchte Kennung mit 422 ab. Kein Buchen, kein Umsatz, keine Tageslimit-Prüfung (BR-0070 gilt erst bei Ausführung).
3. UC-017, BR-0080: Liste nach Ausführungstag, bei gleichem Tag nach Vormerkzeitpunkt (Einfügereihenfolge); Löschen nur eigener vorgemerkter Aufträge, sonst 404.
4. Oberfläche: Feld „Ausführungstag“ (`input type=date`), Prüfung BR-0079 im Browser (ADR-004), Zeile „Ausführungstag“ in der Zusammenfassung (TT.MM.JJJJ) nur bei Terminüberweisung, Bestätigen ruft dann POST /api/terminueberweisungen, Fehlerbehandlung nach A9 Schritt 5, A10, A11; Finanzstatus zeigt „Überweisung vorgemerkt.“. Neue Seite „Vorgemerkte Überweisungen“ mit Tabelle, Leerhinweis, Auswahl „Auftrag zum Löschen“, Sicherheitsabfrage Ja/Nein und Meldung „Vorgemerkter Auftrag gelöscht.“.
5. Unit-Tests (`test/terminueberweisung.test.ts`) für BR-0079, BR-0005 und BR-0080 (UC-017 WP-1); Gauge-Schritte für die neuen Szenarien.

## Rahmen
Keine neue Bibliothek, kein neues Muster.

## Entscheidungen

- Wie weit darf der Ausführungstag einer Terminüberweisung höchstens in der Zukunft liegen?
  **Antwort:** Höchstens 365 Tage ab heute
  _→ eingearbeitet in UC-002, BR-0079, UC-017, BR-0080, Überweisung, POST /api/test/reset, POST /api/test/lasttest/reset, GET /api/terminueberweisungen, POST /api/terminueberweisungen, DELETE /api/terminueberweisungen/{auftragsId}, Schema Terminueberweisungsauftrag, Schema Terminueberweisung, ueberweisung, ueberweisung-bestaetigen, vorgemerkte-ueberweisungen, NFR-001, NFR-002, vision, ADR-002, architektur, finanzstatus · 8cf06da_
- Darf der Ausführungstag auf ein Wochenende oder einen Feiertag fallen?
  **Antwort:** Jeder Kalendertag ab morgen ist erlaubt; die Ausführung ist nicht Teil der Story
  _→ eingearbeitet in UC-002, BR-0079, UC-017, BR-0080, Überweisung, POST /api/test/reset, POST /api/test/lasttest/reset, GET /api/terminueberweisungen, POST /api/terminueberweisungen, DELETE /api/terminueberweisungen/{auftragsId}, Schema Terminueberweisungsauftrag, Schema Terminueberweisung, ueberweisung, ueberweisung-bestaetigen, vorgemerkte-ueberweisungen, NFR-001, NFR-002, vision, ADR-002, architektur, finanzstatus · 8cf06da_
- Zählt das Tageslimit schon beim Vormerken?
  **Antwort:** Nein, beim Vormerken wird das Tageslimit nicht geprüft; es gilt erst bei der Ausführung
  _→ eingearbeitet in UC-002, BR-0079, UC-017, BR-0080, Überweisung, POST /api/test/reset, POST /api/test/lasttest/reset, GET /api/terminueberweisungen, POST /api/terminueberweisungen, DELETE /api/terminueberweisungen/{auftragsId}, Schema Terminueberweisungsauftrag, Schema Terminueberweisung, ueberweisung, ueberweisung-bestaetigen, vorgemerkte-ueberweisungen, NFR-001, NFR-002, vision, ADR-002, architektur, finanzstatus · 8cf06da_
- Gibt es eine Höchstzahl vorgemerkter Aufträge je Kundin?
  **Antwort:** Keine Höchstzahl
  _→ eingearbeitet in UC-002, BR-0079, UC-017, BR-0080, Überweisung, POST /api/test/reset, POST /api/test/lasttest/reset, GET /api/terminueberweisungen, POST /api/terminueberweisungen, DELETE /api/terminueberweisungen/{auftragsId}, Schema Terminueberweisungsauftrag, Schema Terminueberweisung, ueberweisung, ueberweisung-bestaetigen, vorgemerkte-ueberweisungen, NFR-001, NFR-002, vision, ADR-002, architektur, finanzstatus · 8cf06da_
- Was geschieht, wenn eine auftragsId erneut gesendet wird, nachdem der Auftrag gelöscht wurde, oder wenn sie schon für eine andere Überweisung der Kundin verwendet wurde (sofortige Überweisung oder anderer Inhalt)?
  **Antwort:** Die Kennung bleibt je Kundin für beide Überweisungsarten dauerhaft verbraucht. Jede Wiederholung außer der des noch vorgemerkten Auftrags (dort 200 wie bisher) wird mit 422 und dem Text „Diese Auftrags-Kennung wurde bereits verwendet.“ abgelehnt; es entsteht kein Auftrag. Das ergänzt die Antworten von POST /api/terminueberweisungen und BR-0005.
  _→ eingearbeitet in UC-002, BR-0005, POST /api/terminueberweisungen · a9533b2_
- Soll auch die Wiederholung der Kennung einer bereits ausgeführten sofortigen Überweisung über POST /api/ueberweisungen mit 422 statt wie bisher ohne erneute Buchung abgelehnt werden?
  **Antwort:** Nein, die Wiederholung derselben sofortigen Überweisung bleibt idempotent (A3 unverändert)
  _→ eingearbeitet in BR-0005 · a9533b2_
- Soll die Idempotenz-Ablage je Endpunkt getrennt geführt werden, während die Kennung je Kundin für beide Endpunkte verbraucht gilt?
  **Antwort:** Ja, getrennte Ablagen je Endpunkt, Verbrauch je Kkundin über beide
  _→ eingearbeitet in ADR-003 · b7cab8b_
