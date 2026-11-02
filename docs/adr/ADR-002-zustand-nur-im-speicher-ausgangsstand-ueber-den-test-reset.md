# ADR-002: Zustand nur im Speicher, Ausgangsstand über den Test-Reset

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

C-001 sagt: Demo-Konten statt Kernbank. Die Akzeptanztests brauchen vor jedem Szenario denselben Ausgangsstand, und der Dienst soll ohne Datenbank starten. Konten stehen als Modulvariable mit AUSGANGSSTAND in src/konten.ts, Sitzungen und ausgeführte Aufträge in Maps. Szenarien zum Tageslimit brauchen einen Girokontosaldo über dem Ausgangsstand, damit sie das Tageslimit prüfen und nicht die Betragsgrenze des Kontos.

## Entscheidung

Konten, Sitzungen und ausgeführte Aufträge liegen ausschließlich im Speicher des Prozesses. POST /api/test/reset beendet alle Sitzungen und setzt Konten und Aufträge auf den Ausgangsstand zurück; die Route wird nur bei TEST_MODE=1 registriert. Der Ausgangsstand bleibt unverändert; eine zweite Route des Testbetriebs setzt den Saldo eines Kontos (POST /api/test/konten/{iban}/saldo), damit ein Szenario einen anderen Ausgangssaldo herstellen kann; sie ändert nur den Saldo; die Demo-Umsätze samt ihren Saldo-danach-Werten bleiben stehen, deshalb bauen Szenarien, die die Umsatzliste prüfen, weiter auf dem Ausgangsstand auf; auch sie ist nur bei TEST_MODE=1 vorhanden.

## Folgen

Leichter: kein Schema, keine Migration, kein Betrieb einer Datenbank, Tests laufen mit einem Aufruf reproduzierbar; ein Szenario, das einen anderen Saldo braucht, stellt ihn mit einem weiteren Aufruf her, ohne den Ausgangsstand zu verändern. Schwerer: jeder Neustart verliert Sitzungen, Salden und die Idempotenz-Ablage; mehrere Instanzen teilen keinen Zustand; ein gesetzter Saldo gilt nur bis zum nächsten Reset; der Reset-Endpunkt und die Saldo-Route dürfen in keinem Betrieb ohne TEST_MODE erreichbar sein.
