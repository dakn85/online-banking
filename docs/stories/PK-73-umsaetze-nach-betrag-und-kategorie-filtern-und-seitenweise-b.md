# PK-73: Umsätze nach Betrag und Kategorie filtern und seitenweise blättern

**Art:** Änderung · **Priorität:** Mittel · **Systeme:** Online-Banking

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
| Umsatz | Geändert | Beschreibung geändert, Attribut kategorie geändert |
| Finanzstatus | Geändert | Skizze geändert |
| Umsätze | Geändert | Feld Betrag von neu, Feld Betrag bis neu, Feld Kategorie neu, und 5 weitere |
| UC-003 Umsätze eines Kontos anzeigen | Geändert | Ziel geändert, Notizen geändert, Schritt 4 geändert, und 20 weitere |
| BR-0075 Export mit den Umsätzen der Liste | Geändert | Text geändert |
| BR-0076 Export nur mit Umsätzen | Geändert | Text geändert |
| BR-0104 Betragsfilter und Kategoriefilter der Umsatzliste | Neu | Neu in UC-003 |
| BR-0105 Seitenweise Ausgabe der Umsatzliste mit Gesamtzahl | Neu | Neu in UC-003 |
| UC-019 Ausgabenanalyse des Girokontos anzeigen | Geändert | Notizen geändert |

## Akzeptanztests

- `acceptance/specs/umsaetze.spec`: Betragsfilter, Kategorie und Textsuche wirken zusammen
- `acceptance/specs/umsaetze.spec`: Der Betragsfilter schließt Betrag von und Betrag bis ein
- `acceptance/specs/umsaetze.spec`: Der Betragsfilter zeigt Ausgänge nach ihrer Höhe ohne Vorzeichen
- `acceptance/specs/umsaetze.spec`: Der Betragsfilter zeigt einen Eingang, dessen Höhe im Betragsbereich liegt
- `acceptance/specs/umsaetze.spec`: Der CSV-Export berücksichtigt den Filter Ein-/Ausgang
- `acceptance/specs/umsaetze.spec`: Der CSV-Export einer leeren Auswahl liefert keine Datei und zeigt die Meldung
- `acceptance/specs/umsaetze.spec`: Der CSV-Export enthält die gefilterten Umsätze, neueste zuerst, mit Saldo danach
- `acceptance/specs/umsaetze.spec`: Der CSV-Export enthält genau die Umsätze der gefilterten Liste
- `acceptance/specs/umsaetze.spec`: Der Dienst weist die Kategorie Alle als Formatfehler ab
- `acceptance/specs/umsaetze.spec`: Der Filter Ein-/Ausgang blendet die Gegenrichtung aus
- `acceptance/specs/umsaetze.spec`: Der Filter Ein-/Ausgang ohne Knopf Weiter
- `acceptance/specs/umsaetze.spec`: Der Kategoriefilter zeigt nur Umsätze der gewählten Kategorie
- `acceptance/specs/umsaetze.spec`: Die beiden SEPA-Lastschriften stehen als jüngste Buchungen mit ihrem Saldo danach oben
- `acceptance/specs/umsaetze.spec`: Die Umsätze zeigen die Buchungen mit Betrag und Saldo danach, neueste zuerst
- `acceptance/specs/umsaetze.spec`: Die Umsatzliste zeigt den Buchungstag als TT.MM.JJJJ
- `acceptance/specs/umsaetze.spec`: Ein Betrag von über Betrag bis zeigt die Meldung zum ungültigen Betragsbereich
- `acceptance/specs/umsaetze.spec`: Ein Filterwechsel führt die Umsätze auf Seite 1 zurück
- `acceptance/specs/umsaetze.spec`: Eine Seite hinter der letzten Trefferseite zeigt keine Zeile, aber die Gesamtzahl
- `acceptance/specs/umsaetze.spec`: Mehr als 20 Treffer blättern auf Seite 1 mit 20 Umsätzen und Seite 2 mit dem Rest, beide mit der Gesamtzahl
- `acceptance/specs/umsaetze.spec`: Seite vor und Seite zurück blättern die Umsatzliste

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-23_

## Bausteine
- Online-Banking-Dienst: `src/umsaetze.ts` (Filter, Seiten, Demo-Umsätze), `src/main.ts` (Routen Umsätze und Export), `src/kunden.ts`/`src/konten.ts` (Demo-Kundin maria.schulz)
- Oberfläche: `public/seiten/umsaetze.js`, `public/styles.css`
- Akzeptanztests: `acceptance/tests/StepImplementation.ts` (fehlende Schritte)

