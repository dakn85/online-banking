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

## Die Daueraufträge sind über den Knopf in der Zeile des Girokontos erreichbar

Tags: UC-005, PK-14

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge vom Girokonto
* Die Daueraufträge zeigen den Hinweis "Sie haben noch keinen Dauerauftrag."

## Ein abgelehntes Auftraggeberkonto zeigt die allgemeine Fehlermeldung

Tags: UC-005, PK-14, BR-0024

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge vom Girokonto
* Der Dienst antwortet auf das Anlegen mit dem Status "403"
* Die Daueraufträge zeigen die Meldung "Der Dauerauftrag konnte nicht angelegt werden."

## Ein Dauerauftrag mit einem Betrag unter 0,01 Euro wird abgelehnt

Tags: UC-005, PK-14, BR-0021

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt den Dauerauftrag an den Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "0,00", Ausführungstag "15", erster Ausführung "2026-03-15" und Verwendungszweck "Miete März" an
* Die Daueraufträge zeigen die Meldung "Der Betrag muss größer als 0 sein."

## Ein Dauerauftrag mit einer ersten Ausführung in der Vergangenheit wird abgelehnt

Tags: UC-005, PK-14, BR-0023

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin legt den Dauerauftrag an den Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00", Ausführungstag "15", erster Ausführung "gestern" und Verwendungszweck "Miete März" an
* Die Daueraufträge zeigen die Meldung "Die erste Ausführung darf nicht in der Vergangenheit liegen."
