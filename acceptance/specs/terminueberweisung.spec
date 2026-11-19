# Terminüberweisung

## Eine Terminüberweisung wird vorgemerkt und nichts gebucht

Tags: UC-002, PK-53

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Zeile "Girokonto" zeigt "Saldo" "2.145,30 €"

## Ein Ausführungstag heute wird abgelehnt und keine Zusammenfassung gezeigt

Tags: UC-002, PK-53, BR-0079

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "heute" und wählt „Weiter“
* Die Überweisung zeigt die Meldung "Der Ausführungstag muss zwischen morgen und 365 Tagen ab heute liegen."
* Die Überweisung zeigt keine Zusammenfassung

## Ein Ausführungstag in genau 365 Tagen wird angenommen

Tags: UC-002, PK-53, BR-0079

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 365 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."

## Ein doppelter Klick auf Bestätigen merkt die Terminüberweisung nur einmal vor

Tags: UC-002, PK-53, BR-0005

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "2" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die vorgemerkten Überweisungen zeigen "1" Aufträge

## Ein Terminüberweisungsauftrag mit ungültiger IBAN wird mit 400 abgelehnt

Tags: UC-002, PK-53, BR-0003

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "400"
| feld            | wert                        |
|-----------------|-----------------------------|
| empfaengerIban  | DE00 1234 5678 9012 3456 78 |
| ausfuehrungstag | in 5 Tagen                  |

## Ohne Anmeldung wird das Vormerken mit 401 abgelehnt

Tags: UC-002, PK-53

* Der Aufruf "POST /api/terminueberweisungen" ohne Anmeldung antwortet mit dem Status "401"

## Ein fremdes Auftraggeberkonto wird beim Vormerken mit 403 abgelehnt

Tags: UC-002, PK-53, BR-0007

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "403"
| feld             | wert                        |
|------------------|-----------------------------|
| auftraggeberIban | DE89 3704 0044 0532 0130 00 |
| ausfuehrungstag  | in 5 Tagen                  |

## Ein Betrag über dem verfügbaren Betrag wird beim Vormerken mit 422 abgelehnt

Tags: UC-002, PK-53, BR-0004

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "422"
| feld            | wert       |
|-----------------|------------|
| betrag          | 3.200,00 € |
| ausfuehrungstag | in 5 Tagen |

## Ein Ausführungstag heute wird beim Vormerken mit 422 abgelehnt

Tags: UC-002, PK-53, BR-0079

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "422"
| feld            | wert  |
|-----------------|-------|
| ausfuehrungstag | heute |
