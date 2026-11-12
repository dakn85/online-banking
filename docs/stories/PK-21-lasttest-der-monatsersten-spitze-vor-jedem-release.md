# PK-21: Lasttest der Monatsersten-Spitze vor jedem Release

**Art:** Technik · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Betrieb möchte ich vor jedem Release mit einem Lasttest nachweisen, dass Finanzstatus und Überweisung auch in der Spitze am Monatsersten in 95 % der Aufrufe in höchstens 500 ms und in 99,5 % ohne Serverfehler antworten, damit die Kundin am Monatsersten Gehalt und Miete so schnell wie an jedem anderen Tag erledigt.

## Nicht im Scope

Eigene Lastumgebung; Produktivbetrieb und Monitoring im Betrieb; Lastspitzen aus anderen Anlässen als dem Monatsersten; Skalierung des Dienstes über eine Instanz hinaus; Aufbewahrung und Vergleich der Lasttestergebnisse über Releases hinweg; neue oder geänderte Abläufe, Regeln, Felder und Operationen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Lasttest der Monatsersten-Spitze als eigene Prüfstufe vor dem Release | Neu | Entscheidung neu |
| Architektur | Geändert | Querschnittliche Konzepte geändert |
| Antwortzeit von Finanzstatus und Überweisung | Geändert | Anforderung geändert, Maß geändert, Prüfung geändert |
| Verfügbarkeit von Finanzstatus und Überweisung | Geändert | Anforderung geändert, Maß geändert, Prüfung geändert |
| Lasttest auf der gemeinsamen Testumgebung | Neu | Randbedingung neu |

## Aufgaben für die Umsetzung

- [ ] Lasttest der Monatsersten-Spitze als eigene Prüfstufe vor dem Release: Entscheidung neu
- [ ] Architektur: Querschnittliche Konzepte geändert
- [ ] Antwortzeit von Finanzstatus und Überweisung: Anforderung geändert
- [ ] Antwortzeit von Finanzstatus und Überweisung: Maß geändert
- [ ] Antwortzeit von Finanzstatus und Überweisung: Prüfung geändert
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Anforderung geändert
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Maß geändert
- [ ] Verfügbarkeit von Finanzstatus und Überweisung: Prüfung geändert
- [ ] Lasttest auf der gemeinsamen Testumgebung: Randbedingung neu
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-21 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-21 grün

## Entscheidungen

- Woran wird die Lastspitze des Monatsersten bemessen, die der Lasttest nachweisen muss?
  **Antwort:** 300 gleichzeitig angemeldete Kundinnen in der Spitze (Anmeldezahlen der letzten Monatsersten plus Zuschlag). Jede ruft im Schnitt alle 15 s den Finanzstatus auf, das sind rund 20 Aufrufe pro Sekunde; jeder zehnte Besuch endet mit einer Überweisung.
  _→ noch nicht in der Spezifikation_
- Gilt die Antwortzeit von höchstens 500 ms auch in der Monatsersten-Spitze, oder darf sie dort abweichen?
  **Antwort:** Unverändert auch in der Spitze: 95 % in höchstens 500 ms und 99,5 % ohne Serverfehler.
  _→ noch nicht in der Spezifikation_
- Welche Wege soll der Lasttest belasten?
  **Antwort:** Den ganzen Weg Anmeldung, Finanzstatus, Überweisung bis zur Bestätigung samt Buchung.
  _→ noch nicht in der Spezifikation_
- Auf welcher Umgebung und mit welchen Daten läuft der Lasttest?
  **Antwort:** Bis es eine eigene Lastumgebung gibt: die gemeinsame Testumgebung online-banking, außerhalb der Akzeptanzläufe. Jede virtuelle Kundin meldet sich mit einer eigenen Demo-Kennung an, Überweisungen mit kleinen Beträgen, Daten vor dem Lauf zurücksetzen.
  _→ noch nicht in der Spezifikation_
- Wie lange muss die Lastspitze im Lasttest gehalten werden, damit der Nachweis gilt?
  **Antwort:** 15 Minuten im Beharrungszustand.
  _→ noch nicht in der Spezifikation_
- Woher kommen die 300 Demo-Kennungen und der Kontobestand für den Lasttest?
  **Antwort:** Vorerst teilen sich die virtuellen Kundinnen die vorhandenen Demo-Kennungen, mehrere Sitzungen je Kennung. Ein eigener Lastbestand mit 300 Kennungen folgt in einer eigenen Story, bevor der Nachweis für ein Release zählt.
  _→ eingearbeitet in NFR-003, NFR-004, C-002, ADR-007, architektur_
- Womit und wodurch ausgelöst läuft der Lasttest?
  **Antwort:** Mit den Lastläufen der Plattform: ein k6-Skript mit Lastprofil im Testprojekt, vor jedem Release auf der Seite Last gestartet. Der Lauf ist der Nachweis an der Anforderung. Kein eigenes Werkzeug und keine ADR dafür.
  _→ eingearbeitet in NFR-003, NFR-004, C-002, ADR-007, architektur_
- Welcher Betrag, Empfänger und Verwendungszweck gelten für die Überweisungen im Lasttest?
  **Antwort:** 0,01 € an einen festen Empfänger, damit der verfügbare Betrag sicher reicht.
  _→ eingearbeitet in NFR-003, NFR-004, C-002, ADR-007, architektur_
- Was zählt als Beharrungszustand, und welche Aufrufe gehen in die Messung ein?
  **Antwort:** 15 Minuten nach vollständiger Anmeldung; gemessen werden Finanzstatus und Überweisung, die Anmeldung wird belastet, aber nicht gegen 500 ms geprüft.
  _→ eingearbeitet in NFR-003, NFR-004, C-002, ADR-007, architektur_
- Was passiert, wenn der Lasttest einen Zielwert verfehlt?
  **Antwort:** Der Lasttest blockiert das Release; eine Ausnahme wird schriftlich entschieden.
  _→ eingearbeitet in NFR-003, NFR-004, C-002, ADR-007, architektur_
