# PK-72: Sparziel mit monatlicher Sparrate und Dauerauftrag anlegen

**Art:** Neu · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich für mein Tagesgeldkonto ein Sparziel mit Zielbetrag und Zieldatum anlegen und die monatliche Sparrate vorgeschlagen bekommen, damit das System dafür einen Dauerauftrag von meinem Girokonto einrichtet und ich mein Ziel bis zum Zieldatum erreiche.

## Nicht im Scope

- Sparziel ändern: Die Idee nennt nur das Anlegen; Änderung von Zielbetrag oder Zieldatum samt Anpassung des Dauerauftrags ist eine eigene Aktion.
- Sparziel löschen oder beenden: Nicht verlangt; es müsste geklärt werden, was mit dem Dauerauftrag geschieht.
- Sparziele anzeigen mit Fortschritt: Eine Liste oder Fortschrittsanzeige der Sparziele steht nicht in der Idee.
- Benachrichtigung bei Zielerreichung oder verfehlter Sparrate: Hintergrundprozess und Nachrichten sind nicht verlangt.
- Anpassen der Sparrate bei Abweichung vom Plan: Spätere Stufe, nicht in der Idee.
- Mehrere Sparziele je Tagesgeldkonto verwalten: Unklar, ob nötig; Höchstzahl und Zuordnung der Einzahlungen werden nicht verlangt.
- Verzinsung des Tagesgeldkontos in der Berechnung: Nicht verlangt; Sparrate wird ohne Zinsen vorgeschlagen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Sparrate vorschlagen | Neu | Endpunkt neu |
| Sparziel anlegen | Neu | Endpunkt neu, Maske neu |
| Sparratenvorschlag | Neu | Schema neu |
| NeuesSparziel | Neu | Schema neu |
| Sparziel | Neu | Schema neu, Entität neu |
| Dauerauftrag | Geändert | Einschränkungen geändert |
| Zugriffsschutz des Sparziels | Neu | Qualitätsanforderung neu |
| Finanzstatus | Geändert | Use Case UC-025 neu, Aktion Sparziel neu, Skizze geändert |
| UC-016 Daueraufträge vom Girokonto verwalten | Geändert | Notizen geändert |
| UC-025 Sparziel mit monatlicher Sparrate anlegen | Neu | Use Case neu |
| BR-0101 Berechnung der monatlichen Sparrate | Neu | Neu in UC-025 |
| BR-0102 Gültigkeit von Zielbetrag und Zieldatum eines Sparziels | Neu | Neu in UC-025 |
| BR-0103 Sparziel mit Dauerauftrag für das Tagesgeldkonto der Kundin | Neu | Neu in UC-025 |
| Vision | Geändert | Abschnitt „Zweck“ geändert, Abschnitt „Ziele“ geändert |

## Akzeptanztests

- `acceptance/specs/sparziel.spec`: Das Sparziel ist ohne Anmeldung nicht erreichbar
- `acceptance/specs/sparziel.spec`: Die Schnittstelle lehnt das Sparziel mit einem Zieldatum in der Vergangenheit mit 422 ab
- `acceptance/specs/sparziel.spec`: Die Schnittstelle lehnt das Sparziel mit ungültigem Zielbetrag mit 400 ab
- `acceptance/specs/sparziel.spec`: Die Schnittstelle lehnt das Sparziel ohne Anmeldung mit 401 ab
- `acceptance/specs/sparziel.spec`: Die Schnittstelle lehnt den Vorschlag mit einem Zieldatum in der Vergangenheit mit 422 ab
- `acceptance/specs/sparziel.spec`: Die Schnittstelle lehnt den Vorschlag mit ungültigem Zielbetrag mit 400 ab
- `acceptance/specs/sparziel.spec`: Die Schnittstelle lehnt den Vorschlag ohne Anmeldung mit 401 ab
- `acceptance/specs/sparziel.spec`: Die Sparrate wird aus Zielbetrag, Zieldatum und Saldo des Tagesgeldkontos vorgeschlagen
- `acceptance/specs/sparziel.spec`: Ein Sparziel wird angelegt und der Dauerauftrag für die Sparrate eingerichtet
- `acceptance/specs/sparziel.spec`: Ein Zielbetrag nicht über dem Saldo des Tagesgeldkontos wird abgelehnt
- `acceptance/specs/sparziel.spec`: Ein Zielbetrag von 0,00 € wird als ungültige Angabe abgelehnt
- `acceptance/specs/sparziel.spec`: Ein Zieldatum vor der ersten Rate wird abgelehnt
- `acceptance/specs/sparziel.spec`: Ein Zieldatum, das nicht in der Zukunft liegt, wird abgelehnt
- `acceptance/specs/sparziel.spec`: Eine Kundin ohne Tagesgeldkonto sieht statt der Eingabe den Hinweis
- `acceptance/specs/sparziel.spec`: Eine Sparrate unter 0,10 € wird auf 0,10 € angehoben

