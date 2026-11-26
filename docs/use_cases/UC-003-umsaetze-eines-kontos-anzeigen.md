# Use Case: Umsätze eines Kontos anzeigen

## Überblick

**Use Case ID:** UC-003  
**Name:** Umsätze eines Kontos anzeigen  
**Bereich:** Finanzstatus  
**Primärakteur:** Privatkundin  
**Ziel:** Die Kundin sieht zu einem ihrer Konten die Umsätze mit Buchungstag, Gegenpartei, Verwendungszweck, Kategorie, Betrag und Saldo danach, den neuesten zuerst, und schränkt sie über die Textsuche sowie die Filter nach Zeitraum, Ein-/Ausgang, Betrag von/bis und Kategorie ein; sie blättert die Treffer seitenweise mit 20 Umsätzen je Seite und sieht die Gesamtzahl der Treffer, und sie lädt die Umsätze als CSV-Datei herunter. Zu einem Umsatz erfasst sie eine eigene Notiz, sieht sie in der Zeile, überschreibt sie und löscht sie nach einer Rückfrage wieder.  
**Ziele:** Z-6  
**Anforderungen:** NFR-001, C-001

## Vorbedingungen

- Die Kundin ist angemeldet, es gibt eine gültige Sitzung (NFR-001).
- Die Kundin hat im Finanzstatus in der Zeile eines Kontos „Umsätze“ gewählt.

## Standardablauf

1. Die Kundin wählt im Finanzstatus in der Zeile eines Kontos „Umsätze“.
2. Das System liest die Umsätze des Kontos (Demo-Daten, C-001).
3. Das System ordnet die Umsätze mit dem neuesten Buchungstag zuerst (BR-0008).
4. Das System zeigt Kontoname und IBAN des Kontos sowie die Felder für die Textsuche und die Filter nach Zeitraum, Ein-/Ausgang, Betrag von, Betrag bis und Kategorie.
5. Das System zeigt die Umsätze in einer Tabelle mit Buchungstag, Gegenpartei, Verwendungszweck, Kategorie, Betrag in Euro, Saldo danach in Euro und Rückgabe; bei einer SEPA-Lastschrift steht dort „Zurückgeben“, bei einer zurückgegebenen „Zurückgegeben“ (UC-022).
6. Die Kundin gibt einen Suchtext ein und wählt einen Zeitraum, eine Richtung, Betrag von und Betrag bis sowie eine Kategorie.
7. Das System zeigt nur die Umsätze, deren Gegenpartei oder Verwendungszweck den Suchtext enthält, deren Buchungstag im Zeitraum liegt, deren Betrag zur gewählten Richtung passt, deren Betragshöhe zwischen Betrag von und Betrag bis liegt und deren Kategorie der gewählten entspricht (BR-0009, BR-0010, BR-0104).
8. Die Kundin blättert mit „Seite vor“ und „Seite zurück“; das System zeigt die Treffer seitenweise mit 20 Umsätzen je Seite, nennt die Gesamtzahl der Treffer und behält die Reihenfolge nach BR-0008 über alle Seiten bei (BR-0105).
9. Die Kundin wählt „Als CSV exportieren“.
10. Das System liefert die Umsätze, die zu den eingestellten Werten für Suchtext, Zeitraum, Ein-/Ausgang, Betrag von und Betrag bis sowie Kategorie passen, über alle Seiten und ohne Seitenparameter, mit derselben Reihenfolge und demselben Saldo danach als CSV-Datei, die der Browser herunterlädt; es speichert die Datei nicht (BR-0075, BR-0104).
11. Die Kundin wählt „Kontoauszug“; das System öffnet die Maske Kontoauszug für das Konto mit der IBAN der angezeigten Umsätze, weiter mit UC-024.
12. Das System zeigt je Umsatz in der Zeile die gespeicherte Notiz im Feld Notiz und genau eine Aktion: „Notiz erfassen“, wenn der Umsatz keine Notiz trägt, sonst „Notiz ändern“ (BR-0106).
13. Die Kundin wählt in der Zeile eines Umsatzes „Notiz erfassen“ oder „Notiz ändern“; das System öffnet das Formular Notiz zum Umsatz für genau diesen Umsatz und hält den gewählten Umsatz dort mit Gegenpartei und umsatzId fest.
14. Das System zeigt im Formular den bisherigen Text als Inhalt, wenn der Umsatz eine Notiz trägt, und die Aktion „Notiz löschen“ nur dann, wenn er eine Notiz trägt (BR-0106, BR-0107).
15. Die Kundin gibt den Notiztext ein und wählt „Speichern“; das System schickt den Text mit der im Formular festgehaltenen umsatzId an PUT /api/konten/{iban}/umsaetze/{umsatzId}/notiz, zeigt die Meldung „Notiz gespeichert.“ und danach den gespeicherten Text in dieser Zeile (BR-0106). Der Notiztext folgt der Feldbedingung von Umsatznotiz.text im Datenmodell (A15).
16. Die Kundin wählt im Formular „Notiz löschen“; das System zeigt die Rückfrage „Notiz zu <Gegenpartei> löschen? Die Notiz lässt sich nicht wiederherstellen.“ mit „Bestätigen“ und „Abbrechen“, wobei die Gegenpartei die des im Formular festgehaltenen Umsatzes ist. Nach „Bestätigen“ schickt es DELETE /api/konten/{iban}/umsaetze/{umsatzId}/notiz mit dessen umsatzId, zeigt die Meldung „Notiz gelöscht.“ und die Zeile ohne Notiz; bei „Abbrechen“ bleibt die Notiz unverändert (BR-0107).

