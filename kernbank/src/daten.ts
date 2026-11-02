/*
  In-Memory-Daten der Kernbank. Jedes Modul, das Daten im Speicher hält,
  meldet hier an, wie es seinen Ausgangsstand wiederherstellt; der Testbetrieb
  (POST /api/test/reset) setzt so alles auf einmal zurück.
*/

const ruecksetzer: Array<() => void> = [];

export function beimZuruecksetzen(ruecksetzen: () => void): void {
  ruecksetzer.push(ruecksetzen);
}

export function allesZuruecksetzen(): void {
  for (const ruecksetzen of ruecksetzer) ruecksetzen();
}