## Aufgaben für die Umsetzung

- [ ] Sparrate vorschlagen: Endpunkt neu
- [ ] Sparziel anlegen: Endpunkt neu
- [ ] Sparratenvorschlag: Schema neu
- [ ] NeuesSparziel: Schema neu
- [ ] Sparziel: Schema neu
- [ ] Dauerauftrag: Einschränkungen geändert
- [ ] Sparziel: Entität neu
- [ ] Zugriffsschutz des Sparziels: Qualitätsanforderung neu
- [ ] Finanzstatus: Use Case UC-025 neu
- [ ] Finanzstatus: Aktion Sparziel neu
- [ ] Finanzstatus: Skizze geändert
- [ ] Sparziel anlegen: Maske neu
- [ ] UC-016: Notizen geändert
- [ ] UC-025: Use Case neu
- [ ] BR-0101: Neu in UC-025
- [ ] BR-0102: Neu in UC-025
- [ ] BR-0103: Neu in UC-025
- [ ] Vision: Zweck geändert
- [ ] Vision: Z-17 neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-72 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-72 grün

## Entscheidungen

- Wann liegt der erste Ausführungstag des Sparraten-Dauerauftrags, und damit: Wie viele Raten zählt die Berechnung bis zum Zieldatum?
  **Antwort:** Gleicher Kalendertag im Folgemonat wie der Anlagetag; Enddatum ist das Zieldatum; gezählt werden die monatlichen Ausführungen bis einschließlich Zieldatum.
  _→ eingearbeitet in UC-025, BR-0101, BR-0102, BR-0103, UC-016, Dauerauftrag, Sparziel, GET /api/sparziele/vorschlag, POST /api/sparziele, Schema Sparratenvorschlag, Schema NeuesSparziel, Schema Sparziel, sparziel, finanzstatus, vision, NFR-006_
- Darf die Kundin für dasselbe Tagesgeldkonto mehrere Sparziele anlegen?
  **Antwort:** Ja, mehrere sind zulässig; es gibt keine Prüfung und keine Höchstzahl.
  _→ eingearbeitet in UC-025, BR-0101, BR-0102, BR-0103, UC-016, Dauerauftrag, Sparziel, GET /api/sparziele/vorschlag, POST /api/sparziele, Schema Sparratenvorschlag, Schema NeuesSparziel, Schema Sparziel, sparziel, finanzstatus, vision, NFR-006_
- Gibt es eine späteste Grenze für das Zieldatum eines Sparziels?
  **Antwort:** Keine Obergrenze; das Zieldatum muss nur so weit in der Zukunft liegen, dass mindestens eine Rate anfällt.
  _→ eingearbeitet in UC-025, BR-0101, BR-0102, BR-0103, UC-016, Dauerauftrag, Sparziel, GET /api/sparziele/vorschlag, POST /api/sparziele, Schema Sparratenvorschlag, Schema NeuesSparziel, Schema Sparziel, sparziel, finanzstatus, vision, NFR-006_
- Was geschieht, wenn die berechnete Sparrate unter dem Mindestbetrag eines Dauerauftrags von 0,10 € liegt (kleine Differenz zum Saldo, lange Laufzeit)?
  **Antwort:** Der Vorschlag wird auf 0,10 € angehoben; das Sparziel wird angelegt.
  _→ eingearbeitet in UC-025, BR-0101, BR-0102, BR-0103, UC-016, Dauerauftrag, Sparziel, GET /api/sparziele/vorschlag, POST /api/sparziele, Schema Sparratenvorschlag, Schema NeuesSparziel, Schema Sparziel, sparziel, finanzstatus, vision, NFR-006_