## Schritte
1. **BR-0104 Filter im Dienst:** `filterAus` liest `betragVon`, `betragBis` (Zahl ≥ 0, sonst 400) und `kategorie` (Werteliste von Umsatz.kategorie, „Alle“ und Unbekanntes 400, UC-003 A13). Liegt betragVon über betragBis: 400 „Der Betragsbereich ist ungültig: von liegt über bis.“ (A9, A11). `umsaetzeVon` vergleicht die Betragshöhe ohne Vorzeichen in Cent, beide Grenzen eingeschlossen, und die Kategorie; alle gesetzten Filter wirken zusammen.
2. **BR-0105 Seiten:** `GET /api/konten/{iban}/umsaetze` liest `seite` (≥ 1, Vorgabe 1) und `seitengroesse` (≥ 1, Vorgabe 20), sonst 400; liefert `{umsaetze, gesamt}` mit dem Ausschnitt in der Reihenfolge nach BR-0008. Eine Seite hinter der letzten liefert `umsaetze: []` mit `gesamt`.
3. **BR-0075/BR-0076 Export:** gleiche Filter, keine Seitenparameter, alle Treffer; 404 vor 400 vor 422 wie bisher.
4. **UC-003 Maske:** Filterleiste um Betrag von, Betrag bis (Texteingabe mit Dezimalkomma, Umwandlung in Zahl) und Kategorie (Auswahl „Alle“ plus Werteliste) ergänzen; die Maske schickt `seitengroesse=20` und `seite` mit. Kennzahlen „Gesamtzahl der Treffer“ und „Seite“, Knöpfe „Seite zurück“/„Seite vor“. Jeder Filterwechsel setzt auf Seite 1 (A12). 400 zeigt nur die Meldung statt der Liste (A9), eine leere Seite hinter der letzten zeigt keine Zeile, die Gesamtzahl und keinen Hinweis (A10); Hinweis nach A2 nur bei `gesamt = 0`.
5. **Demo-Kundin maria.schulz (PIN 11223):** Girokonto mit 25 Demo-Umsätzen, Saldo danach rückwärts aus dem Kontosaldo (C-001, BR-0008); setzt der Demo-Reset zurück.
6. **Schritte:** Filterschritt um Betrag von/bis und Kategorie erweitert; neu: Treffer, Blättern, Seite, Zeilenzahl je Seite, Status der Abfrage, Knopf nicht vorhanden, direkter API-Aufruf mit Parameter.
7. **Unit-Tests** in `test/umsaetze.test.ts` für BR-0104 und BR-0105.

## Rahmenänderung
Keine neue Bibliothek. Daten der neuen Demo-Kundin (IBAN, Saldo, Kundennummer, Umsätze) legt die Spezifikation nicht fest; ich wähle sie und melde sie als Rückmeldung.

## Offene Fragen

- [ ] Das Szenario „Der CSV-Export enthält genau die Umsätze der gefilterten Liste“ (acceptance/specs/umsaetze.spec:384–405) kann so nicht grün werden. Es setzt die Testdaten zurück und führt keine Überweisung aus, filtert dann ohne Suchtext mit Betrag 10,00 bis 60,00 und Kategorie „Sonstiges“ und erwartet zwei Zeilen: „Bäckerei Krause | Einkauf | -12,00 € | 2.190,10 €“ und „Möbel Nord GmbH | Rechnung 4711 | -50,00 € | 2.095,30 €“. Dabei gibt es drei Widersprüche: (1) Bäckerei Krause trägt laut entity_model.md (Umsatz.kategorie) die Kategorie Lebensmittel, nicht Sonstiges. (2) Möbel Nord GmbH entsteht nur aus einer Überweisung, und das Szenario führt keine aus. (3) Eine Überweisung von heute stünde nach BR-0008 über der Bäckerei (Buchungstag 12.02.2026), nicht darunter. Nach dem Ausgangsstand liefert der Filter 10–60 / Sonstiges auf Lenas Girokonto keinen Treffer: Die Liste zeigt den Hinweis nach A2, und der Export antwortet mit 422.

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
  _→ eingearbeitet · 54d459c_
- Wie sollen die 200 Lastumsätze je Lastkunde verteilt sein?
  **Antwort:** Über sechs Monate, alle sieben Kategorien, Beträge gestreut
  _→ eingearbeitet · 54d459c_
- Wie antwortet der Dienst auf kategorie=Alle?
  **Antwort:** Mit 400 als Formatfehler, weil „Alle“ kein Wert des Feldes kategorie ist.
  _→ eingearbeitet in GET /api/konten/{iban}/umsaetze, GET /api/konten/{iban}/umsaetze/export, UC-003, BR-0104 · c930ded_
