/* UC-002 Überweisung vom Girokonto: Regeln BR-0003 bis BR-0007, ausgeführt im Dienst. */
import { belasten, girokonto } from './konten';
import { buchen } from './umsaetze';

/** Länderkennzeichen des SEPA-Raums (EWR, Schweiz, Vereinigtes Königreich, Monaco, San Marino, Andorra, Vatikan). */
const SEPA = new Set(('AD AT BE BG CH CY CZ DE DK EE ES FI FR GB GI GR HR HU IE IS IT LI LT LU LV MC MT NL NO PL PT RO SE SI SK SM VA').split(' '));

export const IBAN_FEHLER = 'Die IBAN ist ungültig oder gehört zu keinem SEPA-Land.';
export const BETRAG_FEHLER = 'Der Betrag übersteigt den verfügbaren Betrag des Girokontos.';

export interface Ueberweisungsauftrag {
  auftragsId: string;
  auftraggeberIban: string;
  empfaenger: string;
  empfaengerIban: string;
  betrag: number;
  verwendungszweck: string;
}

export interface Ueberweisung extends Ueberweisungsauftrag {
  waehrung: 'EUR';
  status: 'ausgefuehrt';
  erfasstAm: string;
}

export const ibanNormal = (iban: string) => iban.replace(/\s+/g, '').toUpperCase();

/** BR-0003: 15 bis 34 Stellen, Prüfziffer nach ISO 7064 MOD 97-10, Land im SEPA-Raum. */
export function ibanGueltig(eingabe: string): boolean {
  const iban = ibanNormal(eingabe);
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(iban) || !SEPA.has(iban.slice(0, 2))) return false;
  let rest = 0;
  for (const zeichen of iban.slice(4) + iban.slice(0, 4)) {
    for (const ziffer of /[A-Z]/.test(zeichen) ? String(zeichen.charCodeAt(0) - 55) : zeichen) rest = (rest * 10 + Number(ziffer)) % 97;
  }
  return rest === 1;
}

/** Abgelehnter Auftrag mit dem Status, den der Vertrag dafür nennt. */
export class Ablehnung extends Error {
  constructor(readonly status: 400 | 403 | 422, meldung: string) { super(meldung); }
}

/** BR-0005: ausgeführte Aufträge nach Auftrags-Kennung. */
const ausgefuehrt = new Map<string, Ueberweisung>();

export function zuruecksetzen(): void {
  ausgefuehrt.clear();
}

/** Führt den Auftrag genau einmal aus. `neu` ist false, wenn die Kennung schon gebucht war. */
export function ausfuehren(auftrag: Ueberweisungsauftrag): { neu: boolean; ueberweisung: Ueberweisung } {
  const frueher = ausgefuehrt.get(auftrag.auftragsId);
  if (frueher) return { neu: false, ueberweisung: frueher };
  const konto = girokonto(auftrag.auftraggeberIban);
  if (!konto) throw new Ablehnung(403, 'Das Auftraggeberkonto ist kein Girokonto der Kundin.');
  if (!ibanGueltig(auftrag.empfaengerIban)) throw new Ablehnung(400, IBAN_FEHLER);
  const cent = Math.round(auftrag.betrag * 100);
  if (!(cent > 0) || cent > Math.round((konto.saldo + konto.dispositionsrahmen) * 100)) throw new Ablehnung(422, BETRAG_FEHLER);
  belasten(konto.iban, cent / 100);
  const ueberweisung: Ueberweisung = {
    ...auftrag, empfaengerIban: ibanNormal(auftrag.empfaengerIban), betrag: cent / 100,
    waehrung: 'EUR', status: 'ausgefuehrt', erfasstAm: new Date().toISOString(),
  };
  // BR-0012: genau ein Umsatz je Auftrag; Buchungstag ist der Tag der Ausführung (UTC), Saldo danach der geminderte Saldo.
  buchen(konto.iban, {
    buchungstag: ueberweisung.erfasstAm.slice(0, 10), gebuchtAm: ueberweisung.erfasstAm,
    gegenpartei: ueberweisung.empfaenger, verwendungszweck: ueberweisung.verwendungszweck,
    betrag: -ueberweisung.betrag, saldoDanach: girokonto(konto.iban)!.saldo,
  });
  ausgefuehrt.set(auftrag.auftragsId, ueberweisung);
  return { neu: true, ueberweisung };
}
