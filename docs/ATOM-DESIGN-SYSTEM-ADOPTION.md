# ATOM Design System Adoption — ATOM × Ignite × KSE

**Upstream:** ATOM + Nirmata Holdings Brand & Design Standard **v2.2.2** (commit `4dc80b9`).
**Adoption state:** pilot. **Pilot reference:** `BenThingkTangk/atom-sales-os#2`.
**Machine-readable version record:** [`brand/ATOM_DESIGN_SYSTEM_VERSION.json`](../brand/ATOM_DESIGN_SYSTEM_VERSION.json).

This app is a **single-file, zero-build static site** (`index.html`) deployed by Vercel. It has no
framework, bundler, or dependency graph, so the canonical design system is **inlined** into the
`<style>` block of `index.html` rather than imported as a package. This is the deliberate adoption
method for this property and is the single most important thing to understand before editing.

---

## 1. What changed

### Identity & color
- **Canonical ATOM teal `#00F0DF`** is now the single source of truth for the shared identity
  (orbital mark, nucleus, traveling electron, loader, focus ring, live signals, links, buttons).
  Defined once as `--teal-core` with the sanctioned ladder (`--teal-bright`, `--teal-dim`,
  `--teal-deep`, `--teal-glow`, `--teal-surface`, `--teal-border`).
- The previous **Antimatter purple** identity scale (`#696aac`, `#8587e3`, `#4c4dac`, `#3e3f7e`,
  and their `rgba()` forms) was removed entirely.
- Surfaces use the canonical **dark-first, layered near-black** stack (`#050607` → `#24252b`) —
  never flat pure black.
- Legacy `--am-*` component variables are **aliased onto the canonical tokens** so the large body
  of existing component CSS inherits the canonical palette without a rule-by-rule rewrite.

### Product-accent restraint
- KSE sports-data and agent-outcome moments keep an accent, but aligned to the canonical channels:
  **Gold `#F5C842`** (from `#f9c946`) and **Success `#3FD18B`** (from `#4ade80`). One accent per
  surface; the shared ATOM identity always stays teal.

### Typography
- Display: **Cabinet Grotesk 900** (via Fontshare) with a metric-matched `Display Fallback`
  `@font-face` so hero tracking never collides during the swap window.
- Body: **Satoshi**. Mono: **JetBrains Mono**. The previous Bebas Neue / Plus Jakarta Sans pairing
  was removed.

### Logo & orbital behavior
- The nav mark is the **canonical orbital mark**: a nucleus, three electron orbits at 60° offsets,
  and one traveling electron. Orbits stay neutral grey; the nucleus and traveling electron carry
  the teal accent. The **traveling electron orbits** (the `orbit` motif) to encode a live, working
  agent, and the nucleus uses the `breathe` motif. Both collapse under `prefers-reduced-motion`.

### Motion
- Canonical signature easing `cubic-bezier(0.16, 1, 0.3, 1)` at 180ms (already in use) is retained,
  and the named motifs **orbit / breathe / scan** are defined. Reduced motion remains a complete,
  honest alternative.

### Traffic-light window chrome
- Applied **only** to the live agent **data-flow / evidence panels** (`.dataflow-diagram`), where a
  terminal/agent surface is meaningful. The three lights are **decorative, pure-CSS, and
  non-interactive** — they signal an agent/evidence surface without implying OS window controls, so
  agent/security semantics stay clear. Not applied to marketing or narrative surfaces.

### Nirmata endorsement
- Document title, footer brand block, and copyright now carry **"ATOM, a Nirmata Holdings
  company."** Surfaced "Antimatter AI" brand naming was replaced with **ATOM** (public-safe: the
  canonical standard cautions against surfacing AntimatterAI in public showcase copy).

### Low-risk defect fixes
- Removed an invalid `left: -var(--sp-8)` declaration on `.timeline-dot`.
- Fixed a malformed `<path>` in the CTA envelope icon.
- Skip link now becomes **visible on focus** (was permanently `sr-only`).

---

## 2. Exceptions & rationale

- **Inlined, not imported.** The upstream is a Next.js app (CSS modules + `'use client'`). This
  property has no build step; inlining the tokens preserves the static deploy. Documented as
  `adoptionMethod: "inlined-tokens"` in the version record.
- **Functional external endpoints preserved.** Links to `antimatterai.com` and the
  `atom@antimatterai.com` contact are the app's real, deployed destinations. Their **hrefs are kept
  intact** to preserve the deploy/integration; only the **visible brand-name text** was rebranded to
  ATOM. Changing the destinations was out of scope and would risk the live integration.
- **Deeper gold data shade `#d99a1a`** is used for one gold gradient stop. It is a restrained
  data-viz shade, not the shared identity, and is explicitly not policed by the drift guard.

---

## 3. Sync method (updating to a newer upstream)

1. Re-read the canonical tokens from the upstream `src/app/globals.css` and `public/tokens.json` at
   the new commit.
2. Update the `:root` token block and the legacy `--am-*` aliases in `index.html`.
3. Bump `upstreamVersion` / `upstreamCommit` in `brand/ATOM_DESIGN_SYSTEM_VERSION.json`.
4. Run `npm run validate` (drift guard + tests) and re-run QA at 320/390/768/1024/1440.

## 4. Rollback

This adoption touches one deployable file (`index.html`) plus additive tooling/docs. There is no
data migration, no dependency, and no deploy-config change.

- **Single-file revert:** restore `index.html` from pre-adoption commit `9ec4cf1`, or
- **Full revert:** `git revert <adoption-commit>` (safe to remove `package.json`, `scripts/`,
  `brand/`, and `docs/` — none affect the static deploy).

## 5. Drift guard & tests

- `npm run check:brand` — asserts a single `--teal-core: #00F0DF` source of truth and zero
  teal-impostor / legacy-purple hexes in `index.html`.
- `npm run test` — asserts canonical tokens, typography, orbital mark, motion motifs, window chrome,
  the Nirmata endorsement, preserved KSE routes/content/workflows, accessibility landmarks, and
  version-metadata integrity.
- `npm run validate` — runs both.

Both are dependency-free node scripts; they add no build step and do not affect the Vercel deploy.
