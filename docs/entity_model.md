# Entitätenmodell

## ER-Diagramm

```mermaid
erDiagram
    Konto }o--|| Kunde : "gehört zu"
    "Überweisung" }o--|| Konto : "geht ab von"
    Umsatz }o--|| Konto : "gehört zu"
    Empfaengervorlage }o--|| Kunde : "gehört zu"
    Debitkarte |o--|| Konto : "gehört zum Girokonto"
```

## Entitäten

### Kunde

**Bereich:** Finanzstatus  

Die angemeldete Privatkundin, deren Konten der Finanzstatus zeigt.

| Attribut | Beschreibung | Datentyp | Länge/Präzision | Validierungsregeln |
|---|---|---|---|---|
| kundennummer | Nummer der Kundin im Online-Banking | String | 1..20 | Pflicht; Eindeutig; Länge 1..20; Beispiel K-104 233 |
| vorname | Vorname der Kundin | String | 1..60 | Pflicht; Länge 1..60 |
| nachname | Nachname der Kundin | String | 1..60 | Pflicht; Länge 1..60 |
| tageslimit | Tageslimit der Kundin für Überweisungen je Kalendertag in Euro; anfangs das Standardlimit, von der Kundin senk- und bis zum Standardlimit anhebbar | Decimal |  | Pflicht; Wertebereich 0..5000; Standard 5000.00; Beispiel 1000.00; höchstens zwei Nachkommastellen |
| standardlimit | Standardlimit für das Tageslimit in Euro; für alle Kundinnen gleich, nicht änderbar | Decimal |  | Pflicht; Standard 5000.00; Beispiel 5000.00; für alle Kundinnen gleich |

**Einschränkungen:** Das Tageslimit gilt je Kundin, nicht je Konto, und liegt nur im Speicher (ADR-002).

### Konto

**Bereich:** Finanzstatus  

Ein Konto der Kundin, wie es der Finanzstatus in einer Zeile zeigt. Eine Kreditkarte mit offenem Betrag führt einen negativen Saldo.

| Attribut | Beschreibung | Datentyp | Länge/Präzision | Validierungsregeln |
|---|---|---|---|---|
| kontoname | Bezeichnung des Kontos in der Tabelle | String | 1..60 | Pflicht; Länge 1..60; Beispiel Girokonto |
| iban | IBAN des Kontos | String | 22..22 | Pflicht; Eindeutig; Länge 22..22; Beispiel DE02 5001 0517 5407 3249 31 |
| art | Art des Kontos | String |  | Pflicht; Werte Girokonto, Kreditkarte; Beispiel Girokonto |
| saldo | Aktueller Saldo in Euro; bei einer Kreditkarte mit offenem Betrag negativ | Decimal |  | Pflicht; Beispiel 2145.30; negativ bei Kreditkarte mit offenem Betrag |
| waehrung | Währung des Saldos | String |  | Pflicht; Werte EUR; Standard EUR |
| dispositionsrahmen | Eingeräumter Dispositionsrahmen in Euro; nur beim Girokonto belegt | Decimal |  | Pflicht bei Art Girokonto; Beispiel 1000.00; nur bei Art Girokonto |
| verfuegbarerBetrag | Verfügbarer Betrag in Euro: Saldo plus Dispositionsrahmen; nur beim Girokonto belegt | Decimal |  | Pflicht bei Art Girokonto; Beispiel 3145.30; nur bei Art Girokonto |

**Einschränkungen:** Ein Konto der Art Girokonto kann eine Debitkarte haben (Entität Debitkarte); eine Kreditkarte hat keine.

### Überweisung

**Bereich:** Überweisung  

Ein einmaliger Überweisungsauftrag von einem Girokonto, wie ihn die Überweisung erfasst und genau einmal ausführt. Ein Auftrag für einen späteren Ausführungstag (Terminüberweisung) ist bis zu seiner Ausführung oder Löschung vorgemerkt und bucht nichts.

| Attribut | Beschreibung | Datentyp | Länge/Präzision | Validierungsregeln |
|---|---|---|---|---|
| auftragsId | Kennung des Auftrags, von der Seite je Überweisung vergeben; Träger der Einmalbuchung | String | 1..36 | Pflicht; Eindeutig; Länge 1..36; Beispiel A-2026-00007 |
| empfaenger | Name des Empfängers | String | 1..70 | Pflicht; Länge 1..70; Beispiel Möbel Nord GmbH |
| empfaengerIban | IBAN des Empfängers im SEPA-Raum | String | 15..34 | Pflicht; Länge 15..34; Beispiel DE02 5001 0517 5407 3249 31 |
| betrag | Überweisungsbetrag in Euro, mindestens 0,10 | Decimal |  | Pflicht; Wertebereich 0.10..; Beispiel 50.00 |
| waehrung | Währung des Betrags | String |  | Pflicht; Werte EUR; Standard EUR |
| verwendungszweck | Verwendungszweck der Überweisung | String | 1..140 | Pflicht; Länge 1..140; Beispiel Rechnung 4711 |
| status | Stand des Auftrags: ausgefuehrt nach der Ausführung, vorgemerkt bei einer Terminüberweisung | String |  | Pflicht; Werte ausgefuehrt, vorgemerkt; Beispiel ausgefuehrt |
| erfasstAm | Zeitpunkt der Ausführung, bei einem vorgemerkten Auftrag der Zeitpunkt der Vormerkung | DateTime |  | Pflicht; Beispiel 2026-02-14T10:15:00Z |
| ausfuehrungstag | Kalendertag, an dem eine Terminüberweisung ausgeführt werden soll; nur bei einem vorgemerkten Auftrag belegt | Date |  | Pflicht bei Status vorgemerkt; nur bei Status vorgemerkt; Anzeigeformat TT.MM.JJJJ; Beispiel 2026-12-24 |

