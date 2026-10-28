# Finanzstatus

## Der Finanzstatus zeigt alle Konten mit IBAN und Saldo

Tags: UC-001, PK-1

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Zeile "Girokonto" zeigt "IBAN" "DE02 5001 0517 5407 3249 31"
* Die Zeile "Girokonto" zeigt "Saldo" "2.145,30 €"
* Die Zeile "Kreditkarte" zeigt "Saldo" "-387,45 €"

## Das Gesamtvermögen ist die Summe aller Salden

Tags: UC-001, PK-1

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Der Finanzstatus zeigt das Gesamtvermögen "1.757,85 €"

## Das Girokonto zeigt Dispositionsrahmen und verfügbaren Betrag

Tags: UC-001, PK-1

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Zeile "Girokonto" zeigt "Dispositionsrahmen" "1.000,00 €"
* Die Zeile "Girokonto" zeigt "Verfügbarer Betrag" "3.145,30 €"

## Ohne Anmeldung ist der Finanzstatus nicht erreichbar

Tags: UC-001, PK-1

* Testdaten sind zurückgesetzt
* Der Finanzstatus ist ohne Anmeldung nicht erreichbar
* Die Anmeldeseite ist zu sehen
