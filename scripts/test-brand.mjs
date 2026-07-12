#!/usr/bin/env node
/**
 * ATOM design-system adoption tests (dependency-free).
 *
 * Asserts that the canonical ATOM + Nirmata Holdings Brand Design Standard
 * v2.2.2 is applied to index.html AND that the KSE-specific content, routes,
 * workflows, and accessibility landmarks are preserved. Runs on plain node,
 * no framework, so it works in this zero-build static app.
 *
 * Run: `npm run test`  (or: node scripts/test-brand.mjs)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
const version = JSON.parse(readFileSync(join(process.cwd(), "brand/ATOM_DESIGN_SYSTEM_VERSION.json"), "utf8"));

let passed = 0;
const failures = [];
function ok(name, cond) {
  if (cond) { passed++; } else { failures.push(name); }
}
const has = (s) => html.includes(s);
const count = (re) => (html.match(re) || []).length;

// ---- Canonical tokens / identity ----
ok("canonical teal ladder --teal-core #00f0df defined once", count(/--teal-core:\s*#00f0df;/gi) === 1);
ok("teal-bright ladder token present", has("--teal-bright: #5cf7ec") || has("--teal-bright:#5cf7ec"));
ok("teal-deep ladder token present", has("--teal-deep:") && has("#00766e"));
ok("canonical near-black base surface #050607 (never flat black)", has("--am-bg:           #050607") || has("#050607"));
ok("no legacy Antimatter purple #696aac anywhere", !/#696aac/i.test(html));
ok("no legacy purple gradient stop #8587e3", !/#8587e3/i.test(html));
ok("no flat pure-black #020202 background", !/#020202/i.test(html));

// ---- Typography ----
ok("Cabinet Grotesk display face wired", has("Cabinet Grotesk"));
ok("Satoshi body face wired", has("Satoshi"));
ok("JetBrains Mono face wired", has("JetBrains Mono"));
ok("Fontshare stylesheet linked", has("api.fontshare.com"));
ok("metric-matched Display Fallback @font-face present", has("Display Fallback"));
ok("legacy Bebas Neue display font removed", !/Bebas Neue/i.test(html));

// ---- Orbital mark + motion ----
ok("canonical orbital mark (3 orbits at 60deg offsets) present", has("rotate(60 24 24)") && has("rotate(120 24 24)"));
ok("teal nucleus in mark", has('class="atom-nucleus"'));
ok("traveling electron encodes live agent", has('class="atom-electron"'));
ok("orbit motion motif defined", has("@keyframes orbit"));
ok("breathe motion motif defined", has("@keyframes breathe"));
ok("signature easing cubic-bezier(0.16, 1, 0.3, 1) present", has("cubic-bezier(0.16, 1, 0.3, 1)"));
ok("reduced-motion honest alternative preserved", has("prefers-reduced-motion"));

// ---- Traffic-light window chrome on agent/evidence panels ----
ok("traffic-light tokens present", has("--tl-red:") && has("--tl-yellow:") && has("--tl-green:"));
ok("window chrome applied to dataflow titlebar", /\.dataflow-title::before/.test(html));

// ---- Nirmata endorsement + ATOM identity ----
ok("Nirmata Holdings endorsement present", has("a Nirmata Holdings company"));
ok("ATOM wordmark in nav", has('class="nav-logo-text">ATOM'));
ok("public-safe: no 'Antimatter AI' surfaced brand name in copy", !/Antimatter AI/.test(html));
ok("document title carries endorsement", /<title>[^<]*Nirmata Holdings company<\/title>/.test(html));

// ---- Preserved KSE content / routes / workflows ----
for (const anchor of ["#ignite", "#usecases", "#scenario", "#solutions"]) {
  ok(`route/anchor ${anchor} preserved`, has(`href="${anchor}"`) && has(`id="${anchor.slice(1)}"`));
}
for (const team of ["Denver Nuggets", "Colorado Avalanche", "Colorado Rapids", "Colorado Mammoth"]) {
  ok(`KSE property preserved: ${team}`, has(team));
}
ok("KSE partner Ignite by Ticketmaster preserved", has("Ignite by Ticketmaster") || has("Ignite"));
ok("scenario workflow ($112K auto-debrief) preserved", has("$112K"));
ok("Ricky Casady KSE quote preserved", has("Ricky Casady"));
ok("four use-case tabs preserved", count(/class="tab-btn/g) >= 4);
ok("six solution cards preserved", count(/class="solution-card/g) >= 6);
ok("Ricky Casady attribution title preserved", has("VP of Ticketing"));

// ---- Accessibility landmarks ----
ok("skip link becomes visible on focus", has('class="skip-link"') && /\.skip-link:focus/.test(html));
ok("main landmark present", has('<main id="main">'));
ok("nav landmark present", has('role="navigation"'));
ok("contentinfo footer landmark present", has('role="contentinfo"'));
ok("tablist ARIA preserved", has('role="tablist"'));
ok("mobile menu dialog ARIA preserved", has('role="dialog"'));

// ---- Version metadata integrity ----
ok("version metadata pins upstream v2.2.2", version.upstreamVersion === "2.2.2");
ok("version metadata pins canonical teal", version.canonicalTeal === "#00f0df");
ok("version metadata documents rollback", typeof version.rollback === "string" && version.rollback.length > 0);

if (failures.length) {
  console.error(`✗ ${failures.length} assertion(s) FAILED:`);
  for (const f of failures) console.error("   - " + f);
  console.error(`\n(${passed} passed)`);
  process.exit(1);
}
console.log(`✓ All ${passed} ATOM adoption assertions passed (tokens, typography, orbital mark, motion, window chrome, endorsement, preserved KSE routes/content, accessibility, version metadata).`);
