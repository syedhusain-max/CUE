// CLAUDE.md: no em or en dashes in visible copy or prompt text.
import fs from 'node:fs';
import path from 'node:path';

const roots = ['app', 'components', 'lib', 'public/templates', 'public/manifest.webmanifest'];
const bad = /[–—]/;
let hits = 0;
const walk = (p) => {
  const st = fs.statSync(p);
  if (st.isDirectory()) return fs.readdirSync(p).forEach((f) => walk(path.join(p, f)));
  if (!/\.(jsx?|mjs|css|html|json|webmanifest|md)$/.test(p)) return;
  fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
    if (bad.test(line)) { hits++; console.log(`${p}:${i + 1}: ${line.trim().slice(0, 120)}`); }
  });
};
roots.forEach((r) => fs.existsSync(r) && walk(r));
if (hits) { console.error(`\n${hits} line(s) with an em or en dash.`); process.exit(1); }
console.log('No em or en dashes found.');
