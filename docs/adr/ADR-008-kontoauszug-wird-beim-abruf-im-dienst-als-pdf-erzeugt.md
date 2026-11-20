# ADR-008: Kontoauszug wird beim Abruf im Dienst als PDF erzeugt

- **Status:** vorgeschlagen
- **Datum:** 2026-11-19

## Kontext

_Was ist die Lage, welche Kräfte wirken?_

## Entscheidung

Der Dienst erzeugt das PDF beim Abruf aus den Umsätzen im Speicher mit einer reinen Node-Bibliothek ohne native Abhängigkeit und liefert es direkt als Download; es wird nicht gespeichert. Salden und Beträge folgen ADR-005 und erscheinen im PDF als Euro mit Tausenderpunkt und Komma.

## Folgen

_Was wird leichter, was schwerer?_
