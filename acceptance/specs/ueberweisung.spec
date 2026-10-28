# Überweisung

## Überweisen öffnet die Überweisung mit vorbelegtem Girokonto

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto

## Die Zusammenfassung zeigt die erfasste Überweisung vor dem Absenden

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE02 5001 0517 5407 3249 31", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung

## Eine bestätigte Überweisung mindert den Saldo des Girokontos

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE02 5001 0517 5407 3249 31", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Zeile "Girokonto" zeigt "Saldo" "2.095,30 €"
* Der Finanzstatus zeigt das Gesamtvermögen "1.707,85 €"

## Ein doppelter Klick auf Bestätigen bucht nur einmal

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE02 5001 0517 5407 3249 31", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "2" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Zeile "Girokonto" zeigt "Saldo" "2.095,30 €"

## Eine ungültige IBAN wird abgelehnt

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE00 1234 5678 9012 3456 78", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."

## Ein Betrag über dem verfügbaren Betrag wird abgelehnt

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE02 5001 0517 5407 3249 31", Betrag "3.200,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Der Betrag übersteigt den verfügbaren Betrag des Girokontos."
