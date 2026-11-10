# UC-005 Akzeptanztests

## Ein monatlicher Dauerauftrag wird angelegt

Tags: UC-005, PK-14

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt den Dauerauftrag an den Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00", Ausführungstag "15", erster Ausführung "2026-03-15" und Verwendungszweck "Miete März" an
* Die Daueraufträge zeigen die Meldung "Dauerauftrag angelegt."

## Ein Dauerauftrag mit IBAN außerhalb des SEPA-Raums wird abgelehnt

Tags: UC-005, PK-14

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt den Dauerauftrag an den Empfänger "Möbel Nord GmbH" mit IBAN "TR33 0006 1005 1978 6457 8413 26", Betrag "50,00", Ausführungstag "15", erster Ausführung "2026-03-15" und Verwendungszweck "Miete März" an
* Die Daueraufträge zeigen die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."

## Ein Dauerauftrag mit Ausführungstag außerhalb von 1 bis 28 wird abgelehnt

Tags: UC-005, PK-14

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt den Dauerauftrag an den Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00", Ausführungstag "31", erster Ausführung "2026-03-15" und Verwendungszweck "Miete März" an
* Die Daueraufträge zeigen die Meldung "Der Ausführungstag liegt zwischen 1 und 28."

## Ein Dauerauftrag wird erst nach der Sicherheitsabfrage gelöscht

Tags: UC-005, PK-14

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt den Dauerauftrag an den Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00", Ausführungstag "15", erster Ausführung "2026-03-15" und Verwendungszweck "Miete März" an
* Die Kundin wählt den Dauerauftrag "Möbel Nord GmbH" zum Löschen und antwortet auf die Sicherheitsabfrage "Ja"
* Die Daueraufträge zeigen die Meldung "Dauerauftrag gelöscht."
