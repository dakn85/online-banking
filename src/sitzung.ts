import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { Kunde, kundeMitKennung } from './kunden';

/* Sitzungen im Speicher, über ein HttpOnly-Cookie. Nach einem Neustart meldet man sich neu an. */

const COOKIE = 'aventa_sitzung';
const sitzungen = new Map<string, { kennung: string; seit: string }>();

export function anlegen(res: Response, kunde: Kunde): void {
  const id = randomUUID();
  sitzungen.set(id, { kennung: kunde.kennung, seit: new Date().toISOString() });
  res.cookie(COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/' });
}

export function beenden(req: Request, res: Response): void {
  const id = cookieWert(req);
  if (id) sitzungen.delete(id);
  res.clearCookie(COOKIE, { path: '/' });
}

export function alleBeenden(): void {
  sitzungen.clear();
}

export function angemeldeterKunde(req: Request): Kunde | undefined {
  const id = cookieWert(req);
  const sitzung = id ? sitzungen.get(id) : undefined;
  return sitzung ? kundeMitKennung(sitzung.kennung) : undefined;
}

/** Schützt Seiten (Umleitung zur Anmeldung) und API (401). */
export function nurAngemeldet(art: 'seite' | 'api') {
  return (req: Request, res: Response, next: NextFunction) => {
    const kunde = angemeldeterKunde(req);
    if (kunde) { res.locals.kunde = kunde; return next(); }
    if (art === 'seite') return res.redirect('/anmelden');
    res.status(401).json({ fehler: 'Bitte melden Sie sich an.' });
  };
}

function cookieWert(req: Request): string | undefined {
  const kopf = req.headers.cookie || '';
  const teil = kopf.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE + '='));
  return teil ? decodeURIComponent(teil.slice(COOKIE.length + 1)) : undefined;
}
