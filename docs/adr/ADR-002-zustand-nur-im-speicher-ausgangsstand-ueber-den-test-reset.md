# ADR-002: Zustand nur im Speicher, Ausgangsstand über den Test-Reset

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

C-001 sagt: Demo-Konten statt Kernbank. Die Akzeptanztests brauchen vor jedem Szenario denselben Ausgangsstand, und der Dienst soll ohne Datenbank starten. Konten stehen als Modulvariable mit AUSGANGSSTAND in src/konten.ts, Sitzungen und ausgeführte Aufträge in Maps.

## Entscheidung

Konten, Sitzungen und ausgeführte Aufträge liegen ausschließlich im Speicher des Prozesses. POST /api/test/reset beendet alle Sitzungen und setzt Konten und Aufträge auf den Ausgangsstand zurück; die Route wird nur bei TEST_MODE=1 registriert.

## Folgen

Leichter: kein Schema, keine Migration, kein Betrieb einer Datenbank, Tests laufen mit einem Aufruf reproduzierbar. Schwerer: jeder Neustart verliert Sitzungen, Salden und die Idempotenz-Ablage; mehrere Instanzen teilen keinen Zustand; der Reset-Endpunkt darf in keinem Betrieb ohne TEST_MODE erreichbar sein.
