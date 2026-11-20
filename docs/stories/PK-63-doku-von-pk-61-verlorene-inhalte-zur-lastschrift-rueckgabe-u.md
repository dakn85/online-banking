# PK-63: Doku: von PK-61 verlorene Inhalte zur Lastschrift-Rückgabe und Vormerkung zurückholen

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Product Owner möchte ich, dass Datenmodell, API-Beschreibung und Architektur wieder nennen, was PK-59 (Lastschrift zurückgeben) und PK-60 (vorgemerkte Überweisungen) gebracht haben und beim Merge von PK-61 verloren ging, und dass UC-004 dem Ziel Z-7 statt Z-6 zugeordnet ist, damit die Dokumentation zum Code passt und spätere Stories darauf aufbauen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos mit Saldo danach, neueste zuerst | Geändert | Beschreibung geändert, Use Cases geändert |
| Umsatz | Geändert | Eigenschaft betrag geändert, Eigenschaft buchungstag geändert, Eigenschaft gegenpartei geändert, und 8 weitere, Beschreibung geändert, Attribut kategorie geändert |
| Architektur | Geändert | Bausteinsicht geändert, Querschnittliche Konzepte geändert |
| UC-004 Empfängervorlagen verwalten | Geändert | Ziele geändert |

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

**Bausteine:** keine; der Code hat das Verhalten seit PK-59/PK-60 (src/umsaetze.ts, src/lastschrift.ts, src/ueberweisung.ts).

**Schritte**
1. Nur Dokumentation: Die Beschreibung stellt wieder her, was der Code schon tut (UC-022, BR-0093..BR-0095; UC-017, BR-0079/BR-0080). Kein Code, keine Steps.
2. Beleg: die bestehenden Szenarien zu UC-003, UC-017 und UC-022 laufen unverändert grün.

**Rahmen:** keine Änderung.

## Entscheidungen

- Welche Kategorie tragen die beiden Demo-Lastschriften Fitnessstudio Vital und Zeitungsverlag Nord im Ausgangsstand des Girokontos (und die Gutschrift einer Rückgabe)?
  **Antwort:** Fitnessstudio Vital Freizeit, Zeitungsverlag Nord Freizeit, Rückgabe-Umsatz wie die ursprüngliche Lastschrift
  _→ ohne Änderung: Von Hand nach dem Code eingetragen (e94b4cf)._
- Die Story ändert in UC-004 das Ziel von Z-6 auf Z-7. Das hat mit Lastschrift-Rückgabe und Vormerkung nichts zu tun. Soll UC-004 tatsächlich dem Ziel Z-7 zugeordnet sein?
  **Antwort:** Ja, Z-7 ist richtig und gehört zur Wiederherstellung: Z-7 in vision.md heißt „Empfänger aus Vorlage statt Neueingabe“; PK-7 legte UC-004 mit „Ziele: NEU“ an und bekam dabei Z-6 (Umsätze) statt Z-7. Gefunden bei der Prüfung der Spezifikation am 20.11., bewusst in diese Aufräum-Story mitgenommen.
  _→ ohne Änderung: Steht schon im Zweig (9e07c1d), Story-Satz per übernommenem Vorschlag ergänzt._
