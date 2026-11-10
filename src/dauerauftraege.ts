/* UC-005 Dauerauftrag einrichten, ansehen und löschen: Regeln BR-0020 bis BR-0024, je Kundin im Speicher (ADR-002).
   Ein Dauerauftrag wird nur angelegt, gezeigt und gelöscht; ausgeführt und gebucht wird er in dieser Story nicht. */
import { girokonto } from './konten';
import { IBAN_FEHLER, ibanGueltig, ibanNormal } from './ueberweisung';

export interface Dauerauftrag {
  dauerauftragsId: string;
  auftraggeberIban: string;
  empfaenger: string;
  empfaengerIban: string;
  betrag: number;
  waehrung: 'EUR';
  /** BR-0022: Tag im Monat, 1 bis 28. */
  ausfuehrungstag: number;
  /** BR-0023: Datum JJJJ-MM-TT, beim Anlegen nicht vor dem heutigen Tag. */
  ersteAusfuehrung: string;
  verwendungszweck: string;
}

/** Was der Aufrufer schickt (Schema DauerauftragAnlegen); geprüft wird hier. */
export type Eingabe = { [feld in keyof Omit<Dauerauftrag, 'dauerauftragsId'>]?: unknown };

export const BETRAG_FEHLER = 'Der Betrag muss mindestens 0,01 Euro betragen.';
export const TAG_FEHLER = 'Der Ausführungstag liegt zwischen 1 und 28.';
export const ERSTE_AUSFUEHRUNG_FEHLER = 'Die erste Ausführung darf nicht in der Vergangenheit liegen.';
export const NICHT_GEFUNDEN = 'Der Dauerauftrag wurde nicht gefunden.';
/* Diese Meldungen nennt die Spezifikation nicht; die Oberfläche erreicht nur die erste (leeres Pflichtfeld). */
export const UNVOLLSTAENDIG = 'Der Dauerauftrag ist unvollständig.';
export const EMPFAENGER_ZU_LANG = 'Der Empfänger darf höchstens 70 Zeichen lang sein.';
export const ZWECK_ZU_LANG = 'Der Verwendungszweck darf höchstens 140 Zeichen lang sein.';
export const KONTO_FEHLER = 'Das Auftraggeberkonto ist kein Girokonto der Kundin.';

/** Abgelehnte Anfrage mit dem Status, den der Vertrag nennt. */
export class Dauerauftragsfehler extends Error {
  constructor(readonly status: 400 | 403 | 404, meldung: string) { super(meldung); }
}

/** Je Kennung der Kundin ihre Daueraufträge (BR-0024). */
let dauerauftraege = new Map<string, Dauerauftrag[]>();
let laufendeNummer = 0;

/** Ausgangsstand: keine Kundin hat Daueraufträge. */
export function zuruecksetzen(): void {
  dauerauftraege = new Map();
  laufendeNummer = 0;
}

/** Der heutige Kalendertag in UTC als JJJJ-MM-TT (Leitplanke Zeiten; wie der Buchungstag in BR-0012). */
export const heuteUtc = () => new Date().toISOString().slice(0, 10);

/** Ein Kalendertag JJJJ-MM-TT, den es gibt (kein 2026-02-30). */
function istDatum(wert: unknown): wert is string {
  if (typeof wert !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(wert)) return false;
  const zeit = Date.parse(`${wert}T00:00:00Z`);
  return !Number.isNaN(zeit) && new Date(zeit).toISOString().slice(0, 10) === wert;
}

const eigene = (kennung: string) => dauerauftraege.get(kennung) ?? [];

/** BR-0024: nur die Daueraufträge dieser Kundin, nach erster Ausführung aufsteigend; bei gleichem Tag in der Reihenfolge des Anlegens. */
export function liste(kennung: string): Dauerauftrag[] {
  return eigene(kennung)
    .map((d, i) => ({ d, i }))
    .sort((a, b) => a.d.ersteAusfuehrung.localeCompare(b.d.ersteAusfuehrung) || a.i - b.i)
    .map(({ d }) => ({ ...d }));
}

