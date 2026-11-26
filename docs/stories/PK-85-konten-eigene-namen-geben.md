# PK-85: Konten eigene Namen geben

**Art:** Erweiterung · **Priorität:** Mittel · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich meinen Konten eigene Namen geben können, etwa dem Tagesgeldkonto „Urlaubskasse“, damit ich sie im Finanzstatus besser auseinanderhalte.

## Nicht im Scope

- Kontonamen wieder entfernen/zurücksetzen: Die Idee nennt nur das Vergeben eines Namens, kein Löschen oder Zurücksetzen auf die Standardbezeichnung.
- Namensänderung mit TAN bestätigen: Die Idee verlangt keine TAN-Bestätigung; ob eine Datenänderung bestätigt werden muss, ist nicht gefordert.
- Bestätigungsnachricht im Postfach: Die Idee erwähnt keine Benachrichtigung über die Umbenennung.
- Eigene Namen für Empfängervorlagen oder Daueraufträge: Die Idee betrifft nur eigene Konten, nicht andere Objekte.
- Verwaltung/Report über vergebene Kontonamen: Kein administrativer oder berichtender Bedarf in der Idee.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Konten der angemeldeten Kundin mit Salden und Gesamtvermögen | Geändert | Beschreibung geändert |
| Eigenen Namen eines Kontos der angemeldeten Kundin setzen | Neu | Endpunkt neu |
| Konto | Geändert | Eigenschaft eigenerName neu, Attribut eigenerName neu |
| KontonameEingabe | Neu | Schema neu |
| Zugriffsschutz des Finanzstatus | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Antwortzeit von Finanzstatus und Überweisung | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Verfügbarkeit von Finanzstatus und Überweisung | Geändert | Anforderung geändert, Maß geändert, Gilt für geändert |
| Finanzstatus | Geändert | Feld Eigener Name neu, Aktion Umsätze geändert, Aktion Umbuchen geändert, und 4 weitere |
| UC-001 Finanzstatus anzeigen | Geändert | Ziele geändert, Notizen geändert, Schritt 5 geändert, und 6 weitere |
| BR-0108 Eigener Kontoname nur für Konten der angemeldeten Kundin | Neu | Neu in UC-001 |
| Vision | Geändert | Abschnitt „Ziele“ geändert, Abschnitt „Abgrenzung“ geändert |

## Akzeptanztests

- `acceptance/specs/finanzstatus.spec`: Das Vergeben eines eigenen Kontonamens ohne Anmeldung wird mit 401 beantwortet
- `acceptance/specs/finanzstatus.spec`: Die Kundin vergibt dem Tagesgeldkonto den eigenen Namen Urlaubskasse
- `acceptance/specs/finanzstatus.spec`: Ein eigener Name aus nur Leerzeichen wird mit 400 abgelehnt
- `acceptance/specs/finanzstatus.spec`: Ein Konto einer fremden IBAN lässt sich nicht benennen
- `acceptance/specs/finanzstatus.spec`: Ein leerer eigener Name wird mit 400 abgelehnt
- `acceptance/specs/finanzstatus.spec`: Ein unverändert gespeicherter eigener Name wird mit 200 bestätigt
- `acceptance/specs/finanzstatus.spec`: Ein zu langer eigener Name wird mit 400 abgelehnt
- `acceptance/specs/finanzstatus.spec`: Eine IBAN mit falscher Länge wird mit 400 abgelehnt
- `acceptance/specs/finanzstatus.spec`: Ohne vergebenen eigenen Namen bleibt die Spalte leer
- `acceptance/specs/finanzstatus.spec`: Ohne vergebenen eigenen Namen liefert der Dienst für das Konto eigenerName als null
- `acceptance/specs/finanzstatus.spec`: Zwei Konten dürfen denselben eigenen Namen tragen

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-26_

## Bausteine

- **Konten und Finanzstatus** (`src/konten.ts`): Attribut `eigenerName` am Konto im Speicher (ADR-002); der Reset legt die Konten aus dem Ausgangsstand neu an, danach trägt keines einen eigenen Namen. Neue Funktion `eigenenNamenSetzen` prüft und speichert, kennt kein HTTP.
- **Seitenauslieferung** (`src/main.ts`): Route `PUT /api/konten/{iban}/name` hinter dem Zugriffsschutz (NFR-001); Rumpf ohne gültiges JSON wird an dieser Route mit 400 beantwortet, ohne Sitzung bleibt es 401.
- **Oberfläche** (`public/seiten/finanzstatus.js`): Feld „Eigener Name“ an der Kontokarte, Knopf „Name vergeben“ je Konto, Seitenblatt „Eigenen Namen vergeben“ mit `Aventa.blatt`.
- **Akzeptanztests** (`acceptance/tests/StepImplementation.ts`): fehlende Steps.

