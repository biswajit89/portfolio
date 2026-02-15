/**
 * Lightweight prerender script for key routes.
 *
 * Run after `vite build`:
 *   node scripts/prerender.js
 *
 * For each route it copies dist/index.html into the route's directory
 * so that static hosts serve the SPA shell at every path, improving
 * initial load for crawlers and users landing on deep links.
 */

import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const ROUTES = [
  '/about',
  '/experience',
  '/projects',
  '/skills',
  '/education',
  '/contact',
];

const indexHtml = join(DIST, 'index.html');

if (!existsSync(indexHtml)) {
  console.error('dist/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

for (const route of ROUTES) {
  const dir = join(DIST, route);
  mkdirSync(dir, { recursive: true });
  copyFileSync(indexHtml, join(dir, 'index.html'));
  console.log(`  ✓ ${route}/index.html`);
}

console.log(`\nPrerendered ${ROUTES.length} routes.`);
