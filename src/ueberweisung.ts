/* UC-002 Überweisung vom Girokonto: Regeln BR-0003 bis BR-0007 und Mindestbetrag (A8), ausgeführt im Dienst.
   UC-002 A9 bis A11 und UC-017: Terminüberweisung vormerken, liefern und löschen (BR-0005, BR-0079, BR-0080). */
import { belasten, girokonto } from './konten';
import { Auswahl, istDemokunde, Kunde } from './kunden';
import { buchen } from './umsaetze';

/** Länderkennzeichen des SEPA-Raums (EWR, Schweiz, Vereinigtes Königreich, Monaco, San Marino, Andorra, Vatikan). */
const SEPA = new Set(('AD AT BE BG CH CY CZ DE DK EE ES FI FR GB GI GR HR HU IE IS IT LI LT LU LV MC MT NL NO PL PT RO SE SI SK SM VA').split(' '));

export const IBAN_FEHLER = 'Die IBAN ist ungültig oder gehört zu keinem SEPA-Land.';
export const BETRAG_FEHLER = 'Der Betrag übersteigt den verfügbaren Betrag des Girokontos.';
export const MINDESTBETRAG_FEHLER = 'Der Betrag muss mindestens 0,10 € betragen.';
export const AUSFUEHRUNGSTAG_FEHLER = 'Der Ausführungstag muss zwischen morgen und 365 Tagen ab heute liegen.';
export const DATUM_FEHLER = 'Der Ausführungstag ist kein gültiges Datum.';
export const KENNUNG_FEHLER = 'Diese Auftrags-Kennung wurde bereits verwendet.';
/** Feldregel Überweisung.betrag: mindestens 0,10 Euro, in Cent. */
const MINDESTBETRAG_CENT = 10;
/** BR-0079: der Ausführungstag liegt höchstens so viele Tage nach heute. */
const HOECHSTE_VORLAUFTAGE = 365;

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

export interface Terminueberweisungsauftrag extends Ueberweisungsauftrag {
  /** Kalendertag JJJJ-MM-TT */
  ausfuehrungstag: string;
}

