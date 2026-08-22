# Design system & layout audit — Launch To Wellness

**Site audited:** `https://launchtowellne.wpenginepowered.com/` (WordPress 
6.x, Kadence theme + Kadence Blocks, Rank Math, Autoptimize, Site Kit)
**Date:** 22 August 2026
**Scope:** homepage, measured at 390px, 768px and 1440px

The public `launchtowellness.com` is still served by Wix; the WordPress build
audited here is the staged replacement.

## Method

The page was mirrored locally with all 100+ assets, then rendered in headless
Chromium at three viewports. Findings come from **computed styles on the
rendered page**, not from reading the CSS — the two disagree in exactly the
places that matter. Colour contrast is calculated to WCAG 2.1.

One measurement pass was discarded and re-run: the first mirror was missing 10
Autoptimize stylesheets, which inflated page height by 3.4x. Every number below
is from the corrected render.

## The shape of the problem

The site has a **good palette and a coherent visual language** — the Kadence
global palette is well-chosen, the Fraunces/Nunito Sans pairing works, and the
hero is genuinely strong. The problem is not taste. It is that the design
system exists in three incompatible copies:

| | |
|---|---|
| Kadence global palette | 15 slots, sane, largely unused by the custom sections |
| `--ltw-*` tokens | disciplined, mostly correct, matches Kadence |
| unprefixed tokens | `--navy`, `--blue`, `--ink` — drifted, self-contradictory |

**239 distinct custom properties** are declared across **8 competing
namespaces** (`--ltw-*`, `--o-*`, `--type-*`, `--font-*`, `--blue-*`,
`--dur-*`, `--radius-*`, `--s-*`). **58 of them are declared more than once
with different values**, so the same token resolves differently depending on
which of the 20 hand-written section blocks wins the cascade.

`--navy` is three colours. `--blue` is two. `--ltw-type-h2` is both 32px and
34px. `--ltw-type-lede` is three different values.

## Findings, ranked

### 1. The accent colour fails contrast everywhere it is used on light — **accessibility**

`#e8a15b` is the brand's warm accent and appears 18 times in the hand-written
CSS.

| Ground | Ratio | AA body text (4.5:1) |
|---|---|---|
| white | **2.17** | fails |
| ivory `#f7f4ee` | **1.98** | fails |
| cloud `#eef2f2` | **1.92** | fails |
| sky-wash `#e8f4f9` | **1.94** | fails |
| navy `#0e2c3d` | 6.69 | passes |

White text *on* the orange is 2.17:1 — also failing. Navy on orange is 6.69:1
and is the only correct pairing.

Kadence already defines `palette14` `#9a5f22` (5.21:1 on white), which reads as
the same warm amber and passes. That becomes `--ltw-text-accent`; the orange is
kept for fills, rules and icons on navy.

This matters beyond aesthetics: a behavioural-health provider carries real ADA
exposure, and the audience includes people in acute distress and older parents.

### 2. Colour drift actively broke contrast that was previously fine

The unprefixed aliases do not merely differ from the canonical tokens — some
are worse:

| Alias | Drifted to | On white | Canonical | On white |
|---|---|---|---|---|
| `--blue` | `#2782B2` | **4.27** fails | `#1b6084` | 6.88 passes |
| `--muted` | `#7a92a4` | **3.24** fails | `#526671` | 6.00 passes |
| `--blue-deep` | `#1e6f99` | 5.54 | `#1b6084` | 6.88 |
| `--ink` | `#18384f` | 12.23 | `#172d38` | 14.30 |
| `--navy` | `#143247` / `#0f2535` | — | `#0e2c3d` | — |

Two aliases dropped below AA purely through copy-paste drift.

### 3. Heading hierarchy inverts — **accessibility + scannability**

Rendered heading sizes on one page:

| Level | Distinct sizes | Values |
|---|---|---|
| H1 | 3 | 10px, 42px, 68px |
| H2 | 6 | 12px, 21px, 32px (×12), 34px, 40px, 44px |
| H3 | 4 | 14.5px (×5), 17px (×39), 25px, 27px |

Five H3s render at **14.5px — smaller than the 16px body copy beside them**.
Heading level and visual weight disagree, so the scan order misleads sighted
readers and the document outline misleads screen readers.

### 4. Two `<h1>` elements, one of them 10px — **SEO + accessibility** *(template)*

