/* UC-003 Notiz zu einem Umsatz: speichern, überschreiben und löschen (BR-0106, BR-0107). Je Kundin im Speicher (ADR-002), kennt kein HTTP.
   Die Notiz hängt am gespeicherten Umsatz: Ein Reset legt die Umsätze neu an, danach trägt keiner eine Notiz,
   und bei Lastkunden fällt sie mit dem verdrängten Umsatz weg. */
import { kontoMitIban } from './konten';
import { Umsatz, umsatzMitId } from './umsaetze';

export const KONTO_FEHLER = 'Das Konto wurde nicht gefunden.';
export const UMSATZ_FEHLER = 'Der Umsatz wurde nicht gefunden.';
export const NOTIZ_FEHLER = 'Die Notiz wurde nicht gefunden.';
export const LEER_FEHLER = 'Die Notiz muss mindestens 1 Zeichen enthalten.';
export const LAENGE_FEHLER = 'Die Notiz darf höchstens 140 Zeichen lang sein.';
/** Umsatznotiz.text: Länge 1..140 nach dem Entfernen der Randleerzeichen. */
export const NOTIZ_MAX = 140;

export interface Notiz { text: string }

/** Abgelehnte Notiz mit dem Status, den der Vertrag dafür nennt. */
export class Notizfehler extends Error {
  constructor(readonly status: 400 | 404, meldung: string) { super(meldung); }
}

/** BR-0106: der Umsatz nur unter einem Konto der Kundin und nur unter diesem Konto; sonst 404 mit dem Text des Falls. */
function umsatzDerKundin(kennung: string, iban: string, umsatzId: string): Umsatz {
  const konto = kontoMitIban(kennung, iban);
  if (!konto) throw new Notizfehler(404, KONTO_FEHLER);
  const umsatz = umsatzMitId(konto.iban, umsatzId);
  if (!umsatz) throw new Notizfehler(404, UMSATZ_FEHLER);
  return umsatz;
}

/**
 * UC-003 Schritt 15: speichert den Text als Notiz des Umsatzes und überschreibt eine vorhandene (BR-0106).
 * Prüfreihenfolge Konto (404), Umsatz (404), Text (400, A15); der Text zählt ohne Randleerzeichen.
 */
export function speichern(kennung: string, iban: string, umsatzId: string, text: unknown): Notiz {
  const umsatz = umsatzDerKundin(kennung, iban, umsatzId);
  const notiz = typeof text === 'string' ? text.trim() : '';
  if (!notiz) throw new Notizfehler(400, LEER_FEHLER);
  if ([...notiz].length > NOTIZ_MAX) throw new Notizfehler(400, LAENGE_FEHLER);
  umsatz.notiz = notiz;
  return { text: notiz };
}

/** UC-003 Schritt 16: löscht die Notiz des Umsatzes; ohne Notiz 404 und nichts gelöscht (BR-0107, A18). */
export function loeschen(kennung: string, iban: string, umsatzId: string): void {
  const umsatz = umsatzDerKundin(kennung, iban, umsatzId);
  if (umsatz.notiz === undefined) throw new Notizfehler(404, NOTIZ_FEHLER);
  delete umsatz.notiz;
}
