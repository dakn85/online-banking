/* UC-023 Persönliche Daten anzeigen und ändern: BR-0096, BR-0097, je Kundin im Speicher (ADR-002). Kennt kein HTTP. */
import { Auswahl, istDemokunde } from './kunden';
import { nachrichtAnlegen } from './nachrichten';

export interface Kundendaten {
  strasse: string;
  postleitzahl: string;
  ort: string;
  email: string;
  telefonnummer: string;
}

/** BR-0096: feste TAN (Mock) für alle Kundinnen und alle Änderungen. */
export const TAN = '123456';
export const TAN_FALSCH = 'Die TAN ist falsch. Die Änderung wurde nicht gespeichert.';

export const BETREFF = 'Ihre persönlichen Daten wurden geändert';
const ABSENDER = 'Aventa Bank';

/** Abgelehnte Änderung: 400 bei einer Feldregel (Meldung zum ersten verletzten Feld), 422 bei falscher TAN. */
export class Kundendatenfehler extends Error {
  constructor(readonly status: 400 | 422, meldung: string) { super(meldung); }
}

/** Ausgangsstand (UC-023 Notizen); Lastkunden haben Teststraße 1 in Berlin. */
const AUSGANGSSTAND: Record<string, Kundendaten> = {
  'lena.hoffmann': { strasse: 'Lindenallee 12', postleitzahl: '50667', ort: 'Köln', email: 'lena.hoffmann@example.org', telefonnummer: '+49 221 1234567' },
  'jonas.weber': { strasse: 'Hauptstraße 5', postleitzahl: '80331', ort: 'München', email: 'jonas.weber@example.org', telefonnummer: '+49 89 7654321' },
  'maria.schulz': { strasse: 'Elbchaussee 40', postleitzahl: '22763', ort: 'Hamburg', email: 'maria.schulz@example.org', telefonnummer: '+49 40 2345678' },
};
const lastkunde = (kennung: string): Kundendaten => ({
  strasse: 'Teststraße 1', postleitzahl: '10115', ort: 'Berlin', email: `${kennung}@example.org`, telefonnummer: '+49 30 1234567',
});

/** Geänderte Stände je Kennung; wer fehlt, hat den Ausgangsstand. */
const stand = new Map<string, Kundendaten>();

/** Setzt die Daten der ausgewählten Kennungen auf den Ausgangsstand; ohne Auswahl die der Demo-Kundinnen. */
export function zuruecksetzen(auswahl: Auswahl = istDemokunde): void {
  for (const kennung of [...stand.keys()]) if (auswahl(kennung)) stand.delete(kennung);
}

export function lesen(kennung: string): Kundendaten {
  return { ...(stand.get(kennung) ?? AUSGANGSSTAND[kennung] ?? lastkunde(kennung)) };
}

const bereinigt = (wert: unknown): string | undefined => (typeof wert === 'string' ? wert.trim() : undefined);

/** Feldregeln des Datenmodells (Kunde) auf den bereinigten Werten, in der Reihenfolge der Maske. */
function pruefen(b: Record<string, unknown>): { daten: Kundendaten; tan: string } {
  const strasse = bereinigt(b.strasse);
  const ort = bereinigt(b.ort);
  const email = bereinigt(b.email);
  const telefon = bereinigt(b.telefonnummer);
  const plz = typeof b.postleitzahl === 'string' ? b.postleitzahl : undefined;
  const tan = typeof b.tan === 'string' ? b.tan : undefined;
  const fehler = (meldung: string) => new Kundendatenfehler(400, meldung);
  if (!strasse) throw fehler('Bitte geben Sie Straße und Hausnummer an.');
  if (strasse.length > 100) throw fehler('Die Straße darf höchstens 100 Zeichen lang sein.');
  if (plz === undefined || !/^[0-9]{5}$/.test(plz)) throw fehler('Die Postleitzahl muss aus 5 Ziffern bestehen.');
  if (!ort) throw fehler('Bitte geben Sie den Ort an.');
  if (ort.length > 60) throw fehler('Der Ort darf höchstens 60 Zeichen lang sein.');
  if (!email || email.length < 3 || email.length > 254 || !/^[^@ ]+@[^@ ]+\.[^@ ]+$/.test(email)) throw fehler('Die E-Mail-Adresse ist ungültig.');
  if (!telefon || telefon.length < 6 || telefon.length > 20 || !/^\+?[0-9 /()-]+$/.test(telefon)) throw fehler('Die Telefonnummer ist ungültig.');
  if (tan === undefined || !/^[0-9]{6}$/.test(tan)) throw fehler('Die TAN muss aus 6 Ziffern bestehen.');
  return { daten: { strasse, postleitzahl: plz, ort, email, telefonnummer: telefon }, tan };
}

/** BR-0097: je geänderter Angabe ein Satz in fester Reihenfolge, ohne Werte. */
function geaendertText(alt: Kundendaten, neu: Kundendaten): string {
  const saetze: string[] = [];
  if (alt.strasse !== neu.strasse || alt.postleitzahl !== neu.postleitzahl || alt.ort !== neu.ort) saetze.push('Ihre Anschrift wurde geändert.');
  if (alt.email !== neu.email) saetze.push('Ihre E-Mail-Adresse wurde geändert.');
  if (alt.telefonnummer !== neu.telefonnummer) saetze.push('Ihre Telefonnummer wurde geändert.');
  return saetze.join(' ');
}

/** UC-023 Schritte 4 und 5: Felder prüfen (400), dann TAN (422, BR-0096), speichern und bei Änderung genau eine Nachricht (BR-0097). */
export function aendern(kennung: string, auftrag: unknown): Kundendaten {
  const { daten, tan } = pruefen(auftrag && typeof auftrag === 'object' ? auftrag as Record<string, unknown> : {});
  if (tan !== TAN) throw new Kundendatenfehler(422, TAN_FALSCH);
  const geaendert = geaendertText(lesen(kennung), daten);
  stand.set(kennung, daten);
  if (geaendert) nachrichtAnlegen(kennung, { absender: ABSENDER, betreff: BETREFF, text: geaendert });
  return lesen(kennung);
}
