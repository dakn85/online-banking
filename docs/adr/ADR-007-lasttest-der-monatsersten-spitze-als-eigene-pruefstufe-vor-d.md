# ADR-007: Lasttest der Monatsersten-Spitze als eigene Prüfstufe vor dem Release

- **Status:** vorgeschlagen
- **Datum:** 2026-11-12

## Kontext

_Was ist die Lage, welche Kräfte wirken?_

## Entscheidung

Ein eigenes Lasttest-Werkzeug liegt neben der Testsuite im Repo und fährt den Dienst ausschließlich über dessen HTTP-Schnittstelle: Anmeldung, Finanzstatus, Überweisung bis zur Bestätigung samt Buchung. Es läuft vor jedem Release gegen die gemeinsame Testumgebung, außerhalb der Akzeptanzläufe, und sein Bericht wird zum Release festgehalten; die Freigabe setzt einen bestandenen Lauf voraus.

## Folgen

_Was wird leichter, was schwerer?_
