# PK-8: Antwortzeit und Verfügbarkeit von Finanzstatus und Überweisung festlegen

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Betrieb der Aventa Bank möchte ich für Finanzstatus und Überweisung messbare Ziele für Antwortzeit und Verfügbarkeit, damit ich nach jeder Auslieferung sehe, ob eine Story die Kundinnen warten lässt oder Serverfehler bringt.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Antwortzeit des Finanzstatus | Neu | Qualitätsanforderung neu |
| Verfügbarkeit von Finanzstatus und Überweisung | Neu | Qualitätsanforderung neu |

## Aufgaben für die Umsetzung

- [ ] Antwortzeit des Finanzstatus: Qualitätsanforderung neu
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Qualitätsanforderung neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-8 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-8 grün

## Offene Fragen

- [ ] Zählt die Antwortzeitmessung alle Aufrufe von GET /api/konten, auch abgewiesene ohne gültige Sitzung?
- [ ] Zählen fachliche Ablehnungen (4xx) in die Verfügbarkeitsquote hinein?
- [ ] Soll der Betrieb als Stakeholder in die Vision aufgenommen werden, damit die Herkunft auf STK-n zeigt?
