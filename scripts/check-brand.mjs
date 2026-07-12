#!/usr/bin/env node
/**
 * ATOM brand governance — canonical-teal drift regression.
 *
 * Guards the single-source ATOM identity hue (#00F0DF) against silent drift.
 * Adapted from the upstream color-governance test (v2.2.2, commit 4dc80b9),
 * reimplemented as a dependency-free node script so it runs on this zero-build
 * single-file static app without adding a test framework.
 *
 * Checks:
 *   1. `--teal-core: #00f0df;` is defined exactly once in index.html
 *      (the single source of truth for the ATOM identity hue).
 *   2. None of the historical "teal impostor" / legacy Antimatter-purple hexes
 *      reappear anywhere in index.html. Before adoption this page expressed its
 *      identity in a purple scale (#696aac / #8587e3 / #4c4dac / #3e3f7e, …);
 *      the canonical ATOM identity must now be expressed via var(--teal-core) /
 *      #00F0DF and the sanctioned ladder only.
 *
 * NOTE: deliberately-distinct data / product channels sanctioned by the brand
 * (Gold #f5c842, Success #3fd18b, and the deeper gold data shade #d99a1a) are
 * NOT policed — they are restrained product-accent / data-viz shades, not the
 * shared ATOM identity.
 *
 * Run: `npm run check:brand`  (or: node scripts/check-brand.mjs)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FILE = join(ROOT, "index.html");

// Historical teal-impostor / legacy-purple hexes. Reintroducing any is drift.
const FORBIDDEN = [
  "#696aac", // Antimatter purple that masqueraded as the identity accent
  "#8587e3", // purple gradient bright stop
  "#4c4dac", // purple gradient mid stop
  "#3e3f7e", // purple "primary"
  "#a2a3e9", // purple secondary text
  "#c7c8f2", // purple tertiary
  "#e3e3f8", // purple light accent
  "#f6f6fd", // off-white tuned to the purple system
  "#00c8c8", // legacy "v2.0" teal
  "#00e6d3", // legacy mobile teal
  "#00989c",
  "#00a99d",
];

const html = readFileSync(FILE, "utf8");
const lines = html.split("\n");

const forbiddenRe = new RegExp(FORBIDDEN.join("|"), "i");
const violations = [];
lines.forEach((line, i) => {
  const m = line.match(forbiddenRe);
  if (m) violations.push(`index.html:${i + 1}  ${m[0]}  → teal impostor; use var(--teal-core) / #00F0DF`);
});

const coreCount = (html.match(/--teal-core:\s*#00f0df;/gi) || []).length;

let failed = false;
if (coreCount !== 1) {
  console.error(`✗ Expected \`--teal-core: #00f0df;\` defined exactly once in index.html, found ${coreCount}.`);
  failed = true;
}
if (violations.length) {
  console.error(`✗ Found ${violations.length} teal-impostor hex literal(s):`);
  for (const v of violations) console.error("   " + v);
  failed = true;
}

if (failed) {
  console.error("\nATOM brand governance FAILED. Use var(--teal-core) / #00F0DF, or extend the ladder with justification.");
  process.exit(1);
}

console.log("✓ ATOM brand governance passed — canonical teal #00F0DF is the single source of truth.");
