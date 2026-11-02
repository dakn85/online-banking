# PK-9: Datenfehler im Finanzstatus schreibt die IBAN ins Log

**Art:** Fehler · **Priorität:** Hoch · **Systeme:** Online-Banking

## Story

Als Betrieb der Aventa Bank möchte ich, dass der Dienst bei einem Datenfehler im Finanzstatus keine IBAN protokolliert, damit Kontobezüge nicht über weitergegebene Logs abfließen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Architektur | Geändert | Querschnittliche Konzepte geändert, Risiken und technische Schulden geändert |

## Aufgaben für die Umsetzung

- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Architektur: Risiken und technische Schulden geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-9 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-9 grün
