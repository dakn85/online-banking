/* UC-003 Umsätze eines Kontos: Demo-Umsätze (C-001), Reihenfolge und Saldo danach (BR-0008), Filter (BR-0009, BR-0010, BR-0104), Seiten (BR-0105). */
import { randomUUID } from 'node:crypto';
import { ibansJeKennung, kontoMitIban } from './konten';
import { Auswahl, istDemokunde, istLastkunde, LAST_PRAEFIX } from './kunden';

export interface Umsatz {
  /** Kennung des Umsatzes, vom Dienst vergeben (1..36 Zeichen). */
  umsatzId: string;
  buchungstag: string;
  /** Zeitpunkt der Buchung in UTC; bei gleichem Buchungstag steht der jüngere oben (BR-0008). */
  gebuchtAm: string;
  gegenpartei: string;
  verwendungszweck: string;
  /** Eingang positiv, Ausgang negativ (BR-0009). */
  betrag: number;
  /** Kategorie aus der festen Liste (UC-019). */
  kategorie: Kategorie;
  waehrung: 'EUR';
  saldoDanach: number;
  /** UC-022: der Umsatz ist eine SEPA-Lastschrift; nur das Girokonto trägt solche (BR-0094). */
  sepaLastschrift: boolean;
  /** UC-022: die Lastschrift wurde zurückgegeben (BR-0094). */
  zurueckgegeben: boolean;
  /** UC-003, BR-0106: eigene Notiz der Kundin (Umsatznotiz.text, 1..140 Zeichen); fehlt, solange der Umsatz keine trägt (umsatznotiz.ts). */
  notiz?: string;
}

export const KATEGORIEN = ['Wohnen', 'Lebensmittel', 'Mobilität', 'Freizeit', 'Versicherungen', 'Gesundheit', 'Sonstiges'] as const;
export type Kategorie = typeof KATEGORIEN[number];

export type Richtung = 'alle' | 'eingang' | 'ausgang';

export interface Filter {
  suchtext?: string;
  von?: string;
  bis?: string;
  richtung?: Richtung;
  /** BR-0104: Betragshöhe ohne Vorzeichen in Euro, beide Grenzen eingeschlossen; fehlt eine, ist sie offen. */
  betragVon?: number;
  betragBis?: number;
  /** BR-0104: Kategorie aus der Werteliste; fehlt sie, schränkt sie nicht ein. */
  kategorie?: Kategorie;
}

/** BR-0105: Nummer der Trefferseite ab 1 und Treffer je Seite. */
export interface Seite { seite: number; seitengroesse: number }
export const SEITENGROESSE = 20;
/** BR-0105, UC-003 A14: Obergrenze der Seitengröße; eine größere angefragte Seitengröße begrenzt der Dienst darauf, ohne Fehler. */
export const SEITENGROESSE_MAX = 100;

export const ZEITRAUM_FEHLER = 'Der Zeitraum ist ungültig: von liegt nach bis.';
export const BETRAGSBEREICH_FEHLER = 'Der Betragsbereich ist ungültig: von liegt über bis.';

/** Ungültige Abfrage (Vertrag: 400). */
export class Abfragefehler extends Error {}

type Demo = Omit<Umsatz, 'umsatzId' | 'waehrung' | 'saldoDanach' | 'sepaLastschrift' | 'zurueckgegeben'> & { sepaLastschrift?: boolean };

/**
 * Demo-Umsätze je IBAN, neueste zuerst (C-001). Gegenparteien und Verwendungszwecke kommen in keinem Szenario
 * als Suchtext vor. Der Saldo danach ergibt sich rückwärts aus dem Kontosaldo: Der jüngste trägt ihn (BR-0008).
 */