## Alternativabläufe

### A1: Nicht angemeldet

**Auslöser:** Es gibt keine gültige Sitzung, beim Öffnen der Seite (Schritt 1) oder weil sie bis zum Export abgelaufen ist (Schritt 10, Antwort 401). (Schritt 1).  
**Ablauf:**

1. Das System leitet auf die Anmeldeseite um und liefert beim Export keine Datei.
2. Die Kundin meldet sich an; danach beginnt der Standardablauf erneut, oder sie bricht ab.

### A2: Keine Umsätze zur Auswahl

**Auslöser:** Das Konto hat keine Umsätze, oder zu Suchtext, Zeitraum, Richtung, Betrag von/bis und Kategorie passt kein Umsatz. (Schritt 7).  
**Ablauf:**

1. Das System zeigt den Hinweis „Für diese Auswahl gibt es keine Umsätze.“ und keine Zeile.

### A3: Konto nicht gefunden

**Auslöser:** Die IBAN gehört zu keinem Konto der angemeldeten Kundin (BR-0011). (Schritt 2).  
**Ablauf:**

1. Das System zeigt den Hinweis „Das Konto wurde nicht gefunden.“ und keine Umsätze.

### A4: Zeitraum ungültig

**Auslöser:** Das Von-Datum liegt nach dem Bis-Datum (BR-0010). (Schritt 7).  
**Ablauf:**

1. Das System zeigt die Meldung „Der Zeitraum ist ungültig: von liegt nach bis.“ statt der Tabelle und keine Umsätze.
2. Einen Hinweis nach A2 zeigt das System nicht.

### A5: Keine Umsätze zum Export

**Auslöser:** Zu Suchtext, Zeitraum, Richtung, Betrag von/bis und Kategorie passt kein Umsatz, oder das Konto hat keine Umsätze; der Dienst antwortet mit 422 (BR-0076). (Schritt 10).  
**Ablauf:**

1. Das System liefert keine Datei und zeigt die Meldung „Für diese Auswahl gibt es keine Umsätze zum Export.“.

### A6: Konto nicht gefunden beim Export

**Auslöser:** Die IBAN gehört zu keinem Konto der angemeldeten Kundin; der Dienst antwortet mit 404 (BR-0011). (Schritt 10).  
**Ablauf:**

1. Das System liefert keine Datei und zeigt die Meldung „Das Konto wurde nicht gefunden.“.

### A7: Zeitraum ungültig beim Export

**Auslöser:** Das Von-Datum liegt nach dem Bis-Datum; der Dienst antwortet mit 400 (BR-0010). (Schritt 10).  
**Ablauf:**

1. Das System liefert keine Datei und zeigt die Meldung „Der Zeitraum ist ungültig: von liegt nach bis.“.

### A8: Export fehlgeschlagen

**Auslöser:** Der Dienst antwortet mit einem anderen Fehler als in A1, A5 bis A7, A11 und A13 oder ist nicht erreichbar. (Schritt 10).  
**Ablauf:**

1. Das System liefert keine Datei und zeigt die Meldung „Der Export ist fehlgeschlagen. Bitte versuchen Sie es später erneut.“.

### A9: Betragsbereich ungültig

