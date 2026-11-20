# ADR-004: Fachliche Prüfungen doppelt, maßgeblich ist der Dienst

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

BR-0003 und BR-0004 sollen ohne Rundreise am Feld gemeldet werden, müssen aber auch für Aufrufe außerhalb der eigenen Oberfläche gelten. Eine gemeinsame Bibliothek gibt es nicht: die Oberfläche ist JavaScript unter public/, der Dienst TypeScript unter src/. Seit PK-43 lehnt der Dienst auch einen Betrag unter 0,10 € mit 400 ab (Feldregel Überweisung.betrag, UC-002 A8), sodass 400 nicht mehr allein zur IBAN gehört. Der Dienst lehnt beim Bestätigen außerdem das überschrittene Tageslimit (BR-0070) mit 422 ab; dessen Meldung gehört zu keinem Feld, 422 hat damit zwei Ursachen mit unterschiedlichem Ort der Anzeige.

## Entscheidung

Dieselbe Regel steht zweimal, in der Oberfläche und im Dienst: der Browser prüft für die Rückmeldung, der Dienst prüft beim Bestätigen erneut und lehnt mit 400 beziehungsweise 422 ab; die Oberfläche ordnet die Ablehnung nach Status und Meldung des Dienstes zu: 400 mit der Mindestbetrag-Meldung („Der Betrag muss mindestens 0,10 € betragen.“) und 422 mit der Meldung zu BR-0004 dem Betrag, jedes andere 400 dem IBAN-Feld; bei 400 entscheidet der Fehlertext des Dienstes. 422 mit der Meldung zum Tageslimit (BR-0070) zeigt die Oberfläche im Formular als die eigene Meldung des Dienstes („Mit dieser Überweisung würde Ihr Tageslimit überschritten.“), ohne Feldbezug und nicht als Meldung aus UC-002 A6. Jeden anderen Status zeigt sie mit der Meldung aus UC-002 A6 („Die Überweisung konnte nicht ausgeführt werden.“) im Formular. Maßgeblich ist die Prüfung des Dienstes; die SEPA-Länderliste steht als Referenz in BR-0003, die Oberfläche führt dieselben Länderkennzeichen für die Feldmeldung mit. Verworfen: ein eigener Fehlercode im Schema Fehler der OpenAPI, weil er eine Vertragsänderung an Dienst, OpenAPI und Oberfläche erfordert.

## Folgen

Leichter: sofortige Feldmeldung und trotzdem eine belastbare Grenze in der Schnittstelle; das Tageslimit erscheint mit der Meldung des Dienstes im Formular und nicht am Betragsfeld. Schwerer: jede Änderung an BR-0003 oder BR-0004 ist an zwei Stellen nötig, die SEPA-Länderliste ist in beiden Implementierungen hart kodiert, folgt der Referenzliste in BR-0003 und ist mit ihr an beiden Stellen nachzuführen; Abweichungen sind nur an den Akzeptanztests zu erkennen. Die Zuordnung von 400 und 422 hängt am Meldungstext des Dienstes; jede neue Ursache mit diesen Status braucht eine eigene Zuordnung in der Oberfläche. Der Fehlertext des Dienstes für den Mindestbetrag ist Teil des Vertrags: ändert er sich nur in Dienst oder Oberfläche, ordnet die Oberfläche die 400 falsch dem IBAN-Feld zu, was nur die Akzeptanztests zeigen. Ein eigener Fehlercode im Schema Fehler würde die Zuordnung vom Text lösen und bleibt die Option, falls weitere 400- oder 422-Fälle ein eigenes Feld brauchen. Der Dienst vergibt 400 auch für einen unvollständigen Auftrag („Der Auftrag ist unvollständig.“), die Oberfläche zeigt dafür aber die IBAN-Meldung am IBAN-Feld; eine Prüfung, die nur den Dienst betrifft, ist im Browser damit falsch verortet.
