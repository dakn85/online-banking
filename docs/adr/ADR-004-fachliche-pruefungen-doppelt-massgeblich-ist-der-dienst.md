# ADR-004: Fachliche Prüfungen doppelt, maßgeblich ist der Dienst

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

BR-0003 (IBAN mit Prüfziffer nach ISO 7064 MOD 97-10 und SEPA-Länderliste) und BR-0004 (Betrag größer 0 und höchstens verfügbar) sollen ohne Rundreise am Feld gemeldet werden, müssen aber auch für Aufrufe außerhalb der eigenen Oberfläche gelten. Eine gemeinsame Bibliothek gibt es nicht: der Browser-Code ist JavaScript in public/, der Dienst TypeScript in src/.

## Entscheidung

Dieselbe Regel steht zweimal, in public/seiten/ueberweisung.js und in src/ueberweisung.ts. Der Browser prüft für die Rückmeldung, der Dienst prüft beim Bestätigen erneut und lehnt mit 400 beziehungsweise 422 ab; die Oberfläche ordnet 400 dem IBAN-Feld, 422 dem Betrag und jeden anderen Status der allgemeinen Meldung zu. Maßgeblich ist die Prüfung des Dienstes; die SEPA-Länderliste steht als Referenz in BR-0003, die Oberfläche führt dieselben Länderkennzeichen für die Feldmeldung mit.

## Folgen

Leichter: sofortige Feldmeldung und trotzdem eine belastbare Grenze in der Schnittstelle. Schwerer: jede Änderung an BR-0003 oder BR-0004 ist an zwei Stellen nötig, die SEPA-Länderliste ist in beiden Dateien hart kodiert und folgt der Referenzliste in BR-0003, eine Änderung der Liste ist damit in der Regel und in beiden Dateien nachzuführen, und Abweichungen sind nur an den Akzeptanztests zu erkennen. Dazu vergibt der Dienst 400 auch für einen unvollständigen Auftrag (`src/main.ts`, „Der Auftrag ist unvollständig.“), die Oberfläche zeigt dafür aber die IBAN-Meldung am IBAN-Feld (`public/seiten/ueberweisung.js`); eine Prüfung, die nur den Dienst betrifft, ist im Browser damit falsch verortet.
