/* UC-016 Daueraufträge vom Girokonto verwalten: Regeln BR-0077 und BR-0078, je Kundin im Speicher (ADR-002).
   Die Daueraufträge werden nur verwaltet, nicht ausgeführt. */
import { randomUUID } from 'node:crypto';
import { finanzstatus } from './konten';
import { Auswahl, istDemokunde } from './kunden';
import { IBAN_FEHLER, MINDESTBETRAG_FEHLER, ibanGueltig, ibanNormal } from './ueberweisung';

export type Turnus = 'monatlich' | 'vierteljährlich' | 'jährlich';
export const TURNUS: readonly Turnus[] = ['monatlich', 'vierteljährlich', 'jährlich'];

export interface Dauerauftrag {
  dauerauftragId: string;
  auftraggeberIban: string;
  empfaenger: string;
  empfaengerIban: string;
  betrag: number;
  waehrung: 'EUR';
  verwendungszweck: string;
  turnus: Turnus;
  ersterAusfuehrungstag: string;
  /** Fehlt, wenn der Dauerauftrag unbefristet läuft. */
  enddatum?: string;
}

export const ANGABEN_FEHLER = 'Die Angaben zum Dauerauftrag sind unvollständig oder ungültig.';
export const TAG_VERGANGEN = 'Der erste Ausführungstag darf nicht in der Vergangenheit liegen.';
export const ENDE_VOR_BEGINN = 'Das Enddatum darf nicht vor dem ersten Ausführungstag liegen.';
export const NICHT_GEFUNDEN = 'Der Dauerauftrag existiert nicht mehr.';

/** Abgelehnte Anfrage mit dem Status, den der Vertrag nennt. */
export class Dauerauftragsfehler extends Error {
  constructor(readonly status: 400 | 404 | 422, meldung: string) { super(meldung); }
}

/** Je Kennung der Kundin ihre Daueraufträge (BR-0078). */
const bestand = new Map<string, Dauerauftrag[]>();

/** Heute als JJJJ-MM-TT in UTC (BR-0077), um ganze Tage verschoben. */
export const heute = (tage = 0, jetzt = new Date()): string =>
  new Date(Date.UTC(jetzt.getUTCFullYear(), jetzt.getUTCMonth(), jetzt.getUTCDate() + tage)).toISOString().slice(0, 10);

/** BR-0007: das Girokonto der Kundin ist das Auftraggeberkonto. */
function girokontoIban(kennung: string): string {
  const konto = finanzstatus(kennung).konten.find(k => k.art === 'Girokonto');
  if (!konto) throw new Error('Dauerauftrag: Kundin ohne Girokonto');
  return konto.iban;
}

/** Ausgangsstand: jonas.weber hat „Hausverwaltung Weber“ mit erstem Ausführungstag vor 30 Tagen; alle anderen keinen. */
const AUSGANGSSTAND: Record<string, () => Dauerauftrag[]> = {
  'jonas.weber': () => [{
    dauerauftragId: 'jw-d1', auftraggeberIban: girokontoIban('jonas.weber'), empfaenger: 'Hausverwaltung Weber',
    empfaengerIban: 'DE89370400440532013000', betrag: 650, waehrung: 'EUR', verwendungszweck: 'Miete',
    turnus: 'monatlich', ersterAusfuehrungstag: heute(-30),
  }],
};

/** Setzt die Daueraufträge der ausgewählten Kennungen auf den Ausgangsstand; ohne Auswahl die der Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const kennung of [...bestand.keys()]) if (auswahl(kennung)) bestand.delete(kennung);
  for (const [kennung, erzeugen] of Object.entries(AUSGANGSSTAND)) if (auswahl(kennung)) bestand.set(kennung, erzeugen());
}

const eigene = (kennung: string) => bestand.get(kennung) ?? [];

/** Nach erstem Ausführungstag aufsteigend, bei gleichem Tag nach Empfänger aufsteigend. */
export function liste(kennung: string): Dauerauftrag[] {
  return [...eigene(kennung)]
    .sort((a, b) => a.ersterAusfuehrungstag.localeCompare(b.ersterAusfuehrungstag)
      || a.empfaenger.localeCompare(b.empfaenger, 'de-DE', { sensitivity: 'base' }))
    .map(d => ({ ...d }));
}

export interface Eingabe {
  empfaenger?: unknown; empfaengerIban?: unknown; betrag?: unknown; verwendungszweck?: unknown;
  turnus?: unknown; ersterAusfuehrungstag?: unknown; enddatum?: unknown;
}

const angabenFehler = () => new Dauerauftragsfehler(400, ANGABEN_FEHLER);