**Auslöser:** Betrag von liegt über Betrag bis (BR-0104). (Schritt 7).  
**Ablauf:**

1. Das System zeigt die Meldung „Der Betragsbereich ist ungültig: von liegt über bis.“ statt der Tabelle und keine Umsätze.
2. Einen Hinweis nach A2 zeigt das System nicht.

### A10: Seite hinter der letzten Trefferseite

**Auslöser:** Die Kundin wählt „Seite vor“, und die angefragte Seite liegt hinter der letzten Trefferseite (BR-0105). (Schritt 8).  
**Ablauf:**

1. Das System zeigt keine Zeile und die Gesamtzahl der Treffer.
2. Eine Meldung zeigt das System nicht.

### A11: Betragsbereich ungültig beim Export

**Auslöser:** Betrag von liegt über Betrag bis; der Dienst antwortet mit 400 (BR-0104). (Schritt 10).  
**Ablauf:**

1. Das System liefert keine Datei und zeigt die Meldung „Der Betragsbereich ist ungültig: von liegt über bis.“.

### A12: Filterwechsel

**Auslöser:** Die Kundin ändert Suchtext, Zeitraum, Ein-/Ausgang, Betrag von, Betrag bis oder Kategorie, während die Liste eine Seite ab 2 zeigt (BR-0105). (Schritt 6).  
**Ablauf:**

1. Das System zeigt die Treffer der neuen Auswahl ab Seite 1 und nennt die Gesamtzahl der Treffer über alle Seiten (BR-0105).
2. Einen Hinweis nach A2 zeigt das System nur, wenn die neue Auswahl keinen Treffer hat.

### A13: Filterwert ungültig

**Auslöser:** Ein Aufruf schickt einen Filterwert außerhalb der Feldbedingungen von Umsatz, etwa kategorie „Alle“ statt eines Werts der Werteliste von Umsatz.kategorie; der Dienst antwortet mit 400. (Schritt 7, beim Export Schritt 10). (Schritt 7).  
**Ablauf:**

1. Der Dienst antwortet mit 400 und dem Feld fehler und liefert keine Umsätze, beim Export keine Datei.
2. Das System zeigt keinen Hinweis nach A2 und beim Export keinen nach A5.

### A14: Seitengröße über der Obergrenze

**Auslöser:** Ein Aufruf fragt eine Seitengröße über der Obergrenze nach BR-0105 an. (Schritt 8).  
**Ablauf:**

1. Der Dienst begrenzt die angefragte Seitengröße auf die Obergrenze und liefert höchstens diese Zahl an Umsätzen auf der Seite, mit der Gesamtzahl über alle Seiten, dem Saldo danach je Umsatz und ohne Meldung.
2. Die Reihenfolge bleibt die nach BR-0008, und einen Hinweis nach A2 zeigt das System nur, wenn es keinen Treffer gibt.

### A15: Notiztext außerhalb der Feldbedingung

**Auslöser:** Der Notiztext verletzt eine Feldbedingung von Umsatznotiz.text im Datenmodell, ist also nach dem Entfernen der Randleerzeichen leer oder länger, als die Feldbedingung erlaubt; der Dienst antwortet mit 400 und dem Feld fehler (Schritt 15).  
**Ablauf:**

1. Das System zeigt am Feld Notiz die Meldung „Die Notiz muss mindestens 1 Zeichen enthalten.“ bei leerem Text oder „Die Notiz darf höchstens 140 Zeichen lang sein.“ bei zu langem Text und keine Erfolgsmeldung; die gespeicherte Notiz bleibt unverändert.
2. Die Kundin berichtigt den Text; danach geht es mit Schritt 15 weiter, oder sie bricht ab.

### A16: Konto nicht gefunden beim Speichern der Notiz

**Auslöser:** Die IBAN gehört zu keinem Konto der angemeldeten Kundin; der Dienst antwortet mit 404 (BR-0106). (Schritt 15).  
**Ablauf:**

1. Das System zeigt im Feld fehler „Das Konto wurde nicht gefunden.“ und keine Erfolgsmeldung; die Notiz bleibt unverändert.

### A17: Umsatz nicht gefunden beim Speichern der Notiz

**Auslöser:** Die umsatzId gehört zu keinem Umsatz dieses Kontos; der Dienst antwortet mit 404 (BR-0106). (Schritt 15).  
**Ablauf:**