The homepage has two `<h1>`s: the hero (correct) and the site title in the
header, rendering at 10px. The header title should be a `<p>` or `<div>`.

Related: the one remaining 12px `<h2>` is a mega-menu section label
("ABOUT LAUNCH TO WELLNESS") built as a Kadence Advanced Heading. It should not
be a heading at all. It is deliberately **not** resized in `fixes.css` —
enlarging it would break the navigation. The fix is semantic.

### 5. Mobile header offers no way to convert — **conversion** *(template)*

At 390px the header is 41px tall and contains **exactly one visible control:
the hamburger**. No logo, no phone number, no CTA.

The desktop header carries both *Verify Insurance* and *Get Help Now*. For a
treatment centre whose primary conversion is a phone call, the mobile header
should carry a `tel:` link at minimum. This is likely the single highest-value
commercial fix on the list.

### 6. Touch targets below minimum — **mobile usability**

At 390px, 15 non-prose interactive elements render under 44×44:

- Carousel dots at **6×6px**. Verified by hit-testing: before the fix, a tap
  14px above a dot missed entirely; after, it lands.
- Top-bar links: "Who We Serve" 81×14, "Referrals" 50×14, "Families" 44×16.
- The off-canvas trigger at 41×41 — just under.

The skip link at 1×1 is correct and intentionally excluded.

### 7. Three families load; the one you want isn't actually loaded — **performance**

The site self-hosts **34 `@font-face` rules** via the WordPress Font Library
(the page carries `class="wp-fonts-local"`) **and** loads a render-blocking
Google Fonts stylesheet:

```
fonts.googleapis.com/css?family=Inter:regular,600,700
  |Fraunces:600,700|Nunito Sans:600,regular,500,700
```

| Family | Self-hosted faces | Weights | Bytes |
|---|---|---|---|
| Fraunces | 18 | 9 × 2 styles | 616KB |
| Nunito Sans | 16 | 8 × 2 styles | 620KB |
| **Inter** | **0** | — | — |
| | | | **1.24MB** |

So Fraunces and Nunito Sans download from two sources. **Inter appears in 7
font stacks and has no `@font-face` anywhere** — confirmed by enumerating the
loaded faces. It exists only in that third-party request, so every element
declaring `Inter, sans-serif` falls back to an arbitrary system font whenever
the request is slow or blocked. That is most of why type reads inconsistently
between sections.

**Direction set: Fraunces + Inter. Nunito Sans is retired.** The remedy is
therefore to *add* Inter to the Font Library rather than remove it from the
stacks:

1. Install Inter locally at 400/500/600/700, upright only.
2. Remove Nunito Sans (16 faces, 620KB).
3. Trim Fraunces from 18 faces to 600/700 upright (~548KB).
4. Drop the remote `kadence-fonts-gfonts` request once both are local.

That lands at **6 self-hosted faces instead of 34** — roughly **1.06MB less
font weight** and no render-blocking third-party request. Steps are in
`design-system/README.md`.

### 8. Above-the-fold images are lazy-loaded — **perceived performance** *(template)*

The "IN-NETWORK WITH" insurance strip sits ~135px down the page, above the
fold at every viewport. All **28 carrier logos carry `loading="lazy"`**, so the
strip paints as empty space on first load — precisely the trust signal a
prospective patient looks for first.

### 9. CSS delivery — **performance**

| Source | Size |
|---|---|
| Inline `<style>` in the HTML | 494KB across 42 blocks |
| ↳ of which hand-written section CSS | 251KB across 20 blocks |
| External (Autoptimize, 10 files) | 172KB |
| External (Kadence theme, 4 files) | 82KB |
| **Total CSS** | **748KB** |

The 801KB HTML document is **62% inline CSS**, none of it cacheable across
pages. Each of the 20 section blocks re-declares its own local variables.

There is a second consequence beyond weight. **21 of the 43 `<style>` blocks
are printed in the `<body>`, including 16 of the 19 hand-written section
blocks** — Kadence emits block CSS next to each block. Anything loaded in the
head comes earlier in document order and loses every equal-specificity fight
against them.

This is why *Customize → Additional CSS* is the wrong place for corrective CSS
on this site, and it is measured rather than theoretical: loading the override
layer in the head left 103 elements rendering the wrong typeface; loading it
before `</body>` cut that to 47. See the install notes in
`design-system/README.md`.

