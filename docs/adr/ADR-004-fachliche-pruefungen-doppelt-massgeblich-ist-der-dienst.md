# ADR-004: Fachliche Prüfungen doppelt, maßgeblich ist der Dienst

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

BR-0003 und BR-0004 sollen ohne Rundreise am Feld gemeldet werden, müssen aber auch für Aufrufe außerhalb der eigenen Oberfläche gelten. Eine gemeinsame Bibliothek gibt es nicht: die Oberfläche ist JavaScript unter public/, der Dienst TypeScript unter src/. Bei der Umbuchung (UC-021) liefert 422 zwei Ursachen (BR-0088, BR-0089), 400 deckt den Mindestbetrag und Formatfehler mehrerer Felder ab, und die Antwort trägt keinen Ursachencode; eine Zuordnung nach Status zu einem Feld wäre nicht eindeutig.

## Entscheidung

Dieselbe Regel steht zweimal, in der Oberfläche und im Dienst: der Browser prüft für die Rückmeldung, der Dienst prüft beim Bestätigen erneut und lehnt mit 400 beziehungsweise 422 ab; die Oberfläche ordnet bei der Überweisung 400 dem IBAN-Feld, 422 dem Betrag und jeden anderen Status der allgemeinen Meldung zu. Bei der Umbuchung ordnet sie keinen Status einem Feld zu: Sie zeigt bei 400 wegen des Mindestbetrags und bei 422 den Fachtext aus dem Feld fehler des Dienstes als allgemeine Meldung im Formular, bei jedem anderen 400 (Formatfehler von IBAN oder auftragsId) und bei jedem anderen Status die allgemeine Meldung „Die Umbuchung konnte nicht ausgeführt werden.“. Der Dienst prüft in der Reihenfolge 401, 400, 403, 422 BR-0088, 422 BR-0089; die erste Verletzung lehnt ab. Maßgeblich ist die Prüfung des Dienstes; die SEPA-Länderliste steht als Referenz in BR-0003, die Oberfläche führt dieselben Länderkennzeichen für die Feldmeldung mit.

## Folgen

Leichter: sofortige Feldmeldung und trotzdem eine belastbare Grenze in der Schnittstelle. Schwerer: jede Änderung an BR-0003 oder BR-0004 ist an zwei Stellen nötig, die SEPA-Länderliste ist in beiden Implementierungen hart kodiert, folgt der Referenzliste in BR-0003 und ist mit ihr an beiden Stellen nachzuführen; Abweichungen sind nur an den Akzeptanztests zu erkennen. Der Dienst vergibt 400 auch für einen unvollständigen Auftrag („Der Auftrag ist unvollständig.“), die Oberfläche zeigt dafür aber die IBAN-Meldung am IBAN-Feld; eine Prüfung, die nur den Dienst betrifft, ist im Browser damit falsch verortet. Bei der Umbuchung gibt es diese Fehlverortung nicht, weil keine Meldung an einem Feld hängt; dafür markiert die Oberfläche dort auch bei einem Fehler im Betrag kein Feld, sie zeigt nur die Meldung im Formular. Der Dienst muss bei der Umbuchung den Fachtext aus UC-021 in fehler liefern, weil die Oberfläche ihn unverändert anzeigt.
