# ADR-002: Zustand nur im Speicher, Ausgangsstand über den Test-Reset

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

C-001 sagt: Demo-Konten statt Kernbank. Die Akzeptanztests brauchen vor jedem Szenario denselben Ausgangsstand, und der Dienst soll ohne Datenbank starten. Konten stehen mit ihrem Ausgangsstand je Kennung in src/konten.ts, Sitzungen und ausgeführte Aufträge in Maps. Seit PK-21 laufen neben den Akzeptanztests Lasttests mit 300 eigenen Kundinnen gegen dieselbe Testumgebung; ein Reset der einen darf die anderen nicht stören.

## Entscheidung

Konten, Sitzungen und ausgeführte Aufträge liegen ausschließlich im Speicher des Prozesses, geordnet nach der Kennung der Kundin; jede Kundin hat eigene Konten, auch die beiden Demo-Kundinnen. Im Testbetrieb (TEST_MODE=1) kommen die Lastkunden lasttest-001 bis lasttest-300 dazu, und es gibt zwei Resets: POST /api/test/reset beendet die Sitzungen der Demo-Kundinnen und setzt deren Konten, Umsätze, Aufträge und Empfängervorlagen auf den Ausgangsstand zurück; POST /api/test/lasttest/reset tut dasselbe nur für die Lastkunden. Keiner berührt die Daten des anderen. Beide Routen werden nur bei TEST_MODE=1 registriert.

## Folgen

Leichter: kein Schema, keine Migration, kein Betrieb einer Datenbank, Tests laufen mit einem Aufruf reproduzierbar. Schwerer: jeder Neustart verliert Sitzungen, Salden und die Idempotenz-Ablage; mehrere Instanzen teilen keinen Zustand; die Reset-Endpunkte und die Lastkunden mit ihrer öffentlichen PIN dürfen in keinem Betrieb ohne TEST_MODE erreichbar sein. Weil der Speicher nicht wächst, wenn niemand zurücksetzt, hält der Dienst für Lastkunden nur die jüngsten 200 Umsätze je Konto und 200 Auftrags-Kennungen je Kundin.
