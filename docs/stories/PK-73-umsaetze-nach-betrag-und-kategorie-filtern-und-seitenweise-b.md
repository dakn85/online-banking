# PK-73: Umsätze nach Betrag und Kategorie filtern und seitenweise blättern

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich die Umsätze eines Kontos nach Betrag von/bis und nach Kategorie filtern und seitenweise mit der Gesamtzahl der Treffer blättern, damit ich auch bei vielen Buchungen die gesuchten Umsätze schnell finde.

## Nicht im Scope

Filter zurücksetzen als eigener Bedienschritt: Die Idee nennt kein Zurücksetzen; die Filterfelder leeren zu können ist nicht gefordert.
Sortierung der Treffer wählen: Die Idee verlangt nur Betragsfilter, Kategoriefilter und Blättern, keine wählbare Sortierung.
Export der gefilterten Liste als CSV: Der Export ist ein eigener Use Case (UC-024/BR-0075) und nicht Teil dieser Story.
Kategorieauswertung mit Summe und Anteil zur gefilterten Liste: Die Ausgabenanalyse (UC-019/BR-0083) ist ein eigener Use Case; die Story fordert nur die Trefferliste.
Seitengröße einstellbar oder gemerkt: Die Idee nennt nur seitenweises Blättern, keine Einstellung der Seitengröße.
Filter merken oder als Vorlage speichern: Nicht in der Idee genannt; wäre eine spätere Stufe.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl | Geändert | Zusammenfassung geändert, Beschreibung geändert, Parameter betragVon (query) neu, und 6 weitere |
| Umsätze eines Kontos als CSV-Datei exportieren | Geändert | Beschreibung geändert, Parameter betragVon (query) neu, Parameter betragBis (query) neu, und 4 weitere |
| Umsaetze | Geändert | Eigenschaft umsaetze geändert, Eigenschaft gesamt neu |
| Umsatz | Geändert | Attribut kategorie geändert |
| Finanzstatus | Geändert | Skizze geändert |
| Umsätze | Geändert | Feld Betrag von neu, Feld Betrag bis neu, Feld Kategorie neu, und 5 weitere |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Ziel geändert, Schritt 4 geändert, Schritt 6 geändert, und 17 weitere |
| BR-0075 Export mit den Umsätzen der Liste | Geändert | Text geändert |
| BR-0076 Export nur mit Umsätzen | Geändert | Text geändert |
| BR-0104 Betragsfilter und Kategoriefilter der Umsatzliste | Neu | Neu in UC-003 |
| BR-0105 Seitenweise Ausgabe der Umsatzliste mit Gesamtzahl | Neu | Neu in UC-003 |
| UC-019 Ausgabenanalyse des Girokontos anzeigen | Geändert | Notizen geändert |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Betragsfilter, Kategorie und Textsuche wirken zusammen
- `acceptance/specs/umsaetze.spec`: Der Betragsfilter zeigt Ausgänge nach ihrer Höhe ohne Vorzeichen
- `acceptance/specs/umsaetze.spec`: Der CSV-Export enthält genau die Umsätze der gefilterten Liste
- `acceptance/specs/umsaetze.spec`: Der Filter Ein-/Ausgang blendet die Gegenrichtung aus
- `acceptance/specs/umsaetze.spec`: Der Filter Ein-/Ausgang ohne Knopf Weiter
- `acceptance/specs/umsaetze.spec`: Der Kategoriefilter zeigt nur Umsätze der gewählten Kategorie
- `acceptance/specs/umsaetze.spec`: Die Umsatzliste zeigt den Buchungstag als TT.MM.JJJJ
- `acceptance/specs/umsaetze.spec`: Ein Betrag von über Betrag bis zeigt die Meldung zum ungültigen Betragsbereich
- `acceptance/specs/umsaetze.spec`: Eine Seite hinter der letzten Trefferseite zeigt keine Zeile, aber die Gesamtzahl
- `acceptance/specs/umsaetze.spec`: Mehr als 20 Treffer blättern auf Seite 1 mit 20 Umsätzen und Seite 2 mit dem Rest, beide mit der Gesamtzahl
- `acceptance/specs/umsaetze.spec`: Seite vor und Seite zurück blättern die Umsatzliste

## Aufgaben für die Umsetzung

- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Zusammenfassung geändert
- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Beschreibung geändert
- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Parameter betragVon (query) neu
- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Parameter betragBis (query) neu
- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Parameter kategorie (query) neu
- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Parameter seite (query) neu
- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Parameter seitengroesse (query) neu
- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Antwort 200 geändert
- [ ] Umsätze eines Kontos mit Saldo danach, neueste zuerst, seitenweise mit Gesamtzahl: Antwort 400 geändert
- [ ] Umsätze eines Kontos als CSV-Datei exportieren: Beschreibung geändert
- [ ] Umsätze eines Kontos als CSV-Datei exportieren: Parameter betragVon (query) neu
- [ ] Umsätze eines Kontos als CSV-Datei exportieren: Parameter betragBis (query) neu
- [ ] Umsätze eines Kontos als CSV-Datei exportieren: Parameter kategorie (query) neu
- [ ] Umsätze eines Kontos als CSV-Datei exportieren: Antwort 200 geändert
- [ ] Umsätze eines Kontos als CSV-Datei exportieren: Antwort 400 geändert
- [ ] Umsätze eines Kontos als CSV-Datei exportieren: Antwort 422 geändert
- [ ] Umsaetze: Eigenschaft umsaetze geändert
- [ ] Umsaetze: Eigenschaft gesamt neu
- [ ] Umsatz: Attribut kategorie geändert
- [ ] Finanzstatus: Skizze geändert
- [ ] Umsätze: Feld Betrag von neu
- [ ] Umsätze: Feld Betrag bis neu
- [ ] Umsätze: Feld Kategorie neu
- [ ] Umsätze: Feld Gesamtzahl der Treffer neu
- [ ] Umsätze: Feld Seite neu
- [ ] Umsätze: Aktion Seite zurück neu
- [ ] Umsätze: Aktion Seite vor neu
- [ ] Umsätze: Skizze geändert
- [ ] UC-003: Ziel geändert
- [ ] UC-003: Schritt 4 geändert
- [ ] UC-003: Schritt 6 geändert
- [ ] UC-003: Schritt 7 geändert
- [ ] UC-003: Schritt 8 geändert
- [ ] UC-003: Schritt 10 geändert
- [ ] UC-003: A2 geändert
- [ ] UC-003: A5 geändert
- [ ] UC-003: A6 geändert
- [ ] UC-003: A7 geändert
- [ ] UC-003: A8 geändert
- [ ] UC-003: A9 neu: Betragsbereich ungültig
- [ ] UC-003: A10 neu: Seite hinter der letzten Trefferseite
- [ ] UC-003: A11 neu: Betragsbereich ungültig beim Export
- [ ] UC-003: Sequenzdiagramm geändert
- [ ] UC-003: Erfolg 2 geändert
- [ ] UC-003: BR-0075 geändert
- [ ] UC-003: BR-0076 geändert
- [ ] UC-003: BR-0104 neu: Betragsfilter und Kategoriefilter der Umsatzliste
- [ ] UC-003: BR-0105 neu: Seitenweise Ausgabe der Umsatzliste mit Gesamtzahl
- [ ] BR-0075: Text geändert
- [ ] BR-0076: Text geändert
- [ ] BR-0104: Neu in UC-003
- [ ] BR-0105: Neu in UC-003
- [ ] UC-019: Notizen geändert
- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-73 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-73 grün

## Entscheidungen

- Wogegen prüft der Filter Betrag von/bis den Umsatz: gegen die Höhe des Betrags ohne Vorzeichen oder gegen den Betrag mit Vorzeichen?
  **Antwort:** Gegen die Höhe ohne Vorzeichen: -950,00 € liegt zwischen 100 und 1.000; Ein-/Ausgang bleibt der eigene Filter.
  _→ eingearbeitet in UC-003, BR-0104, BR-0105 · a87fa7f_
- Wie viele Umsätze zeigt eine Seite der Umsatzliste?
  **Antwort:** 20 Umsätze je Seite, fest von der Maske mitgeschickt.
  _→ eingearbeitet in UC-003, BR-0104, BR-0105 · a87fa7f_
- Was antwortet der Dienst, wenn die angefragte Seite hinter der letzten Trefferseite liegt?
  **Antwort:** Eine leere Trefferseite mit der Gesamtzahl und ohne Meldung.
  _→ eingearbeitet in UC-003, BR-0104, BR-0105 · a87fa7f_
- Soll die Export-Schnittstelle die Betrags- und Kategoriewerte der Maske annehmen und verwerfen, oder gar nicht führen?
  **Antwort:** Weder noch: Der Export wendet wie die Liste alle Filter an, also auch Betrag von/bis und Kategorie, über alle Seiten ohne Seitenparameter. BR-0075 bleibt unverändert gültig.
  _→ eingearbeitet in UC-003, BR-0075, BR-0076, GET /api/konten/{iban}/umsaetze/export · 6e241d5_
- Reicht der Nachweis am Betragsfilter, oder soll das Szenario zusätzlich den Kategoriefilter setzen?
  **Antwort:** Das Szenario setzt Betrag von/bis und Kategorie und prüft, dass die Datei genau die Umsätze der Liste enthält.
  _→ eingearbeitet in UC-003, BR-0075, BR-0076, GET /api/konten/{iban}/umsaetze/export · 6e241d5_
- Passen die Namen seite, seitengroesse und gesamt für Seitenparameter und Trefferzahl?
  **Antwort:** Ja, seite, seitengroesse und gesamt
  _→ eingearbeitet in GET /api/konten/{iban}/umsaetze, GET /api/konten/{iban}/umsaetze/export, Schema Umsaetze, umsaetze, finanzstatus, UC-003, BR-0075, BR-0076, UC-019 · d8430cc_
