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
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung

## Eine bestätigte Überweisung mindert den Saldo des Girokontos

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "1" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Zeile "Girokonto" zeigt "Saldo" "2.095,30 €"
* Der Finanzstatus zeigt das Gesamtvermögen "1.707,85 €"

## Ein doppelter Klick auf Bestätigen bucht nur einmal

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und prüft die Zusammenfassung
* Die Kundin bestätigt die Überweisung "2" Mal und sieht die Meldung "Überweisung ausgeführt."
* Die Zeile "Girokonto" zeigt "Saldo" "2.095,30 €"

## Eine ungültige IBAN wird abgelehnt

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE00 1234 5678 9012 3456 78", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und wählt „Weiter“
* Die Überweisung zeigt die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."

## Ein Betrag über dem verfügbaren Betrag wird abgelehnt

Tags: UC-002, PK-2

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00", Betrag "3.200,00 €", Verwendungszweck "Rechnung 4711" und wählt „Weiter“
* Die Überweisung zeigt die Meldung "Der Betrag übersteigt den verfügbaren Betrag des Girokontos."

## Eine IBAN außerhalb der SEPA-Länderliste wird abgelehnt und keine Zusammenfassung gezeigt

Tags: UC-002, PK-3, BR-0003

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "TR33 0006 1005 1978 6457 8413 26", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und wählt „Weiter“
* Die Überweisung zeigt die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."
* Die Überweisung zeigt keine Zusammenfassung

## Eine IBAN mit weniger als 15 Stellen wird abgelehnt

Tags: UC-002, PK-3, BR-0003

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin erfasst Empfänger "Möbel Nord GmbH", IBAN "DE93 3704 0044 05", Betrag "50,00 €", Verwendungszweck "Rechnung 4711" und wählt „Weiter“
* Die Überweisung zeigt die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."

## Eine gewählte Empfängervorlage belegt Empfänger, IBAN und Verwendungszweck

Tags: UC-002, PK-7

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711" an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin wählt in der Überweisung die Vorlage "Möbel Nord GmbH" und sieht Empfänger "Möbel Nord GmbH", IBAN "DE89 3704 0044 0532 0130 00" und Verwendungszweck "Rechnung 4711"

## Eine Vorlage ohne Verwendungszweck lässt das Feld Verwendungszweck leer

Tags: UC-002, PK-7, BR-0017

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt die Vorlage "Hausverwaltung Weber" mit IBAN "DE44 5001 0517 5407 3249 31" ohne Verwendungszweck an
* Die Kundin öffnet die Überweisung vom Girokonto
* Die Kundin wählt in der Überweisung die Vorlage "Hausverwaltung Weber" und sieht Empfänger "Hausverwaltung Weber", IBAN "DE44 5001 0517 5407 3249 31" und einen leeren Verwendungszweck
