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
- Andere Ausgänge als ausgeführte Überweisungen nach UC-002 (Umbuchungen, Lastschriften, Kartenzahlungen, Daueraufträge): Sie zählen nicht zu den heutigen Ausgängen des Tageslimits.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Fachliche Prüfungen doppelt, maßgeblich ist der Dienst | Geändert | Kontext geändert, Entscheidung geändert, Folgen geändert |
| Überweisung vom Girokonto ausführen | Geändert | Beschreibung geändert, Antwort 200 geändert, Antwort 422 geändert |
| Architektur | Geändert | Bausteinsicht geändert, Laufzeitsicht geändert |
| Antwortzeit von Finanzstatus und Überweisung | Geändert | Maß geändert, Herkunft geändert |
| Überweisung | Geändert | Skizze geändert |
| UC-002 Überweisung vom Girokonto | Geändert | Notizen geändert, Schritt 7 geändert, A12 neu: Tageslimit überschritten, und 4 weitere |
| UC-015 Tageslimit für Überweisungen festlegen | Geändert | Notizen geändert, BR-0070 geändert |
| BR-0070 Tageslimit der Kundin | Geändert | Text geändert |

## Akzeptanztests

- `acceptance/specs/ueberweisung.spec`: Der Dienst lehnt bei Verletzung von verfügbarem Betrag und Tageslimit mit der Meldung zum verfügbaren Betrag ab
- `acceptance/specs/ueberweisung.spec`: Ein Betrag genau in Höhe des Tageslimits wird ausgeführt
- `acceptance/specs/ueberweisung.spec`: Ein gesenktes Tageslimit zählt frühere Ausgänge des Tages mit
- `acceptance/specs/ueberweisung.spec`: Ein Tageslimit von 0,00 € lehnt jede Überweisung ab
- `acceptance/specs/ueberweisung.spec`: Eine abgelehnte Überweisung zählt nicht zu den Ausgängen des Tages
- `acceptance/specs/ueberweisung.spec`: Eine Überweisung über dem Tageslimit wird abgelehnt und der Saldo bleibt unverändert
- `acceptance/specs/ueberweisung.spec`: Eine wiederholte Bestätigung wird bei ausgeschöpftem Tageslimit nicht erneut geprüft
- `acceptance/specs/ueberweisung.spec`: Heutige Ausgänge zählen zum Tageslimit
- `acceptance/specs/ueberweisung.spec`: Übersteigt ein Betrag Tageslimit und verfügbaren Betrag, gilt die Meldung zum verfügbaren Betrag

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

## Bausteine (docs/architecture.md)
- **Überweisungsauftrag** (`src/ueberweisung.ts`): Tageslimit-Prüfung beim Ausführen; führt je Kundin die Tagessumme der ausgeführten Überweisungen in Cent je UTC-Tag (eigene Ablage, unabhängig vom 200er-Fenster der Auftrags-Kennungen, damit Lastkunden stimmen).
- **Tageslimit** (`src/tageslimit.ts`): `lesen()` liefert das Limit, wird nur gelesen.
- **Testdaten/Reset**: Tagessummen werden in `zuruecksetzen()` der Überweisung gelöscht und damit von beiden Resets (Demo und Lastkunden) erfasst (BR-0070).
- **Oberfläche** (`public/seiten/ueberweisung.js`): 422 mit der Tageslimit-Meldung als Formularmeldung ohne Feldbezug (ADR-004).
- **Akzeptanztests**: fehlende Steps (Bestätigen/Abbrechen, direkter Aufruf mit Status und Meldung).

## Schritte
1. UC-002 A12/BR-0070: Prüfreihenfolge Auftraggeberkonto, IBAN, Mindestbetrag, BR-0004, dann Tageslimit; 422 „Mit dieser Überweisung würde Ihr Tageslimit überschritten.“; Vergleich in Cent, Summe genau in Höhe des Limits zulässig, auch Limit 0,00.
2. BR-0005/BR-0070: Wiederholung mit bekannter Auftrags-Kennung (200) wird vor der Limitprüfung beantwortet, nicht erneut geprüft.
3. Abgelehnte Aufträge erhöhen die Tagessumme nicht; nur ausgeführte Überweisungen zählen (keine Umbuchungen, Termin- oder Daueraufträge).
4. Oberfläche und Steps wie oben; Unit-Tests mit @BR-0070 im Namen.

## Rahmenänderung
Keine neue Bibliothek.

## Entscheidungen

- Soll die Maske Überweisung das Tageslimit schon bei „Weiter“ prüfen, oder prüft nur der Dienst beim Bestätigen?
  **Antwort:** Nur der Dienst prüft beim Bestätigen (POST /api/ueberweisungen, 422); die Maske springt zurück auf die Überweisung und zeigt die Meldung im Formular mit den bisherigen Eingaben, ohne neue Schnittstellendaten.
  _→ eingearbeitet in UC-015, BR-0070, UC-002, POST /api/ueberweisungen, ueberweisung, architektur · 495ae6c_
- Zählen zu den „heutigen Ausgängen“ nur die am laufenden UTC-Tag ausgeführten Überweisungen vom Girokonto (UC-002), oder auch andere Ausgänge wie Umbuchungen, Lastschriften, Kartenzahlungen und Daueraufträge?
  **Antwort:** Nur ausgeführte Überweisungen nach UC-002; andere Ausgänge zählen nicht und werden als „Nicht im Scope“ benannt.
  _→ eingearbeitet in UC-015, BR-0070, UC-002 · b1d1336_
- Welche Ablehnung gilt, wenn ein Betrag zugleich den verfügbaren Betrag des Girokontos (BR-0004) und das Tageslimit (BR-0070) übersteigt?
  **Antwort:** BR-0004 zuerst: 422 mit „Der Betrag übersteigt den verfügbaren Betrag des Girokontos.“; die Oberfläche zeigt die Meldung am Betragsfeld, die Tageslimit-Prüfung läuft nur bei ausreichendem verfügbaren Betrag
  _→ noch nicht in der Spezifikation_
- Gilt das Tageslimit auch für die Lastkunden (lasttest-001 bis lasttest-300), und setzt POST /api/test/lasttest/reset deren Tageslimit und Tagesausgänge zurück?
  **Antwort:** Ja: Der Lasttest-Reset setzt Limit auf das Standardlimit und Tagesausgänge zurück; BR-0070 nennt beide Resets
  _→ noch nicht in der Spezifikation_