const lastschriften = (): Demo[] => {
  const vormonat = letzterTagVormonat();
  return [
  // UC-022: Buchungstag relativ zum Tag des Resets (UTC): Vital am letzten Tag des Vormonats (in der Frist, nie im Monat des Resets), Zeitungsverlag darüber hinaus.
  { buchungstag: vormonat, gebuchtAm: `${vormonat}T08:00:00.000Z`, gegenpartei: 'Fitnessstudio Vital', verwendungszweck: 'Mitgliedsbeitrag', betrag: -29.9, kategorie: 'Freizeit', sepaLastschrift: true },
  { buchungstag: vorTagen(70), gebuchtAm: `${vorTagen(70)}T08:00:00.000Z`, gegenpartei: 'Zeitungsverlag Nord', verwendungszweck: 'Zeitungsabo', betrag: -14.9, kategorie: 'Freizeit', sepaLastschrift: true },
  ];
};
const GIRO_ALT: Demo[] = [
  { buchungstag: '2026-02-12', gebuchtAm: '2026-02-12T09:30:00.000Z', gegenpartei: 'Bäckerei Krause', verwendungszweck: 'Einkauf', betrag: -12, kategorie: 'Lebensmittel' },
  { buchungstag: '2026-02-10', gebuchtAm: '2026-02-10T07:15:00.000Z', gegenpartei: 'Energieversorgung Nord', verwendungszweck: 'Abschlag Februar', betrag: -86, kategorie: 'Wohnen' },
  { buchungstag: '2026-02-01', gebuchtAm: '2026-02-01T06:00:00.000Z', gegenpartei: 'Lindner Logistik GmbH', verwendungszweck: 'Gehalt Januar', betrag: 2640, kategorie: 'Sonstiges' },
  { buchungstag: '2026-01-28', gebuchtAm: '2026-01-28T14:20:00.000Z', gegenpartei: 'Hausverwaltung Berger', verwendungszweck: 'Miete Februar', betrag: -950, kategorie: 'Wohnen' },
];
const KARTE: Demo[] = [
  { buchungstag: '2026-02-11', gebuchtAm: '2026-02-11T18:45:00.000Z', gegenpartei: 'Buchhandlung Seitenweise', verwendungszweck: 'Kartenzahlung', betrag: -42.95, kategorie: 'Freizeit' },
  { buchungstag: '2026-02-05', gebuchtAm: '2026-02-05T12:10:00.000Z', gegenpartei: 'Reisebüro Fernweh', verwendungszweck: 'Bahnticket', betrag: -129.5, kategorie: 'Mobilität' },
  { buchungstag: '2026-02-02', gebuchtAm: '2026-02-02T08:00:00.000Z', gegenpartei: 'Aventa Bank', verwendungszweck: 'Ausgleich Abrechnung Januar', betrag: 500, kategorie: 'Sonstiges' },
];
/** UC-003 Notizen: Maria Schulz hat 25 Demo-Umsätze auf dem Girokonto, damit die Treffer zwei Seiten füllen (BR-0105). */
const MARIA_GIRO: Demo[] = ([
  ['2026-10-30', 'Stadtwerke Elbe', 'Abschlag Strom', -74, 'Wohnen'],
  ['2026-10-28', 'Supermarkt Frisch', 'Einkauf', -46.2, 'Lebensmittel'],
  ['2026-10-27', 'Apotheke am Markt', 'Rezeptgebühr', -10, 'Gesundheit'],
  ['2026-10-25', 'Verkehrsverbund Elbe', 'Monatskarte', -58, 'Mobilität'],
  ['2026-10-23', 'Kino Lichtspiel', 'Eintritt', -24, 'Freizeit'],
  ['2026-10-21', 'Supermarkt Frisch', 'Einkauf', -32.75, 'Lebensmittel'],
  ['2026-10-19', 'Haftpflicht Hanse', 'Jahresbeitrag', -64.9, 'Versicherungen'],
  ['2026-10-17', 'Wochenmarkt Altona', 'Obst und Gemüse', -18.4, 'Lebensmittel'],
  ['2026-10-15', 'Tankstelle Hafen', 'Tanken', -61.3, 'Mobilität'],
  ['2026-10-13', 'Sportverein Eintracht', 'Mitgliedsbeitrag', -15, 'Freizeit'],
  ['2026-10-11', 'Supermarkt Frisch', 'Einkauf', -27.6, 'Lebensmittel'],
  ['2026-10-09', 'Zahnarztpraxis Brandt', 'Eigenanteil', -45, 'Gesundheit'],
  ['2026-10-07', 'Hausverwaltung Kröger', 'Miete Oktober', -820, 'Wohnen'],
  ['2026-10-05', 'Buchladen Seeseite', 'Kartenzahlung', -21.9, 'Freizeit'],
  ['2026-10-03', 'Supermarkt Frisch', 'Einkauf', -39.15, 'Lebensmittel'],
  ['2026-10-01', 'Reederei Hansa GmbH', 'Gehalt September', 2480, 'Sonstiges'],
  ['2026-09-29', 'Stadtwerke Elbe', 'Abschlag Strom', -74, 'Wohnen'],
  ['2026-09-27', 'Supermarkt Frisch', 'Einkauf', -41.8, 'Lebensmittel'],
  ['2026-09-25', 'Verkehrsverbund Elbe', 'Monatskarte', -58, 'Mobilität'],
  ['2026-09-23', 'Theater am Hafen', 'Eintrittskarten', -48, 'Freizeit'],
  ['2026-09-21', 'Supermarkt Frisch', 'Einkauf', -29.4, 'Lebensmittel'],
  ['2026-09-19', 'Krankenkasse Hanse', 'Zusatzbeitrag', -12.5, 'Versicherungen'],
  ['2026-09-17', 'Bäckerei Sonnenschein', 'Einkauf', -8.6, 'Lebensmittel'],
  ['2026-09-07', 'Hausverwaltung Kröger', 'Miete September', -820, 'Wohnen'],
  ['2026-09-01', 'Reederei Hansa GmbH', 'Gehalt August', 2480, 'Sonstiges'],
] as const).map(([tag, gegenpartei, verwendungszweck, betrag, kategorie]) => ({
  buchungstag: tag, gebuchtAm: `${tag}T10:00:00.000Z`, gegenpartei, verwendungszweck, betrag, kategorie,
}));
/** Je Lastkonto so viele Ausgangsumsätze (architecture.md, Lastkunden; POST /api/test/lasttest/reset). */
export const LAST_UMSAETZE = 200;
/** Buchungstage der Lastumsätze: 1 bis LAST_TAGE Tage vor dem Tag des Resets, sicher innerhalb von sechs Monaten. */
const LAST_TAGE = 180;
/** Höhen der Ausgänge in Euro, von wenigen Euro bis in den vierstelligen Bereich, damit auch ein enger Betragsfilter Treffer hat. */
const LAST_AUSGAENGE = [2.5, 4.99, 8.4, 12, 19.9, 27.5, 39, 54.8, 75, 110, 189, 320, 640, 1250];
const LAST_GEGENPARTEI: Record<Kategorie, string> = {
  Wohnen: 'Hausverwaltung Lastweg', Lebensmittel: 'Supermarkt Lastmarkt', Mobilität: 'Verkehrsbetrieb Lastlinie', Freizeit: 'Freizeitpark Lastland',
  Versicherungen: 'Lastversicherung AG', Gesundheit: 'Apotheke Lastplatz', Sonstiges: 'Lastdienst GmbH',
};

