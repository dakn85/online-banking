# PK-12: Tageslimit von 5.000 EUR je Kalendertag beim Überweisen

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich, dass das Online-Banking eine Überweisung von meinem Girokonto ablehnt, wenn ich zusammen mit den am selben Kalendertag bereits ausgeführten Überweisungen mehr als 5.000,00 EUR überweisen würde, damit ein Eingabefehler oder ein Missbrauch meinen Bestand nicht an einem Tag über die vereinbarte Grenze hinaus belastet.

## Nicht im Scope

Kein Anheben, Senken oder Sperren des Limits durch die Kundin, keine Anzeige des verbleibenden Tagesbetrags im Finanzstatus oder in der Überweisung, keine Termin- und Daueraufträge, keine Benachrichtigung beim Erreichen der Grenze, keine Änderung an BR-0004, BR-0005 und an der genau einmaligen Ausführung.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Zustand nur im Speicher, Ausgangsstand über den Test-Reset | Geändert | Kontext geändert, Entscheidung geändert, Folgen geändert |
| Überweisung vom Girokonto ausführen | Geändert | Beschreibung geändert, Antwort 400 geändert, Antwort 422 geändert |
| Fehler | Geändert | Eigenschaft code neu |
| Ueberweisungsauftrag | Geändert | Eigenschaft betrag geändert |
| Architektur | Geändert | Querschnittliche Konzepte geändert |
| Überweisung | Geändert | Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | Schritt 7 geändert, A1 geändert, A2 geändert, und 2 weitere |
| BR-0019 Tageslimit des Kalendertags | Neu | Neu in UC-002 |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Die Tagessumme aller Girokonten im Finanzstatus: eine Kundin ohne eigene Überweisung wird abgelehnt
- `acceptance/specs/ueberweisung.spec`: Überweisungen bis genau zum Tageslimit werden am selben Kalendertag ausgeführt
- `acceptance/specs/ueberweisung.spec`: Zwei Überweisungen am selben Kalendertag über zusammen mehr als das Tageslimit: die zweite wird abgelehnt

## Aufgaben für die Umsetzung

- [ ] Zustand nur im Speicher, Ausgangsstand über den Test-Reset: Kontext geändert
- [ ] Zustand nur im Speicher, Ausgangsstand über den Test-Reset: Entscheidung geändert
- [ ] Zustand nur im Speicher, Ausgangsstand über den Test-Reset: Folgen geändert
- [ ] Überweisung vom Girokonto ausführen: Beschreibung geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 400 geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 422 geändert
- [ ] Fehler: Eigenschaft code neu
- [ ] Ueberweisungsauftrag: Eigenschaft betrag geändert
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Überweisung: Skizze geändert
- [ ] UC-002: Schritt 7 geändert
- [ ] UC-002: A1 geändert
- [ ] UC-002: A2 geändert
- [ ] UC-002: A8 neu: Tageslimit des Kalendertags überschritten
- [ ] UC-002: BR-0019 neu: Tageslimit des Kalendertags
- [ ] BR-0019: Neu in UC-002
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-12 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-12 grün

## Offene Fragen

- [ ] Passen Feldname und Werte?
- [ ] Sollen auch 401 und 403 einen code tragen?

## Entscheidungen

- Nach welcher Zeit wird der Kalendertag des Tageslimits bestimmt?
  **Antwort:** Buchungstag in UTC, wie BR-0012 (Annahme).
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung · 0fac6d9_
- Gilt das Tageslimit je Kundin über alle Girokonten oder je Girokonto?
  **Antwort:** Je Kundin über alle ihre Girokonten (Annahme).
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung · 0fac6d9_
- Welchen Status und welchen Text trägt die Ablehnung wegen des Tageslimits?
  **Antwort:** 422 wie beim verfügbaren Betrag, mit eigenem Text (Annahme).
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung · 0fac6d9_
- Soll die Oberfläche das Tageslimit schon bei „Weiter“ prüfen?
  **Antwort:** Nein, nur der Dienst prüft (Annahme).
  _→ eingearbeitet in UC-002, BR-0019, POST /api/ueberweisungen, Schema Ueberweisungsauftrag, ueberweisung · 0fac6d9_
- Wie werden die Akzeptanztests zum Tageslimit mit den Demo-Konten möglich?
  **Antwort:** Ausgangsstand bleibt, damit die bestehenden Szenarien unverändert gelten. Die beiden neuen Szenarien setzen den Saldo des Girokontos vorher über die Testschnittstelle (TEST_MODE) auf 6.000,00 EUR, mit einem eigenen Step, z. B. „Das Girokonto hat einen Saldo von "6.000,00 €"“.
  _→ eingearbeitet in ADR-002, architektur · 95fd280_
- POST /api/ueberweisungen: Kommt die Nachricht bei Überweisung.status nicht vorhanden (neue auftragsId) an, nennt die Spezifikation zwei Abläufe (UC-002 A2, UC-002 A8). Welcher gilt? (POST /api/ueberweisungen, Überweisung.status nicht vorhanden (neue auftragsId))
  **Antwort:** Es gilt keine der Optionen ausschließlich – beide Prüfungen laufen in der Reihenfolge BR-0004 vor BR-0019. Sind beide verletzt, greift UC-002 A2; für den Story-Fall (Tageslimit) ist UC-002 A8 maßgeblich.
  _→ eingearbeitet in UC-002, BR-0019 · 697b0db_
- BR-0019 rechnet den Tagesumsatz je Kundin über alle ihre Girokonten, aber ein ausgeführter Auftrag trägt nur auftraggeberIban, betrag und erfasstAm, keine Kundin; im Demo-Bestand sehen alle Kundinnen dieselben Konten (C-001, src/konten.ts), und die Entität Konto hat im Modell eine Kante zu Kunde, im Bestand aber keine Zuordnung. Welche bereits ausgeführten Überweisungen zählen in den Tagesumsatz der angemeldeten Kundin? (POST /api/ueberweisungen, System)
  **Antwort:** Alle Überweisungen, die am UTC-Tag von den Girokonten abgingen, die die Kundin in ihrem Finanzstatus sieht (der Demo-Bestand ist gemeinsam): Folge: sobald die gemeinsame Tagessumme 5.000,00 EUR übersteigt, antwortet der Dienst jeder Kundin mit 422 und demselben Text, auch wenn sie selbst an dem Tag nichts überwiesen hat; keine zusätzliche Speicherung nötig.
  _→ eingearbeitet in UC-002, BR-0019 · a9e5951_
- Beide Ablehnungen (verfügbarer Betrag nach BR-0004, Tageslimit nach BR-0019) antworten mit 422, und das Schema Fehler trägt nur das Feld fehler (Text). Woran erkennt die Überweisungsseite, welche der beiden Meldungen sie anzeigt, nachdem sie die Ablehnung erhalten hat? (POST /api/ueberweisungen, fehler)
  **Antwort:** Der Dienst bekommt im Schema Fehler ein unterscheidendes Feld (z. B. code = TAGESLIMIT/BETRAG), und die Seite wertet es aus: Folge: openapi.yaml (Schema Fehler und Antwort 422), die 400/422-Meldungszuordnung und der Vertrag ändern sich über die Story hinaus; die Fehlertexte bleiben.
  _→ eingearbeitet in POST /api/ueberweisungen, Schema Fehler, UC-002, BR-0019_
