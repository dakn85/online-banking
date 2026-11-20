# PK-64: Demo-Konten tragen gültige IBANs (Prüfziffer nach ISO 7064)

**Art:** Fehler · **Priorität:** Hoch · **Systeme:** Online-Banking

## Story

Als Privatkundin möchte ich, dass mein Girokonto und meine Kreditkarte eine IBAN mit gültiger Prüfziffer tragen (heute DE02 … 4931 und DE44 … 4955, beide ungültig), damit eine Überweisung an diese Konten nicht an der IBAN-Prüfung aus UC-002 scheitert und Testdaten, Datenmodell und Masken zur Regel passen.

## Änderungen

| Element | Änderung | Zusammenfassung |
|---|---|---|
| Konto | Geändert | Attribut iban geändert |
| Überweisung | Geändert | Attribut empfaengerIban geändert, Skizze geändert |
| Umbuchung | Geändert | Attribut quellIban geändert, Skizze geändert |
| Ausgabenanalyse | Geändert | Skizze geändert |
| Debitkarte | Geändert | Skizze geändert |
| Empfängervorlagen | Geändert | Skizze geändert |
| Finanzstatus | Geändert | Skizze geändert |
| Überweisung bestätigen | Geändert | Skizze geändert |
| Umsätze | Geändert | Skizze geändert |

## Akzeptanztests

- `acceptance/specs/debitkarte.spec`: GET Debitkarte 401: Der Abruf der Debitkarte ohne Anmeldung wird abgelehnt
- `acceptance/specs/debitkarte.spec`: GET Debitkarte 404: Zu einer Kreditkarte gibt es keine Debitkarte
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 400: Die endgültige Sperre ohne Sperrgrund wird abgelehnt
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 401: Das Sperren der Debitkarte ohne Anmeldung wird abgelehnt
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 404: Eine Kreditkarte lässt sich nicht sperren
- `acceptance/specs/debitkarte.spec`: PUT Debitkarte 409: Eine aktive Debitkarte lässt sich nicht entsperren
- `acceptance/specs/finanzstatus.spec`: Der Finanzstatus zeigt alle Konten mit IBAN und Saldo
- `acceptance/specs/kontoauszug.spec`: Der Kontoauszug wird als Datei mit festem Namen heruntergeladen
- `acceptance/specs/kontoauszug.spec`: Der Kontoauszug zeigt Anfangssaldo, Endsaldo und alle Umsätze des Monats, neueste zuerst
- `acceptance/specs/umbuchung.spec`: Die Schnittstelle lehnt dasselbe Konto als Quell- und Zielkonto mit 422 ab
- `acceptance/specs/umbuchung.spec`: Die Schnittstelle lehnt einen Betrag unter 0,10 € mit 400 ab
- `acceptance/specs/umbuchung.spec`: Die Schnittstelle prüft die Kontenpaarung vor der Betragsgrenze und nennt die Meldung zu BR-0088
- `acceptance/specs/umbuchung.spec`: Ein Quellkonto, das nicht zur Kundin gehört, wird abgelehnt
- `acceptance/specs/umbuchung.spec`: Eine wiederholte Anfrage mit derselben Auftrags-Kennung ändert die Salden nicht erneut
- `acceptance/specs/umsaetze.spec`: Die CSV-Datei ist UTF-8 mit BOM, durch Semikolon getrennt und nach dem Konto benannt

## Technischer Entwurf

_Platform Admin (Agent „coding laptop“), 2026-11-20_

**Bausteine:** Testdaten der Demo-Kundinnen (src/konten.ts, src/umsaetze.ts), Unit-Tests, StepImplementation der Akzeptanztests.

**Schritte**
1. Girokonto und Kreditkarte der Demo-Kundinnen bekommen neue Kontonummern mit gültiger Prüfziffer nach ISO 7064 MOD 97-10 (UC-002, BR-0003): DE02 5001 0517 5407 3249 11 und DE44 5001 0517 5407 3250 28. Nur die Prüfziffer zu reparieren hätte DE44 … 3249 31 ergeben, die IBAN des Empfängers „Stadtwerke Nord“.
2. Code, Unit-Tests, Specs und Steps nutzen die neuen Werte; Protokolle alter Stories unter docs/stories bleiben unverändert.
3. Neuer Unit-Test: jede IBAN der Demo-Konten besteht ibanGueltig (UC-002).

**Rahmen:** keine Änderung.

## Entscheidungen

- Sollen auch die Konten der übrigen Demo-Kundinnen und der Lastkunden (lasttest-001 …) gültige IBANs mit Prüfziffer nach ISO 7064 erhalten, oder gilt die Story nur für Lena Hoffmann?
  **Antwort:** Alle – ist schon erfüllt: Die Konten von Jonas Weber waren gültig, die Lastkunden-IBANs berechnet src/testdaten.ts über deutscheIban (2000 geprüft, alle gültig). DE44 5001 0517 5407 3249 31 (Hausverwaltung Weber) ist gültig, nachgerechnet. Das Beispiel der Konto-IBAN steht bewusst ohne Leerzeichen (22 Zeichen wie die Feldregel); keine weitere Änderung nötig.
  _→ ohne Änderung: Schon erfüllt: alle Demo- und Lastkunden-IBANs sind gültig, ein Unit-Test prüft das._
