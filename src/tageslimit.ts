/* UC-015 Tageslimit für Überweisungen festlegen: BR-0070, je Kundin im Speicher (ADR-002). Kennt kein HTTP. */
import { Auswahl, istDemokunde } from './kunden';

/** BR-0070: Standardlimit in Euro, für alle Kundinnen gleich und nicht änderbar. */
export const STANDARDLIMIT = 5000;
export const TAGESLIMIT_FEHLER = 'Das Tageslimit muss zwischen 0,00 EUR und 5.000,00 EUR liegen.';

export interface Tageslimit {
  tageslimit: number;
  standardlimit: number;
}

/** Abgelehntes Tageslimit (UC-015 A1); der Dienst antwortet mit 400. */
export class Tageslimitfehler extends Error {
  readonly status = 400;
  constructor() { super(TAGESLIMIT_FEHLER); }
}

/** Gesetzte Limits je Kennung; wer fehlt, hat das Standardlimit. */
const limits = new Map<string, number>();

/** Setzt das Tageslimit der ausgewählten Kennungen auf das Standardlimit; ohne Auswahl das der Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const kennung of [...limits.keys()]) if (auswahl(kennung)) limits.delete(kennung);
}

/** Aktuelles Tageslimit und Standardlimit der Kundin. Die Tageslimit-Prüfung der Überweisung (PK-12) misst gegen tageslimit. */
export function lesen(kennung: string): Tageslimit {
  return { tageslimit: limits.get(kennung) ?? STANDARDLIMIT, standardlimit: STANDARDLIMIT };
}

/** Kunde.tageslimit: Zahl von 0 bis zum Standardlimit mit höchstens zwei Nachkommastellen; sonst bleibt das Limit, wie es ist. */
export function setzen(kennung: string, wert: unknown): Tageslimit {
  if (typeof wert !== 'number' || !Number.isFinite(wert)) throw new Tageslimitfehler();
  const cent = Math.round(wert * 100);
  if (Math.abs(wert * 100 - cent) > 1e-6 || cent < 0 || cent > STANDARDLIMIT * 100) throw new Tageslimitfehler();
  limits.set(kennung, cent / 100);
  return lesen(kennung);
}
