/* UC-003 Umsätze eines Kontos: Demo-Umsätze (C-001), Reihenfolge und Saldo danach (BR-0008), Filter (BR-0009, BR-0010). */
import { ibansJeKennung, kontoMitIban } from './konten';
import { Auswahl, istDemokunde } from './kunden';

export interface Umsatz {
  buchungstag: string;
  /** Zeitpunkt der Buchung in UTC; bei gleichem Buchungstag steht der jüngere oben (BR-0008). */
  gebuchtAm: string;
  gegenpartei: string;
  verwendungszweck: string;
  /** Eingang positiv, Ausgang negativ (BR-0009). */
  betrag: number;
  waehrung: 'EUR';
  saldoDanach: number;
}

export type Richtung = 'alle' | 'eingang' | 'ausgang';

export interface Filter {
  suchtext?: string;
  von?: string;
  bis?: string;
  richtung?: Richtung;
}

export const ZEITRAUM_FEHLER = 'Der Zeitraum ist ungültig: von liegt nach bis.';

/** Ungültige Abfrage (Vertrag: 400). */
export class Abfragefehler extends Error {}

type Demo = Omit<Umsatz, 'waehrung' | 'saldoDanach'>;

/**
 * Demo-Umsätze je IBAN, neueste zuerst (C-001). Gegenparteien und Verwendungszwecke kommen in keinem Szenario
 * als Suchtext vor. Der Saldo danach ergibt sich rückwärts aus dem Kontosaldo: Der jüngste trägt ihn (BR-0008).
 */
const GIRO: Demo[] = [
  { buchungstag: '2026-02-12', gebuchtAm: '2026-02-12T09:30:00.000Z', gegenpartei: 'Bäckerei Krause', verwendungszweck: 'Einkauf', betrag: -12 },
  { buchungstag: '2026-02-10', gebuchtAm: '2026-02-10T07:15:00.000Z', gegenpartei: 'Energieversorgung Nord', verwendungszweck: 'Abschlag Februar', betrag: -86 },
  { buchungstag: '2026-02-01', gebuchtAm: '2026-02-01T06:00:00.000Z', gegenpartei: 'Lindner Logistik GmbH', verwendungszweck: 'Gehalt Januar', betrag: 2640 },
  { buchungstag: '2026-01-28', gebuchtAm: '2026-01-28T14:20:00.000Z', gegenpartei: 'Hausverwaltung Berger', verwendungszweck: 'Miete Februar', betrag: -950 },
];
const KARTE: Demo[] = [
  { buchungstag: '2026-02-11', gebuchtAm: '2026-02-11T18:45:00.000Z', gegenpartei: 'Buchhandlung Seitenweise', verwendungszweck: 'Kartenzahlung', betrag: -42.95 },
  { buchungstag: '2026-02-05', gebuchtAm: '2026-02-05T12:10:00.000Z', gegenpartei: 'Reisebüro Fernweh', verwendungszweck: 'Bahnticket', betrag: -129.5 },
  { buchungstag: '2026-02-02', gebuchtAm: '2026-02-02T08:00:00.000Z', gegenpartei: 'Aventa Bank', verwendungszweck: 'Ausgleich Abrechnung Januar', betrag: 500 },
];
/** Lena und Jonas haben dieselben Demo-Umsätze auf ihren eigenen Konten; Lastkunden haben keine. */
const DEMO: Record<string, { kennung: string; umsaetze: Demo[] }> = {
  DE02500105175407324931: { kennung: 'lena.hoffmann', umsaetze: GIRO },
  DE44500105175407324955: { kennung: 'lena.hoffmann', umsaetze: KARTE },
  DE61500105175407325013: { kennung: 'jonas.weber', umsaetze: GIRO },
  DE39500105175407325021: { kennung: 'jonas.weber', umsaetze: KARTE },
};

const runden = (betrag: number) => Math.round(betrag * 100) / 100;

/** Umsätze je IBAN in der Reihenfolge der Buchung. Jede IBAN gehört genau einer Kennung (konten.ts). */
const umsaetze = new Map<string, Umsatz[]>();

