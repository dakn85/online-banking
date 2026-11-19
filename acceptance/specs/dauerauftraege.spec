# Daueraufträge vom Girokonto verwalten

## Ein Dauerauftrag wird angelegt und in der Liste gezeigt

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "in 60 Tagen" an
* Die Daueraufträge zeigen die Meldung "Dauerauftrag gespeichert."
* Die Daueraufträge zeigen die Einträge
| Empfänger       | IBAN                        | Betrag  | Zweck         | Turnus    | Erster Ausführungstag | Enddatum    |
|-----------------|-----------------------------|---------|---------------|-----------|-----------------------|-------------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 50,00 € | Rechnung 4711 | monatlich | in 5 Tagen            | in 60 Tagen |

## Die Daueraufträge sind nach erstem Ausführungstag aufsteigend sortiert

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Stadtwerke Nord" mit IBAN "DE02 5001 0517 5407 3249 31", Betrag "85,00 €", Verwendungszweck "Abschlag Strom", Turnus "vierteljährlich", erstem Ausführungstag "in 20 Tagen" und Enddatum "" an
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "jährlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Daueraufträge zeigen die Einträge
| Empfänger       | IBAN                        | Betrag  | Zweck          | Turnus          | Erster Ausführungstag | Enddatum |
|-----------------|-----------------------------|---------|----------------|-----------------|-----------------------|----------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 50,00 € | Rechnung 4711  | jährlich        | in 5 Tagen            |          |
| Stadtwerke Nord | DE02 5001 0517 5407 3249 31 | 85,00 € | Abschlag Strom | vierteljährlich | in 20 Tagen           |          |

## Ein Dauerauftrag ohne Verwendungszweck wird abgelehnt

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Daueraufträge zeigen die Meldung "Die Angaben zum Dauerauftrag sind unvollständig oder ungültig."

## Ein Dauerauftrag mit IBAN außerhalb des SEPA-Raums wird abgelehnt

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "TR33 0006 1005 1978 6457 8413 26", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Daueraufträge zeigen die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."

## Ein Dauerauftrag mit Betrag unter 0,10 € wird abgelehnt

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "0,09 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Daueraufträge zeigen die Meldung "Der Betrag muss mindestens 0,10 € betragen."

## Ein erster Ausführungstag in der Vergangenheit wird abgelehnt

Tags: UC-016, PK-52, BR-0077

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "gestern" und Enddatum "" an
* Die Daueraufträge zeigen die Meldung "Der erste Ausführungstag darf nicht in der Vergangenheit liegen."

## Ein Enddatum vor dem ersten Ausführungstag wird abgelehnt

Tags: UC-016, PK-52, BR-0077

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 10 Tagen" und Enddatum "in 5 Tagen" an
* Die Daueraufträge zeigen die Meldung "Das Enddatum darf nicht vor dem ersten Ausführungstag liegen."

## Ein Dauerauftrag wird geändert

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Kundin ändert beim Dauerauftrag "Möbel Nord GmbH" das Feld "Betrag" auf "75,00 €"
* Die Daueraufträge zeigen die Meldung "Dauerauftrag geändert."
* Die Daueraufträge zeigen die Einträge
| Empfänger       | IBAN                        | Betrag  | Zweck         | Turnus    | Erster Ausführungstag | Enddatum |
|-----------------|-----------------------------|---------|---------------|-----------|-----------------------|----------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 75,00 € | Rechnung 4711 | monatlich | in 5 Tagen            |          |

## Bei vergangenem ersten Ausführungstag lässt sich der Betrag trotzdem ändern

Tags: UC-016, PK-52, BR-0077

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin ändert beim Dauerauftrag "Hausverwaltung Weber" das Feld "Betrag" auf "700,00 €"
* Die Daueraufträge zeigen die Meldung "Dauerauftrag geändert."
* Die Daueraufträge zeigen die Einträge
| Empfänger            | IBAN                        | Betrag   | Zweck | Turnus    | Erster Ausführungstag | Enddatum |
|----------------------|-----------------------------|----------|-------|-----------|-----------------------|----------|
| Hausverwaltung Weber | DE89 3704 0044 0532 0130 00 | 700,00 € | Miete | monatlich | vor 30 Tagen          |          |