/**
 * Ausgangsumsätze des Lastkunden mit dieser Nummer, neueste zuerst: Buchungstage gleichmäßig über die Tage vor dem Reset,
 * alle sieben Kategorien reihum (BR-0104), jeder zehnte ein Eingang, sonst Ausgänge mit gestreuten Beträgen (BR-0009).
 * Fest je Nummer, damit Lastläufe wiederholbar sind; Eingänge und Ausgänge halten sich ungefähr die Waage.
 */
export function lastumsaetze(nr: number): Demo[] {
  const liste: Demo[] = [];
  for (let k = 0; k < LAST_UMSAETZE; k++) {
    const position = k * LAST_TAGE / LAST_UMSAETZE; // 0 bis unter LAST_TAGE, mit k wachsend
    const tag = vorTagen(1 + Math.floor(position));
    // Innerhalb eines Tages bucht der ältere früher, damit die Reihenfolge nach BR-0008 der Erzeugung folgt.
    const minuten = 1430 - Math.round((position % 1) * 1400);
    const zeit = `${String(Math.floor(minuten / 60)).padStart(2, '0')}:${String(minuten % 60).padStart(2, '0')}`;
    const kategorie = KATEGORIEN[(k + nr) % KATEGORIEN.length];
    const streuung = (nr * 7919 + k * 104729) % 1000;
    const eingang = k % 10 === 3;
    const betrag = eingang ? 1200 + streuung : -LAST_AUSGAENGE[(k * 5 + nr) % LAST_AUSGAENGE.length];
    liste.push({
      buchungstag: tag, gebuchtAm: `${tag}T${zeit}:00.000Z`, kategorie, betrag,
      gegenpartei: eingang ? 'Lastarbeitgeber GmbH' : LAST_GEGENPARTEI[kategorie],
      verwendungszweck: eingang ? `Gutschrift ${LAST_UMSAETZE - k}` : `Lastumsatz ${LAST_UMSAETZE - k}`,
    });
  }
  return liste;
}

