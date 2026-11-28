# Sparziel mit monatlicher Sparrate

## Die Sparrate wird aus Zielbetrag, Zieldatum und Saldo des Tagesgeldkontos vorgeschlagen

Tags: UC-025, PK-72, BR-0101

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "500,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Kundin öffnet das Sparziel
* Die Kundin berechnet die Sparrate für Zielbetrag "600,00 €" und Zieldatum "in 100 Tagen"
* Das Sparziel zeigt die Sparrate "33,34 €" als Vorschlag

## Eine Sparrate unter 0,10 € wird auf 0,10 € angehoben

Tags: UC-025, PK-72, BR-0101

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Sparziel
* Die Kundin berechnet die Sparrate für Zielbetrag "0,05 €" und Zieldatum "in 31 Tagen"
* Das Sparziel zeigt die Sparrate "0,10 €" als Vorschlag

## Ein Zieldatum, das nicht in der Zukunft liegt, wird abgelehnt

Tags: UC-025, PK-72, BR-0102

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Sparziel
* Die Kundin berechnet die Sparrate für Zielbetrag "600,00 €" und Zieldatum "gestern"
* Das Sparziel zeigt die Meldung "Das Zieldatum muss in der Zukunft liegen."

## Ein Zieldatum vor der ersten Rate wird abgelehnt

Tags: UC-025, PK-72, BR-0102

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Sparziel
* Die Kundin berechnet die Sparrate für Zielbetrag "600,00 €" und Zieldatum "in 5 Tagen"
* Das Sparziel zeigt die Meldung "Bis zum Zieldatum fällt keine monatliche Rate an."

## Ein Zielbetrag nicht über dem Saldo des Tagesgeldkontos wird abgelehnt

Tags: UC-025, PK-72, BR-0102

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Umbuchung
* Die Kundin erfasst Quellkonto "Girokonto", Zielkonto "Tagesgeldkonto" und Betrag "500,00 €"
* Die Kundin wählt „Umbuchen“ "1" Mal
* Die Kundin öffnet das Sparziel
* Die Kundin berechnet die Sparrate für Zielbetrag "400,00 €" und Zieldatum "in 100 Tagen"
* Das Sparziel zeigt die Meldung "Der Zielbetrag muss über dem Saldo des Tagesgeldkontos liegen."

## Ein Zielbetrag von 0,00 € wird als ungültige Angabe abgelehnt

Tags: UC-025, PK-72

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Sparziel
* Die Kundin berechnet die Sparrate für Zielbetrag "0,00 €" und Zieldatum "in 100 Tagen"
* Das Sparziel zeigt die Meldung "Die Angaben zum Sparziel sind unvollständig oder ungültig."

## Ein Sparziel wird angelegt und der Dauerauftrag für die Sparrate eingerichtet

Tags: UC-025, PK-72, BR-0103, NFR-001, NFR-006

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Sparziel
* Die Kundin berechnet die Sparrate für Zielbetrag "1.000,00 €" und Zieldatum "in 70 Tagen"
* Die Kundin legt das Sparziel an
* Das Sparziel zeigt die Meldung "Sparziel angelegt."
* Die Kundin öffnet die Daueraufträge
* Die Daueraufträge zeigen den Dauerauftrag an das Tagesgeldkonto über "500,00 €" mit Verwendungszweck "Sparrate Sparziel", Turnus "monatlich", erstem Ausführungstag im Folgemonat und Enddatum "in 70 Tagen"

## Die Schnittstelle lehnt den Vorschlag mit ungültigem Zielbetrag mit 400 ab

Tags: UC-025, PK-72

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Schnittstelle lehnt den Aufruf "GET /api/sparziele/vorschlag" mit Zielbetrag "0,00 €" und Zieldatum "in 100 Tagen" mit dem Status "400" ab

## Die Schnittstelle lehnt den Vorschlag ohne Anmeldung mit 401 ab

Tags: UC-025, PK-72, NFR-006

* Testdaten sind zurückgesetzt
* Die Schnittstelle lehnt den Aufruf "GET /api/sparziele/vorschlag" mit Zielbetrag "600,00 €" und Zieldatum "in 100 Tagen" mit dem Status "401" ab

## Die Schnittstelle lehnt den Vorschlag mit einem Zieldatum in der Vergangenheit mit 422 ab

Tags: UC-025, PK-72, BR-0102

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Schnittstelle lehnt den Aufruf "GET /api/sparziele/vorschlag" mit Zielbetrag "600,00 €" und Zieldatum "gestern" mit dem Status "422" ab

## Die Schnittstelle lehnt das Sparziel mit ungültigem Zielbetrag mit 400 ab

Tags: UC-025, PK-72

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Schnittstelle lehnt den Aufruf "POST /api/sparziele" mit Zielbetrag "0,00 €" und Zieldatum "in 100 Tagen" mit dem Status "400" ab

## Die Schnittstelle lehnt das Sparziel ohne Anmeldung mit 401 ab

Tags: UC-025, PK-72, NFR-006

* Testdaten sind zurückgesetzt
* Die Schnittstelle lehnt den Aufruf "POST /api/sparziele" mit Zielbetrag "600,00 €" und Zieldatum "in 100 Tagen" mit dem Status "401" ab

## Die Schnittstelle lehnt das Sparziel mit einem Zieldatum in der Vergangenheit mit 422 ab

Tags: UC-025, PK-72, BR-0102

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Schnittstelle lehnt den Aufruf "POST /api/sparziele" mit Zielbetrag "600,00 €" und Zieldatum "gestern" mit dem Status "422" ab

## Das Sparziel ist ohne Anmeldung nicht erreichbar

Tags: UC-025, PK-72, NFR-006

* Testdaten sind zurückgesetzt
* Das Sparziel ist ohne Anmeldung nicht erreichbar

## Eine Kundin ohne Tagesgeldkonto sieht statt der Eingabe den Hinweis

Tags: UC-025, PK-72, BR-0103

* Testdaten sind zurückgesetzt
* "lasttest-001" meldet sich mit der Vorgabe-PIN der Lastkunden an
* Die Kundin öffnet das Sparziel
* Das Sparziel zeigt die Meldung "Sie haben kein Tagesgeldkonto."

## Ein wiederholtes Anlegen mit gleichen Angaben legt ein weiteres Sparziel mit eigenem Dauerauftrag an

Tags: UC-025, PK-72, BR-0103

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet das Sparziel
* Die Kundin berechnet die Sparrate für Zielbetrag "1.000,00 €" und Zieldatum "in 70 Tagen"
* Die Kundin legt das Sparziel an
* Die Kundin berechnet die Sparrate für Zielbetrag "1.000,00 €" und Zieldatum "in 70 Tagen"
* Die Kundin legt das Sparziel an
* Das Sparziel zeigt die Meldung "Sparziel angelegt."
* Die Kundin öffnet die Daueraufträge
* Die Daueraufträge zeigen "2" Daueraufträge an das Tagesgeldkonto mit Verwendungszweck "Sparrate Sparziel"
