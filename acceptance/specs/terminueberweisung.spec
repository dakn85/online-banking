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

## Ein Ausführungstag morgen wird beim Vormerken angenommen

Tags: UC-002, PK-53, BR-0079

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "200"
| feld            | wert   |
|-----------------|--------|
| ausfuehrungstag | morgen |

## Ein ungültiges Datum als Ausführungstag wird beim Vormerken mit 400 abgelehnt

Tags: UC-002, PK-53

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "400"
| feld            | wert       |
|-----------------|------------|
| ausfuehrungstag | 31.02.2027 |

## Eine wiederholte Auftrags-Kennung beim Vormerken legt keinen zweiten Auftrag an

Tags: UC-002, PK-53, BR-0005

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "200"
| feld            | wert         |
|-----------------|--------------|
| auftragsId      | wiederholt-1 |
| ausfuehrungstag | in 5 Tagen   |
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "200"
| feld            | wert         |
|-----------------|--------------|
| auftragsId      | wiederholt-1 |
| ausfuehrungstag | in 5 Tagen   |
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die vorgemerkten Überweisungen zeigen "1" Aufträge

## Ein Ausführungstag in 366 Tagen wird beim Vormerken mit 422 abgelehnt

Tags: UC-002, PK-53, BR-0079

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "422"
| feld            | wert         |
|-----------------|--------------|
| ausfuehrungstag | in 366 Tagen |

## Beim Vormerken gilt das Tageslimit nicht

Tags: UC-002, PK-53, BR-0070

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "PUT /api/tageslimit" mit den Angaben auf und erhält den Status "200"
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "500,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."

## Nach dem Vormerken entsteht kein Umsatz

Tags: UC-002, PK-53

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung vorgemerkt."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"

## Die Zusammenfassung zeigt bei einer Terminüberweisung den Ausführungstag

Tags: UC-002, PK-53

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungstag "in 5 Tagen" und wählt „Weiter“

## Eine gelöschte Auftrags-Kennung kann beim Vormerken nicht erneut verwendet werden

Tags: UC-002, PK-53, BR-0005

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "201"
| feld            | wert         |
|-----------------|--------------|
| auftragsId      | verbraucht-1 |
| ausfuehrungstag | in 5 Tagen   |
* Die angemeldete Kundin ruft "DELETE /api/terminueberweisungen/{auftragsId}" mit den Angaben auf und erhält den Status "204"
| feld       | wert         |
|------------|--------------|
| auftragsId | verbraucht-1 |
* Die angemeldete Kundin ruft "POST /api/terminueberweisungen" mit den Angaben auf und erhält den Status "422"
| feld            | wert         |
|-----------------|--------------|
| auftragsId      | verbraucht-1 |
| ausfuehrungstag | in 5 Tagen   |
* Die Kundin öffnet in der Überweisung die vorgemerkten Überweisungen
* Die vorgemerkten Überweisungen zeigen "0" Aufträge