### Umsatz

**Bereich:** Finanzstatus  

Eine Buchung auf einem Konto der Kundin, wie sie die Umsätze mit Buchungstag, Gegenpartei, Verwendungszweck, Betrag und Saldo danach zeigen. Im Ausgangsstand trägt jedes Demo-Konto einige Demo-Umsätze mit festen Buchungstagen und festen Uhrzeiten, der jüngste mit dem Kontosaldo als Saldo danach (C-001); weitere Umsätze entstehen aus einer ausgeführten Überweisung (BR-0012), deren gebuchtAm der Ausführungszeitpunkt ist.

| Attribut | Beschreibung | Datentyp | Länge/Präzision | Validierungsregeln |
|---|---|---|---|---|
| buchungstag | Tag der Buchung | Date |  | Pflicht; Beispiel 2026-02-14; Anzeige in der Umsatzliste und in der CSV-Datei als TT.MM.JJJJ, Beispiel 14.02.2026 |
| gegenpartei | Name der Gegenpartei | String | 1..70 | Pflicht; Länge 1..70; Beispiel Möbel Nord GmbH |
| verwendungszweck | Verwendungszweck der Buchung | String | 1..140 | Pflicht; Länge 1..140; Beispiel Rechnung 4711 |
| betrag | Betrag in Euro; beim Ausgang negativ. Anzeige in der Umsatzliste mit Dezimalkomma, Tausenderpunkt und Währungszeichen, Beispiel -1.250,00 €. In der CSV-Datei in Euro mit Dezimalkomma, ohne Tausenderpunkt und ohne Währungszeichen, Beispiel -50,00 | Decimal |  | Pflicht; Beispiel -50.00 |
| waehrung | Währung des Betrags | String |  | Pflicht; Werte EUR; Standard EUR |
| saldoDanach | Saldo des Kontos nach dieser Buchung in Euro. Anzeige in der Umsatzliste mit Dezimalkomma, Tausenderpunkt und Währungszeichen, Beispiel 2.095,30 €. In der CSV-Datei in Euro mit Dezimalkomma, ohne Tausenderpunkt und ohne Währungszeichen, Beispiel 2095,30 | Decimal |  | Pflicht; Beispiel 2095.30 |
| gebuchtAm | Zeitpunkt der Buchung in UTC; entscheidet bei gleichem Buchungstag über die Reihenfolge, der jüngere steht oben (BR-0008) | DateTime |  | Pflicht; Beispiel 2026-02-14T10:15:00Z |

**Einschränkungen:** Ein Eingang hat einen positiven, ein Ausgang einen negativen Betrag; der Betrag 0 kommt nicht vor (BR-0009).

### Empfaengervorlage

**Bereich:** Überweisung  

Ein gespeicherter Empfänger der Kundin mit Name, IBAN und optional Verwendungszweck, den sie bei der Überweisung auswählt, statt ihn neu einzutippen.

| Attribut | Beschreibung | Datentyp | Länge/Präzision | Validierungsregeln |
|---|---|---|---|---|
| vorlagenId | Kennung der Vorlage | String | 1..36 | Pflicht; Eindeutig; Länge 1..36; Beispiel V-2026-00001 |
| name | Name des Empfängers, der zugleich die Vorlage benennt | String | 1..70 | Pflicht; Länge 1..70; Beispiel Möbel Nord GmbH |
| empfaengerIban | IBAN des Empfängers im SEPA-Raum | String | 15..34 | Pflicht; Länge 15..34; Beispiel DE89 3704 0044 0532 0130 00 |
| verwendungszweck | Verwendungszweck der Vorlage; optional; leer oder nur Leerzeichen ergibt keinen Wert, dann fehlt das Feld | String | 0..140 | Länge 0..140; Beispiel Rechnung 4711; leer oder nur Leerzeichen = kein Wert, das Feld fehlt in Antwort und Liste |

**Einschränkungen:** Der Name ist je Kunde eindeutig, verglichen ohne führende und folgende Leerzeichen und ohne Beachtung der Groß-/Kleinschreibung; gespeichert wird die Eingabe der Kundin; höchstens 50 Empfängervorlagen je Kunde.

### Debitkarte

**Bereich:** Debitkarte  

Die Debitkarte zum Girokonto der Kundin mit ihrem Sperrstatus. Die Kundin erkennt sie an der maskierten Kartennummer.

| Attribut | Beschreibung | Datentyp | Länge/Präzision | Validierungsregeln |
|---|---|---|---|---|
| kartennummerMaskiert | Maskierte Kartennummer, vier Sterne und die letzten vier Stellen; daran erkennt die Kundin ihre Karte | String | 9..9 | Pflicht; Länge 9..9; Muster ^\*\*\*\* [0-9]{4}$; Beispiel **** 4821 |
| status | Sperrstatus der Karte; endgültig gesperrt bleibt gesperrt | String |  | Pflicht; Werte aktiv, vorübergehend gesperrt, endgültig gesperrt; Standard aktiv; Beispiel aktiv |
| sperrgrund | Grund der endgültigen Sperre, von der Kundin beim endgültigen Sperren gewählt; nur belegt, wenn der Status endgültig gesperrt ist | String |  | Werte Verlust, Diebstahl; Beispiel Verlust; Pflicht beim endgültigen Sperren, sonst nicht belegt; ein bei anderem Zielstatus mitgeschickter Sperrgrund wird ignoriert und nicht gespeichert |

**Einschränkungen:** Zu einem Girokonto gibt es höchstens eine Debitkarte, zu einer Kreditkarte keine. Die Debitkarte liegt nur im Speicher (ADR-002); im Ausgangsstand haben die Demo-Kundinnen je eine Debitkarte mit Status aktiv.
