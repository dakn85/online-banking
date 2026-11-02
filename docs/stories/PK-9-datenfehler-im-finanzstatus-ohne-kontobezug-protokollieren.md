# PK-9: Datenfehler im Finanzstatus ohne Kontobezug protokollieren

**Art:** Technik · **Priorität:** Hoch · **Systeme:** Online-Banking

## Story

Als Betrieb der Aventa Bank möchte ich, dass der Dienst bei einem Datenfehler im Finanzstatus nur Ort und Art des Fehlers protokolliert und weder die IBAN noch einen anderen Kontobezug, damit Kontobezüge nicht über weitergegebene Logs abfließen.

## Nicht im Scope

Antwort an die Kundin (500 mit derselben Meldung), UC-001, Vertrag und Masken bleiben unverändert.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Architektur | Geändert | Querschnittliche Konzepte geändert, Risiken und technische Schulden geändert |

## Aufgaben für die Umsetzung

- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Architektur: Risiken und technische Schulden geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-9 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-9 grün