/**
 * Legt den Dauerauftrag an. Reihenfolge nach UC-005 Schritt 4 und 5: Pflichtangaben, IBAN des Empfängers (BR-0020),
 * Betrag (BR-0021), Ausführungstag (BR-0022), erste Ausführung (BR-0023), zuletzt das Auftraggeberkonto (BR-0007, BR-0024).
 * `heute` ist der Tag, ab dem die erste Ausführung liegen darf.
 */
export function anlegen(kennung: string, eingabe: Eingabe, heute: string = heuteUtc()): Dauerauftrag {
  const { auftraggeberIban, empfaenger, empfaengerIban, betrag, waehrung, ausfuehrungstag, ersteAusfuehrung, verwendungszweck } = eingabe;
  const text = (wert: unknown): wert is string => typeof wert === 'string' && wert.trim() !== '';
  if (!text(auftraggeberIban) || !text(empfaenger) || !text(verwendungszweck) || !istDatum(ersteAusfuehrung)) throw new Dauerauftragsfehler(400, UNVOLLSTAENDIG);
  if (empfaenger.trim().length > 70) throw new Dauerauftragsfehler(400, EMPFAENGER_ZU_LANG);
  if (verwendungszweck.trim().length > 140) throw new Dauerauftragsfehler(400, ZWECK_ZU_LANG);

  if (typeof empfaengerIban !== 'string' || !ibanGueltig(empfaengerIban)) throw new Dauerauftragsfehler(400, IBAN_FEHLER);
  // BR-0021: mindestens 0,01 Euro, in Euro, auf Cent gerundet (ADR-005). Der verfügbare Betrag des Girokontos spielt keine Rolle.
  if (typeof betrag !== 'number' || !Number.isFinite(betrag) || betrag < 0.01 || (waehrung !== undefined && waehrung !== 'EUR')) throw new Dauerauftragsfehler(400, BETRAG_FEHLER);
  if (typeof ausfuehrungstag !== 'number' || !Number.isInteger(ausfuehrungstag) || ausfuehrungstag < 1 || ausfuehrungstag > 28) throw new Dauerauftragsfehler(400, TAG_FEHLER);
  if (ersteAusfuehrung < heute) throw new Dauerauftragsfehler(400, ERSTE_AUSFUEHRUNG_FEHLER);

  const konto = girokonto(ibanNormal(auftraggeberIban));
  if (!konto) throw new Dauerauftragsfehler(403, KONTO_FEHLER);

  laufendeNummer += 1;
  const dauerauftrag: Dauerauftrag = {
    dauerauftragsId: `DA-${heute.slice(0, 4)}-${String(laufendeNummer).padStart(5, '0')}`,
    auftraggeberIban: konto.iban, empfaenger: empfaenger.trim(), empfaengerIban: ibanNormal(empfaengerIban),
    betrag: Math.round(betrag * 100) / 100, waehrung: 'EUR', ausfuehrungstag, ersteAusfuehrung, verwendungszweck: verwendungszweck.trim(),
  };
  dauerauftraege.set(kennung, [...eigene(kennung), dauerauftrag]);
  return { ...dauerauftrag };
}

/** Löscht endgültig; die Sicherheitsabfrage stellt die Seite (UC-005 A7). Fremde oder unbekannte Kennung: 404 (BR-0024). */
export function loeschen(kennung: string, dauerauftragsId: string): void {
  if (!eigene(kennung).some(d => d.dauerauftragsId === dauerauftragsId)) throw new Dauerauftragsfehler(404, NICHT_GEFUNDEN);
  dauerauftraege.set(kennung, eigene(kennung).filter(d => d.dauerauftragsId !== dauerauftragsId));
}
