/* Konten je Kundin (C-001: noch kein Kernbanksystem). Jedes Konto gehört genau einer Kennung; jede Abfrage nennt die Kennung der Sitzung. */
import { Auswahl, istDemokunde } from './kunden';

export type Kontoart = 'Girokonto' | 'Kreditkarte' | 'Tagesgeldkonto';

export interface Konto {
  kontoname: string;
  art: Kontoart;
  iban: string;
  saldo: number;
  waehrung: 'EUR';
  /** BR-0002: nur beim Girokonto, dort Pflicht. */
  dispositionsrahmen?: number;
  /** UC-001 A3: eigener Name der Kundin, 1..60 Zeichen ohne Randleerzeichen; fehlt, solange sie keinen vergeben hat. Nicht im Ausgangsstand. */
  eigenerName?: string;
}

/** Konto, wie es der Finanzstatus liefert: eigenerName immer vorhanden, ohne vergebenen Namen null. */
export type Kontoansicht = Omit<Konto, 'eigenerName'> & { eigenerName: string | null; verfuegbarerBetrag?: number };

/** Demo-Bestand je Kennung, Girokonto zuerst, dann Kreditkarte und Tagesgeldkonto (0,00 Euro, ohne Umsätze). Jonas hat eine eigene Kopie von Lenas Bestand mit eigenen IBANs. */
const DEMO: Record<string, Konto[]> = {
  'lena.hoffmann': [
    { kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE02500105175407324911', saldo: 2145.30, waehrung: 'EUR', dispositionsrahmen: 1000 },
    { kontoname: 'Kreditkarte', art: 'Kreditkarte', iban: 'DE44500105175407325028', saldo: -387.45, waehrung: 'EUR' },
    { kontoname: 'Tagesgeldkonto', art: 'Tagesgeldkonto', iban: 'DE97500105175407324947', saldo: 0, waehrung: 'EUR' },
  ],
  'jonas.weber': [
    { kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE61500105175407325013', saldo: 2145.30, waehrung: 'EUR', dispositionsrahmen: 1000 },
    { kontoname: 'Kreditkarte', art: 'Kreditkarte', iban: 'DE39500105175407325021', saldo: -387.45, waehrung: 'EUR' },
    { kontoname: 'Tagesgeldkonto', art: 'Tagesgeldkonto', iban: 'DE38500105175407325039', saldo: 0, waehrung: 'EUR' },
  ],
  // UC-003 Notizen: Maria Schulz hat nur ein Girokonto, mit 25 Demo-Umsätzen (umsaetze.ts).
  'maria.schulz': [
    { kontoname: 'Girokonto', art: 'Girokonto', iban: 'DE16500105175407325047', saldo: 1850, waehrung: 'EUR', dispositionsrahmen: 1000 },
  ],
};

/** Ausgangsstand je Kennung: die Demo-Kundinnen fest, Lastkunden kommen über `ausgangsstandSetzen` dazu. */
const ausgangsstand = new Map<string, readonly Konto[]>(Object.entries(DEMO));

/** Aktueller Bestand je Kennung. */
const konten = new Map<string, Konto[]>();

/** Setzt die Konten der ausgewählten Kennungen auf ihren Ausgangsstand; ohne Auswahl die Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const [kennung, bestand] of ausgangsstand) {
    if (auswahl(kennung)) konten.set(kennung, bestand.map(k => ({ ...k })));
  }
}
zuruecksetzen();

/** Legt den Ausgangsstand einer Kennung fest und setzt ihre Konten darauf. */
export function ausgangsstandSetzen(kennung: string, bestand: readonly Konto[]): void {
  ausgangsstand.set(kennung, bestand.map(k => ({ ...k })));
  konten.set(kennung, bestand.map(k => ({ ...k })));
}

/** Kennungen mit Konten und ihre IBANs, für das Zurücksetzen der Umsätze. */
export function ibansJeKennung(): [string, string[]][] {
  return [...ausgangsstand.keys()].map(kennung => [kennung, (konten.get(kennung) ?? []).map(k => k.iban)]);
}

const eigene = (kennung: string) => konten.get(kennung) ?? [];

/** Ein Girokonto ohne Dispositionsrahmen ist ein Datenfehler (Vertrag: 500). Die Meldung landet im Log und nennt nur Ort und Art, keinen Kontobezug (PK-9). */
export class Datenfehler extends Error {}

const runden = (betrag: number) => Math.round(betrag * 100) / 100;

/** Ein Konto für den Finanzstatus: verfügbarer Betrag beim Girokonto (BR-0002), eigener Name oder null (UC-001 Schritt 5). */
function ansicht(k: Konto): Kontoansicht {
  const basis = { ...k, eigenerName: k.eigenerName ?? null };
  if (k.art !== 'Girokonto') return basis;
  if (k.dispositionsrahmen === undefined) throw new Datenfehler('Finanzstatus: Girokonto ohne Dispositionsrahmen');
  return { ...basis, verfuegbarerBetrag: runden(k.saldo + k.dispositionsrahmen) };
}

/** UC-001: Konten der Kundin mit verfügbarem Betrag (BR-0002) und Gesamtvermögen (BR-0001). */
export function finanzstatus(kennung: string): { gesamtvermoegen: number; konten: Kontoansicht[] } {
  const bestand = eigene(kennung);
  return {
    gesamtvermoegen: runden(bestand.reduce((summe, k) => summe + k.saldo, 0)),
    konten: bestand.map(ansicht),
  };
}

export const NAME_LEER = 'Bitte geben Sie den eigenen Namen an.';
export const NAME_LAENGE = 'Der eigene Name darf höchstens 60 Zeichen lang sein.';
export const IBAN_LAENGE = 'Die IBAN muss 22 Zeichen lang sein.';
export const KONTO_FEHLT = 'Das Konto wurde nicht gefunden.';
/** Konto.eigenerName: Länge 1..60 nach dem Entfernen der Randleerzeichen. */
export const NAME_MAX = 60;

/** Abgelehnter eigener Name mit dem Status, den der Vertrag dafür nennt. */
export class Namensfehler extends Error {
  constructor(readonly status: 400 | 404, meldung: string) { super(meldung); }
}

/**
 * UC-001 A3 bis A5, BR-0108: setzt oder ändert den eigenen Namen eines Kontos der Kundin; unverändert speichern ist erlaubt.
 * Prüfreihenfolge IBAN-Länge (400), Konto unter der Kennung (404), Name leer oder länger als 60 Zeichen (400).
 * Kontoname, Art, IBAN und Saldo bleiben unverändert; zwei Konten dürfen denselben eigenen Namen tragen.
 */
export function eigenenNamenSetzen(kennung: string, iban: string, eigenerName: unknown): Kontoansicht {
  const gesucht = iban.replace(/\s+/g, '').toUpperCase();
  if (gesucht.length !== 22) throw new Namensfehler(400, IBAN_LAENGE);
  const konto = eigene(kennung).find(k => k.iban === gesucht);
  if (!konto) throw new Namensfehler(404, KONTO_FEHLT);
  const name = typeof eigenerName === 'string' ? eigenerName.trim() : '';
  if (!name) throw new Namensfehler(400, NAME_LEER);
  if ([...name].length > NAME_MAX) throw new Namensfehler(400, NAME_LAENGE);
  konto.eigenerName = name;
  return ansicht(konto);
}

/** BR-0007: das Girokonto der Kundin mit dieser IBAN, sonst nichts. */
export function girokonto(kennung: string, iban: string): (Konto & { dispositionsrahmen: number }) | undefined {
  const konto = eigene(kennung).find(k => k.art === 'Girokonto' && k.iban === iban);
  return konto && konto.dispositionsrahmen !== undefined ? konto as Konto & { dispositionsrahmen: number } : undefined;
}

/** BR-0011: ein Konto der Kundin mit dieser IBAN (Leerzeichen zählen nicht), sonst nichts; fremde Konten gibt es für sie nicht. */
export function kontoMitIban(kennung: string, iban: string): Konto | undefined {
  const gesucht = iban.replace(/\s+/g, '').toUpperCase();
  const konto = eigene(kennung).find(k => k.iban === gesucht);
  return konto && { ...konto };
}

/** BR-0006: den Saldo eines Kontos der Kundin um den Betrag mindern. */
export function belasten(kennung: string, iban: string, betrag: number): void {
  const konto = eigene(kennung).find(k => k.iban === iban);
  if (!konto) throw new Error('Belastung: Konto gehört nicht zur Kundin');
  konto.saldo = runden(konto.saldo - betrag);
}

/** BR-0095: den Saldo eines Kontos der Kundin um den Betrag erhöhen; gibt den neuen Saldo zurück. */
export function gutschreiben(kennung: string, iban: string, betrag: number): number {
  const konto = eigene(kennung).find(k => k.iban === iban);
  if (!konto) throw new Error('Gutschrift: Konto gehört nicht zur Kundin');
  konto.saldo = runden(konto.saldo + betrag);
  return konto.saldo;
}

/** Nur für Tests: Konten einer Kennung setzen, ohne den Ausgangsstand zu ändern. */
export function kontenSetzen(kennung: string, neu: Konto[]): void {
  konten.set(kennung, neu.map(k => ({ ...k })));
}

/** BR-0091: Saldo des Quellkontos mindern und Saldo des Zielkontos erhöhen, beides zusammen. Beide Konten gehören der Kundin (BR-0088). */
export function umbuchen(kennung: string, quellIban: string, zielIban: string, betrag: number): { quellSaldo: number; zielSaldo: number } {
  const quelle = eigene(kennung).find(k => k.iban === quellIban);
  const ziel = eigene(kennung).find(k => k.iban === zielIban);
  if (!quelle || !ziel || quelle === ziel) throw new Error('Umbuchung: Konten gehören nicht zur Kundin');
  quelle.saldo = runden(quelle.saldo - betrag);
  ziel.saldo = runden(ziel.saldo + betrag);
  return { quellSaldo: quelle.saldo, zielSaldo: ziel.saldo };
}
