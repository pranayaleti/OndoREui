#!/usr/bin/env node
/**
 * Bundle analysis script
 * Analyzes bundle sizes and identifies opportunities for optimization.
 *
 * Usage:
 *   node scripts/analyze-bundle.mjs            informational report on out/
 *   node scripts/analyze-bundle.mjs --check    performance budget, exits 1 when a ceiling is crossed (CI)
 *
 * The budget reads the static export (out/), so run it after `npm run build`. Sizes are gzip bytes of
 * the same-origin script files each page loads, which tracks what visitors download (Cloudflare adds
 * brotli on top, so the real number is a little smaller). Ceilings sit a few percent above the
 * measured sizes on 2026-10-01: they do not flag today's weight, they flag the next heavy import.
 * When a change is meant to add weight, raise the number in BUDGETS in the same commit and say why.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

/* eslint-disable no-console -- CLI output */

const OUT_DIR = join(process.cwd(), 'out');

function getFileSize(filePath) {
  try {
    const stats = statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeDirectory(dir, extensions = ['.js', '.css']) {
  const files = [];
  
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...analyzeDirectory(fullPath, extensions));
      } else if (entry.isFile()) {
        const ext = entry.name.substring(entry.name.lastIndexOf('.'));
        if (extensions.includes(ext)) {
          const size = getFileSize(fullPath);
          files.push({
            path: fullPath.replace(process.cwd(), ''),
            name: entry.name,
            size,
            ext,
          });
        }
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

/**
 * Gzip ceilings in KB. `base` is the set of scripts every App Router page shares (layout, framework,
 * header, footer). `routes` are whole-page totals, base included. `appRouter: false` marks the legacy
 * Pages Router calculators, which run a different framework runtime and so are left out of the base set.
 */
export const BUDGETS = {
  baseKb: 300,
  routes: [
    { label: '/', html: 'index.html', appRouter: true, maxKb: 360 },
    { label: '/buy/', html: 'buy/index.html', appRouter: true, maxKb: 350 },
    { label: '/locations/alpine/', html: 'locations/alpine/index.html', appRouter: true, maxKb: 320 },
    { label: '/calculators/affordability-calculator/', html: 'calculators/affordability-calculator/index.html', appRouter: false, maxKb: 165 },
  ],
};

/**
 * Markers that must not appear in the shared base scripts. Chunk names are hashed, so these are
 * strings that only the library or data module itself contains (not the word "sentry" in an env var
 * name or a /glossary link in the footer). Each of them belongs to one route or loads on demand.
 */
export const BASE_FORBIDDEN = [
  { name: 'recharts', marker: 'recharts-wrapper' },
  { name: 'leaflet', marker: 'leaflet-container' },
  { name: 'sentry', marker: '__SENTRY__' },
  { name: 'glossary data', marker: 'How loans are priced, qualified, and paid down.' },
];

/** Same-origin script URLs a page loads, de-duplicated, in document order, URL-decoded. */
export function scriptSources(html) {
  const found = new Set();
  for (const match of html.matchAll(/<script\b[^>]*\ssrc=["']([^"']+)["']/gi)) {
    const src = match[1];
    if (src.startsWith('/') && !src.startsWith('//')) found.add(decodeURIComponent(src.split('?')[0]));
  }
  return [...found];
}

/** Scripts present on every page of the list. */
export function sharedScripts(lists) {
  if (lists.length === 0) return [];
  return lists[0].filter((src) => lists.every((list) => list.includes(src)));
}

function readScript(outDir, src) {
  const file = join(outDir, src);
  return existsSync(file) ? readFileSync(file) : null;
}

/** Total gzip bytes of the scripts, plus the ones that are missing from out/. */
export function gzipBytes(outDir, scripts) {
  let bytes = 0;
  const missing = [];
  for (const src of scripts) {
    const body = readScript(outDir, src);
    if (body === null) missing.push(src);
    else bytes += gzipSync(body).length;
  }
  return { bytes, missing };
}

/** Which forbidden markers appear in which of the scripts. */
export function findForbidden(outDir, scripts, forbidden = BASE_FORBIDDEN) {
  const hits = [];
  for (const src of scripts) {
    const body = readScript(outDir, src);
    if (body === null) continue;
    const text = body.toString('utf8');
    for (const { name, marker } of forbidden) {
      if (text.includes(marker)) hits.push({ script: src, name });
    }
  }
  return hits;
}

/** Measure the export against the budget. Returns table rows and a list of problems (empty when green). */
export function evaluateBudgets(outDir, budgets = BUDGETS) {
  const problems = [];
  const rows = [];
  const appLists = [];
  const pages = [];

  for (const route of budgets.routes) {
    const file = join(outDir, route.html);
    if (!existsSync(file)) {
      problems.push(`${route.label}: ${route.html} not found in the export, update BUDGETS if the route moved`);
      continue;
    }
    const scripts = scriptSources(readFileSync(file, 'utf8'));
    const { bytes, missing } = gzipBytes(outDir, scripts);
    for (const src of missing) problems.push(`${route.label}: ${src} is referenced but missing from the export`);
    pages.push({ route, scripts, bytes });
    if (route.appRouter) appLists.push(scripts);
  }

  const base = sharedScripts(appLists);
  const baseSize = gzipBytes(outDir, base).bytes;
  if (appLists.length > 0 && base.length === 0) problems.push('No scripts are shared by the App Router pages, the base set could not be measured');
  rows.push({ label: 'shared base', kb: baseSize / 1024, maxKb: budgets.baseKb, files: base.length });
  if (baseSize / 1024 > budgets.baseKb) {
    problems.push(`shared base JS is ${(baseSize / 1024).toFixed(1)} KB gzip, over the ${budgets.baseKb} KB ceiling`);
  }
  for (const hit of findForbidden(outDir, base)) {
    problems.push(`shared base chunk ${hit.script} contains ${hit.name}: load it on the route that needs it, not in the layout`);
  }

  for (const { route, scripts, bytes } of pages) {
    rows.push({ label: route.label, kb: bytes / 1024, maxKb: route.maxKb, files: scripts.length });
    if (bytes / 1024 > route.maxKb) {
      problems.push(`${route.label} loads ${(bytes / 1024).toFixed(1)} KB gzip of JS, over the ${route.maxKb} KB ceiling`);
    }
  }
  return { rows, problems };
}

function runBudgetCheck() {
  if (!existsSync(OUT_DIR)) {
    console.error(`analyze-bundle: ${OUT_DIR} not found, run the build first`);
    process.exit(1);
  }
  const { rows, problems } = evaluateBudgets(OUT_DIR);
  console.log('Performance budget (gzip JS per page):');
  for (const row of rows) {
    console.log(`  ${row.label.padEnd(44)} ${row.kb.toFixed(1).padStart(7)} KB of ${row.maxKb} KB  (${row.files} files)`);
  }
  if (problems.length > 0) {
    for (const problem of problems) console.error(`  FAIL ${problem}`);
    console.error(`analyze-bundle: ${problems.length} budget problem(s)`);
    process.exit(1);
  }
  console.log('analyze-bundle: within budget');
}

function main() {
  console.log('📊 Analyzing bundle sizes...\n');
  
  // Analyze JavaScript files
  const jsFiles = analyzeDirectory(OUT_DIR, ['.js']);
  const cssFiles = analyzeDirectory(OUT_DIR, ['.css']);
  
  // Sort by size
  jsFiles.sort((a, b) => b.size - a.size);
  cssFiles.sort((a, b) => b.size - a.size);
  
  // Calculate totals
  const totalJSSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
  const totalCSSSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
  
  console.log('📦 JavaScript Files:');
  console.log(`   Total: ${formatBytes(totalJSSize)} (${jsFiles.length} files)\n`);
  console.log('   Top 10 largest files:');
  jsFiles.slice(0, 10).forEach((file, index) => {
    console.log(`   ${index + 1}. ${file.name}: ${formatBytes(file.size)}`);
  });
  
  console.log('\n🎨 CSS Files:');
  console.log(`   Total: ${formatBytes(totalCSSSize)} (${cssFiles.length} files)\n`);
  console.log('   Top 10 largest files:');
  cssFiles.slice(0, 10).forEach((file, index) => {
    console.log(`   ${index + 1}. ${file.name}: ${formatBytes(file.size)}`);
  });
  
  // Recommendations
  console.log('\n💡 Optimization Recommendations:');
  
  if (totalJSSize > 500 * 1024) { // 500KB
    console.log('   ⚠️  JavaScript bundle is large. Consider:');
    console.log('      - Code splitting with dynamic imports');
    console.log('      - Tree shaking unused code');
    console.log('      - Lazy loading non-critical components');
  }
  
  if (totalCSSSize > 100 * 1024) { // 100KB
    console.log('   ⚠️  CSS bundle is large. Consider:');
    console.log('      - Purging unused Tailwind classes');
    console.log('      - Removing unused CSS');
    console.log('      - Critical CSS extraction');
  }
  
  const largeFiles = [...jsFiles, ...cssFiles].filter(f => f.size > 100 * 1024);
  if (largeFiles.length > 0) {
    console.log(`\n   ⚠️  Found ${largeFiles.length} files larger than 100KB:`);
    largeFiles.forEach(file => {
      console.log(`      - ${file.name}: ${formatBytes(file.size)}`);
    });
  }
  
  console.log('\n✅ Analysis complete!');
}

const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  if (process.argv.includes('--check')) runBudgetCheck();
  else main();
}