/** Lena und Jonas haben dieselben Demo-Umsätze auf ihren eigenen Konten; Lastkunden haben je LAST_UMSAETZE Lastumsätze. */
const DEMO: Record<string, { kennung: string; umsaetze: () => Demo[] }> = {
  DE02500105175407324911: { kennung: 'lena.hoffmann', umsaetze: () => [...lastschriften(), ...GIRO_ALT] },
  DE44500105175407325028: { kennung: 'lena.hoffmann', umsaetze: () => KARTE },
  DE61500105175407325013: { kennung: 'jonas.weber', umsaetze: () => [...lastschriften(), ...GIRO_ALT] },
  DE39500105175407325021: { kennung: 'jonas.weber', umsaetze: () => KARTE },
  DE16500105175407325047: { kennung: 'maria.schulz', umsaetze: () => MARIA_GIRO },
};

const runden = (betrag: number) => Math.round(betrag * 100) / 100;

/** Heutiger Kalendertag in UTC, JJJJ-MM-TT. */
export const heuteUtc = () => new Date().toISOString().slice(0, 10);
/** Der Kalendertag n Tage vor heute (UTC), JJJJ-MM-TT. */
function vorTagen(n: number): string {
  const d = new Date(`${heuteUtc()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Der letzte Tag des Vormonats des Resettags (UTC), JJJJ-MM-TT. */
function letzterTagVormonat(): string {
  const d = new Date(`${heuteUtc().slice(0, 8)}01T00:00:00Z`);
  d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}

/** Umsätze je IBAN in der Reihenfolge der Buchung. Jede IBAN gehört genau einer Kennung (konten.ts). */
const umsaetze = new Map<string, Umsatz[]>();
/** Alle Umsätze je IBAN ohne die Grenze der Lastkunden: Grundlage der Ausgabenanalyse (BR-0083). */
const alleUmsaetze = new Map<string, Umsatz[]>();

/** Ausgangsumsätze eines Kontos, neueste zuerst: Demo-Umsätze, beim Girokonto eines Lastkunden die Lastumsätze, sonst keine. */
function ausgangsumsaetze(kennung: string, iban: string): Demo[] {
  if (DEMO[iban]?.kennung === kennung) return DEMO[iban].umsaetze();
  if (istLastkunde(kennung)) return lastumsaetze(Number(kennung.slice(LAST_PRAEFIX.length)));
  return [];
}

/** Setzt die Umsätze der Konten der ausgewählten Kennungen auf den Ausgangsstand zurück. Ohne Auswahl die Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const [kennung, ibans] of ibansJeKennung()) {
    if (!auswahl(kennung)) continue;
    for (const iban of ibans) {
      let saldo = kontoMitIban(kennung, iban)?.saldo ?? 0;
      const mitSaldo: Umsatz[] = [];
      for (const u of ausgangsumsaetze(kennung, iban)) {
        mitSaldo.push({ ...u, umsatzId: randomUUID(), sepaLastschrift: u.sepaLastschrift ?? false, zurueckgegeben: false, waehrung: 'EUR', saldoDanach: runden(saldo) });
        saldo -= u.betrag;
      }
      // Gespeichert in der Reihenfolge der Buchung (älteste zuerst): Die Grenze der Lastkunden verdrängt so den ältesten Umsatz (buchen).
      mitSaldo.reverse();
      umsaetze.set(iban, mitSaldo);
      alleUmsaetze.set(iban, [...mitSaldo]);
    }
  }
}
zuruecksetzen();

/** BR-0012: der Umsatz einer ausgeführten Überweisung. Mit Grenze (nur Lastkunden) bleiben nur die jüngsten so vielen Umsätze. */
export function buchen(iban: string, umsatz: Omit<Umsatz, 'waehrung' | 'umsatzId' | 'sepaLastschrift' | 'zurueckgegeben'> & Partial<Pick<Umsatz, 'sepaLastschrift' | 'zurueckgegeben'>>, grenze?: number): Umsatz {
  // Dasselbe Objekt in beiden Listen, damit ein Rückgabestatus in beiden gilt.
  const neu: Umsatz = { sepaLastschrift: false, zurueckgegeben: false, ...umsatz, umsatzId: randomUUID(), waehrung: 'EUR' };
  let liste = umsaetze.get(iban);
  if (!liste) umsaetze.set(iban, liste = []);
  liste.push(neu);
  let alle = alleUmsaetze.get(iban);
  if (!alle) alleUmsaetze.set(iban, alle = []);
  alle.push(neu);
  if (grenze !== undefined && liste.length > grenze) liste.splice(0, liste.length - grenze);
  return { ...neu };
}

/** UC-022, UC-003 Notiz: der gespeicherte Umsatz dieses Kontos mit dieser Kennung (veränderbar), sonst nichts. */
export function umsatzMitId(iban: string, umsatzId: string): Umsatz | undefined {
  return umsaetze.get(iban)?.find(u => u.umsatzId === umsatzId);
}

export const EXPORT_LEER = 'Für diese Auswahl gibt es keine Umsätze zum Export.';

const csvText = (wert: string) => (/[;"\r\n]/.test(wert) ? `"${wert.replace(/"/g, '""')}"` : wert);
const csvBetrag = (betrag: number) => betrag.toFixed(2).replace('.', ',');
const csvTag = (tag: string) => tag.split('-').reverse().join('.');

