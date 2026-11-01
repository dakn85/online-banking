# PK-5: Technik: Systemdokumentation auf Architekturebene

**Art:** Technik · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als neue Entwicklerin im Team möchte ich eine Architekturbeschreibung des Online-Bankings nach arc42 lesen, die Bausteine, Abläufe, Verteilung, Konzepte und Risiken auf Architekturebene erklärt statt Datei für Datei, damit ich mich in einer halben Stunde zurechtfinde und die Beschreibung auch bei wachsendem Code gültig bleibt.

## Nicht im Scope

Kein Code, keine Use Cases, Geschäftsregeln, API oder NFR (nur Verweise per Kennung); keine Beschreibung einzelner Dateien, Klassen oder Funktionen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Architektur | Geändert | Einführung und Ziele geändert, Randbedingungen geändert, Kontextabgrenzung geändert, und 8 weitere |

## Aufgaben für die Umsetzung

- [ ] Architektur: Einführung und Ziele geändert
- [ ] Architektur: Randbedingungen geändert
- [ ] Architektur: Kontextabgrenzung geändert
- [ ] Architektur: Lösungsstrategie geändert
- [ ] Architektur: Bausteinsicht geändert
- [ ] Architektur: Laufzeitsicht geändert
- [ ] Architektur: Verteilungssicht geändert
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Architektur: Qualitätsanforderungen geändert
- [ ] Architektur: Risiken und technische Schulden geändert
- [ ] Architektur: Glossar geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-5 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-5 grün

## Entscheidungen

- Soll die Verteilungsgrafik den Plattformlauf der Akzeptanztests als eigenen Knoten zeigen?
  **Antwort:** Nein, die Tests stehen nur im Testkonzept.
  _→ noch nicht in der Spezifikation_
- Soll die fehlende Autorisierung je Konto als eigene Entscheidung festgehalten werden oder als Risiko bleiben?
  **Antwort:** Als Risiko bleiben, kein weiterer ADR.
  _→ noch nicht in der Spezifikation_
- Soll der Plattformlauf der Akzeptanztests als eigener Knoten in der Verteilung erscheinen?
  **Antwort:** Nein, die Verteilung bleibt bei den Umgebungen, in denen die Container der Bausteinsicht laufen; der Lauf steht im Testkonzept.
  _→ noch nicht in der Spezifikation_
- Soll die fehlende Autorisierung je Konto als eigene Entscheidung unter docs/adr/ festgehalten werden?
  **Antwort:** Wir machen das später mit eigener Story
  _→ noch nicht in der Spezifikation_