- Soll der Zustand „Zurückgegeben“ auch im Finanzstatus als eigene Spalte erscheinen?
  **Antwort:** Nein, die Umsatzliste zeigt ihn, im Finanzstatus genügt der Hinweis
  _→ eingearbeitet in GET /api/konten/{iban}/umsaetze, GET /api/konten/{iban}/umsaetze/export, Schema Umsaetze, umsaetze, finanzstatus, UC-003, BR-0075, BR-0076, UC-019 · d8430cc_
- Gehört „Alle“ zur Werteliste der Kategorie oder nur zur Maske?
  **Antwort:** Nur zur Maske: das Feld kategorie kennt „Alle“ nicht.
  _→ eingearbeitet in Umsatz, UC-003, BR-0104 · 5c5598f_
- Darf der Kategoriefilter mehr Kategorien anbieten als die Ausgabenanalyse?
  **Antwort:** Nein, beide nutzen dieselben sieben Kategorien aus der Entität Umsatz.
  _→ eingearbeitet in Umsatz, UC-003, BR-0104 · 5c5598f_
- Wie zeigt die Maske Umsätze, wenn die angefragte Seite hinter der letzten Trefferseite liegt und die Filter zugleich keinen einzigen Treffer ergeben (etwa nach einem Filterwechsel auf Seite 3)?
  **Antwort:** Die Maske springt bei jedem Filterwechsel auf Seite 1 und fragt nur Seiten ab 1 an; eine leere Seite hinter der letzten entsteht nur durch Blättern und zeigt keine Zeile, die Gesamtzahl und keinen Hinweis.
  _→ noch nicht in der Spezifikation_
- Wo sollen die 25 Umsätze für den Blätternachweis liegen?
  **Antwort:** Bei einer neuen Demo-Kundin mit eigenem Girokonto, damit bestehende Szenarien unverändert bleiben
  _→ eingearbeitet_
- Wie sollen die 200 Lastumsätze je Lastkunde verteilt sein?
  **Antwort:** Über sechs Monate, alle sieben Kategorien, Beträge gestreut
  _→ eingearbeitet_
- Wie antwortet der Dienst auf kategorie=Alle?
  **Antwort:** Mit 400 als Formatfehler, weil „Alle“ kein Wert des Feldes kategorie ist.
  _→ eingearbeitet in GET /api/konten/{iban}/umsaetze, GET /api/konten/{iban}/umsaetze/export, UC-003, BR-0104 · c930ded_
- Sollen „Seite vor“ und „Seite zurück“ nur seitenweise blättern, ohne auf Seite 1 bzw. die letzte Trefferseite zu springen?
  **Antwort:** Ja, ein Schritt je Knopf, ohne Sprung auf Seite 1 oder die letzte Seite.
  _→ eingearbeitet in UC-003, umsaetze · c026169_
- Sollen die Demo-Daten die Kategorie Sonstiges für die Überweisungen behalten oder im Szenario eine andere Kategorie verwendet werden?
  **Antwort:** Sonstiges bleibt, wie BR-0012 es vorgibt (Annahme des Vorschlags).
  _→ noch nicht in der Spezifikation_
- Soll das Szenario zum Filter Ein-/Ausgang beim Export weiter nur die Richtung prüfen oder zusätzlich Betrag und Kategorie setzen?
  **Antwort:** Zusätzlich Betrag von 10,00 bis 60,00 und Kategorie Sonstiges setzen (Annahme des Vorschlags).
  _→ noch nicht in der Spezifikation_
- Woran soll die leere Auswahl des Exports künftig gezeigt werden?
  **Antwort:** Am Zusammenspiel von Suchtext, Betrag und Kategorie (Annahme des Vorschlags).
  _→ noch nicht in der Spezifikation_
- Welche Kategorie trägt die Gutschrift einer Lastschrift-Rückgabe?
  **Antwort:** Die Kategorie der zurückgegebenen Lastschrift.
  _→ eingearbeitet in Umsatz · 41f9dfe_
- Soll BR-0095 die Kategorie des Umsatzes einer Rückgabe selbst nennen, damit Regel und Datenmodell dasselbe sagen?
  **Antwort:** Ja, die Kategorie der zurückgegebenen Lastschrift in BR-0095 ergänzen.
  _→ eingearbeitet in Umsatz · 41f9dfe_
- An welcher Stelle der Navigation soll „Überweisung“ auf Debitkarte, Persönliche Daten und Umbuchung stehen?
  **Antwort:** Direkt nach „Finanzstatus“, wie auf den meisten Masken.
  _→ noch nicht in der Spezifikation_
- Sollen alle Masken den Navigationseintrag mit dem Beispielwert „Postfach (2)“ zeigen?
  **Antwort:** Ja, „Postfach (2)“ wie auf den übrigen Masken und in der Skizze postfach.
  _→ noch nicht in der Spezifikation_