export interface Terminueberweisung extends Terminueberweisungsauftrag {
  waehrung: 'EUR';
  status: 'vorgemerkt';
  /** Zeitpunkt der Vormerkung */
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

/** BR-0005: ausgeführte Aufträge je Kennung der Kundin nach Auftrags-Kennung; eine fremde Auftrags-Kennung liefert nichts zurück. */
const ausgefuehrt = new Map<string, Map<string, Ueberweisung>>();
/** UC-017, BR-0080: vorgemerkte Aufträge je Kennung der Kundin nach Auftrags-Kennung, in der Reihenfolge der Vormerkung; nie gekappt (ADR-002). */
const vorgemerkt = new Map<string, Map<string, Terminueberweisung>>();
/** BR-0005, ADR-003: Auftrags-Kennungen je Kundin, die eine Terminüberweisung verbraucht hat (vorgemerkt oder gelöscht); nie gekappt. */
const terminKennungen = new Map<string, Set<string>>();

/** Vergisst ausgeführte und vorgemerkte Aufträge der ausgewählten Kennungen; ohne Auswahl die der Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const ablage of [ausgefuehrt, vorgemerkt, terminKennungen]) {
    for (const kennung of [...ablage.keys()]) if (auswahl(kennung)) ablage.delete(kennung);
  }
}

/** Prüft Auftraggeberkonto (BR-0007), IBAN (BR-0003) und Mindestbetrag (A8); liefert das Girokonto und den Betrag in Cent. */
function pruefen(kennung: string, auftrag: Ueberweisungsauftrag) {
  const konto = girokonto(kennung, ibanNormal(auftrag.auftraggeberIban));
  if (!konto) throw new Ablehnung(403, 'Das Auftraggeberkonto ist kein Girokonto der Kundin.');
  if (!ibanGueltig(auftrag.empfaengerIban)) throw new Ablehnung(400, IBAN_FEHLER);
  const cent = Math.round(auftrag.betrag * 100);
  // UC-002 A8: Betrag unter dem Mindestbetrag (auch 0, negativ oder keine Zahl)
  if (!(cent >= MINDESTBETRAG_CENT)) throw new Ablehnung(400, MINDESTBETRAG_FEHLER);
  return { konto, cent };
}

/** BR-0004: höchstens der aktuelle verfügbare Betrag des Girokontos. */
function deckungPruefen(konto: { saldo: number; dispositionsrahmen: number }, cent: number): void {
  if (cent > Math.round((konto.saldo + konto.dispositionsrahmen) * 100)) throw new Ablehnung(422, BETRAG_FEHLER);
}

/**
 * Führt den Auftrag der Kundin genau einmal aus. `neu` ist false, wenn die Kennung schon gebucht war.
 * Mit Speichergrenze (nur Lastkunden) merkt sich der Dienst nur die jüngsten so vielen Auftrags-Kennungen.
 * BR-0005: Eine von einer Terminüberweisung verbrauchte Kennung lehnt er mit 422 ab.
 */
export function ausfuehren(kunde: Pick<Kunde, 'kennung' | 'speichergrenze'>, auftrag: Ueberweisungsauftrag): { neu: boolean; ueberweisung: Ueberweisung } {
  let eigene = ausgefuehrt.get(kunde.kennung);
  const frueher = eigene?.get(auftrag.auftragsId);
  if (frueher) return { neu: false, ueberweisung: frueher };
  if (terminKennungen.get(kunde.kennung)?.has(auftrag.auftragsId)) throw new Ablehnung(422, KENNUNG_FEHLER);
  const { konto, cent } = pruefen(kunde.kennung, auftrag);
  deckungPruefen(konto, cent);
  belasten(kunde.kennung, konto.iban, cent / 100);
  const ueberweisung: Ueberweisung = {
    ...auftrag, empfaengerIban: ibanNormal(auftrag.empfaengerIban), betrag: cent / 100,
    waehrung: 'EUR', status: 'ausgefuehrt', erfasstAm: new Date().toISOString(),
  };
  // BR-0012: genau ein Umsatz je Auftrag; Buchungstag ist der Tag der Ausführung (UTC), Saldo danach der geminderte Saldo.
  buchen(konto.iban, {
    buchungstag: ueberweisung.erfasstAm.slice(0, 10), gebuchtAm: ueberweisung.erfasstAm,
    gegenpartei: ueberweisung.empfaenger, verwendungszweck: ueberweisung.verwendungszweck,
    betrag: -ueberweisung.betrag, saldoDanach: girokonto(kunde.kennung, konto.iban)!.saldo,
  }, kunde.speichergrenze);
  if (!eigene) ausgefuehrt.set(kunde.kennung, eigene = new Map());
  eigene.set(auftrag.auftragsId, ueberweisung);
  if (kunde.speichergrenze !== undefined && eigene.size > kunde.speichergrenze) eigene.delete(eigene.keys().next().value!);
  return { neu: true, ueberweisung };
}

/** BR-0079: der heutige Kalendertag in Europe/Berlin als JJJJ-MM-TT. */
export function heute(jetzt: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(jetzt);
}

/** Der Kalendertag `tage` Tage nach `tag` (beide JJJJ-MM-TT). */
export function plusTage(tag: string, tage: number): string {
  const d = new Date(`${tag}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
}

/** Feldregel Überweisung.ausfuehrungstag: ein gültiger Kalendertag JJJJ-MM-TT (also kein 31.02.). */
export function gueltigerTag(tag: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(tag) && !Number.isNaN(Date.parse(`${tag}T00:00:00Z`)) && plusTage(tag, 0) === tag;
}

/**
 * UC-002 A9: merkt den Auftrag für den Ausführungstag vor. Bucht nichts, kein Umsatz, kein Tageslimit (A9 Schritt 2 und 3).
 * BR-0005: `neu` ist false bei der Wiederholung eines noch vorgemerkten Auftrags; jede andere verbrauchte Kennung lehnt er mit 422 ab.
 */
export function vormerken(kunde: Pick<Kunde, 'kennung'>, auftrag: Terminueberweisungsauftrag, jetzt: Date = new Date()): { neu: boolean; terminueberweisung: Terminueberweisung } {
  let eigene = vorgemerkt.get(kunde.kennung);
  const frueher = eigene?.get(auftrag.auftragsId);
  if (frueher) return { neu: false, terminueberweisung: frueher };
  let verbraucht = terminKennungen.get(kunde.kennung);
  if (verbraucht?.has(auftrag.auftragsId) || ausgefuehrt.get(kunde.kennung)?.has(auftrag.auftragsId)) throw new Ablehnung(422, KENNUNG_FEHLER);
  const { konto, cent } = pruefen(kunde.kennung, auftrag);
  if (!gueltigerTag(auftrag.ausfuehrungstag)) throw new Ablehnung(400, DATUM_FEHLER);
  deckungPruefen(konto, cent);
  // BR-0079: frühestens morgen, höchstens 365 Tage nach heute, gemessen am heutigen Tag in Europe/Berlin
  const tag = heute(jetzt);
  if (!(auftrag.ausfuehrungstag > tag && auftrag.ausfuehrungstag <= plusTage(tag, HOECHSTE_VORLAUFTAGE))) {
    throw new Ablehnung(422, AUSFUEHRUNGSTAG_FEHLER);
  }
  const terminueberweisung: Terminueberweisung = {
    ...auftrag, auftraggeberIban: konto.iban, empfaengerIban: ibanNormal(auftrag.empfaengerIban), betrag: cent / 100,
    waehrung: 'EUR', status: 'vorgemerkt', erfasstAm: jetzt.toISOString(),
  };
  if (!eigene) vorgemerkt.set(kunde.kennung, eigene = new Map());
  if (!verbraucht) terminKennungen.set(kunde.kennung, verbraucht = new Set());
  eigene.set(auftrag.auftragsId, terminueberweisung);
  verbraucht.add(auftrag.auftragsId);
  return { neu: true, terminueberweisung };
}

/** UC-017, BR-0080: vorgemerkte Aufträge der Kundin nach Ausführungstag, bei gleichem Tag der früher vorgemerkte zuerst. */
export function vorgemerkteAuftraege(kennung: string): Terminueberweisung[] {
  return [...(vorgemerkt.get(kennung)?.values() ?? [])].sort((a, b) => a.ausfuehrungstag.localeCompare(b.ausfuehrungstag));
}

/** UC-017, BR-0080: löscht den vorgemerkten Auftrag der Kundin endgültig; false, wenn sie keinen mit dieser Kennung hat. Die Kennung bleibt verbraucht. */
export function vorgemerktenLoeschen(kennung: string, auftragsId: string): boolean {
  return vorgemerkt.get(kennung)?.delete(auftragsId) ?? false;
}