1. Das System zeigt im Feld fehler „Der Umsatz wurde nicht gefunden.“ und keine Erfolgsmeldung; die Notiz bleibt unverändert.

### A18: Notiz nicht gefunden beim Löschen

**Auslöser:** Der Umsatz trägt keine Notiz; der Dienst antwortet mit 404 (BR-0107). (Schritt 16).  
**Ablauf:**

1. Das System zeigt im Feld fehler „Die Notiz wurde nicht gefunden.“ und die Zeile ohne Notiz.

## Sequenzdiagramm

```mermaid
sequenceDiagram
    actor kundin as Privatkundin
    participant banking as Online-Banking
    kundin->>banking: „Umsätze“ in der Zeile eines Kontos
    banking->>banking: GET /api/konten/{iban}/umsaetze
    banking-->>kundin: Umsätze des Kontos, neueste zuerst
    kundin->>banking: Suchtext, Zeitraum, Ein-/Ausgang, Betrag von/bis, Kategorie
    banking-->>kundin: Umsätze, gefiltert, seitenweise mit der Gesamtzahl
    kundin->>banking: „Als CSV exportieren“
    banking->>banking: GET /api/konten/{iban}/umsaetze/export
    banking-->>kundin: CSV-Datei der gefilterten Umsätze
    alt keine gültige Sitzung
        banking-->>kundin: Umleitung auf die Anmeldeseite
    else keine Umsätze zur Auswahl
        banking-->>kundin: „Für diese Auswahl gibt es keine Umsätze.“
    else keine Umsätze für den Export
        banking-->>kundin: „Für diese Auswahl gibt es keine Umsätze zum Export.“
    end
```

## Nachbedingungen

### Erfolg

- Die Umsätze des gewählten Kontos sind mit Buchungstag, Gegenpartei, Verwendungszweck, Kategorie, Betrag und Saldo danach sichtbar, den neuesten zuerst.
- Suchtext, Zeitraum, Richtung, Betrag von/bis und Kategorie sind auf die angezeigten Umsätze angewendet.
- Nach einem Export liegt die CSV-Datei mit den Umsätzen der eingestellten Filter beim Browser der Kundin; im System ist nichts gespeichert.
- Die Notiz, die die Kundin erfasst oder überschrieben hat, ist am Umsatz gespeichert und in der Zeile sichtbar; eine gelöschte Notiz ist entfernt.

### Fehlschlag

- Ohne gültige Sitzung wurden keine Umsätze gezeigt; die Anmeldeseite ist zu sehen.

## Geschäftsregeln

### BR-0008: Reihenfolge der Umsätze und Saldo danach

Die Umsätze eines Kontos stehen mit dem neuesten Buchungstag zuerst; sortiert wird nach Buchungstag absteigend und bei gleichem Buchungstag nach gebuchtAm absteigend, sodass der zuletzt gebuchte Umsatz oben steht. Der Saldo danach eines Umsatzes ist der Saldo des Kontos unmittelbar nach dieser Buchung; der jüngste Umsatz eines Kontos trägt daher den aktuellen Saldo des Kontos.

### BR-0009: Ein- und Ausgang

Ein Eingang hat einen positiven Betrag, ein Ausgang einen negativen Betrag; der Betrag 0 kommt nicht vor. Die Richtung „Alle“ schränkt nicht ein, „Eingang“ zeigt nur Umsätze mit positivem Betrag, „Ausgang“ nur Umsätze mit negativem Betrag.

### BR-0010: Zeitraum und Textsuche

Der Zeitraumfilter zeigt die Umsätze, deren Buchungstag zwischen dem gewählten Von- und Bis-Datum liegt, beide Grenzen eingeschlossen; fehlt eine Grenze, gilt sie als offen. Liegt das Von-Datum nach dem Bis-Datum, antwortet der Dienst mit 400 und dem Feld fehler „Der Zeitraum ist ungültig: von liegt nach bis.“ und liefert keine Umsätze; die Seite zeigt diese Meldung statt der Tabelle und keinen Hinweis nach A2. Die Textsuche zeigt die Umsätze, deren Gegenpartei oder Verwendungszweck den Suchtext enthält, ohne Rücksicht auf Groß- und Kleinschreibung. Ohne Eingabe schränkt ein Filter nicht ein.

### BR-0011: Umsätze und Rückgaben nur für Konten der Kundin