/** Gültiger Kalendertag im Format JJJJ-MM-TT. */
function tagGueltig(wert: unknown): wert is string {
  if (typeof wert !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(wert)) return false;
  const d = new Date(`${wert}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === wert;
}

const text = (wert: unknown, max: number): string => {
  if (typeof wert !== 'string' || !wert.trim() || wert.trim().length > max) throw angabenFehler();
  return wert.trim();
};

type Felder = Omit<Dauerauftrag, 'dauerauftragId' | 'auftraggeberIban' | 'waehrung'>;

/** Pflicht und Format (400): zuerst die Feldregeln (A1), dann die IBAN (A2), dann der Mindestbetrag (A3). */
function felderPruefen(e: Eingabe): Felder {
  const empfaenger = text(e.empfaenger, 70);
  const verwendungszweck = text(e.verwendungszweck, 140);
  if (!TURNUS.includes(e.turnus as Turnus)) throw angabenFehler();
  if (!tagGueltig(e.ersterAusfuehrungstag)) throw angabenFehler();
  const ende = e.enddatum === undefined || e.enddatum === null || e.enddatum === '' ? undefined : e.enddatum;
  if (ende !== undefined && !tagGueltig(ende)) throw angabenFehler();
  const betrag = typeof e.betrag === 'number' && Number.isFinite(e.betrag) ? e.betrag : undefined;
  // Mehr als zwei Nachkommastellen: A1, es wird nicht gerundet.
  if (betrag !== undefined && Math.abs(betrag * 100 - Math.round(betrag * 100)) > 1e-6) throw angabenFehler();
  if (typeof e.empfaengerIban !== 'string' || !ibanGueltig(e.empfaengerIban)) throw new Dauerauftragsfehler(400, IBAN_FEHLER);
  if (betrag === undefined || betrag < 0.1) throw new Dauerauftragsfehler(400, MINDESTBETRAG_FEHLER);
  return {
    empfaenger, empfaengerIban: ibanNormal(e.empfaengerIban), betrag: Math.round(betrag * 100) / 100,
    verwendungszweck, turnus: e.turnus as Turnus, ersterAusfuehrungstag: e.ersterAusfuehrungstag,
    ...(ende !== undefined ? { enddatum: ende as string } : {}),
  };
}

/** BR-0077 (422): erster Ausführungstag nicht vor heute (beim Ändern nur bei Abweichung), Enddatum nicht davor. */
function tageAbPruefen(neu: Felder, gespeicherterTag?: string): void {
  if (neu.ersterAusfuehrungstag !== gespeicherterTag && neu.ersterAusfuehrungstag < heute()) throw new Dauerauftragsfehler(422, TAG_VERGANGEN);
  if (neu.enddatum !== undefined && neu.enddatum < neu.ersterAusfuehrungstag) throw new Dauerauftragsfehler(422, ENDE_VOR_BEGINN);
}

export function anlegen(kennung: string, eingabe: Eingabe): Dauerauftrag {
  const felder = felderPruefen(eingabe);
  tageAbPruefen(felder);
  const neu: Dauerauftrag = { dauerauftragId: randomUUID(), auftraggeberIban: girokontoIban(kennung), waehrung: 'EUR', ...felder };
  bestand.set(kennung, [...eigene(kennung), neu]);
  return { ...neu };
}

function eigener(kennung: string, id: unknown): Dauerauftrag {
  const d = eigene(kennung).find(x => x.dauerauftragId === id);
  if (!d) throw new Dauerauftragsfehler(404, NICHT_GEFUNDEN);
  return d;
}

/** Ersetzt die Angaben; Reihenfolge: Kennung (404), Pflicht und Format (400), BR-0077 (422). */
export function aendern(kennung: string, id: string, eingabe: Eingabe): Dauerauftrag {
  const alt = eigener(kennung, id);
  const felder = felderPruefen(eingabe);
  tageAbPruefen(felder, alt.ersterAusfuehrungstag);
  const neu: Dauerauftrag = { dauerauftragId: alt.dauerauftragId, auftraggeberIban: alt.auftraggeberIban, waehrung: 'EUR', ...felder };
  bestand.set(kennung, eigene(kennung).map(d => d === alt ? neu : d));
  return { ...neu };
}

/** Löscht endgültig; die Sicherheitsabfrage stellt die Seite (UC-016 A7). */
export function loeschen(kennung: string, id: string): void {
  const d = eigener(kennung, id);
  bestand.set(kennung, eigene(kennung).filter(x => x !== d));
}

zuruecksetzen();
