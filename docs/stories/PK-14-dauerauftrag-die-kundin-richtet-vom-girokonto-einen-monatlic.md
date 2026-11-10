# PK-14: Dauerauftrag: Die Kundin richtet vom Girokonto einen monatlichen Dauerauftrag an einen Empfänger im SEPA-Raum ein …

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Dauerauftrag: Die Kundin richtet vom Girokonto einen monatlichen Dauerauftrag an einen Empfänger im SEPA-Raum ein (Betrag, Ausführungstag im Monat, erste Ausführung, Verwendungszweck), sieht ihre Daueraufträge in einer Liste und kann einen Dauerauftrag löschen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Daueraufträge der angemeldeten Kundin | Neu | Endpunkt neu |
| Dauerauftrag einrichten | Neu | Endpunkt neu |
| Dauerauftrag löschen | Neu | Endpunkt neu |
| Dauerauftrag | Neu | Schema neu, Entität neu |
| DauerauftragAnlegen | Neu | Schema neu |
| Messpunkt NFR-003: Antwortzeit von Finanzstatus und Überweisung | Geändert | Messpunkt geändert |
| Messpunkt NFR-004: Verfügbarkeit von Finanzstatus und Überweisung | Geändert | Messpunkt geändert |
| Zugriffsschutz des Finanzstatus | Geändert | Gilt für geändert |
| Antwortzeit von Finanzstatus und Überweisung | Geändert | Maß geändert, Gilt für geändert |
| Verfügbarkeit von Finanzstatus und Überweisung | Geändert | Maß geändert, Gilt für geändert |
| Daueraufträge | Neu | Maske neu |
| Finanzstatus | Geändert | Aktion Daueraufträge neu, Skizze geändert |
| UC-001 Finanzstatus anzeigen | Geändert | Schritt 8 neu |
| UC-005 Dauerauftrag einrichten, ansehen und löschen | Neu | Use Case neu |
| BR-0020 IBAN des Empfängers im Dauerauftrag | Neu | Neu in UC-005 |
| BR-0021 Betrag des Dauerauftrags | Neu | Neu in UC-005 |
| BR-0022 Ausführungstag im Monat | Neu | Neu in UC-005 |
| BR-0023 Erste Ausführung des Dauerauftrags | Neu | Neu in UC-005 |
| BR-0024 Daueraufträge der angemeldeten Kundin | Neu | Neu in UC-005 |
| BR-0025 Empfänger des Dauerauftrags | Neu | Neu in UC-005 |
| BR-0026 Verwendungszweck des Dauerauftrags | Neu | Neu in UC-005 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/dauerauftraege.spec`: Die Daueraufträge sind über den Knopf in der Zeile des Girokontos erreichbar
- `acceptance/specs/dauerauftraege.spec`: Ein abgelehntes Auftraggeberkonto zeigt die allgemeine Fehlermeldung
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit Ausführungstag außerhalb von 1 bis 28 wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit einem Betrag unter 0,01 Euro wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit einer ersten Ausführung in der Vergangenheit wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag mit IBAN außerhalb des SEPA-Raums wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag ohne Empfänger wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag ohne Verwendungszweck wird abgelehnt
- `acceptance/specs/dauerauftraege.spec`: Ein Dauerauftrag wird erst nach der Sicherheitsabfrage gelöscht
- `acceptance/specs/dauerauftraege.spec`: Ein monatlicher Dauerauftrag wird angelegt
- `acceptance/specs/dauerauftraege.spec`: Eine erste Ausführung am heutigen Kalendertag in UTC wird angenommen

## Technischer Entwurf

_Goran Art (Agent „PK-3 Online-Banking“), 2026-11-10_

**Bausteine:** Online-Banking-Dienst: Component „Dauerauftrag“ in `src/dauerauftraege.ts`, Routen und Seitenadresse in `src/main.ts` (Seitenauslieferung); Oberfläche: Seite `public/seiten/dauerauftraege.js`, Knopf in `public/seiten/finanzstatus.js`, Einbindung in `public/app.html`, Klassen in `public/styles.css`; Tests: `test/dauerauftraege.test.ts`, `acceptance/tests/StepImplementation.ts`.

**Schritte**
1. Entität Dauerauftrag, BR-0024, ADR-002: `src/dauerauftraege.ts` hält die Daueraufträge je Kennung der Kundin im Speicher; `zuruecksetzen()` leert sie und hängt an `POST /api/test/reset` (Ausgangsstand: keine Daueraufträge). Die `dauerauftragsId` vergibt der Dienst als `DA-<Jahr>-<laufende Nummer>` (Beispiel des Datenmodells). Die `auftraggeberIban` speichert und liefert er ohne Leerzeichen in Großbuchstaben.
2. UC-005 Schritt 4 und 5, `POST /api/dauerauftraege`: Der Dienst prüft in der Reihenfolge des Use Case: Empfänger (BR-0025: leer oder nur Leerzeichen „Der Empfänger ist ein Pflichtfeld.“, über 70 Zeichen „Der Empfänger darf höchstens 70 Zeichen lang sein.“), Verwendungszweck (BR-0026: „Der Verwendungszweck ist ein Pflichtfeld.“, über 140 Zeichen „Der Verwendungszweck darf höchstens 140 Zeichen lang sein.“), IBAN des Empfängers (BR-0020, mit `ibanGueltig` aus `src/ueberweisung.ts`, BR-0003), Betrag mindestens 0,01 Euro und auf Cent gerundet (BR-0021, ADR-005), Ausführungstag ganze Zahl 1 bis 28 (BR-0022), erste Ausführung nicht vor heute (BR-0023), jeweils 400 mit der Meldung der Regel; danach das Auftraggeberkonto über `girokonto()` (BR-0007, BR-0024), sonst 403. Ergebnis 201 mit dem Schema Dauerauftrag. Die Länge von Empfänger und Verwendungszweck zählt ohne Leerzeichen am Rand; gespeichert und geliefert wird die Eingabe der Kundin, wie sie ankam (BR-0025, BR-0026). „Heute“ ist der Kalendertag in UTC (Leitplanke Zeiten, wie der Buchungstag in BR-0012).
3. `GET /api/dauerauftraege` liefert die Daueraufträge der Kundin nach erster Ausführung aufsteigend; `DELETE /api/dauerauftraege/{dauerauftragsId}` löscht mit 204, fremde oder unbekannte Kennung 404 „Der Dauerauftrag wurde nicht gefunden.“ (BR-0024, UC-005 A7). Alle drei Routen hinter `nurAngemeldet('api')` (401, NFR-001).
4. Maske `dauerauftraege`, UC-005 Schritte 2, 3, 6, 7 und A2 bis A10: Seite `/dauerauftraege` mit Tabelle (Empfänger, IBAN, Betrag, Ausführungstag, Erste Ausführung, Verwendungszweck) oder dem Hinweis „Sie haben noch keinen Dauerauftrag.“, Formular „Neuer Dauerauftrag“ und „Dauerauftrag löschen“ mit Sicherheitsabfrage „Dauerauftrag löschen?“. „Betrag in Euro“ ist ein Textfeld im deutschen Format mit dem Platzhalter „50,00“; ein Betrag mit Punkt statt Komma geht als null an den Dienst und bekommt die Meldung aus BR-0021. Empfänger und Verwendungszweck begrenzt das Formular nicht mehr auf 70 und 140 Zeichen, damit die Meldungen aus A9 und A10 erscheinen können. Das Auftraggeberkonto ist fest das Girokonto aus `GET /api/konten`. Die Seite zeigt bei 400 die Meldung des Dienstes im Formular, bei jedem anderen Status „Der Dauerauftrag konnte nicht angelegt werden.“ (A8); die Eingaben bleiben stehen. Die Auswahl zum Löschen trägt die `dauerauftragsId` als Wert und zeigt den Empfänger.
5. Maske `finanzstatus`, UC-001 Schritt 8: Knopf „Daueraufträge“ in der Zeile des Girokontos zwischen „Umsätze“ und „Überweisen“, öffnet `/dauerauftraege`.
6. WP-1, WP-2: Unit-Tests am Modul für Empfänger und Verwendungszweck (leer, nur Leerzeichen, 70/71 und 140/141 Zeichen, Leerzeichen am Rand), IBAN, Betrag, Ausführungstag, erste Ausführung, Reihenfolge der Prüfungen, 403, 404 für fremde und unbekannte Kennung und 401 ohne Sitzung (an `nurAngemeldet`).
7. Akzeptanztests PK-14: Die beiden neuen Szenarien (ohne Empfänger, ohne Verwendungszweck) laufen mit den vorhandenen Steps. Relative Angaben („in 5 Tagen“, „gestern“) rechnet der Step ab dem heutigen UTC-Tag in ein Datum um. Für „Der Dienst antwortet auf das Anlegen mit dem Status 403“ tauscht der Step im abgehenden Aufruf das Auftraggeberkonto gegen die Kreditkarte, sodass der echte Dienst mit 403 antwortet; ein Testdoppel ist nicht nötig.

**Änderung am Rahmen:** keine neue Bibliothek und kein neues Muster. Der Dienst erhält eine fünfte Component „Dauerauftrag“; `docs/architecture.md` nennt bisher vier und ist nachzuziehen. ADR-004 (Prüfungen doppelt) wende ich hier nicht an: „Anlegen“ ruft den Dienst direkt, er prüft in der Reihenfolge des Use Case, und die Seite zeigt seine Meldung, wie bei den Empfängervorlagen (UC-004). Eine Eingabe, die sich nicht in den Vertrag umwandeln lässt (Betrag „abc“), schickt die Seite als null; der Dienst lehnt sie mit der Meldung der Regel ab. Für eine erste Ausführung, die kein Datum ist, und ein fehlendes Auftraggeberkonto nennt die Spezifikation keine Meldung; der Dienst antwortet an der Stelle von BR-0023 beziehungsweise von Schritt 5 mit 400 „Der Dauerauftrag ist unvollständig.“. Im Finanzstatus stehen am Girokonto drei Knöpfe; bei 1440 px Breite rückt „Überweisen“ in eine zweite Zeile, damit die Tabelle nicht breiter als die Seite wird.

## Entscheidungen

- Welchen Bereich soll der Ausführungstag im Monat haben?
  **Antwort:** 1 bis 28, damit der Termin in jedem Monat vorkommt
  _→ eingearbeitet in vision, UC-005, BR-0020, BR-0021, BR-0022, BR-0023, BR-0024, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, Schema DauerauftragAnlegen, dauerauftraege · 0d1e631_
- Soll der Betrag eines Dauerauftrags beim Anlegen gegen den verfügbaren Betrag des Girokontos geprüft werden?
  **Antwort:** Nein, nur größer als 0, weil die Ausführung erst später fällig wird
  _→ eingearbeitet in vision, UC-005, BR-0020, BR-0021, BR-0022, BR-0023, BR-0024, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, Schema DauerauftragAnlegen, dauerauftraege · 0d1e631_
- Wie soll sich die erste Ausführung zum Ausführungstag im Monat verhalten?
  **Antwort:** Frei wählbares Datum ab heute, darf vom Ausführungstag abweichen
  _→ eingearbeitet in vision, UC-005, BR-0020, BR-0021, BR-0022, BR-0023, BR-0024, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, Schema DauerauftragAnlegen, dauerauftraege · 0d1e631_
- Soll ein fälliger Dauerauftrag in dieser Story schon buchen (Saldo und Umsatz)?
  **Antwort:** Nein, nur Einrichten, Anzeigen und Löschen; die Ausführung folgt in einer eigenen Story
  _→ eingearbeitet in vision, UC-005, BR-0020, BR-0021, BR-0022, BR-0023, BR-0024, Dauerauftrag, GET /api/dauerauftraege, POST /api/dauerauftraege, DELETE /api/dauerauftraege/{dauerauftragsId}, Schema Dauerauftrag, Schema DauerauftragAnlegen, dauerauftraege · 0d1e631_
- Wo soll die Kundin die Daueraufträge öffnen?
  **Antwort:** Über einen Knopf „Daueraufträge“ in der Zeile des Girokontos im Finanzstatus
  _→ eingearbeitet in finanzstatus, UC-005 · fccbabc_
- Woran erkennt das System beim Löschen den gewählten Dauerauftrag, wenn zwei Daueraufträge denselben Empfänger haben?
  **Antwort:** Die Liste und das Auswahlfeld führen je Dauerauftrag die dauerauftragsId als Wert mit; die Aktion Löschen übergibt sie im Pfad, die Anzeige bleibt der Empfänger.
  _→ ohne Änderung: Steht schon in der Maske dauerauftraege: Der übernommene Blocker-Vorschlag bindet die Löschauswahl an die dauerauftragsId._
- Was zeigt das System, wenn der Dienst beim Anlegen mit 403 antwortet, weil das Auftraggeberkonto kein Girokonto der Kundin ist?
  **Antwort:** Der Fall tritt in der Oberfläche nicht auf, weil das Auftraggeberkonto fest das Girokonto der Kundin ist; der Dienst antwortet 403, die Seite zeigt die allgemeine Fehlermeldung.
  _→ eingearbeitet in UC-005, BR-0024, dauerauftraege · c884c2c_
- Soll der Vertrag den Betrag auf mindestens 0.01 festlegen (wie das Datenmodell) oder bei „größer als 0“ bleiben?
  **Antwort:** Mindestens 0.01, also 0.01 zulässig und 0.00 abgelehnt.
  _→ eingearbeitet in POST /api/dauerauftraege, Schema DauerauftragAnlegen · 13d231b_
- Welche Meldung zeigt das System, wenn der Betrag zwischen 0 und 0,01 liegt?
  **Antwort:** Meldung aus BR-0021 beibehalten: „Der Betrag muss größer als 0 sein.“
  _→ eingearbeitet in POST /api/dauerauftraege, Schema DauerauftragAnlegen · 13d231b_
- In welchem Format zeigt die Liste die erste Ausführung?
  **Antwort:** Entfällt: Der Vorschlag, zu dem die Frage gehörte, ist abgelehnt.
  _→ ohne Änderung: Vorschlag abgelehnt, die Frage ist gegenstandslos._
- Mit welcher Antwort bricht die Kundin die Sicherheitsabfrage ab?
  **Antwort:** Entfällt: Der Vorschlag, zu dem die Frage gehörte, ist abgelehnt.
  _→ ohne Änderung: Vorschlag abgelehnt, die Frage ist gegenstandslos._
- BR-0023 und UC-005 A6 nennen den „heutigen Tag“, sagen aber nicht, in welcher Zeitzone er gilt (docs/use_cases/UC-005-dauerauftrag-einrichten-ansehen-und-loeschen.md, BR-0023; docs/entity_model.md, Dauerauftrag.ersteAusfuehrung „nicht vor dem heutigen Tag“). Zwischen 0:00 und 1:00 Uhr (Sommerzeit: 2:00 Uhr) deutscher Zeit ist der UTC-Tag noch der Vortag. Welcher Kalendertag ist „heute“ für die erste Ausführung?
  **Antwort:** Kalendertag in UTC, wie der Buchungstag in BR-0012 und die Leitplanke „Zeiten in UTC“
  _→ eingearbeitet in UC-005, BR-0023, Dauerauftrag, POST /api/dauerauftraege, Schema DauerauftragAnlegen · 676859c_
- Soll der Betrag im Formular mit Komma eingegeben werden?
  **Antwort:** Mit Komma im deutschen Format, z. B. „50,00“, wie die Szenarien es tippen.
  _→ eingearbeitet in dauerauftraege · 262b082_
- Was zeigt das System, wenn die Kundin den Betrag mit Punkt statt mit Komma eingibt?
  **Antwort:** Die Meldung aus BR-0021 („Der Betrag muss mindestens 0,01 Euro betragen.“).
  _→ eingearbeitet in dauerauftraege · 262b082_
- Unter welchen http_route-Werten erscheinen die Dauerauftrags-Operationen in der Metrik?
  **Antwort:** Keine der drei Formen. In Prometheus gemessen: Der Dienst meldet Pfadparameter als {id}, zum Beispiel /api/empfaengervorlagen/{id} und /api/konten/{id}/umsaetze, also weder mit dem Namen aus der OpenAPI noch mit Doppelpunkt. Der Messpunkt soll den Parameter deshalb unter jedem Namen treffen. Für DELETE steht im Summanden http_route=~"/api/dauerauftraege/[^/]+", für GET und POST bleibt http_route="/api/dauerauftraege" wie bei den vorhandenen Einträgen.
  _→ eingearbeitet in NFR-001, NFR-003, NFR-004, slo:nfr-003, slo:nfr-004_
- Soll NFR-001 die Dauerauftragsseite auch im Maß mitzählen oder nur unter Gilt für führen?
  **Antwort:** Nur unter Gilt für führen, das Maß bleibt unverändert
  _→ eingearbeitet in NFR-001, NFR-003, NFR-004, slo:nfr-003, slo:nfr-004_
