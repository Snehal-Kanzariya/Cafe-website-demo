/**
 * Generates styled placeholder JPEG images for every menu item.
 * Uses sharp (Astro's transitive dep) to render SVG → JPEG.
 *
 * Run:  node scripts/generate-menu-images.mjs
 */

import sharp from 'sharp';
import fs    from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';

const __dir  = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dir, '../public/images/menu');
fs.mkdirSync(outDir, { recursive: true });

// ── Image dimensions ──────────────────────────────────────────
const W = 800;
const H = 600;

// ── Item definitions ─────────────────────────────────────────
// bg1/bg2:  gradient stop colours
// accent:   radial glow tint
// label:    short display name
// sub:      category label (all-caps small text)
const items = [
  // Coffee
  { file: 'espresso',          label: 'Espresso Classico',     sub: 'Coffee',          bg1: '#1a0800', bg2: '#7c2d0a', accent: '#f59e0b' },
  { file: 'cortado',           label: 'Cortado',               sub: 'Coffee',          bg1: '#1c0903', bg2: '#92400e', accent: '#fbbf24' },
  { file: 'pour-over',         label: 'Pour Over',             sub: 'Coffee',          bg1: '#150600', bg2: '#78350f', accent: '#fcd34d' },
  { file: 'cold-brew',         label: 'Cold Brew',             sub: 'Coffee',          bg1: '#0b1220', bg2: '#1e3a5f', accent: '#93c5fd' },
  { file: 'flat-white',        label: 'Flat White',            sub: 'Coffee',          bg1: '#1e0d04', bg2: '#854d0e', accent: '#fde68a' },
  // Signature drinks
  { file: 'lavender-latte',    label: 'Honey Lavender Latte',  sub: 'Signature Drink', bg1: '#1e0a50', bg2: '#6d28d9', accent: '#c4b5fd' },
  { file: 'turmeric-latte',    label: 'Golden Turmeric Latte', sub: 'Signature Drink', bg1: '#2d1400', bg2: '#b45309', accent: '#fcd34d' },
  { file: 'rose-chai',         label: 'Rose Cardamom Chai',    sub: 'Signature Drink', bg1: '#2d0018', bg2: '#9d174d', accent: '#fbcfe8' },
  { file: 'matcha',            label: 'Ceremonial Matcha',     sub: 'Signature Drink', bg1: '#031a0d', bg2: '#166534', accent: '#86efac' },
  // Bakery
  { file: 'croissant',         label: 'Butter Croissant',      sub: 'Bakery',          bg1: '#3a1400', bg2: '#b45309', accent: '#fde68a' },
  { file: 'almond-croissant',  label: 'Almond Croissant',      sub: 'Bakery',          bg1: '#2e1200', bg2: '#a16207', accent: '#fef3c7' },
  { file: 'cardamom-bun',      label: 'Cardamom Bun',          sub: 'Bakery',          bg1: '#2a1600', bg2: '#92400e', accent: '#fed7aa' },
  { file: 'sourdough',         label: 'Sourdough Toast',       sub: 'Bakery',          bg1: '#301a00', bg2: '#b45309', accent: '#fef3c7' },
  // Desserts
  { file: 'tiramisu',          label: 'Espresso Tiramisu',     sub: 'Dessert',         bg1: '#150500', bg2: '#6b2300', accent: '#d6b99a' },
  { file: 'basque-cheesecake', label: 'Basque Cheesecake',     sub: 'Dessert',         bg1: '#2d0014', bg2: '#9f1239', accent: '#fda4af' },
  { file: 'financier',         label: 'Brown Butter Financier',sub: 'Dessert',         bg1: '#2a1000', bg2: '#b45309', accent: '#fde68a' },
  // Light bites
  { file: 'avocado-toast',     label: 'Smashed Avocado Toast', sub: 'Light Bite',      bg1: '#031a0c', bg2: '#166534', accent: '#bbf7d0' },
  { file: 'quiche',            label: 'Quiche Lorraine',       sub: 'Light Bite',      bg1: '#1e0f00', bg2: '#92400e', accent: '#fde68a' },
  { file: 'mezze',             label: 'Mezze Board',           sub: 'Light Bite',      bg1: '#0a2010', bg2: '#15803d', accent: '#a7f3d0' },
];

