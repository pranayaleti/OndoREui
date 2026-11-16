#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function hexToRgb(hex) {
  const m = hex.replace('#','');
  const bigint = parseInt(m, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function luminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(hex1, hex2) {
  const L1 = luminance(hexToRgb(hex1));
  const L2 = luminance(hexToRgb(hex2));
  const brightest = Math.max(L1, L2);
  const darkest = Math.min(L1, L2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const tokensPath = path.join(process.cwd(), 'src/styles/design-tokens.json');
const outDir = path.join(process.cwd(), 'reports', 'theme-audit');
const reportPath = path.join(outDir, 'accessibility-contrast.json');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
const c = tokens.color;

// Tokens are stored per theme (bg-base-light, bg-base-dark, ...). Check both.
// The brand orange carries black text (see --primary-foreground), so that is the pair checked on accent-1.
// accent-1 itself is a fill, ring and large-text colour (3:1). Orange body text on the light page uses the
// darker --primary-text, which is defined in _design-tokens.css, not in this file.
const token = (name) => {
  const entry = c[name];
  if (!entry) throw new Error(`design-tokens.json has no color "${name}"`);
  return entry.value;
};

const pairs = ['light', 'dark'].flatMap((theme) => [
  { name: `${theme}: text-primary on bg-base`, fg: token(`text-primary-${theme}`), bg: token(`bg-base-${theme}`), min: 4.5 },
  { name: `${theme}: text-primary on bg-elevated`, fg: token(`text-primary-${theme}`), bg: token(`bg-elevated-${theme}`), min: 4.5 },
  { name: `${theme}: text-muted on bg-base`, fg: token(`text-muted-${theme}`), bg: token(`bg-base-${theme}`), min: 4.5 },
  { name: `${theme}: text-muted on bg-elevated`, fg: token(`text-muted-${theme}`), bg: token(`bg-elevated-${theme}`), min: 4.5 },
  { name: `${theme}: link on bg-base`, fg: token(`link-${theme}`), bg: token(`bg-base-${theme}`), min: 4.5 },
]).concat([
  { name: 'black on accent-1 (buttons)', fg: '#000000', bg: token('accent-1'), min: 4.5 },
  { name: 'dark: accent-1 on bg-base', fg: token('accent-1'), bg: token('bg-base-dark'), min: 4.5 },
  { name: 'dark: accent-1 on bg-elevated', fg: token('accent-1'), bg: token('bg-elevated-dark'), min: 4.5 },
]);

const results = pairs.map((p) => {
  const ratio = contrast(p.fg, p.bg);
  return { pair: p.name, ratio: Number(ratio.toFixed(2)), min: p.min, pass: ratio >= p.min };
});

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
for (const r of results) console.log(`${r.pass ? 'pass' : 'FAIL'}  ${String(r.ratio).padStart(5)} (min ${r.min})  ${r.pair}`);
console.log('Accessibility contrast report written to', reportPath);

const failed = results.filter((r) => !r.pass);
if (failed.length > 0) {
  console.error(`${failed.length} contrast pair(s) below the minimum.`);
  process.exit(1);
}
