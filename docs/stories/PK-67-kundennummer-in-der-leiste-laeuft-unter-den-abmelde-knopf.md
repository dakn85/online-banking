# PK-67: Kundennummer in der Leiste läuft unter den Abmelde-Knopf

**Art:** Technik · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Nach PK-66 bricht die Kundennummer unten in der Leiste nicht mehr um und läuft unter das Abmelde-Symbol (live auf dem Testcluster gesehen). Die Nummer bleibt zusammen, „Kundennummer“ darf davor umbrechen.

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

Hinweis: Der Code entstand vor diesem Entwurf (Technik-Story ohne Spezifikationsänderung).

**Bausteine:** public/styles.css (.leiste__kunde, .leiste__person), public/app.js (Kundennummer im Rahmen).

**Schritte**
1. Mittlere Spalte des Leistenfußes darf schrumpfen (minmax(0, 1fr)), der Text darf umbrechen.
2. Die Nummer selbst steht in einem eigenen span mit nowrap, damit „K-104 233“ nicht am Bindestrich zerfällt.

Keine Änderung an Dienst, API, Daten oder Szenarien.
