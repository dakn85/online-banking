# UC-006 Akzeptanztests

## Ein Dauerauftrag einer anderen Kundin erscheint nicht in der Liste

Tags: UC-006, PK-19, BR-0031

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin richtet den Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00" über "50,00" Euro am "15." des Monats ein, erstmals "in 5 Tagen", mit Verwendungszweck "Miete"
* Die Kundin meldet sich ab
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Daueraufträge zeigen keinen Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00"

## Die Daueraufträge sind ohne Anmeldung nicht erreichbar

Tags: UC-006, PK-19, NFR-001

* Testdaten sind zurückgesetzt
* Die Daueraufträge sind ohne Anmeldung nicht erreichbar

## Ein Dauerauftrag wird eingerichtet und steht in der Liste

Tags: UC-006, PK-19

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin richtet den Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00" über "50,00" Euro am "15." des Monats ein, erstmals "in 5 Tagen", mit Verwendungszweck "Miete"
* Die Daueraufträge zeigen die Zeilen
| Empfänger       | IBAN                        | Betrag  | Ausführungstag | Erste Ausführung | Verwendungszweck |
|-----------------|-----------------------------|---------|----------------|------------------|------------------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 50,00 € | 15.            | in 5 Tagen       | Miete            |

## Ein Dauerauftrag wird erst nach der Sicherheitsabfrage gelöscht

Tags: UC-006, PK-19, BR-0030

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin richtet den Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00" über "50,00" Euro am "15." des Monats ein, erstmals "in 5 Tagen", mit Verwendungszweck "Miete"
* Die Kundin wählt den Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00" zum Löschen und antwortet auf die Sicherheitsabfrage "Ja"
* Die Daueraufträge zeigen keinen Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00"

## Ein Ausführungstag außerhalb von 1 bis 28 wird abgelehnt

Tags: UC-006, PK-19, BR-0027

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin richtet den Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00" über "50,00" Euro am "31." des Monats ein, erstmals "in 5 Tagen", mit Verwendungszweck "Miete"
* Die Daueraufträge zeigen keinen Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00"

## Eine erste Ausführung vor heute wird abgelehnt

Tags: UC-006, PK-19, BR-0028

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin richtet den Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00" über "50,00" Euro am "15." des Monats ein, erstmals "gestern", mit Verwendungszweck "Miete"
* Die Daueraufträge zeigen keinen Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00"

## Ein Betrag von 0 Euro wird abgelehnt

Tags: UC-006, PK-19, BR-0029

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin richtet den Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00" über "0,00" Euro am "15." des Monats ein, erstmals "in 5 Tagen", mit Verwendungszweck "Miete"
* Die Daueraufträge zeigen keinen Dauerauftrag an IBAN "DE89 3704 0044 0532 0130 00"