- Sollen „Seite vor“ und „Seite zurück“ nur seitenweise blättern, ohne auf Seite 1 bzw. die letzte Trefferseite zu springen?
  **Antwort:** Ja, ein Schritt je Knopf, ohne Sprung auf Seite 1 oder die letzte Seite.
  _→ eingearbeitet in UC-003, umsaetze · c026169_
- Sollen die Demo-Daten die Kategorie Sonstiges für die Überweisungen behalten oder im Szenario eine andere Kategorie verwendet werden?
  **Antwort:** Sonstiges bleibt, wie BR-0012 es vorgibt (Annahme des Vorschlags).
  _→ eingearbeitet · 39292ac_
- Soll das Szenario zum Filter Ein-/Ausgang beim Export weiter nur die Richtung prüfen oder zusätzlich Betrag und Kategorie setzen?
  **Antwort:** Zusätzlich Betrag von 10,00 bis 60,00 und Kategorie Sonstiges setzen (Annahme des Vorschlags).
  _→ eingearbeitet · 39292ac_
- Woran soll die leere Auswahl des Exports künftig gezeigt werden?
  **Antwort:** Am Zusammenspiel von Suchtext, Betrag und Kategorie (Annahme des Vorschlags).
  _→ eingearbeitet · 39292ac_
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
- Gilt für den CSV-Export weiterhin die übernommene Annahme, dass Betrag von/bis und Kategorie nicht angewendet werden, oder die geänderte Fassung von Schritt 10, BR-0075 und Export-Endpunkt, die alle Filter anwenden?
  **Antwort:** Der Export wendet alle Filter an (Schritt 10, BR-0075, Endpunkt); die alte Annahme entfällt.
  _→ eingearbeitet in UC-003, BR-0105, umsaetze · 92c380e_
- Woher nimmt die Maske den Wert der Kennzahl „Seite“, die sie neben der Gesamtzahl anzeigt?
  **Antwort:** Aus dem mitgeschickten Parameter seite: die Maske merkt sich die angefragte Seite und zeigt sie an; der Vertrag bleibt unverändert.
  _→ eingearbeitet in UC-003, BR-0105, umsaetze · 92c380e_
- Welche Kategorie soll die Skizzenzeile Fitnessstudio Vital zeigen, damit Skizze und Demo-Daten übereinstimmen?
  **Antwort:** Freizeit, wie das Datenmodell es für diesen Demo-Umsatz festlegt; die Skizze wird angepasst.
  _→ eingearbeitet in UC-003, BR-0105, umsaetze · 92c380e_
- Führt der Export-Endpunkt die drei Filter unter denselben Parameternamen wie die Liste?
  **Antwort:** Gleiche Namen wie die Liste: betragVon, betragBis, kategorie.
  _→ eingearbeitet in UC-003, BR-0104 · 039dd53_
- Sollen die Szenarien der Umsatzliste Kategorie „Sonstiges“ und Betrag von 10,00 bis 60,00 setzen, wie es beim Export-Szenario schon entschieden ist?
  **Antwort:** Ja, Kategorie „Sonstiges“ und Betrag von 10,00 bis 60,00 setzen.
  _→ eingearbeitet · 702cb90_
- Soll das Blätter-Szenario mit "lena.hoffmann" laufen oder braucht es dafür eine eigene Demo-Kundin mit über 20 Umsätzen?
  **Antwort:** Eine neue Demo-Kundin mit über 20 Umsätzen wird in der Spezifikation eingeführt und das Szenario nutzt sie.
  _→ noch nicht in der Spezifikation_
- Wo soll „Postfach (2)“ auf Masken ohne „Empfängervorlagen“ stehen?
  **Antwort:** Am Ende der Navigation, wie vorgeschlagen.
  _→ noch nicht in der Spezifikation_
- Soll die Maske bei einem Formatfehler des Dienstes eine eigene Meldung zeigen, obwohl ihre Auswahlfelder nur zulässige Werte anbieten?
  **Antwort:** Keine eigene Meldung; der Fall entsteht nur bei einem direkten Aufruf des Dienstes.
  _→ eingearbeitet in UC-003, BR-0104 · de0b368_
- Sind die Salden danach der älteren Demo-Umsätze gegenüber der Fassung ohne die beiden Lastschriften bereits um 44,80 erhöht, oder sollen sie noch einmal um 44,80 steigen?
  **Antwort:** Bereits erhöht: 2.190,10, 2.202,10, 2.288,10 und -351,90 gelten.
  _→ eingearbeitet in Umsatz · ad2f763_
