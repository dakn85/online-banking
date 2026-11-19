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
| UC-002 Überweisung vom Girokonto | Geändert | Notizen geändert, A9 neu: Terminüberweisung vormerken, A10 neu: Ausführungstag nicht zulässig, und 2 weitere |
| BR-0079 Ausführungstag der Terminüberweisung | Neu | Neu in UC-002 |
| UC-017 Vorgemerkte Überweisungen verwalten | Neu | Use Case neu |
| BR-0080 Vorgemerkte Aufträge der angemeldeten Kundin | Neu | Neu in UC-017 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/terminueberweisung.spec`: Ein Ausführungstag heute wird abgelehnt und keine Zusammenfassung gezeigt
- `acceptance/specs/terminueberweisung.spec`: Ein Ausführungstag heute wird beim Vormerken mit 422 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Ein Ausführungstag in genau 365 Tagen wird angenommen
- `acceptance/specs/terminueberweisung.spec`: Ein Betrag über dem verfügbaren Betrag wird beim Vormerken mit 422 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Ein doppelter Klick auf Bestätigen merkt die Terminüberweisung nur einmal vor
- `acceptance/specs/terminueberweisung.spec`: Ein fremdes Auftraggeberkonto wird beim Vormerken mit 403 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Ein Terminüberweisungsauftrag mit ungültiger IBAN wird mit 400 abgelehnt
- `acceptance/specs/terminueberweisung.spec`: Eine Terminüberweisung wird vorgemerkt und nichts gebucht
- `acceptance/specs/terminueberweisung.spec`: Ohne Anmeldung wird das Vormerken mit 401 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Bricht die Kundin die Sicherheitsabfrage ab, bleibt der Auftrag vorgemerkt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Die vorgemerkten Aufträge stehen nach Ausführungstag aufsteigend
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ein vorgemerkter Auftrag wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Eine unbekannte Auftrags-Kennung wird beim Löschen mit 404 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Eine vorgemerkte Überweisung steht mit Ausführungstag, Empfänger, Betrag und Verwendungszweck in der Liste
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne Anmeldung sind die vorgemerkten Überweisungen nicht erreichbar
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne Anmeldung wird das Löschen eines vorgemerkten Auftrags mit 401 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne Anmeldung wird die Liste der vorgemerkten Aufträge mit 401 abgelehnt
- `acceptance/specs/vorgemerkte-ueberweisungen.spec`: Ohne vorgemerkten Auftrag zeigt die Maske einen Hinweis statt der Liste

## Aufgaben für die Umsetzung

- [ ] Zustand nur im Speicher, Ausgangsstand über den Test-Reset: Entscheidung geändert
- [ ] Zustand nur im Speicher, Ausgangsstand über den Test-Reset: Folgen geändert
- [ ] Demo-Testdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Lastdaten zurücksetzen (nur Testbetrieb): Beschreibung geändert
- [ ] Vorgemerkte Aufträge der angemeldeten Kundin: Endpunkt neu
- [ ] Terminüberweisung vormerken: Endpunkt neu
- [ ] Vorgemerkten Auftrag löschen: Endpunkt neu
- [ ] Terminueberweisungsauftrag: Schema neu
- [ ] Terminueberweisung: Schema neu
- [ ] Architektur: Bausteinsicht geändert
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Überweisung: Beschreibung geändert
- [ ] Überweisung: Attribut status geändert
- [ ] Überweisung: Attribut erfasstAm geändert
- [ ] Überweisung: Attribut ausfuehrungstag neu
- [ ] Zugriffsschutz des Finanzstatus: Anforderung geändert
- [ ] Zugriffsschutz des Finanzstatus: Maß geändert
- [ ] Zugriffsschutz des Finanzstatus: Gilt für geändert
- [ ] Genau einmalige Ausführung einer Überweisung: Anforderung geändert
- [ ] Genau einmalige Ausführung einer Überweisung: Maß geändert
- [ ] Genau einmalige Ausführung einer Überweisung: Gilt für geändert
- [ ] Finanzstatus: Skizze geändert
- [ ] Überweisung bestätigen: Feld Ausführungstag neu
- [ ] Überweisung bestätigen: Aktion Bestätigen neu
- [ ] Überweisung bestätigen: Skizze geändert
- [ ] Überweisung: Use Case UC-017 neu
- [ ] Überweisung: Feld Ausführungstag neu
- [ ] Überweisung: Aktion Vorgemerkte Überweisungen neu
- [ ] Überweisung: Skizze geändert
- [ ] Vorgemerkte Überweisungen: Maske neu
- [ ] UC-002: Notizen geändert
- [ ] UC-002: A9 neu: Terminüberweisung vormerken
- [ ] UC-002: A10 neu: Ausführungstag nicht zulässig
- [ ] UC-002: Erfolg 4 neu
- [ ] UC-002: BR-0079 neu: Ausführungstag der Terminüberweisung
- [ ] BR-0079: Neu in UC-002
- [ ] UC-017: Use Case neu
- [ ] BR-0080: Neu in UC-017
- [ ] Vision: Z-8 neu
- [ ] Vision: Abgrenzung geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-53 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-53 grün

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
  _→ noch nicht in der Spezifikation_
