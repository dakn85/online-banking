# PK-8: Antwortzeit und Verfügbarkeit von Finanzstatus und Überweisung festlegen

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Betrieb der Aventa Bank möchte ich für Finanzstatus und Überweisung messbare Ziele für Antwortzeit und Verfügbarkeit, damit ich nach jeder Auslieferung sehe, ob eine Story die Kundinnen warten lässt oder Serverfehler bringt.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Architektur | Geändert | Querschnittliche Konzepte geändert |
| Antwortzeit von Finanzstatus und Überweisung | Neu | Qualitätsanforderung neu |
| Verfügbarkeit von Finanzstatus und Überweisung | Neu | Qualitätsanforderung neu |

## Aufgaben für die Umsetzung

- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Antwortzeit von Finanzstatus und Überweisung: Qualitätsanforderung neu
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Qualitätsanforderung neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-8 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-8 grün

## Entscheidungen

- Zählt die Antwortzeitmessung alle Aufrufe von GET /api/konten, auch abgewiesene ohne gültige Sitzung?
  **Antwort:** Alle Aufrufe zählen, auch abgewiesene.
  _→ ohne Änderung: Steht schon in NFR-003: das Maß zählt alle Aufrufe von GET /api/konten, wie im übernommenen Vorschlag._
- Zählen fachliche Ablehnungen (4xx) in die Verfügbarkeitsquote hinein?
  **Antwort:** Nein, nur 5xx zählen als Fehler.
  _→ ohne Änderung: Steht schon in NFR-004: der übernommene Vorschlag ging von dieser Antwort aus (4xx zählen nicht)._
- Soll der Betrieb als Stakeholder in die Vision aufgenommen werden, damit die Herkunft auf STK-n zeigt?
  **Antwort:** Nein, Herkunft bleibt „Betrieb“ mit Verweis auf Story PK-8.
  _→ ohne Änderung: Herkunft steht als „Betrieb: Story PK-8“ in NFR-003 und NFR-004, wie im übernommenen Vorschlag; die Vision bleibt unverändert._
- Welche Antwortzeitgrenze gilt für die Überweisung?
  **Antwort:** Dieselbe Grenze wie beim Finanzstatus: 95 % in höchstens 500 ms über 28 Tage.
  _→ eingearbeitet in NFR-003 · 4c7264e_
- Gilt das 28-Tage-Fenster je ausgelieferter Version oder gemeinsam über alle Aufrufe aller Versionen?
  **Antwort:** Gemeinsam über alle Aufrufe der letzten 28 Tage, ohne Trennung nach Version.
  _→ ohne Änderung: SLO-Fenster bleibt 28 Tage rollierend über alle Aufrufe; steht so in NFR-003/NFR-004._
