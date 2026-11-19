# PK-43: Mindestbetrag 0,10 EUR bei Überweisungen

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich beim Überweisen nur Beträge ab 0,10 EUR eingeben können, damit keine Kleinstbeträge unter 0,10 EUR überwiesen werden.

## Nicht im Scope

Beträge von Daueraufträgen (UC-012) und deren Regeln; ein Höchstbetrag; Rundung oder Nachkommastellen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Überweisung vom Girokonto ausführen | Geändert | Beschreibung geändert, Antwort 400 geändert, Antwort 422 geändert |
| Ueberweisungsauftrag | Geändert | Eigenschaft betrag geändert |
| Überweisung | Geändert | Attribut betrag geändert, Feld Betrag in Euro geändert, Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | A2 geändert, A8 neu: Betrag unter dem Mindestbetrag, Sequenzdiagramm neu, und 1 weitere |
| BR-0004 Betragsgrenze des Girokontos | Geändert | Text geändert |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Ein Betrag unter 0,10 € wird abgelehnt und keine Zusammenfassung gezeigt
- `acceptance/specs/ueberweisung.spec`: Ein Betrag von genau 0,10 € wird angenommen

## Aufgaben für die Umsetzung

- [ ] Überweisung vom Girokonto ausführen: Beschreibung geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 400 geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 422 geändert
- [ ] Ueberweisungsauftrag: Eigenschaft betrag geändert
- [ ] Überweisung: Attribut betrag geändert
- [ ] Überweisung: Feld Betrag in Euro geändert
- [ ] Überweisung: Skizze geändert
- [ ] UC-002: A2 geändert
- [ ] UC-002: A8 neu: Betrag unter dem Mindestbetrag
- [ ] UC-002: Sequenzdiagramm neu
- [ ] UC-002: BR-0004 geändert
- [ ] BR-0004: Text geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-43 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-43 grün

## Offene Fragen

- [ ] Gilt der Mindestbetrag für Daueraufträge beim Einrichten und beim Ändern, mit demselben Status und derselben Meldung?
- [ ] Was passiert mit bestehenden Daueraufträgen unter 0,10 EUR?
