# Daueraufträge

## Die Dauerauftragsliste zeigt nur Daueraufträge der angemeldeten Kundin

Tags: UC-007, PK-20, BR-0037

* Testdaten sind zurückgesetzt
* "jonas.weber" meldet sich mit der PIN "13579" an
* Die Kundin öffnet die Daueraufträge
* Die Daueraufträge zeigen die Zeilen
| Empfänger       | Betrag  | Ausführungstag |
|-----------------|---------|----------------|
| Stadtwerke Nord | 85,00 € | 15             |

## Ein Dauerauftrag vom Girokonto steht danach in der Dauerauftragsliste

Tags: UC-007, PK-20, BR-0032

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt den Dauerauftrag mit den Einträgen
| Empfänger       | IBAN des Empfängers         | Betrag | Ausführungstag im Monat | Erste Ausführung | Verwendungszweck |
|-----------------|-----------------------------|--------|-------------------------|------------------|------------------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 120,00 | 15                      | in 3 Tagen       | Rechnung 4711    |
* Die Daueraufträge zeigen die Zeilen
| Empfänger            | Betrag   | Ausführungstag |
|----------------------|----------|----------------|
| Hausverwaltung Weber | 950,00 € | 1              |
| Möbel Nord GmbH      | 120,00 € | 15             |

## Ein Dauerauftrag über einen Betrag von 0 Euro wird nicht angelegt

Tags: UC-007, PK-20, BR-0033

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt den Dauerauftrag mit den Einträgen
| Empfänger       | IBAN des Empfängers         | Betrag | Ausführungstag im Monat | Erste Ausführung | Verwendungszweck |
|-----------------|-----------------------------|--------|-------------------------|------------------|------------------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 0,00   | 15                      | in 3 Tagen       | Rechnung 4711    |
* Die Daueraufträge zeigen die Meldung "Der Betrag muss größer als 0 Euro sein."
* Die Daueraufträge zeigen die Zeilen
| Empfänger            | Betrag   |
|----------------------|----------|
| Hausverwaltung Weber | 950,00 € |

## Ein Ausführungstag über 28 wird nicht angenommen

Tags: UC-007, PK-20, BR-0034

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt den Dauerauftrag mit den Einträgen
| Empfänger       | IBAN des Empfängers         | Betrag | Ausführungstag im Monat | Erste Ausführung | Verwendungszweck |
|-----------------|-----------------------------|--------|-------------------------|------------------|------------------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 120,00 | 29                      | in 3 Tagen       | Rechnung 4711    |
* Die Daueraufträge zeigen die Meldung "Der Ausführungstag im Monat liegt zwischen 1 und 28."
* Die Daueraufträge zeigen die Zeilen
| Empfänger            | Betrag   |
|----------------------|----------|
| Hausverwaltung Weber | 950,00 € |

## Eine erste Ausführung vor heute wird nicht angenommen

Tags: UC-007, PK-20, BR-0035

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt den Dauerauftrag mit den Einträgen
| Empfänger       | IBAN des Empfängers         | Betrag | Ausführungstag im Monat | Erste Ausführung | Verwendungszweck |
|-----------------|-----------------------------|--------|-------------------------|------------------|------------------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 120,00 | 15                      | gestern          | Rechnung 4711    |
* Die Daueraufträge zeigen die Meldung "Die erste Ausführung darf nicht vor heute liegen."
* Die Daueraufträge zeigen die Zeilen
| Empfänger            | Betrag   |
|----------------------|----------|
| Hausverwaltung Weber | 950,00 € |

## Ein Dauerauftrag an eine ungültige IBAN wird nicht angelegt

Tags: UC-007, PK-20, BR-0036

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt den Dauerauftrag mit den Einträgen
| Empfänger       | IBAN des Empfängers         | Betrag | Ausführungstag im Monat | Erste Ausführung | Verwendungszweck |
|-----------------|-----------------------------|--------|-------------------------|------------------|------------------|
| Möbel Nord GmbH | DE00 0000 0000 0000 0000 00 | 120,00 | 15                      | in 3 Tagen       | Rechnung 4711    |
* Die Daueraufträge zeigen die Meldung "Die IBAN ist ungültig oder gehört zu keinem SEPA-Land."
* Die Daueraufträge zeigen die Zeilen
| Empfänger            | Betrag   |
|----------------------|----------|
| Hausverwaltung Weber | 950,00 € |

## Ein Dauerauftrag ohne Verwendungszweck steht ohne Verwendungszweck in der Liste

Tags: UC-007, PK-20, BR-0039

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt den Dauerauftrag mit den Einträgen
| Empfänger       | IBAN des Empfängers         | Betrag | Ausführungstag im Monat | Erste Ausführung | Verwendungszweck |
|-----------------|-----------------------------|--------|-------------------------|------------------|------------------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 120,00 | 15                      | in 3 Tagen       |                  |
* Die Daueraufträge zeigen die Zeilen
| Empfänger            | Verwendungszweck |
|----------------------|------------------|
| Hausverwaltung Weber | Miete Dezember   |
| Möbel Nord GmbH      |                  |

## Ein gelöschter Dauerauftrag fehlt danach in der Liste

Tags: UC-007, PK-20, BR-0038

* Testdaten sind zurückgesetzt
* "lena.hoffmann" meldet sich mit der PIN "24680" an
* Die Kundin öffnet die Daueraufträge
* Die Kundin legt den Dauerauftrag mit den Einträgen
| Empfänger       | IBAN des Empfängers         | Betrag | Ausführungstag im Monat | Erste Ausführung | Verwendungszweck |
|-----------------|-----------------------------|--------|-------------------------|------------------|------------------|
| Möbel Nord GmbH | DE89 3704 0044 0532 0130 00 | 120,00 | 15                      | in 3 Tagen       | Rechnung 4711    |
* Die Kundin wählt die Vorlage "Hausverwaltung Weber" zum Löschen und antwortet auf die Sicherheitsabfrage "Ja"
* Die Daueraufträge zeigen die Meldung "Dauerauftrag gelöscht."
* Die Daueraufträge zeigen die Zeilen
| Empfänger       | Betrag   | Ausführungstag |
|-----------------|----------|----------------|
| Möbel Nord GmbH | 120,00 € | 15             |