## Schritte

1. UC-001 Schritt 5, Schema Konto: `GET /api/konten` liefert je Konto `eigenerName`, ohne vergebenen Namen `null`.
2. UC-001 A3/A4/A5, BR-0108, Konto.eigenerName, Konto.iban: `PUT /api/konten/{iban}/name` mit `{eigenerName}`. Prüfreihenfolge: 401 (Sitzung), 400 IBAN nach Entfernen der Leerzeichen nicht 22 Zeichen („Die IBAN muss 22 Zeichen lang sein.“), 404 Konto nicht unter der Kennung der Sitzung (BR-0108), 400 Name nach Trim leer, kein Text oder Rumpf ohne gültiges JSON („Bitte geben Sie den eigenen Namen an.“), 400 länger als 60 Zeichen. 200 mit dem Konto wie im Finanzstatus, auch bei unverändertem Namen. Gleicher Name an zwei Konten ist erlaubt; Kontoname, Art, IBAN, Saldo bleiben unverändert, keine TAN, keine Postfachnachricht.
3. UC-001 Schritt 9, A3 bis A5 in der Oberfläche: „Name vergeben“ an jeder Kontokarte öffnet das Blatt mit dem bisherigen Namen; Vorabprüfung im Browser (ADR-004), Ablehnung 400 am Feld im Blatt, 404 als Meldung über der Seite; nach dem Speichern neu laden mit „Eigener Name gespeichert.“. Die Karte zeigt den eigenen Namen in `data-feld="Eigener Name"`, die Liste nennt die Spalte in `data-felder`.
4. Unit-Tests für BR-0108 und die Feldregeln in `test/konten.test.ts`; fehlende Gauge-Steps für Blatt, PUT-Aufruf und `GET /api/konten`.

## Rahmenänderung

Keine neue Bibliothek, kein neues Muster.

## Entscheidungen

- Wo erscheint der eigene Kontoname im Finanzstatus: als zusätzliche Spalte neben dem Kontonamen oder an dessen Stelle?
  **Antwort:** Zusätzliche Spalte „Eigener Name“ neben „Kontoname“; ohne vergebenen Namen bleibt die Zelle leer.
  _→ eingearbeitet durch „UC-001: Eigenen Namen je Konto vergeben und im Finanzstatus zeigen“ in Konto, UC-001, BR-NEU1, GET /api/konten, PUT /api/konten/{iban}/name, Schema Konto, Schema KontonameEingabe, finanzstatus, NFR-001, NFR-003, NFR-004, vision_
- Dürfen zwei Konten derselben Kundin denselben eigenen Namen tragen?
  **Antwort:** Ja, gleiche eigene Namen sind erlaubt; die Konten bleiben über Art und IBAN unterscheidbar.
  _→ eingearbeitet durch „UC-001: Eigenen Namen je Konto vergeben und im Finanzstatus zeigen“ in Konto, UC-001, BR-NEU1, GET /api/konten, PUT /api/konten/{iban}/name, Schema Konto, Schema KontonameEingabe, finanzstatus, NFR-001, NFR-003, NFR-004, vision_
- Was passiert, wenn die Kundin im Blatt „Eigenen Namen vergeben“ den bisherigen eigenen Namen unverändert speichert oder nur Leerzeichen eingibt?
  **Antwort:** Unverändert speichern ist erlaubt und antwortet 200 mit „Eigener Name gespeichert.“; nur Leerzeichen ergibt nach dem Entfernen einen leeren Namen und damit 400 „Bitte geben Sie den eigenen Namen an.“.
  _→ eingearbeitet in UC-001, PUT /api/konten/{iban}/name · ca59002_
- Wie verhält sich PUT /api/konten/{iban}/name, wenn die IBAN im Pfad keine 22 Zeichen hat oder der Rumpf kein gültiges JSON ist?
  **Antwort:** Formatfehler nach Datenmodell: 400 mit der Meldung zum Feld, nichts gespeichert (wie bei leerem oder zu langem Namen).
  _→ eingearbeitet in UC-001, PUT /api/konten/{iban}/name · ca59002_
- Soll eigenerName ohne vergebenen Namen als null geliefert werden, als leere Zeichenkette oder das Feld ganz entfallen?
  **Antwort:** Als null; das Feld ist immer vorhanden (Marktstandard für ein Pflichtfeld ohne Wert).
  _→ eingearbeitet in GET /api/konten, Schema Konto, UC-001 · d7293c1_
