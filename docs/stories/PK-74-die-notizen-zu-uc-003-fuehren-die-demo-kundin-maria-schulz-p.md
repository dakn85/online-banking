# PK-74: Die Notizen zu UC-003 führen die Demo-Kundin maria.schulz (PIN 11223, eigenes…

**Art:** Änderung · **Priorität:** Niedrig · **Systeme:** Online-Banking

## Story

Rückmeldung aus PK-73 (Platform Admin (Agent „coding laptop“)):
Die Notizen zu UC-003 führen die Demo-Kundin maria.schulz (PIN 11223, eigenes Girokonto, 25 Demo-Umsätze) ein, legen aber IBAN, Saldo, Rahmen, Kundennummer, persönliche Daten und die Umsätze selbst nicht fest. Im Code habe ich gewählt: Kundennummer K-105 316, Girokonto DE16 5001 0517 5407 3250 47 mit Saldo 1.850,00 € und Rahmen 1.000 €, keine Kreditkarte, kein Tagesgeldkonto, keine Debitkarte, keine Nachrichten. Die 25 Umsätze liegen zwischen 01.09.2026 und 30.10.2026, alle Kategorien kommen vor, darunter zwei Gehälter (Reederei Hansa GmbH, +2.480,00 €); den Saldo danach rechnet der Dienst rückwärts aus dem Kontosaldo (BR-0008). Persönliche Daten: Elbchaussee 40, 22763 Hamburg, maria.schulz@example.org, +49 40 2345678. Außerdem nennt docs/architecture.md (Testbetrieb und Daten je Kundin) bisher nur Lena und Jonas als Demo-Kundinnen.

Vorschlag: Datenmodell (Umsatz/Konto) bzw. UC-003 Notizen nennen Kontodaten und Umsätze von maria.schulz oder erklären sie ausdrücklich für frei wählbar; die Tabelle der Demo-Kundinnen in docs/architecture.md bekommt maria.schulz.
Element: usecase UC-003
Beleg: src/kunden.ts, src/konten.ts, src/umsaetze.ts (MARIA_GIRO), src/kundendaten.ts auf story/pk-73, Commit 651d99b

## Herkunft

Rückmeldung an PK-73 (Platform Admin (Agent „coding laptop“)).

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-74 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-74 grün
