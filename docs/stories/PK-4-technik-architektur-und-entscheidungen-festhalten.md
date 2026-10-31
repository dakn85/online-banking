# PK-4: Technik: Architektur und Entscheidungen festhalten

**Art:** Technik · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

_Noch kein Story-Satz._

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Ein Dienst liefert Oberfläche und API | Neu | Entscheidung neu |
| Zustand nur im Speicher, Ausgangsstand über den Test-Reset | Neu | Entscheidung neu |
| Genau einmalige Ausführung über die von der Oberfläche vergebene Auftrags-Kennung | Neu | Entscheidung neu |
| Fachliche Prüfungen doppelt, maßgeblich ist der Dienst | Neu | Entscheidung neu |
| Geldbeträge als Zahl in Euro, auf Cent gerundet | Neu | Entscheidung neu |
| Akzeptanztests mit Gauge und Playwright gegen eine laufende Testumgebung | Neu | Entscheidung neu |
| Architektur | Neu | Architektur neu |

## Aufgaben für die Umsetzung

- [ ] Ein Dienst liefert Oberfläche und API: Entscheidung neu
- [ ] Zustand nur im Speicher, Ausgangsstand über den Test-Reset: Entscheidung neu
- [ ] Genau einmalige Ausführung über die von der Oberfläche vergebene Auftrags-Kennung: Entscheidung neu
- [ ] Fachliche Prüfungen doppelt, maßgeblich ist der Dienst: Entscheidung neu
- [ ] Geldbeträge als Zahl in Euro, auf Cent gerundet: Entscheidung neu
- [ ] Akzeptanztests mit Gauge und Playwright gegen eine laufende Testumgebung: Entscheidung neu
- [ ] Architektur: Architektur neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-4 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-4 grün

## Offene Fragen

- [ ] Sollen die sechs ADRs als vorgeschlagen stehen bleiben oder als angenommen gelten?
- [ ] Bleiben Geldbeträge als number in Euro, oder soll der technische Rahmen die Leitplanke durchsetzen (Betrag in Cent als Ganzzahl)?
