/* UC-005 Dauerauftrag einrichten, ansehen und löschen: Regeln BR-0020 bis BR-0026, je Kundin im Speicher (ADR-002).
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
/* BR-0025 und BR-0026: Pflicht und Höchstlänge von Empfänger und Verwendungszweck. */
export const EMPFAENGER_FEHLT = 'Der Empfänger ist ein Pflichtfeld.';
export const EMPFAENGER_ZU_LANG = 'Der Empfänger darf höchstens 70 Zeichen lang sein.';
export const ZWECK_FEHLT = 'Der Verwendungszweck ist ein Pflichtfeld.';
export const ZWECK_ZU_LANG = 'Der Verwendungszweck darf höchstens 140 Zeichen lang sein.';
/* Diese Meldung nennt die Spezifikation nicht: erste Ausführung ohne Datum (leeres Feld der Maske) oder Auftrag ohne Auftraggeberkonto. */
export const UNVOLLSTAENDIG = 'Der Dauerauftrag ist unvollständig.';
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

/** BR-0023: Heute ist der Kalendertag in UTC, wie der Buchungstag in BR-0012; als JJJJ-MM-TT. */
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
 * BR-0025, BR-0026: Pflicht und Höchstlänge. Lauter Leerzeichen gelten als leer, die Länge zählt ohne Leerzeichen am Rand;
 * zurück kommt die Eingabe, wie sie ankam, denn gespeichert und angezeigt wird die Eingabe der Kundin.
 */
function pflichttext(wert: unknown, hoechstens: number, fehlt: string, zuLang: string): string {
  if (typeof wert !== 'string' || wert.trim() === '') throw new Dauerauftragsfehler(400, fehlt);
  if (wert.trim().length > hoechstens) throw new Dauerauftragsfehler(400, zuLang);
  return wert;
}

/**
 * Legt den Dauerauftrag an. Reihenfolge nach UC-005 Schritt 4 und 5: Empfänger (BR-0025), Verwendungszweck (BR-0026),
 * IBAN des Empfängers (BR-0020), Betrag (BR-0021), Ausführungstag (BR-0022), erste Ausführung (BR-0023), zuletzt das
 * Auftraggeberkonto (BR-0007, BR-0024). `heute` ist der Tag, ab dem die erste Ausführung liegen darf.
 */
export function anlegen(kennung: string, eingabe: Eingabe, heute: string = heuteUtc()): Dauerauftrag {
  const { auftraggeberIban, empfaengerIban, betrag, waehrung, ausfuehrungstag, ersteAusfuehrung } = eingabe;
  const empfaenger = pflichttext(eingabe.empfaenger, 70, EMPFAENGER_FEHLT, EMPFAENGER_ZU_LANG);
  const verwendungszweck = pflichttext(eingabe.verwendungszweck, 140, ZWECK_FEHLT, ZWECK_ZU_LANG);
  if (typeof empfaengerIban !== 'string' || !ibanGueltig(empfaengerIban)) throw new Dauerauftragsfehler(400, IBAN_FEHLER);
  // BR-0021: mindestens 0,01 Euro, in Euro, auf Cent gerundet (ADR-005). Der verfügbare Betrag des Girokontos spielt keine Rolle.
  if (typeof betrag !== 'number' || !Number.isFinite(betrag) || betrag < 0.01 || (waehrung !== undefined && waehrung !== 'EUR')) throw new Dauerauftragsfehler(400, BETRAG_FEHLER);
  if (typeof ausfuehrungstag !== 'number' || !Number.isInteger(ausfuehrungstag) || ausfuehrungstag < 1 || ausfuehrungstag > 28) throw new Dauerauftragsfehler(400, TAG_FEHLER);
  if (!istDatum(ersteAusfuehrung)) throw new Dauerauftragsfehler(400, UNVOLLSTAENDIG);
  if (ersteAusfuehrung < heute) throw new Dauerauftragsfehler(400, ERSTE_AUSFUEHRUNG_FEHLER);

  if (typeof auftraggeberIban !== 'string' || auftraggeberIban.trim() === '') throw new Dauerauftragsfehler(400, UNVOLLSTAENDIG);
  const konto = girokonto(ibanNormal(auftraggeberIban));
  if (!konto) throw new Dauerauftragsfehler(403, KONTO_FEHLER);

  laufendeNummer += 1;
  const dauerauftrag: Dauerauftrag = {
    dauerauftragsId: `DA-${heute.slice(0, 4)}-${String(laufendeNummer).padStart(5, '0')}`,
    auftraggeberIban: konto.iban, empfaenger, empfaengerIban: ibanNormal(empfaengerIban),
    betrag: Math.round(betrag * 100) / 100, waehrung: 'EUR', ausfuehrungstag, ersteAusfuehrung, verwendungszweck,
  };
  dauerauftraege.set(kennung, [...eigene(kennung), dauerauftrag]);
  return { ...dauerauftrag };
}

/** Löscht endgültig; die Sicherheitsabfrage stellt die Seite (UC-005 A7). Fremde oder unbekannte Kennung: 404 (BR-0024). */
export function loeschen(kennung: string, dauerauftragsId: string): void {
  if (!eigene(kennung).some(d => d.dauerauftragsId === dauerauftragsId)) throw new Dauerauftragsfehler(404, NICHT_GEFUNDEN);
  dauerauftraege.set(kennung, eigene(kennung).filter(d => d.dauerauftragsId !== dauerauftragsId));
}
