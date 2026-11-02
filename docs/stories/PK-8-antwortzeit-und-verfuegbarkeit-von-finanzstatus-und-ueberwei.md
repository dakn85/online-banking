# PK-8: Antwortzeit und Verfügbarkeit von Finanzstatus und Überweisung festlegen

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Betrieb der Aventa Bank möchte ich für Finanzstatus und Überweisung messbare Ziele für Antwortzeit und Verfügbarkeit, damit ich nach jeder Auslieferung sehe, ob eine Story die Kundinnen warten lässt oder Serverfehler bringt.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Architektur | Geändert | Querschnittliche Konzepte geändert |
| Antwortzeit des Finanzstatus | Neu | Qualitätsanforderung neu |
| Verfügbarkeit von Finanzstatus und Überweisung | Neu | Qualitätsanforderung neu |

## Aufgaben für die Umsetzung

- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Antwortzeit des Finanzstatus: Qualitätsanforderung neu
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Qualitätsanforderung neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-8 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-8 grün

## Offene Fragen

- [ ] Welche Antwortzeitgrenze gilt für die Überweisung?

## Entscheidungen

- Zählt die Antwortzeitmessung alle Aufrufe von GET /api/konten, auch abgewiesene ohne gültige Sitzung?
  **Antwort:** Alle Aufrufe zählen, auch abgewiesene.
  _→ noch nicht in der Spezifikation_
- Zählen fachliche Ablehnungen (4xx) in die Verfügbarkeitsquote hinein?
  **Antwort:** Nein, nur 5xx zählen als Fehler.
  _→ noch nicht in der Spezifikation_
- Soll der Betrieb als Stakeholder in die Vision aufgenommen werden, damit die Herkunft auf STK-n zeigt?
  **Antwort:** Nein, Herkunft bleibt „Betrieb“ mit Verweis auf Story PK-8.
  _→ noch nicht in der Spezifikation_
