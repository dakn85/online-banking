# PK-69: Schwachstelle: Betriebssystem im Image erneuern (alpine 3.24.1)

**Art:** Technik · **Priorität:** Hoch · **Systeme:** Online-Banking

## Story

Der Schwachstellen-Scan im Betrieb meldet für Online-Banking: Betriebssystem im Image erneuern (alpine 3.24.1). Dringlichkeit: Hoch.

## Befund

- 34 Schwachstellen, davon 5 hoch
- läuft in der ausgelieferten Version
- Betriebssystem des Images, nicht der eigene Code
- Updates vorhanden
- Läuft in test, Version 9943ad1: 1.2.6-r2, 1.3.2-r0, 3.5.7-r0

| Schwachstelle | Paket | installiert | behoben ab | Schwere |
| --- | --- | --- | --- | --- |
| CVE-2026-107891 | musl | 1.2.6-r2 | 1.2.6-r3 | hoch |
| CVE-2026-107891 | musl-utils | 1.2.6-r2 | 1.2.6-r3 | hoch |
| CVE-2026-85091 | zlib | 1.3.2-r0 | 1.3.2-r1 | hoch |
| CVE-2026-14456 | libcrypto3 | 3.5.7-r0 | 3.5.8-r0 | hoch |
| CVE-2026-14456 | libssl3 | 3.5.7-r0 | 3.5.8-r0 | hoch |
| CVE-2026-4738 | zlib | 1.3.2-r0 | 1.4-r0 | mittel |
| CVE-2026-18798 | libcrypto3 | 3.5.7-r0 | 3.5.8-r0 | mittel |
| CVE-2026-18798 | libssl3 | 3.5.7-r0 | 3.5.8-r0 | mittel |
| CVE-2026-63072 | libcrypto3 | 3.5.7-r0 | 3.5.8-r0 | mittel |
| CVE-2026-63072 | libssl3 | 3.5.7-r0 | 3.5.8-r0 | mittel |
| CVE-2026-63076 | libcrypto3 | 3.5.7-r0 | 3.5.8-r0 | mittel |
| CVE-2026-63076 | libssl3 | 3.5.7-r0 | 3.5.8-r0 | mittel |
| CVE-2026-107496 | libcrypto3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-107496 | libssl3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-88822 | libcrypto3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-88822 | libssl3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-88823 | libcrypto3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-88823 | libssl3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-95691 | libcrypto3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-95691 | libssl3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-95692 | libcrypto3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-95692 | libssl3 | 3.5.7-r0 | 3.5.9-r1 | mittel |
| CVE-2026-14457 | libcrypto3 | 3.5.7-r0 | 3.5.8-r0 | niedrig |
| CVE-2026-14457 | libssl3 | 3.5.7-r0 | 3.5.8-r0 | niedrig |
| CVE-2026-54874 | libcrypto3 | 3.5.7-r0 | 3.5.8-r0 | niedrig |

… und 9 weitere, siehe Betrieb → Schwachstellen.

## Einschätzung der KI

Unklar: Image-Pakete mit bekannten Lücken; Erreichbarkeit im eigenen Code ungeklärt

## Was zu tun ist

**Basisimage neu bauen, damit alpine 3.24.1 die Updates bekommt**

1. Im Dockerfile das Basisimage auf das aktuelle Tag derselben Linie heben (FROM …) und ohne Cache neu bauen. Betroffen: libcrypto3, libssl3, musl, musl-utils, zlib.
2. Gibt es noch kein neues Basisimage, im Dockerfile die Pakete aktualisieren (Alpine: apk upgrade --no-cache, Debian/Ubuntu: apt-get upgrade -y) und das als Übergang kennzeichnen.
3. Nachtest: Nach der Auslieferung prüft der Scan die laufende Version, und die Akzeptanztests des Systems laufen einmal vollständig. Erst wenn beides passt, gilt die Maßnahme als behoben.

## Akzeptanzkriterien

- Der Scan der ausgelieferten Version findet keine der Schwachstellen dieser Maßnahme mehr.
- Die Akzeptanztests des Systems laufen nach der Auslieferung vollständig und grün.
- Das fachliche Verhalten bleibt gleich; die Spezifikation ändert sich nicht.

## Aufgaben für die Umsetzung

- [ ] Fehlende Steps der Akzeptanztests mit Tag PK-69 implementieren
- [ ] Alle Akzeptanztests mit Tag PK-69 grün
