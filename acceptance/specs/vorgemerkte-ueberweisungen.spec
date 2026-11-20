# Vorgemerkte Überweisungen

## Eine vorgemerkte Überweisung steht mit Ausführungstag, Empfänger, Betrag und Verwendungszweck in der Liste

Tags: UC-017, PK-53

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die vorgemerkten Überweisungen zeigen die Aufträge
| Ausführungstag | Empfänger       | IBAN des Empfängers         | Betrag in Euro | Verwendungszweck |
|----------------|-----------------|-----------------------------|----------------|------------------|
| in 5 Tagen     | Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 50,00 €        | Rechnung 4711    |

## Die vorgemerkten Aufträge stehen nach Ausführungstag aufsteigend

Tags: UC-017, PK-53

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Stadtwerke Nord", IBAN "DE44 5001 0517 5407 3249 31", Betrag "85,00 €", Verwendungszweck "Abschlag Strom" und Ausführungstag "in 30 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die vorgemerkten Überweisungen zeigen die Aufträge
| Ausführungstag | Empfänger       | IBAN des Empfängers         | Betrag in Euro | Verwendungszweck |
|----------------|-----------------|-----------------------------|----------------|------------------|
| in 5 Tagen     | Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 50,00 €        | Rechnung 4711    |
| in 30 Tagen    | Stadtwerke Nord | DE44 5001 0517 5407 3249 31 | 85,00 €        | Abschlag Strom   |

## Ein vorgemerkter Auftrag wird erst nach der Sicherheitsabfrage gelöscht

Tags: UC-017, PK-53, BR-0080

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die Kundin wählt den vorgemerkten Auftrag an "Möbel Nord GmbH" zum Löschen und antwortet auf die Sicherheitsabfrage "Ja"
* Die vorgemerkten Überweisungen zeigen die Meldung "Vorgemerkter Auftrag gelöscht."
* Die vorgemerkten Überweisungen zeigen "0" Aufträge

## Bricht die Kundin die Sicherheitsabfrage ab, bleibt der Auftrag vorgemerkt

Tags: UC-017, PK-53

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die Kundin wählt den vorgemerkten Auftrag an "Möbel Nord GmbH" zum Löschen und antwortet auf die Sicherheitsabfrage "Nein"
* Die vorgemerkten Überweisungen zeigen "1" Aufträge

## Ohne vorgemerkten Auftrag zeigt die Maske einen Hinweis statt der Liste

Tags: UC-017, PK-53

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die vorgemerkten Überweisungen zeigen die Meldung "Sie haben keine vorgemerkten Überweisungen."

## Ohne Anmeldung wird die Liste der vorgemerkten Aufträge mit 401 abgelehnt

Tags: UC-017, PK-53

* Der Aufruf "GET /api/terminueberweisungen" ohne Anmeldung antwortet mit dem Status "401"

## Ohne Anmeldung wird das Löschen eines vorgemerkten Auftrags mit 401 abgelehnt

Tags: UC-017, PK-53

* Der Aufruf "DELETE /api/terminueberweisungen/{auftragsId}" ohne Anmeldung antwortet mit dem Status "401"

## Eine unbekannte Auftrags-Kennung wird beim Löschen mit 404 abgelehnt

Tags: UC-017, PK-53, BR-0080

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "DELETE /api/terminueberweisungen/{auftragsId}" mit den Angaben auf und erhält den Status "404"
| feld       | wert        |
|------------|-------------|
| auftragsId | unbekannt-1 |

## Ohne Anmeldung sind die vorgemerkten Überweisungen nicht erreichbar

Tags: UC-017, PK-53

* Die Seite der vorgemerkten Überweisungen ist ohne Anmeldung nicht erreichbar

## Der vorgemerkte Auftrag einer Kundin erscheint nicht in der Liste einer anderen Kundin

Tags: UC-017, PK-53, BR-0080

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Kundin meldet sich ab
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die vorgemerkten Überweisungen zeigen "0" Aufträge

## Ein Auftrag einer anderen Kundin wird beim Löschen mit 404 abgelehnt

Tags: UC-017, PK-53, BR-0080

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "201"
| feld            | wert       |
|-----------------|------------|
| auftragsId      | fremd-1    |
| ausfuehrungstag | in 5 Tagen |
* Die Kundin meldet sich ab
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die angemeldete Kundin ruft "DELETE /api/terminueberweisungen/{auftragsId}" mit den Angaben auf und erhält den Status "404"
| feld       | wert    |
|------------|---------|
| auftragsId | fremd-1 |
