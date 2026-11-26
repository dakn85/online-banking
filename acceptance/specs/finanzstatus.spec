# Finanzstatus

## Der Finanzstatus zeigt alle Konten mit IBAN und Saldo

Tags: UC-001, PK-1

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Zeile "Girokonto" zeigt "IBAN" "DE02 5001 0517 5407 3249 11"
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
* Die Zeile "Kreditkarte" zeigt "Dispositionsrahmen" ""
* Die Zeile "Kreditkarte" zeigt "Verfügbarer Betrag" ""

## Ohne Anmeldung ist der Finanzstatus nicht erreichbar

Tags: UC-001, PK-1, NFR-001

* Testdaten sind zurückgesetzt
* Der Finanzstatus ist ohne Anmeldung nicht erreichbar
* Die Anmeldeseite ist zu sehen

## Die Kundin vergibt dem Tagesgeldkonto den eigenen Namen Urlaubskasse

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin vergibt im Finanzstatus dem Konto "Tagesgeldkonto" den eigenen Namen "Urlaubskasse"
* Der Finanzstatus zeigt die Meldung "Eigener Name gespeichert."
* Die Zeile "Tagesgeldkonto" zeigt "Eigener Name" "Urlaubskasse"

## Ohne vergebenen eigenen Namen bleibt die Spalte leer

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Zeile "Tagesgeldkonto" zeigt "Eigener Name" ""
* Die Zeile "Tagesgeldkonto" zeigt "Kontoname" "Tagesgeldkonto"

## Zwei Konten dürfen denselben eigenen Namen tragen

Tags: UC-001, PK-85, BR-0108

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin vergibt im Finanzstatus dem Konto "Girokonto" den eigenen Namen "Urlaubskasse"
* Die Kundin vergibt im Finanzstatus dem Konto "Tagesgeldkonto" den eigenen Namen "Urlaubskasse"
* Die Zeile "Girokonto" zeigt "Eigener Name" "Urlaubskasse"
* Die Zeile "Tagesgeldkonto" zeigt "Eigener Name" "Urlaubskasse"

## Ein zu langer eigener Name wird mit 400 abgelehnt

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin setzt über "PUT /api/konten/{iban}/name" für die IBAN "DE97 5001 0517 5407 3249 47" den eigenen Namen "Urlaubskasse für den Sommerurlaub 2027 in Italien am See am Boot" und erhält den Status "400" mit der Meldung "Der eigene Name darf höchstens 60 Zeichen lang sein."

## Ein leerer eigener Name wird mit 400 abgelehnt

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin setzt über "PUT /api/konten/{iban}/name" für die IBAN "DE97 5001 0517 5407 3249 47" den eigenen Namen "" und erhält den Status "400" mit der Meldung "Bitte geben Sie den eigenen Namen an."

## Ein Konto einer fremden IBAN lässt sich nicht benennen

Tags: UC-001, PK-85, BR-0108

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin setzt über "PUT /api/konten/{iban}/name" für die IBAN "DE02500105175407324999" den eigenen Namen "Urlaubskasse" und erhält den Status "404" mit der Meldung "Das Konto wurde nicht gefunden."

## Das Vergeben eines eigenen Kontonamens ohne Anmeldung wird mit 401 beantwortet

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* Der Aufruf "PUT" "/api/konten/DE02500105175407324911/name" ohne Anmeldung antwortet mit dem Status "401"

## Ein unverändert gespeicherter eigener Name wird mit 200 bestätigt

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin setzt über "PUT /api/konten/{iban}/name" für die IBAN "DE97 5001 0517 5407 3249 47" den eigenen Namen "Urlaubskasse" und erhält den Status "200" mit der Meldung "Eigener Name gespeichert."
* Die angemeldete Kundin setzt über "PUT /api/konten/{iban}/name" für die IBAN "DE97 5001 0517 5407 3249 47" den eigenen Namen "Urlaubskasse" und erhält den Status "200" mit der Meldung "Eigener Name gespeichert."

## Eine IBAN mit falscher Länge wird mit 400 abgelehnt

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin setzt über "PUT /api/konten/{iban}/name" für die IBAN "DE97 5001 0517 5407 3249" den eigenen Namen "Urlaubskasse" und erhält den Status "400" mit der Meldung "Die IBAN muss 22 Zeichen lang sein."

## Ein eigener Name aus nur Leerzeichen wird mit 400 abgelehnt

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die angemeldete Kundin setzt über "PUT /api/konten/{iban}/name" für die IBAN "DE97 5001 0517 5407 3249 47" den eigenen Namen " " und erhält den Status "400" mit der Meldung "Bitte geben Sie den eigenen Namen an."

## Ohne vergebenen eigenen Namen liefert der Dienst für das Konto eigenerName als null

Tags: UC-001, PK-85

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Antwort auf den Aufruf "GET /api/konten" liefert für das Konto "Tagesgeldkonto" den eigenen Namen "null"