Umsätze liefert der Dienst und eine Rückgabe (UC-022) bucht er nur zu einer IBAN, die zu einem Konto der angemeldeten Kundin gehört; sonst antwortet er mit 404 und die Seite zeigt „Das Konto wurde nicht gefunden.“. Dasselbe gilt für den Kontoauszug (UC-024): Ihn liefert der Dienst nur zu einer IBAN eines Kontos der angemeldeten Kundin; sonst antwortet er mit 404 und die Maske Kontoauszug zeigt „Das Konto wurde nicht gefunden.“.

### BR-0075: Export mit den Umsätzen der Liste

Der Export enthält genau die Umsätze, die die Umsatzliste zu denselben Werten für Suchtext, Zeitraum, Ein-/Ausgang, Betrag von/bis und Kategorie zeigt (BR-0009, BR-0010, BR-0104), über alle Seiten der Liste hinweg; Seitenparameter führt er nicht und die Seitengröße (BR-0105) wendet er nicht an, je Umsatz eine Zeile, in der Reihenfolge der Liste und mit demselben Saldo danach (BR-0008). Der Dienst erzeugt die Datei bei jedem Aufruf neu und speichert sie nicht.

### BR-0076: Export nur mit Umsätzen

Der Export liefert nur dann eine Datei, wenn mindestens ein Umsatz zu den gesetzten Filtern passt, also zu Suchtext, Zeitraum und Richtung (BR-0009, BR-0010) sowie Betrag von/bis und Kategorie (BR-0104); sonst antwortet der Dienst mit 422 und dem Feld fehler „Für diese Auswahl gibt es keine Umsätze zum Export.“ und liefert keine Datei. Vorher gelten in dieser Reihenfolge BR-0011 (404) und die Prüfung von Zeitraum und Betragsbereich nach BR-0010 und BR-0104 (400); bei fremder IBAN und ungültigem Zeitraum antwortet der Dienst daher mit 404.

### BR-0104: Betragsfilter und Kategoriefilter der Umsatzliste

Der Betragsfilter zeigt die Umsätze, deren Betragshöhe ohne Vorzeichen zwischen Betrag von und Betrag bis liegt, beide Grenzen eingeschlossen; ein Ausgang von -950,00 Euro liegt damit zwischen 100,00 und 1.000,00, und Ein-/Ausgang bleibt der eigene Filter (BR-0009). Fehlt eine Grenze, gilt sie als offen. Der Kategoriefilter zeigt die Umsätze, deren Kategorie der gewählten aus der Werteliste von Umsatz.kategorie entspricht; „Alle“ ist keine Kategorie, sondern die nicht einschränkende Auswahl der Maske, die den Parameter kategorie dann nicht mitschickt, und ohne Parameter schränkt der Filter nicht ein. Zusammen mit Zeitraum und Textsuche (BR-0010) zeigt die Liste nur Umsätze, die alle gesetzten Filter erfüllen. Liegt Betrag von über Betrag bis, antwortet der Dienst mit 400 und dem Feld fehler „Der Betragsbereich ist ungültig: von liegt über bis.“ und liefert keine Umsätze; die Seite zeigt diese Meldung statt der Tabelle und keinen Hinweis nach A2.

### BR-0105: Seitenweise Ausgabe der Umsatzliste mit Gesamtzahl

Die Umsatzliste zeigt 20 Umsätze je Seite; die Maske schickt diese Seitengröße fest mit. Die Treffer stehen über alle Seiten hinweg in der Reihenfolge nach BR-0008, Seite 1 enthält die ersten 20 Treffer. Die Maske fragt nur Seiten ab 1 an, springt bei jedem Filterwechsel auf Seite 1 (A12) und zeigt als Kennzahl „Seite“ die Seitenzahl, die sie zuletzt angefragt hat, also den Wert des Parameters seite; einen eigenen Wert für die angezeigte Seite liefert der Dienst nicht, der Vertrag bleibt unverändert. Die Maske nennt die Gesamtzahl der Treffer über alle Seiten; sie zählt dieselben Umsätze wie die Liste, auch wenn der Testbetrieb je Konto nur die jüngsten 200 Umsätze hält. Eine Seite hinter der letzten Trefferseite liefert eine leere Trefferseite mit der Gesamtzahl und ohne Meldung; den Hinweis nach A2 zeigt die Seite nur, wenn es keinen Treffer gibt. Die Seitengröße ist nach oben begrenzt: Der Dienst liefert höchstens 100 Umsätze je Seite, auch wenn ein Aufruf eine größere Seitengröße anfragt; er begrenzt die angefragte Seitengröße auf 100 und antwortet ohne Fehler und ohne Meldung (A14). Für die Maske ändert das nichts, sie bleibt bei ihren 20 Umsätzen je Seite; die Reihenfolge nach BR-0008 und die Gesamtzahl über alle Seiten bleiben unberührt.

