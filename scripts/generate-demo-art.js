/**
 * Generates original, procedurally-drawn textile artwork (jewel-tone gradients,
 * temple-style borders, weave lattice, mandala motif) to use as demo product imagery.
 *
 * Why generated art and not real photos: scraping real product photography off
 * the web to embed in a storefront would reuse someone else's copyrighted images
 * without a license. This draws original vector art instead, then rasterizes it
 * to WebP with sharp — same "auto-compress to WebP" pipeline as real uploads.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT_DIR = path.join(__dirname, "..", "public", "uploads", "products", "demo");
fs.mkdirSync(OUT_DIR, { recursive: true });

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Temple-border: repeating triangles ("kumbam") with a dot between peaks.
function templeBorder(y, width, h, fill, count, flip = false) {
  const w = width / count;
  let tris = "";
  for (let i = 0; i < count; i++) {
    const x = i * w;
    const points = flip
      ? `${x},${y} ${x + w},${y} ${x + w / 2},${y - h}`
      : `${x},${y} ${x + w},${y} ${x + w / 2},${y + h}`;
    tris += `<polygon points="${points}" fill="${fill}" opacity="0.85"/>`;
    tris += `<circle cx="${x + w}" cy="${y}" r="3" fill="${fill}" opacity="0.5"/>`;
  }
  return tris;
}

// Diagonal lattice suggesting a woven brocade texture.
function weaveLattice(width, height, stroke, gap = 46) {
  let lines = "";
  for (let x = -height; x < width + height; x += gap) {
    lines += `<line x1="${x}" y1="0" x2="${x + height}" y2="${height}" stroke="${stroke}" stroke-width="1" opacity="0.08"/>`;
    lines += `<line x1="${x + height}" y1="0" x2="${x}" y2="${height}" stroke="${stroke}" stroke-width="1" opacity="0.08"/>`;
  }
  return lines;
}

// A simple mandala/rosette built from overlapping petals — reads as an
// embroidered medallion motif rather than an abstract blob.
function rosette(cx, cy, r, petals, fill, fillSoft, rotate = 0) {
  let petalShapes = "";
  for (let i = 0; i < petals; i++) {
    const angle = (360 / petals) * i + rotate;
    petalShapes += `<ellipse cx="${cx}" cy="${cy - r * 0.55}" rx="${r * 0.22}" ry="${r * 0.55}"
      fill="${fill}" opacity="0.85" transform="rotate(${angle} ${cx} ${cy})"/>`;
  }
  return `
    <g>
      ${petalShapes}
      <circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="${fillSoft}" opacity="0.95"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.22}" fill="none" stroke="${fill}" stroke-width="2" opacity="0.6"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.95}" fill="none" stroke="${fill}" stroke-width="1.5" opacity="0.35"/>
    </g>`;
}

function buildSVG({ width, height, bgFrom, bgTo, accent, accentSoft, seed, mirrored = false }) {
  const rand = mulberry32(seed);
  const cx = width / 2;
  const cy = height * (mirrored ? 0.38 : 0.46);

  const smallRosettes = [
    [width * 0.2, height * 0.72, 70],
    [width * 0.8, height * 0.68, 60],
    [width * 0.5, height * 0.88, 50],
  ]
    .map(([x, y, r], i) => rosette(x, y, r, 8, accentSoft, accent, i * 12 + rand() * 6))
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bgFrom}"/>
        <stop offset="100%" stop-color="${bgTo}"/>
      </linearGradient>
      <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12"/>
        <stop offset="30%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.16"/>
      </linearGradient>
      <radialGradient id="vign" cx="50%" cy="42%" r="70%">
        <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.22"/>
      </radialGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    ${weaveLattice(width, height, accentSoft)}

    <rect x="0" y="52" width="${width}" height="6" fill="${accent}" opacity="0.5"/>
    ${templeBorder(84, width, 30, accent, 18)}
    <rect x="0" y="${height - 58}" width="${width}" height="6" fill="${accent}" opacity="0.5"/>
    ${templeBorder(height - 84, width, 30, accent, 18, true)}

    ${rosette(cx, cy, 150, 10, accent, accentSoft, rand() * 10)}
    ${smallRosettes}

    <rect width="${width}" height="${height}" fill="url(#vign)"/>
    <rect width="${width}" height="${height}" fill="url(#sheen)"/>
  </svg>`;
}

const PALETTES = {
  "maroon-gold": { bgFrom: "#5c1a2b", bgTo: "#7a2438", accent: "#e3b45a", accentSoft: "#f0d38b" },
  "emerald-gold": { bgFrom: "#0f3d34", bgTo: "#155444", accent: "#dfc06a", accentSoft: "#efd996" },
  "royal-silver": { bgFrom: "#1c2b52", bgTo: "#2a3d73", accent: "#d7deea", accentSoft: "#eef2f8" },
  "blush-gold": { bgFrom: "#7d3350", bgTo: "#9c4664", accent: "#eccd8e", accentSoft: "#f6e3bc" },
  "mustard-maroon": { bgFrom: "#8a5a15", bgTo: "#a8721f", accent: "#7a2634", accentSoft: "#9c3a4a" },
  "teal-copper": { bgFrom: "#0e4a4a", bgTo: "#146363", accent: "#d08c5c", accentSoft: "#e6ac82" },
  "ash-charcoal": { bgFrom: "#2f343a", bgTo: "#454c54", accent: "#f5f5f5", accentSoft: "#d7dade" },
  "ivory-rose": { bgFrom: "#8c5866", bgTo: "#a97283", accent: "#f6eadd", accentSoft: "#efd6bc" },
  "indigo-gold": { bgFrom: "#20213f", bgTo: "#2d2f5c", accent: "#e0bd64", accentSoft: "#edd48c" },
  "wine-copper": { bgFrom: "#3f1420", bgTo: "#5c1d2f", accent: "#cf8a5c", accentSoft: "#e2ac82" },
};

const WIDTH = 900;
const HEIGHT = 1125; // 4:5

async function generate(slug, paletteKey, seed) {
  const p = PALETTES[paletteKey];
  const primary = buildSVG({ width: WIDTH, height: HEIGHT, ...p, seed });
  const secondary = buildSVG({
    width: WIDTH,
    height: HEIGHT,
    bgFrom: p.bgTo,
    bgTo: p.bgFrom,
    accent: p.accentSoft,
    accentSoft: p.accent,
    seed: seed + 1,
    mirrored: true,
  });

  const outA = path.join(OUT_DIR, `${slug}-1.webp`);
  const outB = path.join(OUT_DIR, `${slug}-2.webp`);
  await sharp(Buffer.from(primary)).webp({ quality: 88 }).toFile(outA);
  await sharp(Buffer.from(secondary)).webp({ quality: 88 }).toFile(outB);
  console.log("generated", slug);
}

(async () => {
  const jobs = [
    ["ash-grey-oversized-tee", "ash-charcoal", 1],
    ["structured-wool-overcoat", "indigo-gold", 2],
    ["draped-satin-midi-dress", "blush-gold", 3],
    ["minimal-leather-card-wallet", "teal-copper", 4],
    ["relaxed-pleated-trousers", "royal-silver", 5],
    ["signature-ash-cap", "mustard-maroon", 6],
    ["banarasi-silk-saree", "maroon-gold", 7],
    ["kanjivaram-silk-saree", "emerald-gold", 8],
    ["chiffon-printed-saree", "ivory-rose", 9],
    ["georgette-party-saree", "wine-copper", 10],
  ];
  for (const [slug, palette, seed] of jobs) {
    await generate(slug, palette, seed);
  }
})();
