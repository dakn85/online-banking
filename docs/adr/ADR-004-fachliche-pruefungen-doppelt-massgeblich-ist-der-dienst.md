# ADR-004: Fachliche Prüfungen doppelt, maßgeblich ist der Dienst

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

BR-0003 und BR-0004 sollen ohne Rundreise am Feld gemeldet werden, müssen aber auch für Aufrufe außerhalb der eigenen Oberfläche gelten. Eine gemeinsame Bibliothek gibt es nicht: die Oberfläche ist JavaScript unter public/, der Dienst TypeScript unter src/.

## Entscheidung

Dieselbe Regel steht zweimal, in der Oberfläche und im Dienst: der Browser prüft für die Rückmeldung, der Dienst prüft beim Bestätigen erneut und lehnt mit 400 beziehungsweise 422 ab; die Oberfläche ordnet 400 dem IBAN-Feld, 422 dem Betrag und jeden anderen Status der allgemeinen Meldung zu. Maßgeblich ist die Prüfung des Dienstes; die SEPA-Länderliste steht als Referenz in BR-0003, die Oberfläche führt dieselben Länderkennzeichen für die Feldmeldung mit.

## Folgen

Leichter: sofortige Feldmeldung und trotzdem eine belastbare Grenze in der Schnittstelle. Schwerer: jede Änderung an BR-0003 oder BR-0004 ist an zwei Stellen nötig, die SEPA-Länderliste ist in beiden Implementierungen hart kodiert, folgt der Referenzliste in BR-0003 und ist mit ihr an beiden Stellen nachzuführen; Abweichungen sind nur an den Akzeptanztests zu erkennen. Der Dienst vergibt 400 auch für einen unvollständigen Auftrag („Der Auftrag ist unvollständig.“), die Oberfläche zeigt dafür aber die IBAN-Meldung am IBAN-Feld; eine Prüfung, die nur den Dienst betrifft, ist im Browser damit falsch verortet.
