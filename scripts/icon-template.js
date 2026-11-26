'use strict';

/**
 * Plantilla de los iconos de lenguaje: página con el color de la familia y el
 * glifo o la sigla grande, para que se distinga a 16-24 px en el explorador.
 */

const CREAM = '#FBF3E2';
const INK = '#3B2A18';
const PAGE_PATH =
  'M38 14 H76 C78.7 14 81.2 15.4 82.6 17.7 L94 34 V108 C94 111.3 91.3 114 88 114 H38 C34.7 114 32 111.3 32 108 V20 C32 16.7 34.7 14 38 14 Z';

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function shade(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const target = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const mix = (v) => Math.round((target - v) * p + v);
  return '#' + [mix(r), mix(g), mix(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** Tinta legible sobre el color de la página. */
function inkFor(color) {
  const { r, g, b } = hexToRgb(color);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? INK : CREAM;
}

const GLYPHS = {
  atom: (_color, ink) => `
    <g stroke="${ink}" stroke-width="3" fill="none">
      <ellipse cx="64" cy="66" rx="19" ry="8"/>
      <ellipse cx="64" cy="66" rx="19" ry="8" transform="rotate(60 64 66)"/>
      <ellipse cx="64" cy="66" rx="19" ry="8" transform="rotate(120 64 66)"/>
    </g>
    <circle cx="64" cy="66" r="3.2" fill="${ink}"/>`,
  python: () => `
    <rect x="51" y="48" width="26" height="18" rx="9" fill="${CREAM}"/>
    <rect x="49" y="66" width="26" height="18" rx="9" fill="#F2C94C"/>
    <circle cx="70" cy="56" r="2.2" fill="#3F6E9E"/>
    <circle cx="58" cy="76" r="2.2" fill="#3F6E9E"/>`,
  gear: (color, ink) => {
    let teeth = '';
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      teeth += `<circle cx="${(64 + Math.cos(angle) * 16).toFixed(1)}" cy="${(66 + Math.sin(angle) * 16).toFixed(1)}" r="4.4"/>`;
    }
    return `
    <g fill="${ink}"><circle cx="64" cy="66" r="13"/>${teeth}</g>
    <circle cx="64" cy="66" r="5.2" fill="${shade(color, -0.18)}"/>`;
  },
  gopher: (color, ink) => `
    <circle cx="53" cy="54" r="5.4" fill="${ink}"/>
    <circle cx="75" cy="54" r="5.4" fill="${ink}"/>
    <circle cx="64" cy="68" r="15.5" fill="${ink}"/>
    <ellipse cx="64" cy="74" rx="9" ry="6.4" fill="#CDEAE4"/>
    <circle cx="60" cy="73" r="1.7" fill="${color}"/>
    <circle cx="68" cy="73" r="1.7" fill="${color}"/>
    <circle cx="58" cy="61" r="2" fill="${color}"/>
    <circle cx="70" cy="61" r="2" fill="${color}"/>`,
  gem: (color, ink) => `
    <path d="M48 61 L58 49 H70 L80 61 L64 84 Z" fill="${ink}"/>
    <g stroke="${shade(color, -0.32)}" stroke-width="1.8" fill="none" opacity="0.85">
      <path d="M48 61 H80"/>
      <path d="M58 49 L64 84"/>
      <path d="M70 49 L64 84"/>
      <path d="M58 49 L55 61 L64 84"/>
      <path d="M70 49 L73 61 L64 84"/>
    </g>`,
  braces: (_color, ink) => `
    <g stroke="${ink}" stroke-width="3.8" fill="none" stroke-linecap="round">
      <path d="M55 47 C49 47 51 61 46 66 C51 71 49 85 55 85"/>
      <path d="M73 47 C79 47 77 61 82 66 C77 71 79 85 73 85"/>
    </g>`,
  hash: (_color, ink) => `
    <g stroke="${ink}" stroke-width="4" stroke-linecap="round">
      <path d="M58 48 L54 84"/>
      <path d="M74 48 L70 84"/>
      <path d="M49 60 H80"/>
      <path d="M48 73 H79"/>
    </g>`,
  terminal: (_color, ink) => `
    <path d="M51 55 L61 66 L51 77" stroke="${ink}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M67 77 H81" stroke="${ink}" stroke-width="4.4" stroke-linecap="round"/>`,
  database: (_color, ink) => `
    <g stroke="${ink}" stroke-width="3.8" fill="none">
      <ellipse cx="64" cy="51" rx="17" ry="6.5"/>
      <path d="M47 51 V79 C47 84 55 87 64 87 C73 87 81 84 81 79 V51"/>
      <path d="M47 65 C47 70 55 73 64 73 C73 73 81 70 81 65"/>
    </g>`,
  sliders: (color, ink) => `
    <g stroke="${ink}" stroke-width="3.8" stroke-linecap="round">
      <path d="M48 55 H80"/>
      <path d="M48 66 H80"/>
      <path d="M48 77 H80"/>
    </g>
    <g fill="${ink}" stroke="${shade(color, -0.18)}" stroke-width="1.6">
      <circle cx="57" cy="55" r="4.6"/>
      <circle cx="72" cy="66" r="4.6"/>
      <circle cx="60" cy="77" r="4.6"/>
    </g>`,
  chevrons: (_color, ink) => `
    <g stroke="${ink}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M56 52 L45 66 L56 80"/>
      <path d="M72 52 L83 66 L72 80"/>
    </g>`,
  tags: (_color, ink) => `
    <g stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M55 52 L44 66 L55 80"/>
      <path d="M73 52 L84 66 L73 80"/>
      <path d="M67 49 L61 83"/>
    </g>`,
  vue: (_color, ink) => `<path d="M46 51 H58 L64 63 L70 51 H82 L64 83 Z" fill="${ink}"/>`,
  moon: (_color, ink) => `
    <path d="M72 46 C59 49 51 60 55 72 C59 84 72 89 81 82 C69 80 62 69 65 59 C66 54 69 49 72 46 Z" fill="${ink}"/>
    <circle cx="77" cy="55" r="2.2" fill="${ink}"/>`,
  bolt: (_color, ink) => `
    <path d="M68 45 L50 71 H61 L57 87 L79 59 H67 L73 45 Z" fill="${ink}"/>`,
  csharp: (_color, ink) => `
    <path d="M59 51 C50 51 45 58 45 66 C45 74 50 81 59 81" stroke="${ink}" stroke-width="4.2" fill="none" stroke-linecap="round"/>
    <g stroke="${ink}" stroke-width="3.2" stroke-linecap="round">
      <path d="M66 52 V80"/>
      <path d="M75 52 V80"/>
      <path d="M61 60 H79"/>
      <path d="M60 71 H78"/>
    </g>`,
  kotlin: (_color, ink) => `
    <path d="M48 49 H72 L48 73 Z" fill="${ink}"/>
    <path d="M48 73 L72 49 H82 L48 83 Z" fill="#E7D9F7"/>`,
  chip: (_color, ink) => `
    <rect x="51" y="53" width="26" height="26" rx="5" fill="none" stroke="${ink}" stroke-width="3.8"/>
    <g stroke="${ink}" stroke-width="3" stroke-linecap="round">
      <path d="M57 45 V53"/><path d="M64 45 V53"/><path d="M71 45 V53"/>
      <path d="M57 79 V87"/><path d="M64 79 V87"/><path d="M71 79 V87"/>
      <path d="M43 59 H51"/><path d="M43 66 H51"/><path d="M43 73 H51"/>
      <path d="M77 59 H85"/><path d="M77 66 H85"/><path d="M77 73 H85"/>
    </g>
    <circle cx="64" cy="66" r="4.2" fill="${ink}"/>`,
  containers: (_color, ink) => `
    <g fill="${ink}">
      <rect x="47" y="62" width="10" height="10" rx="2"/>
      <rect x="59" y="62" width="10" height="10" rx="2"/>
      <rect x="71" y="62" width="10" height="10" rx="2"/>
      <rect x="59" y="50" width="10" height="10" rx="2"/>
    </g>
    <path d="M47 79 C57 86 76 84 83 74" stroke="${ink}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
  branch: (_color, ink) => `
    <g stroke="${ink}" stroke-width="3.8" fill="none" stroke-linecap="round">
      <path d="M55 51 V82"/>
      <path d="M55 60 C55 70 74 66 74 74"/>
    </g>
    <circle cx="55" cy="48" r="5" fill="${ink}"/>
    <circle cx="55" cy="85" r="5" fill="${ink}"/>
    <circle cx="74" cy="77" r="5" fill="${ink}"/>`,
  image: (_color, ink) => `
    <rect x="46" y="50" width="36" height="32" rx="5" fill="none" stroke="${ink}" stroke-width="3.8"/>
    <circle cx="57" cy="61" r="3.8" fill="${ink}"/>
    <path d="M50 79 L61 66 L68 74 L74 68 L79 79 Z" fill="${ink}"/>`,
  video: (_color, ink) => `
    <rect x="45" y="51" width="38" height="30" rx="6" fill="none" stroke="${ink}" stroke-width="3.8"/>
    <path d="M59 59 L73 66 L59 73 Z" fill="${ink}"/>`,
  archive: (color, ink) => `
    <rect x="47" y="51" width="34" height="10" rx="3" fill="${ink}"/>
    <path d="M50 61 H78 V81 C78 84 76 86 73 86 H55 C52 86 50 84 50 81 Z" fill="${ink}"/>
    <rect x="60" y="68" width="8" height="8" rx="2" fill="${shade(color, -0.2)}"/>`,
  lock: (color, ink) => `
    <path d="M56 62 V56 C56 47 72 47 72 56 V62" stroke="${ink}" stroke-width="4.2" fill="none"/>
    <rect x="51" y="62" width="26" height="22" rx="4" fill="${ink}"/>
    <circle cx="64" cy="71" r="3.2" fill="${shade(color, -0.2)}"/>
    <rect x="62.5" y="71" width="3" height="6" rx="1.5" fill="${shade(color, -0.2)}"/>`,
  font: (_color, ink) => `
    <path d="M52 84 L64 48 L76 84" stroke="${ink}" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M57.5 70 H70.5" stroke="${ink}" stroke-width="4.6" stroke-linecap="round"/>`,
  table: (_color, ink) => `
    <rect x="47" y="51" width="34" height="30" rx="4" fill="none" stroke="${ink}" stroke-width="3.8"/>
    <g stroke="${ink}" stroke-width="3">
      <path d="M47 62 H81"/>
      <path d="M47 72 H81"/>
      <path d="M61 51 V81"/>
      <path d="M71 51 V81"/>
    </g>`,
  yaml: (_color, ink) => `
    <g fill="${ink}">
      <circle cx="50" cy="55" r="3"/><rect x="57" y="52.5" width="25" height="5" rx="2.5"/>
      <circle cx="50" cy="66" r="3"/><rect x="57" y="63.5" width="19" height="5" rx="2.5"/>
      <circle cx="50" cy="77" r="3"/><rect x="57" y="74.5" width="22" height="5" rx="2.5"/>
    </g>`,
};

function monogram(spec, ink) {
  const length = spec.label.length;
  const size = length >= 3 ? 26 : 40;
  return `<text x="64" y="65" text-anchor="middle" dominant-baseline="central" font-family="Segoe UI" font-weight="700" font-size="${size}" letter-spacing="${length >= 3 ? -0.8 : -0.5}" fill="${ink}">${spec.label}</text>`;
}

function buildSvg(spec) {
  const light = shade(spec.color, 0.18);
  const dark = shade(spec.color, -0.26);
  const fold = shade(spec.color, -0.4);
  const ink = inkFor(spec.color);
  const glyph = spec.glyph
    ? `<g transform="translate(64 66) scale(1.32) translate(-64 -66)">${GLYPHS[spec.glyph](spec.color, ink)}</g>`
    : monogram(spec, ink);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <defs>
    <linearGradient id="page" x1="32" y1="14" x2="94" y2="114" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${light}"/>
      <stop offset="0.55" stop-color="${spec.color}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.18"/>
      <stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="${PAGE_PATH}" transform="translate(0 3)" fill="#211A10" opacity="0.22"/>
  <path d="${PAGE_PATH}" fill="url(#page)"/>
  <path d="${PAGE_PATH}" fill="url(#gloss)"/>
  <path d="M76 14 L94 34 H82 C78.7 34 76 31.3 76 28 Z" fill="${fold}"/>
  <path d="M76 14 L94 34" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="1.6"/>
  <path d="${PAGE_PATH}" fill="none" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1.4"/>
  ${glyph.trim()}
</svg>
`;
}

module.exports = { buildSvg };