## Ein geänderter erster Ausführungstag in der Vergangenheit wird abgelehnt

Tags: UC-016, PK-52, BR-0077

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Kundin ändert beim Dauerauftrag "Möbel Nord GmbH" das Feld "Erster Ausführungstag" auf "gestern"
* Die Daueraufträge zeigen die Meldung "Der erste Ausführungstag darf nicht in der Vergangenheit liegen."

## Ein Dauerauftrag wird erst nach der Sicherheitsabfrage gelöscht

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Kundin legt einen Dauerauftrag an Empfänger "Stadtwerke Nord" mit IBAN "DE02 5001 0517 5407 3249 31", Betrag "85,00 €", Verwendungszweck "Abschlag Strom", Turnus "vierteljährlich", erstem Ausführungstag "in 20 Tagen" und Enddatum "" an
* Die Kundin wählt den Dauerauftrag "Möbel Nord GmbH" zum Löschen und antwortet auf die Sicherheitsabfrage "Ja"
* Die Daueraufträge zeigen die Meldung "Dauerauftrag gelöscht."
* Die Daueraufträge zeigen die Einträge
| Empfänger       | IBAN                        | Betrag  | Zweck          | Turnus          | Erster Ausführungstag | Enddatum |
|-----------------|-----------------------------|---------|----------------|-----------------|-----------------------|----------|
| Stadtwerke Nord | DE02 5001 0517 5407 3249 31 | 85,00 € | Abschlag Strom | vierteljährlich | in 20 Tagen           |          |

## Bricht die Kundin die Sicherheitsabfrage ab, bleibt der Dauerauftrag bestehen

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Kundin wählt den Dauerauftrag "Möbel Nord GmbH" zum Löschen und antwortet auf die Sicherheitsabfrage "Nein"
* Die Daueraufträge zeigen die Einträge
| Empfänger       | IBAN                        | Betrag  | Zweck         | Turnus    | Erster Ausführungstag | Enddatum |
|-----------------|-----------------------------|---------|---------------|-----------|-----------------------|----------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 50,00 € | Rechnung 4711 | monatlich | in 5 Tagen            |          |

## Die Daueraufträge sind ohne Anmeldung nicht erreichbar

Tags: UC-016, PK-52, BR-0078

* Testdaten sind zurückgesetzt
* Die Daueraufträge sind ohne Anmeldung nicht erreichbar

## Ein Enddatum vor dem unveränderten ersten Ausführungstag wird beim Ändern abgelehnt

Tags: UC-016, PK-52, BR-0077

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin ändert beim Dauerauftrag "Hausverwaltung Weber" das Feld "Enddatum" auf "vor 40 Tagen"
* Die Daueraufträge zeigen die Meldung "Das Enddatum darf nicht vor dem ersten Ausführungstag liegen."

## Bei gleichem ersten Ausführungstag sind die Daueraufträge nach Empfänger aufsteigend sortiert

Tags: UC-016, PK-52

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt einen Dauerauftrag an Empfänger "Stadtwerke Nord" mit IBAN "DE02 5001 0517 5407 3249 31", Betrag "85,00 €", Verwendungszweck "Abschlag Strom", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Kundin legt einen Dauerauftrag an Empfänger "Möbel Nord GmbH" mit IBAN "DE89 3704 0044 0532 0130 00", Betrag "50,00 €", Verwendungszweck "Rechnung 4711", Turnus "monatlich", erstem Ausführungstag "in 5 Tagen" und Enddatum "" an
* Die Daueraufträge zeigen die Einträge
| Empfänger       | IBAN                        | Betrag  | Zweck          | Turnus    | Erster Ausführungstag | Enddatum |
|-----------------|-----------------------------|---------|----------------|-----------|-----------------------|----------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 50,00 € | Rechnung 4711  | monatlich | in 5 Tagen            |          |
| Stadtwerke Nord | DE02 5001 0517 5407 3249 31 | 85,00 € | Abschlag Strom | monatlich | in 5 Tagen            |          |
