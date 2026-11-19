# PK-60: Überweisung prüft das Tageslimit (BR-0070)

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich, dass eine Überweisung abgelehnt wird, die zusammen mit meinen heutigen Ausgängen mein selbst gesetztes Tageslimit übersteigt, auch bei einem Limit von 0,00 €, damit mein Tageslimit meine Überweisungen je Kalendertag wirklich begrenzt.

## Nicht im Scope

- Tageslimit festlegen oder ändern: Das Festlegen ist bereits in UC-015 mit PUT /api/tageslimit und der Maske tageslimit beschrieben; die Idee verlangt nur die Prüfung.
- Anzeige des heute noch verfügbaren Restbetrags auf der Überweisungsmaske: Die Idee nennt nur die Ablehnung mit Meldung, keine zusätzliche Anzeige.
- Benachrichtigung der Kundin oder Hinweis bei Annäherung ans Limit: Die Idee verlangt keine Benachrichtigungen.
- Erhöhung des Limits direkt aus der Ablehnungsmeldung: Die Idee nennt keinen Sprung zur Maske tageslimit; im Zweifel nicht im Scope.
- Bericht oder Verlauf der Limitablehnungen: Berichte werden nicht verlangt.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Überweisung vom Girokonto ausführen | Geändert | Beschreibung geändert, Antwort 422 geändert |
| Architektur | Geändert | Bausteinsicht geändert, Laufzeitsicht geändert |
| Überweisung | Geändert | Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | Schritt 7 geändert, A9 neu: Tageslimit überschritten, Sequenzdiagramm neu |
| UC-015 Tageslimit für Überweisungen festlegen | Geändert | BR-0070 geändert |
| BR-0070 Tageslimit der Kundin | Geändert | Text geändert |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Ein Betrag genau in Höhe des Tageslimits wird ausgeführt
- `acceptance/specs/ueberweisung.spec`: Ein Tageslimit von 0,00 € lehnt jede Überweisung ab
- `acceptance/specs/ueberweisung.spec`: Eine abgelehnte Überweisung zählt nicht zu den Ausgängen des Tages
- `acceptance/specs/ueberweisung.spec`: Eine Überweisung über dem Tageslimit wird abgelehnt und der Saldo bleibt unverändert
- `acceptance/specs/ueberweisung.spec`: Heutige Ausgänge zählen zum Tageslimit

## Aufgaben für die Umsetzung

- [ ] Überweisung vom Girokonto ausführen: Beschreibung geändert
- [ ] Überweisung vom Girokonto ausführen: Antwort 422 geändert
- [ ] Architektur: Bausteinsicht geändert
- [ ] Architektur: Laufzeitsicht geändert
- [ ] Überweisung: Skizze geändert
- [ ] UC-002: Schritt 7 geändert
- [ ] UC-002: A9 neu: Tageslimit überschritten
- [ ] UC-002: Sequenzdiagramm neu
- [ ] UC-015: BR-0070 geändert
- [ ] BR-0070: Text geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-60 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-60 grün

## Entscheidungen

- Soll die Maske Überweisung das Tageslimit schon bei „Weiter“ prüfen, oder prüft nur der Dienst beim Bestätigen?
  **Antwort:** Nur der Dienst prüft beim Bestätigen (POST /api/ueberweisungen, 422); die Maske springt zurück auf die Überweisung und zeigt die Meldung im Formular mit den bisherigen Eingaben, ohne neue Schnittstellendaten.
  _→ eingearbeitet in UC-015, BR-0070, UC-002, POST /api/ueberweisungen, ueberweisung, architektur_
