# ADR-001: Ein Dienst liefert Oberfläche und API

- **Status:** vorgeschlagen
- **Datum:** 2026-10-31

## Kontext

Zwei Use Cases, drei Masken, keine Notwendigkeit für einen eigenen Build der Oberfläche. Der Dienst soll Seiten und JSON aus einer Hand geben, damit keine zweite Auslieferung, kein CORS und kein Bundler zu betreiben ist. Die Seitenmodule sind kleine Skripte, die sich über Aventa.seite am Rahmen in public/app.js anmelden; jede Seite steht als eigener Eintrag in der Liste in src/main.ts.

## Entscheidung

Ein Express-Prozess liefert beides: HTML aus public/ unter /assets, /finanzstatus und /ueberweisung über app.html, dazu JSON unter /api. Die Oberfläche bleibt ungebündeltes HTML, CSS und JavaScript ohne Framework und ohne Typprüfung.

## Folgen

Leichter: eine Auslieferung und ein Port, keine CORS-Konfiguration, kein Frontend-Build, gemeinsamer Rahmen für alle Seiten. Schwerer: eine neue Seite braucht einen Eintrag in src/main.ts und ein Skript in app.html; die Oberfläche ist nicht typgeprüft, deshalb stehen fachliche Prüfungen zusätzlich in TypeScript im Dienst.