/** UC-003, BR-0075: die Umsätze der Liste als CSV (UTF-8 mit BOM, Semikolon, CRLF); die Datei wird nicht gespeichert. */
export function csvAus(liste: Umsatz[]): string {
  const zeilen = ['Buchungstag;Gegenpartei;Verwendungszweck;Betrag;Saldo danach',
    ...liste.map(u => [csvTag(u.buchungstag), csvText(u.gegenpartei), csvText(u.verwendungszweck), csvBetrag(u.betrag), csvBetrag(u.saldoDanach)].join(';'))];
  return `﻿${zeilen.join('\r\n')}\r\n`;
}

const DATUM = /^\d{4}-\d{2}-\d{2}$/;
const BETRAG = /^\d+(\.\d+)?$/;
const GANZZAHL = /^[1-9]\d{0,8}$/;

const abfragewert = (abfrage: Record<string, unknown>, name: string) => (typeof abfrage[name] === 'string' ? (abfrage[name] as string).trim() : '');

/** Prüft die Abfrage (400 bei Fehlern) und gibt den Filter zurück (BR-0009, BR-0010, BR-0104). */
export function filterAus(abfrage: Record<string, unknown>): Filter {
  const wert = (name: string) => abfragewert(abfrage, name);
  const von = wert('von');
  const bis = wert('bis');
  const richtung = (wert('richtung') || 'alle').toLowerCase();
  for (const datum of [von, bis]) {
    if (datum && (!DATUM.test(datum) || Number.isNaN(Date.parse(`${datum}T00:00:00Z`)))) throw new Abfragefehler('Das Datum ist ungültig: erwartet JJJJ-MM-TT.');
  }
  if (!['alle', 'eingang', 'ausgang'].includes(richtung)) throw new Abfragefehler('Die Richtung ist ungültig: alle, eingang oder ausgang.');
  if (von && bis && von > bis) throw new Abfragefehler(ZEITRAUM_FEHLER);
  // BR-0104: Betragshöhe ohne Vorzeichen als Zahl in Euro; Grenzen in Cent verglichen (ADR-005).
  const [betragVon, betragBis] = ['betragVon', 'betragBis'].map(name => {
    const w = wert(name);
    if (!w) return undefined;
    if (!BETRAG.test(w) || !Number.isFinite(Number(w))) throw new Abfragefehler('Der Betrag ist ungültig: erwartet eine Zahl ab 0 in Euro.');
    return Number(w);
  });
  if (betragVon !== undefined && betragBis !== undefined && cent(betragVon) > cent(betragBis)) throw new Abfragefehler(BETRAGSBEREICH_FEHLER);
  // UC-003 A13: „Alle“ ist keine Kategorie; die Maske schickt den Parameter dann nicht mit.
  const kategorie = wert('kategorie');
  if (kategorie && !(KATEGORIEN as readonly string[]).includes(kategorie)) throw new Abfragefehler(`Die Kategorie ist ungültig: erwartet ${KATEGORIEN.join(', ')}.`);
  return {
    suchtext: wert('suchtext') || undefined, von: von || undefined, bis: bis || undefined, richtung: richtung as Richtung,
    betragVon, betragBis, kategorie: (kategorie || undefined) as Kategorie | undefined,
  };
}

/** BR-0105: Seite ab 1 und Seitengröße ab 1 aus der Abfrage, Vorgaben 1 und 20, Seitengröße höchstens 100 (A14); sonst Abfragefehler (400). */
export function seiteAus(abfrage: Record<string, unknown>): Seite {
  const zahl = (name: string, vorgabe: number) => {
    const w = abfragewert(abfrage, name);
    if (!w) return vorgabe;
    if (!GANZZAHL.test(w)) throw new Abfragefehler(`Der Parameter ${name} ist ungültig: erwartet eine ganze Zahl ab 1.`);
    return Number(w);
  };
  return { seite: zahl('seite', 1), seitengroesse: Math.min(zahl('seitengroesse', SEITENGROESSE), SEITENGROESSE_MAX) };
}

