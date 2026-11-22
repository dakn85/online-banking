# Echtzeitüberweisung

## Die Zusammenfassung zeigt bei Echtzeit Entgelt und Gesamtbetrag vor dem Absenden

Tags: UC-002, PK-71, BR-0099

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungsart "Echtzeit" und wählt „Weiter“
* Die Zusammenfassung zeigt die Zeile "Entgelt" mit dem Wert "0,50 €"
* Die Zusammenfassung zeigt die Zeile "Gesamtbetrag" mit dem Wert "50,50 €"

## Eine Echtzeitüberweisung erzeugt einen Umsatz über den Betrag und einen über das Entgelt

Tags: UC-002, PK-71, BR-0012

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungsart "Echtzeit" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Echtzeitüberweisung ausgeführt: 50,00 € überwiesen, Entgelt 0,50 €."
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Umsätze zeigen die Zeilen
| Gegenpartei     | Verwendungszweck            | Betrag   | Saldo danach |
|-----------------|-----------------------------|----------|--------------|
| Aventa Bank     | Entgelt Echtzeitüberweisung | -0,50 €  | 2.094,80 €   |
| Möbel Nord GmbH | Rechnung 4711               | -50,00 € | 2.095,30 €   |

## Ein doppelter Klick auf Bestätigen belastet das Entgelt nur einmal

Tags: UC-002, PK-71, BR-0005

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungsart "Echtzeit" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "2" Mal und sieht die Meldung "Echtzeitüberweisung ausgeführt: 50,00 € überwiesen, Entgelt 0,50 €."
* Die Zeile "Girokonto" zeigt "Saldo" "2.094,80 €"

## Das Tageslimit von 0,00 € lehnt auch eine Echtzeitüberweisung mit 422 ab

Tags: UC-002, PK-71, BR-0070

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Tageslimit
* Die Kundin setzt das Tageslimit auf "0,00 €"
* Die angemeldete Kundin ruft "POST /api/ueberweisungen" mit den Angaben auf und erhält den Status "422"
| feld            | wert     |
|-----------------|----------|
| betrag          | 50,00 €  |
| ausfuehrungsart | echtzeit |

## Eine Echtzeitüberweisung belastet Betrag und Entgelt und meldet beide

Tags: UC-002, PK-71, BR-0006, BR-0099, BR-0100, NFR-001

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und Ausführungsart "Echtzeit" und wählt „Weiter“
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Echtzeitüberweisung ausgeführt: 50,00 € überwiesen, Entgelt 0,50 €."
* Die Zeile "Girokonto" zeigt "Saldo" "2.094,80 €"

## Ein Betrag, der mit dem Entgelt den verfügbaren Betrag übersteigt, wird bei Echtzeit abgelehnt und keine Zusammenfassung gezeigt

Tags: UC-002, PK-71, BR-0004

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "3.145,30 €", Verwendungszweck "Rechnung 4711" und Ausführungsart "Echtzeit" und wählt „Weiter“
* Die Überweisung zeigt die Meldung "Der Betrag übersteigt den verfügbaren Betrag des Girokontos."
* Die Überweisung zeigt keine Zusammenfassung

## Echtzeit zusammen mit einem Ausführungstag wird mit 422 und Meldung abgelehnt

Tags: UC-002, PK-71, BR-0100

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin ruft "POST /api/ueberweisungen" mit den Angaben auf und erhält den Status "422" und die Meldung "Eine Echtzeitüberweisung kann nicht mit einem Ausführungstag erfasst werden."
| feld            | wert       |
|-----------------|------------|
| ausfuehrungsart | echtzeit   |
| ausfuehrungstag | in 5 Tagen |