// ── SVG template ─────────────────────────────────────────────
function makeSVG({ label, sub, bg1, bg2, accent }) {
  // Split long labels onto two lines at the last space before 18 chars
  let line1 = label, line2 = '';
  if (label.length > 18) {
    const mid = label.lastIndexOf(' ', 18);
    if (mid > 0) {
      line1 = label.slice(0, mid);
      line2 = label.slice(mid + 1);
    }
  }

  const cy  = line2 ? 270 : 295; // shift name up if two lines
  const cy2 = cy + 54;

  return /* xml */ `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Main diagonal gradient -->
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>

    <!-- Centre radial glow -->
    <radialGradient id="glow" cx="50%" cy="42%" r="45%">
      <stop offset="0%"   stop-color="${accent}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>

    <!-- Subtle vignette around edges -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
      <stop offset="60%"  stop-color="black" stop-opacity="0"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.55"/>
    </radialGradient>

    <!-- Fine dot texture mask -->
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1" fill="white" fill-opacity="0.06"/>
    </pattern>
  </defs>

  <!-- Background layers -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- Outer decorative ring -->
  <circle cx="${W/2}" cy="${H/2 - 10}" r="210"
          fill="none" stroke="white" stroke-opacity="0.06" stroke-width="1"/>
  <circle cx="${W/2}" cy="${H/2 - 10}" r="168"
          fill="none" stroke="white" stroke-opacity="0.08" stroke-width="1"/>

  <!-- Inner accent disc -->
  <circle cx="${W/2}" cy="${H/2 - 10}" r="130"
          fill="${accent}" fill-opacity="0.07"/>

  <!-- Horizontal rule above text -->
  <line x1="${W/2 - 80}" y1="${cy - 46}"
        x2="${W/2 + 80}" y2="${cy - 46}"
        stroke="white" stroke-opacity="0.20" stroke-width="1"/>

  <!-- Main label — line 1 -->
  <text x="${W/2}" y="${cy}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="48" font-weight="bold"
        fill="white" fill-opacity="0.95"
        letter-spacing="0.5">${line1}</text>

  <!-- Main label — line 2 (only if label wraps) -->
  ${line2 ? `<text x="${W/2}" y="${cy2}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="48" font-weight="bold"
        fill="white" fill-opacity="0.95"
        letter-spacing="0.5">${line2}</text>` : ''}

  <!-- Sub / category -->
  <text x="${W/2}" y="${line2 ? cy2 + 52 : cy + 52}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="16" font-weight="400"
        fill="white" fill-opacity="0.45"
        letter-spacing="4">${sub.toUpperCase()}</text>

  <!-- Horizontal rule below text -->
  <line x1="${W/2 - 60}" y1="${line2 ? cy2 + 78 : cy + 78}"
        x2="${W/2 + 60}" y2="${line2 ? cy2 + 78 : cy + 78}"
        stroke="white" stroke-opacity="0.20" stroke-width="1"/>

  <!-- Branding watermark -->
  <text x="${W/2}" y="${H - 32}"
        text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif"
        font-size="14" font-style="italic"
        fill="white" fill-opacity="0.20"
        letter-spacing="2">Brewed &amp; Co.</text>

  <!-- Corner accents -->
  <line x1="24" y1="24"  x2="60" y2="24"  stroke="white" stroke-opacity="0.12" stroke-width="1"/>
  <line x1="24" y1="24"  x2="24" y2="60"  stroke="white" stroke-opacity="0.12" stroke-width="1"/>
  <line x1="${W-24}" y1="24"  x2="${W-60}" y2="24"  stroke="white" stroke-opacity="0.12" stroke-width="1"/>
  <line x1="${W-24}" y1="24"  x2="${W-24}" y2="60"  stroke="white" stroke-opacity="0.12" stroke-width="1"/>
  <line x1="24" y1="${H-24}" x2="60"     y2="${H-24}" stroke="white" stroke-opacity="0.12" stroke-width="1"/>
  <line x1="24" y1="${H-24}" x2="24"     y2="${H-60}" stroke="white" stroke-opacity="0.12" stroke-width="1"/>
  <line x1="${W-24}" y1="${H-24}" x2="${W-60}" y2="${H-24}" stroke="white" stroke-opacity="0.12" stroke-width="1"/>
  <line x1="${W-24}" y1="${H-24}" x2="${W-24}" y2="${H-60}" stroke="white" stroke-opacity="0.12" stroke-width="1"/>
</svg>`;
}

// ── Generate ─────────────────────────────────────────────────
let ok = 0, fail = 0;

for (const item of items) {
  const dest = path.join(outDir, `${item.file}.jpg`);
  try {
    const svg = makeSVG(item);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(dest);
    console.log(`  ✓  ${item.file}.jpg`);
    ok++;
  } catch (err) {
    console.error(`  ✗  ${item.file}.jpg  —  ${err.message}`);
    fail++;
  }
}

console.log(`\nDone: ${ok} created${fail ? `, ${fail} failed` : ''}`);
console.log(`Output: ${outDir}`);