/** BR-0105: die Treffer der angefragten Seite in der Reihenfolge nach BR-0008 und die Gesamtzahl; hinter der letzten Seite keine Treffer. */
export function trefferseite<T>(treffer: T[], { seite, seitengroesse }: Seite): { umsaetze: T[]; gesamt: number } {
  const start = (seite - 1) * seitengroesse;
  return { umsaetze: treffer.slice(start, start + seitengroesse), gesamt: treffer.length };
}

const cent = (betrag: number) => Math.round(betrag * 100);

/** Umsätze eines Kontos der Kundin, neueste zuerst (BR-0008), gefiltert (BR-0009, BR-0010, BR-0104); `undefined`, wenn es das Konto bei ihr nicht gibt (BR-0011). */
export function umsaetzeVon(kennung: string, iban: string, filter: Filter = {}): Umsatz[] | undefined {
  const konto = kontoMitIban(kennung, iban);
  if (!konto) return undefined;
  const suche = filter.suchtext?.toLocaleLowerCase('de-DE');
  // Gleicher Zeitpunkt (zwei Buchungen in derselben Millisekunde): die später gebuchte oben.
  return (umsaetze.get(konto.iban) ?? []).map((u, nr) => ({ u, nr }))
    .filter(({ u }) => !suche || u.gegenpartei.toLocaleLowerCase('de-DE').includes(suche) || u.verwendungszweck.toLocaleLowerCase('de-DE').includes(suche))
    .filter(({ u }) => (!filter.von || u.buchungstag >= filter.von) && (!filter.bis || u.buchungstag <= filter.bis))
    .filter(({ u }) => filter.richtung === 'eingang' ? u.betrag > 0 : filter.richtung === 'ausgang' ? u.betrag < 0 : true)
    .filter(({ u }) => (filter.betragVon === undefined || Math.abs(cent(u.betrag)) >= cent(filter.betragVon))
      && (filter.betragBis === undefined || Math.abs(cent(u.betrag)) <= cent(filter.betragBis)))
    .filter(({ u }) => !filter.kategorie || u.kategorie === filter.kategorie)
    .sort((a, b) => b.u.buchungstag.localeCompare(a.u.buchungstag) || b.u.gebuchtAm.localeCompare(a.u.gebuchtAm) || b.nr - a.nr)
    .map(({ u }) => ({ ...u }));
}

export const MONAT_FEHLER = 'Der Monat ist ungültig: erwartet JJJJ-MM.';
const MONAT = /^[0-9]{4}-(0[1-9]|1[0-2])$/;

export interface Kategorieausgabe { kategorie: Kategorie; summe: number; anteil: number }
export interface Ausgabenanalyse { monat: string; gesamtausgaben: number; kategorien: Kategorieausgabe[] }

/** UC-019: Prüft den Monat, sonst Abfragefehler (400). Fehlender Monat gilt als ungültig. */
export function monatPruefen(monat: unknown): string {
  if (typeof monat !== 'string' || !MONAT.test(monat)) throw new Abfragefehler(MONAT_FEHLER);
  return monat;
}

/** UC-019, BR-0083: Ausgänge des Monats (BR-0009) je Kategorie, aus allen Umsätzen des Kontos ohne die Grenze von 200. */
export function ausgabenanalyse(iban: string, monat: string): Ausgabenanalyse {
  monatPruefen(monat);
  const cent = new Map<Kategorie, number>();
  for (const u of alleUmsaetze.get(iban) ?? []) {
    if (u.betrag >= 0 || !u.buchungstag.startsWith(monat)) continue;
    cent.set(u.kategorie, (cent.get(u.kategorie) ?? 0) + Math.round(-u.betrag * 100));
  }
  const gesamt = [...cent.values()].reduce((a, b) => a + b, 0);
  const kategorien = [...cent].map(([kategorie, c]) => ({ kategorie, summe: c / 100, anteil: Math.round(c * 1000 / gesamt) / 10 }))
    .sort((a, b) => b.summe - a.summe || a.kategorie.localeCompare(b.kategorie, 'de-DE'));
  return { monat, gesamtausgaben: gesamt / 100, kategorien };
}
