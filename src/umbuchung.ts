/* UC-021 Umbuchung zwischen eigenen Konten: BR-0088 bis BR-0092. Je Kundin im Speicher (ADR-002), kennt kein HTTP. */
import { kontoMitIban, umbuchen } from './konten';
import { Auswahl, istDemokunde, Kunde } from './kunden';
import { buchen } from './umsaetze';

export const PAARUNG_FEHLER = 'Eine Umbuchung ist nur zwischen Girokonto und Tagesgeldkonto möglich.';
export const GRENZE_FEHLER = 'Der Betrag übersteigt den verfügbaren Betrag des Quellkontos.';
export const MINDESTBETRAG_FEHLER = 'Der Betrag muss mindestens 0,10 € betragen.';
export const FORMAT_FEHLER = 'Der Auftrag ist ungültig.';
/** Feldregel Umbuchung.betrag: mindestens 0,10 Euro, in Cent. */
const MINDESTBETRAG_CENT = 10;

export interface Umbuchungsauftrag {
  auftragsId: string;
  quellIban: string;
  zielIban: string;
  betrag: number;
}

export interface Umbuchung extends Umbuchungsauftrag {
  waehrung: 'EUR';
  status: 'ausgefuehrt';
  erfasstAm: string;
}

/** Abgelehnter Auftrag mit dem Status, den der Vertrag dafür nennt. */
export class Umbuchungsfehler extends Error {
  constructor(readonly status: 400 | 403 | 422, meldung: string) { super(meldung); }
}

/** BR-0092: ausgeführte Umbuchungen je Kennung der Kundin nach Auftrags-Kennung, getrennt von den Überweisungen. */
const ausgefuehrt = new Map<string, Map<string, Umbuchung>>();

/** Vergisst die ausgeführten Umbuchungen der ausgewählten Kennungen; ohne Auswahl die der Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const kennung of [...ausgefuehrt.keys()]) if (auswahl(kennung)) ausgefuehrt.delete(kennung);
}

const iban = (wert: unknown) => typeof wert === 'string' ? wert.replace(/\s+/g, '').toUpperCase() : '';

/** Feldregeln der Anfrage (400): Auftrags-Kennung 1..36, IBANs 22 Stellen, Betrag mindestens 0,10 Euro. */
function formatPruefen(eingabe: Record<string, unknown>): Umbuchungsauftrag {
  const { auftragsId, betrag } = eingabe;
  const quellIban = iban(eingabe.quellIban);
  const zielIban = iban(eingabe.zielIban);
  if (typeof auftragsId !== 'string' || auftragsId.length < 1 || auftragsId.length > 36 || quellIban.length !== 22 || zielIban.length !== 22
    || typeof betrag !== 'number' || !Number.isFinite(betrag)) throw new Umbuchungsfehler(400, FORMAT_FEHLER);
  if (Math.round(betrag * 100) < MINDESTBETRAG_CENT) throw new Umbuchungsfehler(400, MINDESTBETRAG_FEHLER);
  return { auftragsId, quellIban, zielIban, betrag: Math.round(betrag * 100) / 100 };
}

/**
 * UC-021 Schritt 4: Prüfreihenfolge Format (400), Wiederholung (200 ohne weitere Prüfung, BR-0092), Zugehörigkeit (403, BR-0088),
 * Kontenpaarung (422, BR-0088), Betragsgrenze (422, BR-0089); dann Salden (BR-0091) und Umsatz je Konto (BR-0090).
 * `neu` ist false, wenn die Kennung dieser Kundin schon ausgeführt war.
 */
export function ausfuehren(kunde: Pick<Kunde, 'kennung' | 'speichergrenze'>, eingabe: Record<string, unknown>): { neu: boolean; umbuchung: Umbuchung } {
  const auftrag = formatPruefen(eingabe);
  let eigene = ausgefuehrt.get(kunde.kennung);
  const frueher = eigene?.get(auftrag.auftragsId);
  if (frueher) return { neu: false, umbuchung: frueher };
  const quelle = kontoMitIban(kunde.kennung, auftrag.quellIban);
  const ziel = kontoMitIban(kunde.kennung, auftrag.zielIban);
  if (!quelle || !ziel) throw new Umbuchungsfehler(403, 'Das Konto gehört nicht zur Kundin.');
  const paar = [quelle.art, ziel.art].sort().join();
  if (quelle.iban === ziel.iban || paar !== 'Girokonto,Tagesgeldkonto') throw new Umbuchungsfehler(422, PAARUNG_FEHLER);
  const cent = Math.round(auftrag.betrag * 100);
  // BR-0089: Girokonto Saldo plus Dispositionsrahmen (wie BR-0004), Tagesgeldkonto der Saldo
  const verfuegbar = quelle.saldo + (quelle.art === 'Girokonto' ? quelle.dispositionsrahmen ?? 0 : 0);
  if (cent > Math.round(verfuegbar * 100)) throw new Umbuchungsfehler(422, GRENZE_FEHLER);
  const { quellSaldo, zielSaldo } = umbuchen(kunde.kennung, quelle.iban, ziel.iban, cent / 100);
  const umbuchung: Umbuchung = { ...auftrag, betrag: cent / 100, waehrung: 'EUR', status: 'ausgefuehrt', erfasstAm: new Date().toISOString() };
  const umsatz = { buchungstag: umbuchung.erfasstAm.slice(0, 10), gebuchtAm: umbuchung.erfasstAm, verwendungszweck: 'Umbuchung', kategorie: 'Sonstiges' as const };
  buchen(quelle.iban, { ...umsatz, gegenpartei: ziel.kontoname, betrag: -umbuchung.betrag, saldoDanach: quellSaldo }, kunde.speichergrenze);
  buchen(ziel.iban, { ...umsatz, gegenpartei: quelle.kontoname, betrag: umbuchung.betrag, saldoDanach: zielSaldo }, kunde.speichergrenze);
  if (!eigene) ausgefuehrt.set(kunde.kennung, eigene = new Map());
  eigene.set(auftrag.auftragsId, umbuchung);
  if (kunde.speichergrenze !== undefined && eigene.size > kunde.speichergrenze) eigene.delete(eigene.keys().next().value!);
  return { neu: true, umbuchung };
}