### BR-0106: Notiz zu Umsätzen der angemeldeten Kundin

Die Notiz zu einem Umsatz speichert, liefert, überschreibt und löscht der Dienst nur zu einer IBAN eines Kontos der angemeldeten Kundin und nur zu einer umsatzId, die zu einem Umsatz dieses Kontos gehört; eine Notiz anderer Kundinnen sieht sie nicht. Gehört die IBAN zu keinem Konto der angemeldeten Kundin, antwortet der Dienst mit 404 und „Das Konto wurde nicht gefunden.“; gehört die umsatzId zu keinem Umsatz dieses Kontos, mit 404 und „Der Umsatz wurde nicht gefunden.“. Die Umsätze zeigen die gespeicherte Notiz je Umsatz im Feld notiz (Umsatznotiz.text); eine Notiz ändert weder die Reihenfolge der Umsätze noch den Saldo danach (BR-0008) noch Filter, Trefferzahl oder Export (BR-0075, BR-0104, BR-0105). Der Dienst liest und ändert nur die Notiz der angemeldeten Kundin aus der Sitzung, eine Kennung im Aufruf gibt es nicht.

### BR-0107: Löschen nur einer vorhandenen Notiz

„Notiz löschen“ entfernt die Notiz erst nach der Bestätigung in der Rückfrage; wählt die Kundin „Abbrechen“, bleibt die Notiz unverändert. Trägt der Umsatz keine Notiz, antwortet der Dienst mit 404 und dem Feld fehler „Die Notiz wurde nicht gefunden.“ und löscht nichts; die Umsätze zeigen diese Meldung und lassen die Zeile ohne Notiz.

## Notizen

Der Ausgangsstand führt je Konto einige Demo-Umsätze mit festen Buchungstagen; das Girokonto trägt dazu zwei SEPA-Lastschriften mit Buchungstag relativ zum Tag des Resets (UC-022); der jüngste Umsatz eines Kontos trägt als Saldo danach den aktuellen Kontosaldo (C-001, BR-0008). Weitere Umsätze entstehen aus einer ausgeführten Überweisung (UC-002, BR-0012) und aus der Rückgabe einer Lastschrift (UC-022). Für das Blättern über mehrere Seiten führt der Testbetrieb die Demo-Kundin Maria Schulz mit der Kennung maria.schulz und der PIN 11223: eine Privatkundin mit eigenem Girokonto und 25 Demo-Umsätzen, sodass die Trefferliste auf Seite 1 zwanzig Umsätze und auf Seite 2 fünf Umsätze zeigt. Die Obergrenze der Seitengröße (A14) ist nur an einem Konto mit mehr als 100 Umsätzen prüfbar; dafür nutzt der Test die Lastkunden lasttest-001 bis lasttest-300, deren Girokonto die jüngsten 200 Umsätze trägt (BR-0105), während die Demo-Konten der übrigen Szenarien unverändert bleiben, weil der Last-Reset (POST /api/test/lasttest/reset) getrennt vom Demo-Reset läuft. Die Umsatzliste ist eine eigene Seite, die der Knopf „Umsätze“ in der Zeile des Finanzstatus öffnet.

Export (Schritte 9 und 10): Die Datei hat Semikolon als Trennzeichen und UTF-8 mit BOM, damit Excel in Deutschland sie direkt richtig öffnet. Sie beginnt mit der Kopfzeile Buchungstag;Gegenpartei;Verwendungszweck;Betrag;Saldo danach, danach folgt je Umsatz eine Zeile. Der Buchungstag steht als TT.MM.JJJJ, Betrag und Saldo danach in Euro mit Dezimalkomma, ohne Tausenderpunkt und ohne Währungszeichen, ein Ausgang negativ (Beispiel -50,00). Ein Text mit Semikolon, Anführungszeichen oder Zeilenumbruch steht in Anführungszeichen, ein Anführungszeichen darin doppelt; sonst werden Texte unverändert geschrieben. Der Dateiname lautet umsaetze-<IBAN ohne Leerzeichen>.csv. Ohne gültige Sitzung gilt A1.
