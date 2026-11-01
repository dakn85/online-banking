# ADR-006: Akzeptanztests mit Gauge und Playwright gegen eine laufende Testumgebung

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

Jedes Akzeptanzkriterium ist ein Szenario im Browser, also braucht der Test eine gebaute, gestartete Umgebung mit TEST_MODE=1. Dieselben Szenarien laufen lokal und als Container im Netz der Plattform. Ein Lauf muss erkennen, ob die Umgebung den erwarteten Stand hat.

## Entscheidung

Die Akzeptanztests sind Gauge-Szenarien mit gauge-ts und Playwright (chromium) und sprechen den Dienst über BANKING_URL an; env/default zeigt auf http://localhost:18300, env/platform auf http://online-banking:8080. Vor der Suite vergleicht standPruefen die Antwort von GET /api/version mit KNIPPQ_ACCEPTED_COMMITS, je Szenario werden die Cookies gelöscht.

## Folgen

Leichter: Szenarien prüfen die echte Oberfläche und denselben Vertrag wie die Kundin, ein Lauf gegen eine veraltete Umgebung wird erkannt. Schwerer: ohne gebaute Testumgebung und ohne gesetzte VERSION schlagen die Tests fehl oder prüfen den Stand nicht; kein Netzwerk-Mocking, deshalb braucht jeder Fehlerfall einen eigenen Ausgangsstand über den Test-Reset.
