# Umbuchung zwischen eigenen Konten

## Umbuchen öffnet die Umbuchung aus dem Finanzstatus

Tags: UC-021, PK-58

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung

## Eine Umbuchung vom Girokonto aufs Tagesgeldkonto bucht sofort um

Tags: UC-021, PK-58, BR-0091

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "500,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Der Finanzstatus zeigt die Meldung "Umbuchung ausgeführt."
* Die Zeile "Girokonto" zeigt "Saldo" "1.645,30 €"
* Die Zeile "Tagesgeldkonto" zeigt "Saldo" "500,00 €"
* Der Finanzstatus zeigt das Gesamtvermögen "1.757,85 €"

## Eine Umbuchung vom Tagesgeldkonto zurück aufs Girokonto bucht sofort um

Tags: UC-021, PK-58

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "500,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Tagesgeldkonto", Zielkonto "Girokonto" und Betrag "200,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Der Finanzstatus zeigt die Meldung "Umbuchung ausgeführt."
* Die Zeile "Girokonto" zeigt "Saldo" "1.845,30 €"
* Die Zeile "Tagesgeldkonto" zeigt "Saldo" "300,00 €"

## Ein doppelter Klick auf Umbuchen bucht nur einmal um

Tags: UC-021, PK-58, BR-0092

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "500,00 €"
* Die Kundin wählt „Umbuchen“ "2" Mal
* Der Finanzstatus zeigt die Meldung "Umbuchung ausgeführt."
* Die Zeile "Girokonto" zeigt "Saldo" "1.645,30 €"
* Die Zeile "Tagesgeldkonto" zeigt "Saldo" "500,00 €"

## Ein Betrag über dem verfügbaren Betrag des Girokontos wird abgelehnt

Tags: UC-021, PK-58, BR-0089

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "3.200,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Umbuchung zeigt die Meldung "Der Betrag übersteigt den verfügbaren Betrag des Quellkontos."

## Ein Betrag unter 0,10 € wird bei der Umbuchung abgelehnt

Tags: UC-021, PK-58

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "0,09 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Umbuchung zeigt die Meldung "Der Betrag muss mindestens 0,10 € betragen."

## Dasselbe Konto als Quell- und Zielkonto wird abgelehnt

Tags: UC-021, PK-58, BR-0088

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Girokonto" und Betrag "50,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Umbuchung zeigt die Meldung "Eine Umbuchung ist nur zwischen Girokonto und Tagesgeldkonto möglich."

## Ein Quellkonto, das nicht zur Kundin gehört, wird abgelehnt

Tags: UC-021, PK-58, BR-0088

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Schnittstelle lehnt die Umbuchung von der IBAN "DE89370400440532013000" auf die IBAN "DE02500105175407324931" über "10,00 €" mit dem Status "403" ab

## Eine Umbuchung erzeugt einen Umsatz auf beiden Konten

Tags: UC-021, PK-58, BR-0090

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "500,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Kundin öffnet die Umsätze des Kontos "Girokonto"
* Die Umsätze zeigen die Zeilen
| Gegenpartei    | Verwendungszweck | Betrag    | Saldo danach |
|----------------|------------------|-----------|--------------|
| Tagesgeldkonto | Umbuchung        | -500,00 € | 1.645,30 €   |
* Die Kundin öffnet die Umsätze des Kontos "Tagesgeldkonto"
* Die Umsätze zeigen die Zeilen
| Gegenpartei | Verwendungszweck | Betrag   | Saldo danach |
|-------------|------------------|----------|--------------|
| Girokonto   | Umbuchung        | 500,00 € | 500,00 €     |

## Ein Betrag über dem Saldo des Tagesgeldkontos wird abgelehnt

Tags: UC-021, PK-58, BR-0089

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Tagesgeldkonto", Zielkonto "Girokonto" und Betrag "10,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Umbuchung zeigt die Meldung "Der Betrag übersteigt den verfügbaren Betrag des Quellkontos."

## Die Schnittstelle lehnt einen Betrag unter 0,10 € mit 400 ab

Tags: UC-021, PK-58

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Schnittstelle lehnt die Umbuchung von der IBAN "DE02500105175407324931" auf die IBAN "DE02500105175407324931" über "0,09 €" mit dem Status "400" ab

## Die Schnittstelle lehnt dasselbe Konto als Quell- und Zielkonto mit 422 ab

Tags: UC-021, PK-58, BR-0088

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Schnittstelle lehnt die Umbuchung von der IBAN "DE02500105175407324931" auf die IBAN "DE02500105175407324931" über "50,00 €" mit dem Status "422" ab

## Ohne Anmeldung ist die Umbuchung nicht erreichbar

Tags: UC-021, PK-58

* Testdaten sind zurückgesetzt
* Die Umbuchung ist ohne Anmeldung nicht erreichbar, die Schnittstelle antwortet mit dem Status "401"
* Die Anmeldeseite ist zu sehen

## Der Finanzstatus zeigt das Tagesgeldkonto mit Saldo 0,00 € und unverändertem Gesamtvermögen

Tags: UC-001, PK-58

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Zeile "Tagesgeldkonto" zeigt "Saldo" "0,00 €"
* Der Finanzstatus zeigt das Gesamtvermögen "1.757,85 €"

## Eine abgelehnte Umbuchung zeigt die Meldung und gibt den Knopf wieder frei

Tags: UC-021, PK-58

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "50,00 €"
* Der Dienst antwortet auf die Umbuchung mit dem Status "500"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Umbuchung zeigt die Meldung "Die Umbuchung konnte nicht ausgeführt werden."
* Der Knopf „Umbuchen“ ist freigegeben
