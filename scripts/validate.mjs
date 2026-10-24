// Checks every post before it is merged: front matter, authors, citations, and that the MDX
// compiles using only plain content and the site's building blocks.
//
//   npm run validate
//
// The website runs its own, stricter checks when it builds; this script gives the same answers
// earlier, on your machine or on the pull request.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { compile } from '@mdx-js/mdx';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import contentGuard from './content-guard.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const CITATION = /\[(@[\w:-]+(?:\s*;\s*@[\w:-]+)*)\]/g;
const authors = new Set(readdirSync(join(ROOT, 'authors')).filter((f) => f.endsWith('.yaml')).map((f) => f.slice(0, -5)));
const errors = [];

function files(dir, match) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full).flatMap((name) => {
    const path = join(full, name);
    return statSync(path).isDirectory() ? files(join(dir, name), match) : match(name) ? [path] : [];
  });
}

function frontMatter(path, text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) { errors.push(`${path}: missing front matter`); return null; }
  return parseYaml(match[1]);
}

function checkCommon(path, data, kind) {
  const need = (field, ok, what) => { if (!ok) errors.push(`${path}: ${field} ${what}`); };
  need('title', typeof data.title === 'string' && data.title.length > 0, 'is required');
  if (kind !== 'notes') need('summary', typeof data.summary === 'string' && data.summary.length > 0, 'is required');
  need('summary', !data.summary || data.summary.length <= 300, 'must be 300 characters or fewer');
  need('date', !Number.isNaN(new Date(data.date).getTime()), 'must be a date like 2026-10-24');
  need('authors', Array.isArray(data.authors) && data.authors.length > 0, 'must list at least one author');
  for (const a of [...(data.authors ?? []), ...(data.contributors ?? [])]) need(`author "${a}"`, authors.has(a), 'has no file in authors/');
  if (kind === 'papers') {
    const p = data.paper ?? {};
    for (const f of ['title', 'authors', 'venue', 'year', 'url']) need(`paper.${f}`, p[f] !== undefined, 'is required');
    need('confidence', ['low', 'medium', 'high'].includes(data.confidence), 'must be low, medium or high');
  }
}

function checkCitations(path, data, body) {
  const ids = (data.references ?? []).map((r) => r.id);
  const known = new Set(ids);
  if (known.size !== ids.length) errors.push(`${path}: reference ids must be unique`);
  for (const match of body.matchAll(CITATION)) {
    for (const key of match[1].split(';').map((k) => k.trim().slice(1))) {
      if (!known.has(key)) errors.push(`${path}: [@${key}] is cited but not listed in references`);
    }
  }
}

const kinds = {
  posts: (n) => n === 'index.mdx',
  leaderboards: (n) => n === 'index.mdx',
  papers: (n) => n === 'index.md' || n === 'index.mdx',
  notes: (n) => n.endsWith('.md') || n.endsWith('.mdx'),
};
let checked = 0;
for (const [kind, match] of Object.entries(kinds)) {
  for (const path of files(kind, match)) {
    const rel = relative(ROOT, path);
    const text = readFileSync(path, 'utf8');
    const data = frontMatter(rel, text);
    if (!data) continue;
    const body = text.replace(/^---\n[\s\S]*?\n---\n/, '');
    checkCommon(rel, data, kind);
    checkCitations(rel, data, body);
    if (kind === 'leaderboards' && !existsSync(join(path, '..', 'data'))) errors.push(`${rel}: leaderboard needs a data/ folder`);
    try {
      await compile({ value: body, path: rel }, { format: path.endsWith('.mdx') ? 'mdx' : 'md', remarkPlugins: [remarkGfm, remarkMath, contentGuard] });
    } catch (e) {
      errors.push(`${rel}: ${e.message}`);
    }
    checked += 1;
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  console.error(`\n${errors.length} problem(s) in ${checked} file(s).`);
  process.exit(1);
}
console.log(`✓ ${checked} file(s) checked, no problems.`);