### 10. Breakpoint sprawl — **maintainability, not a live bug**

18 distinct breakpoint values across 27 media-query strings, mixing `min-width`
and `max-width` at colliding edges: 767/768, 1023/1024/1025, 479/480, plus
600, 700, 720, 820, 860, 900, 980, 1120, 1240.

**I checked whether this causes actual rendering collisions and it does not** —
zero selectors are styled by both `min-width: 768px` and `max-width: 768px`.
This is a latent hazard rather than a present defect: the next edit in either
direction collides silently.

Credit where due: `prefers-reduced-motion` is honoured in 19 places. That is
better than most sites.

### 11. Other measured items

- **54 of 97 images have empty `alt`** — accessibility *(template/media library)*
- **28 of 97 images lack `width`/`height`** — layout-shift source *(template)*
- Header logo served as a **32×32 crop displayed at 30×30** — soft on every 2x
  display *(needs a 60px+ upload)*
- Longest line of body copy at 1440px is **94 characters** (median 62). Past
  ~75 the eye loses the line return.
- **42 distinct spacing values** (25 px-based, 17 rem-based), **20 border-radius
  values** across 4 namespaces, **23 distinct box-shadows**.

## What was fixed, measured

`design-system/fixes.css` was applied to the mirrored page and re-measured:

| Metric | Before | After |
|---|---|---|
| `p`/`li` under 14px (desktop) | 85 | **30** |
| `p`/`li` under 14px (mobile) | 145 | **90** |
| H1 distinct sizes | 3 | **2** |
| H2 distinct sizes | 6 | **5** |
| H3 distinct sizes | 4 | **3** |
| H3 below body size | 5 instances | **0** |
| Carousel dot hit area (±14px) | miss | **hit** |
| Card radii | 5 | 5 *(unchanged)* |
| Elements rendering Nunito Sans | 141 | **47** |
| Elements rendering Inter | 568 | **667** |

Honest notes on the residual:

- The remaining H1 (10px) and H2 (12px) are the two **semantic** defects in
  findings 4. They are template fixes and were deliberately left alone.
- The remaining sub-14px text is eyebrows at 13px (intentional, tracked
  uppercase) and Kadence nav `<li>` wrappers at 10px, which contain no visible
  text of their own.
- **Card radius consolidation did not converge.** Still 5 distinct values; the
  stray 24px collapsed onto 12px but ~55 icon chips at 7px are styled by nested
  selectors an override layer cannot reach. This needs source edits, not more
  `!important`.
- **47 elements still render Nunito Sans.** These are the Kadence header and
  navigation blocks, whose CSS repeats class selectors
  (`.kb-link-wrap.kb-link-wrap.kb-link-wrap`) to outrank everything. The fix is
  a settings change — *Customize → Typography* and the header block's own
  typography — not more CSS.

## Recommended order of work

**Now — accessibility and conversion, low risk**

1. Load `tokens.css` → `compat.css` → `fixes.css` **from the footer, not the
   head** (see finding 9 — head-loaded CSS loses to the inline body blocks).
   Fixes findings 1, 2, 3, 6 and the measure/rhythm items without touching
   markup.
2. Add a `tel:` link and the logo to the mobile header (finding 5).
3. Remove `loading="lazy"` from the 28 above-the-fold carrier logos (8).

**Next — performance**

4. Install Inter into the Font Library, retire Nunito Sans, trim Fraunces, then
   drop the remote Google Fonts request — 34 faces down to 6 (7).
5. Move the 251KB of section CSS out of inline `<style>` into a cacheable
   stylesheet (9).

**Then — content and semantics**

6. Alt text for the 54 images; `width`/`height` on the 28 missing them (11).
7. Demote the header site title and the mega-menu label from headings (4).
8. Upload a 2x logo (11).

**Ongoing — pay down the drift**

9. Migrate the 20 section blocks onto the tokens, deleting lines from
   `compat.css` as you go. Done when `compat.css` is empty. See
   `design-system/README.md`.
10. Collapse the 18 breakpoints to 640 / 1024 / 1280, `min-width` only (10).

## Not covered

Only the homepage was measured. The site has ~60 pages; the programme,
condition and location templates share the section blocks and almost certainly
share these defects, but the per-page counts will differ. The Wix site at the
live domain was not audited.
