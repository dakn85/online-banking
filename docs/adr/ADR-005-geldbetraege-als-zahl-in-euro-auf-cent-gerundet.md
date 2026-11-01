# ADR-005: Geldbeträge als Zahl in Euro, auf Cent gerundet

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

Die Leitplanke verlangt dezimale Beträge, nie Gleitkommazahlen. Der Code nutzt number in Euro und rechnet in Cent: runden in src/konten.ts, cent in src/ueberweisung.ts. Ein Wechsel auf Dezimalarithmetik würde Konten, Vertrag und Oberfläche gleichzeitig berühren.

## Entscheidung

Beträge bleiben number in Euro; jede Summe und jede Belastung wird mit Math.round auf Cent gerundet, Vergleiche gegen den verfügbaren Betrag laufen über Cent. Die Währung ist im Auftrag und in der Antwort fest EUR, die Anzeige nutzt Intl.NumberFormat de-DE.

## Folgen

Leichter: keine zusätzliche Bibliothek, einfache Übergabe als JSON-Zahl, Cent-Vergleich hält die Grenze genau. Schwerer: Abweichung von der Leitplanke, Rundungsdrift bei vielen Buchungen, und ein späterer Wechsel auf Ganzzahl-Cent oder Dezimaltyp ändert Vertrag und Anzeige an mehreren Stellen.
