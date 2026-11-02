# PK-12: Tageslimit: Vom Girokonto darf eine Kundin an einem Kalendertag zusammen höchstens 5.000 EUR überweisen; darüber …

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Tageslimit: Vom Girokonto darf eine Kundin an einem Kalendertag zusammen höchstens 5.000 EUR überweisen; darüber lehnt das System den Auftrag ab.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Überweisung vom Girokonto ausführen | Geändert | Beschreibung geändert, Antwort 422 geändert |
| Ueberweisungsauftrag | Geändert | Eigenschaft betrag geändert |
| Überweisung | Geändert | Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | Schritt 7 geändert, A8 neu: Tageslimit des Kalendertags überschritten, BR-0019 neu: Tageslimit des Kalendertags |
| BR-0019 Tageslimit des Kalendertags | Neu | Neu in UC-002 |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Überweisungen bis genau zum Tageslimit werden am selben Kalendertag ausgeführt
- `acceptance/specs/ueberweisung.spec`: Zwei Überweisungen am selben Kalendertag über zusammen mehr als das Tageslimit: die zweite wird abgelehnt

## Aufgaben für die Umsetzung

- [ ] Überweisung vom Girokonto ausführen: Beschreibung geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 422 geändert
- [ ] Ueberweisungsauftrag: Eigenschaft betrag geändert
- [ ] Überweisung: Skizze geändert
- [ ] UC-002: Schritt 7 geändert
- [ ] UC-002: A8 neu: Tageslimit des Kalendertags überschritten
- [ ] UC-002: BR-0019 neu: Tageslimit des Kalendertags
- [ ] BR-0019: Neu in UC-002
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-12 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-12 grün

## Entscheidungen

- Nach welcher Zeit wird der Kalendertag des Tageslimits bestimmt?
  **Antwort:** Buchungstag in UTC, wie BR-0012 (Annahme).
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung_
- Gilt das Tageslimit je Kundin über alle Girokonten oder je Girokonto?
  **Antwort:** Je Kundin über alle ihre Girokonten (Annahme).
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung_
- Welchen Status und welchen Text trägt die Ablehnung wegen des Tageslimits?
  **Antwort:** 422 wie beim verfügbaren Betrag, mit eigenem Text (Annahme).
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung_
- Soll die Oberfläche das Tageslimit schon bei „Weiter“ prüfen?
  **Antwort:** Nein, nur der Dienst prüft (Annahme).
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung_
- Wie werden die Akzeptanztests zum Tageslimit mit den Demo-Konten möglich?
  **Antwort:** Ausgangsstand bleibt, damit die bestehenden Szenarien unverändert gelten. Die beiden neuen Szenarien setzen den Saldo des Girokontos vorher über die Testschnittstelle (TEST_MODE) auf 6.000,00 EUR, mit einem eigenen Step, z. B. „Das Girokonto hat einen Saldo von "6.000,00 €"“.
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung_
