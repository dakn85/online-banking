# PK-10: Messpunkt für NFR-003: Antwortzeit von Finanzstatus und Überweisung

**Art:** Technik · **Priorität:** Niedrig · **Systeme:** Online-Banking

## Story

NFR-003 „Antwortzeit von Finanzstatus und Überweisung“ wird im Betrieb gemessen. Die Datei docs/betrieb/slo/nfr-003.yaml beschreibt das Ziel als OpenSLO; KnippQAi wertet sie im Bereich Betrieb aus.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Messpunkt NFR-003: Antwortzeit von Finanzstatus und Überweisung | Neu | Messpunkt neu |

## Aufgaben für die Umsetzung

- [ ] Messpunkt NFR-003: Antwortzeit von Finanzstatus und Überweisung: Messpunkt neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-10 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-10 grün

## Entscheidungen

- Soll der Messpunkt für NFR-003 umgebungsunabhängig gelten oder bewusst nur für die Testumgebung, und dann das Maß in NFR-003 auf die Testumgebung präzisiert werden?
  **Antwort:** Umgebungsunabhängig: Filter entfernen, NFR-003 bleErledigt in fc8e272: Die Datei nennt keine Umgebung mehr, KnippQAi setzt sie beim Auswerten ein. counter: false, weil die Abfragen Raten liefern; KnippQAi summiert sie über 28 Tage.ibt „im Betrieb“.
  _→ ohne Änderung: Schon im Zweig umgesetzt (fc8e272), die Datei ist umgebungsfrei._
