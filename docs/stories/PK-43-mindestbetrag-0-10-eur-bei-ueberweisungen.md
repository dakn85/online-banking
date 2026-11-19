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

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-19_

## Bausteine
- Online-Banking-Dienst, Component Überweisungsauftrag (`src/ueberweisung.ts`)
- Oberfläche im Browser, Seite Überweisung (`public/seiten/ueberweisung.js`)
- Unit-Tests `test/ueberweisung.test.ts`

## Schritte
1. Dienst (UC-002 A8, Feldregel Überweisung.betrag ≥ 0,10): `ausfuehren` lehnt einen Betrag unter 10 Cent (auch 0, negativ, keine Zahl) mit `Ablehnung(400, 'Der Betrag muss mindestens 0,10 € betragen.')` ab, nach der IBAN-Prüfung und vor der Betragsgrenze; es wird nichts gebucht.
2. Dienst (BR-0004 neu): 422 nur noch, wenn der Betrag den verfügbaren Betrag übersteigt; die Prüfung „größer als 0“ entfällt dort.
3. Oberfläche (UC-002 A8.1, Maske ueberweisung, Wertebereich 0.10 bis verfügbarer Betrag): Beim „Weiter“ zeigt ein Betrag unter 0,10 € die Meldung „Der Betrag muss mindestens 0,10 € betragen.“ am Feld Betrag und keine Zusammenfassung; über dem verfügbaren Betrag bleibt BR-0004.
4. Oberfläche (UC-002 A8.2, ADR-004): Antwortet der Dienst beim Bestätigen mit 400 und dieser Meldung, springt die Seite auf das Formular mit den bisherigen Eingaben, zeigt die Meldung am Betrag und gibt „Bestätigen“ durch Neuaufbau wieder frei; andere 400 bleiben beim IBAN-Feld.
5. Unit-Tests: 0,09 → 400, 0 → 400, 0,10 → 201, über dem verfügbaren Betrag → 422.
6. Steps: alle Steps der Szenarien sind schon implementiert; nichts Neues.

## Änderung am Rahmen
Keine. ADR-004 ordnet 400 bisher pauschal dem IBAN-Feld zu; die Oberfläche unterscheidet jetzt zusätzlich nach dem Fehlertext des Dienstes (Mindestbetrag → Feld Betrag).

## Offene Fragen

- [ ] Gilt der Mindestbetrag für Daueraufträge beim Einrichten und beim Ändern, mit demselben Status und derselben Meldung?
- [ ] Was passiert mit bestehenden Daueraufträgen unter 0,10 EUR?
