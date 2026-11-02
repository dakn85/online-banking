/* UC-004 Empfängervorlagen verwalten: Regeln BR-0013 bis BR-0016 und BR-0018, je Kundin im Speicher (ADR-002). */
import { randomUUID } from 'node:crypto';
import { IBAN_FEHLER, ibanGueltig, ibanNormal } from './ueberweisung';

export interface Empfaengervorlage {
  vorlagenId: string;
  name: string;
  empfaengerIban: string;
  /** BR-0018: fehlt, wenn die Vorlage keinen hat. */
  verwendungszweck?: string;
}

export const HOECHSTZAHL = 50;
export const NAME_FEHLT = 'Der Name der Vorlage fehlt.';
export const NAME_ZU_LANG = 'Der Name der Vorlage darf höchstens 70 Zeichen lang sein.';
export const ZWECK_ZU_LANG = 'Der Verwendungszweck darf höchstens 140 Zeichen lang sein.';
export const NAME_VERGEBEN = 'Eine Vorlage mit diesem Namen gibt es bereits.';
export const HOECHSTZAHL_ERREICHT = 'Sie haben die Höchstzahl von 50 Empfängervorlagen erreicht.';
export const NICHT_GEFUNDEN = 'Diese Empfängervorlage gibt es nicht.';

/** Abgelehnte Anfrage mit dem Status, den der Vertrag nennt. */
export class Vorlagenfehler extends Error {
  constructor(readonly status: 400 | 404 | 409 | 422, meldung: string) { super(meldung); }
}

/** Je Kennung der Kundin ihre Vorlagen (BR-0016). */
let vorlagen = new Map<string, Empfaengervorlage[]>();

/** Ausgangsstand: jonas.weber hat „Vorlage 1“ bis „Vorlage 50“, damit Höchstzahl und Namenskonflikt prüfbar sind; lena.hoffmann keine. */
export function zuruecksetzen(): void {
  vorlagen = new Map([['jonas.weber', Array.from({ length: HOECHSTZAHL }, (_, i) => ({
    vorlagenId: `jw-${i + 1}`, name: `Vorlage ${i + 1}`, empfaengerIban: 'DE89370400440532013000',
  }))]]);
}
zuruecksetzen();

/** BR-0013: verglichen ohne führende und folgende Leerzeichen und ohne Groß-/Kleinschreibung. */
const vergleichbar = (name: string) => name.trim().toLocaleLowerCase('de-DE');

const eigene = (kennung: string) => vorlagen.get(kennung) ?? [];

/** Nach Name aufsteigend. */
export function liste(kennung: string): Empfaengervorlage[] {
  return [...eigene(kennung)]
    .sort((a, b) => a.name.trim().localeCompare(b.name.trim(), 'de-DE', { numeric: true, sensitivity: 'base' }))
    .map(v => ({ ...v }));
}

function namePruefen(name: unknown): string {
  if (typeof name !== 'string' || !name.trim()) throw new Vorlagenfehler(400, NAME_FEHLT);
  if (name.length > 70) throw new Vorlagenfehler(400, NAME_ZU_LANG);
  return name;
}

/** BR-0018: leer oder nur Leerzeichen heißt kein Verwendungszweck. */
function zweckPruefen(zweck: unknown): string | undefined {
  if (zweck === undefined || zweck === null) return undefined;
  if (typeof zweck !== 'string') throw new Vorlagenfehler(400, ZWECK_ZU_LANG);
  if (!zweck.trim()) return undefined;
  if (zweck.length > 140) throw new Vorlagenfehler(400, ZWECK_ZU_LANG);
  return zweck;
}

/** Anlegen in der Reihenfolge von BR-0015: Pflicht und Format (400), Eindeutigkeit (409), Höchstzahl (422). */
export function anlegen(kennung: string, eingabe: { name?: unknown; empfaengerIban?: unknown; verwendungszweck?: unknown }): Empfaengervorlage {
  const name = namePruefen(eingabe.name);
  if (typeof eingabe.empfaengerIban !== 'string' || !ibanGueltig(eingabe.empfaengerIban)) throw new Vorlagenfehler(400, IBAN_FEHLER);
  const verwendungszweck = zweckPruefen(eingabe.verwendungszweck);
  const bestand = eigene(kennung);
  if (bestand.some(v => vergleichbar(v.name) === vergleichbar(name))) throw new Vorlagenfehler(409, NAME_VERGEBEN);
  if (bestand.length >= HOECHSTZAHL) throw new Vorlagenfehler(422, HOECHSTZAHL_ERREICHT);
  const vorlage: Empfaengervorlage = {
    vorlagenId: randomUUID(), name, empfaengerIban: ibanNormal(eingabe.empfaengerIban),
    ...(verwendungszweck !== undefined ? { verwendungszweck } : {}),
  };
  vorlagen.set(kennung, [...bestand, vorlage]);
  return { ...vorlage };
}

function eigeneVorlage(kennung: string, vorlagenId: string): Empfaengervorlage {
  const vorlage = eigene(kennung).find(v => v.vorlagenId === vorlagenId);
  if (!vorlage) throw new Vorlagenfehler(404, NICHT_GEFUNDEN);
  return vorlage;
}

/** BR-0013 beim Umbenennen: Konflikt nur mit einer anderen Vorlage; gespeichert wird die Eingabe. IBAN und Zweck bleiben. */
export function umbenennen(kennung: string, vorlagenId: string, neuerName: unknown): Empfaengervorlage {
  const vorlage = eigeneVorlage(kennung, vorlagenId);
  const name = namePruefen(neuerName);
  if (eigene(kennung).some(v => v.vorlagenId !== vorlagenId && vergleichbar(v.name) === vergleichbar(name))) throw new Vorlagenfehler(409, NAME_VERGEBEN);
  vorlage.name = name;
  return { ...vorlage };
}

/** Löscht endgültig; die Sicherheitsabfrage stellt die Seite (UC-004 A5). */
export function loeschen(kennung: string, vorlagenId: string): void {
  eigeneVorlage(kennung, vorlagenId);
  vorlagen.set(kennung, eigene(kennung).filter(v => v.vorlagenId !== vorlagenId));
}