/** Setzt die Umsätze der Konten der ausgewählten Kennungen zurück: Demo-Umsätze, sonst keine. Ohne Auswahl die Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const [kennung, ibans] of ibansJeKennung()) {
    if (!auswahl(kennung)) continue;
    for (const iban of ibans) {
      const demo = DEMO[iban]?.kennung === kennung ? DEMO[iban].umsaetze : [];
      let saldo = kontoMitIban(kennung, iban)?.saldo ?? 0;
      const mitSaldo: Umsatz[] = [];
      for (const u of demo) {
        mitSaldo.push({ ...u, waehrung: 'EUR', saldoDanach: runden(saldo) });
        saldo -= u.betrag;
      }
      umsaetze.set(iban, mitSaldo);
    }
  }
}
zuruecksetzen();

/** BR-0012: der Umsatz einer ausgeführten Überweisung. Mit Grenze (nur Lastkunden) bleiben nur die jüngsten so vielen Umsätze. */
export function buchen(iban: string, umsatz: Omit<Umsatz, 'waehrung'>, grenze?: number): void {
  let liste = umsaetze.get(iban);
  if (!liste) umsaetze.set(iban, liste = []);
  liste.push({ ...umsatz, waehrung: 'EUR' });
  if (grenze !== undefined && liste.length > grenze) liste.splice(0, liste.length - grenze);
}

const DATUM = /^\d{4}-\d{2}-\d{2}$/;

/** Prüft die Abfrage (400 bei Fehlern) und gibt den Filter zurück. */
export function filterAus(abfrage: Record<string, unknown>): Filter {
  const wert = (name: string) => (typeof abfrage[name] === 'string' ? (abfrage[name] as string).trim() : '');
  const von = wert('von');
  const bis = wert('bis');
  const richtung = (wert('richtung') || 'alle').toLowerCase();
  for (const datum of [von, bis]) {
    if (datum && (!DATUM.test(datum) || Number.isNaN(Date.parse(`${datum}T00:00:00Z`)))) throw new Abfragefehler('Das Datum ist ungültig: erwartet JJJJ-MM-TT.');
  }
  if (!['alle', 'eingang', 'ausgang'].includes(richtung)) throw new Abfragefehler('Die Richtung ist ungültig: alle, eingang oder ausgang.');
  if (von && bis && von > bis) throw new Abfragefehler(ZEITRAUM_FEHLER);
  return { suchtext: wert('suchtext') || undefined, von: von || undefined, bis: bis || undefined, richtung: richtung as Richtung };
}

/** Umsätze eines Kontos der Kundin, neueste zuerst (BR-0008), gefiltert (BR-0009, BR-0010); `undefined`, wenn es das Konto bei ihr nicht gibt (BR-0011). */
export function umsaetzeVon(kennung: string, iban: string, filter: Filter = {}): Umsatz[] | undefined {
  const konto = kontoMitIban(kennung, iban);
  if (!konto) return undefined;
  const suche = filter.suchtext?.toLocaleLowerCase('de-DE');
  // Gleicher Zeitpunkt (zwei Buchungen in derselben Millisekunde): die später gebuchte oben.
  return (umsaetze.get(konto.iban) ?? []).map((u, nr) => ({ u, nr }))
    .filter(({ u }) => !suche || u.gegenpartei.toLocaleLowerCase('de-DE').includes(suche) || u.verwendungszweck.toLocaleLowerCase('de-DE').includes(suche))
    .filter(({ u }) => (!filter.von || u.buchungstag >= filter.von) && (!filter.bis || u.buchungstag <= filter.bis))
    .filter(({ u }) => filter.richtung === 'eingang' ? u.betrag > 0 : filter.richtung === 'ausgang' ? u.betrag < 0 : true)
    .sort((a, b) => b.u.buchungstag.localeCompare(a.u.buchungstag) || b.u.gebuchtAm.localeCompare(a.u.gebuchtAm) || b.nr - a.nr)
    .map(({ u }) => ({ ...u }));
}
