/* Zeichen der Aventa Bank und das Guillochen-Muster der Anmeldeseite (wie auf Banknoten). */
window.Marke = {
  zeichen(groesse = 36) {
    return `<svg class="marke__zeichen" width="${groesse}" height="${groesse}" viewBox="0 0 36 36" aria-hidden="true">
      <rect x="1" y="1" width="34" height="34" rx="9" fill="none" stroke="#c29a4b" stroke-width="1.6"/>
      <path d="M9.5 26 L18 9 L26.5 26" fill="none" stroke="#c29a4b" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M13.2 20.5 H22.8" stroke="#e6cf9d" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`;
  },
  guilloche(breite, hoehe) {
    // Hypotrochoiden um einen Mittelpunkt rechts unten, mit leicht versetzten Radien.
    const pfade = [];
    const cx = breite * 0.78, cy = hoehe * 0.62;
    for (let k = 0; k < 9; k++) {
      const R = 300 + k * 26, r = 47 + k * 3.2, d = 128 + k * 9;
      let p = '';
      for (let t = 0; t <= Math.PI * 2 * 7.05; t += 0.02) {
        const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
        const y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
        p += (p ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      pfade.push(`<path d="${p}" fill="none" stroke="${k % 3 === 0 ? '#c29a4b' : '#2f6d64'}" stroke-width="${k % 3 === 0 ? 0.7 : 0.55}" opacity="${k % 3 === 0 ? 0.55 : 0.6}"/>`);
    }
    return `<svg class="guilloche" viewBox="0 0 ${breite} ${hoehe}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${pfade.join('')}</svg>`;
  },
};
