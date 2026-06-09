# Hallucinogens page — sectioned for SEO on Wix

The original page was **one self-contained HTML document** meant to drop into a
single Wix **"Embed HTML" / Custom Element** widget. That's the thing hurting SEO.
This folder breaks it into discrete, labeled sections and pulls the SEO assets out
of the dead `<head>` so they can go where Wix actually reads them.

## Why the single embed was the problem

A Wix HTML embed renders inside a **sandboxed `<iframe>`** served from a different
domain. So, for the page URL that's supposed to rank:

| Inside the embed | What Google does with it |
|---|---|
| `<h1>`, `<h2>`s, body copy | Not attributed to the page — effectively invisible |
| `<title>` / `<meta description>` / canonical | **Ignored** — Wix owns the real `<head>` |
| JSON-LD schema (Medical/FAQ/Breadcrumb) | Not read for this URL |
| Internal links (dual diagnosis, anxiety, …) | Pass **no** internal link equity |

**The fix isn't "smaller embeds" — it's going native.** Rebuild each block below
as a real Wix Studio **Section** using native Heading / Text / Button / Repeater /
Accordion elements. Then everything is in the page's own DOM and fully crawlable.

## What's in this folder

```
hallucinogens-page/
├── index.html                  # full page reassembled (preview + single-embed fallback)
├── styles.css                  # shared CSS extracted once (no per-section duplication)
├── sections/                   # the page split into 12 labeled blocks
│   ├── 01-hero.html
│   ├── 02-what-are-hallucinogens.html
│   ├── 03-signs-and-symptoms.html
│   ├── 04-risks.html
│   ├── 05-hallucinogens-vs-therapeutic-psychedelics.html
│   ├── 06-withdrawal-and-recovery.html
│   ├── 07-dual-diagnosis.html
│   ├── 08-levels-of-care.html
│   ├── 09-included-services.html
│   ├── 10-faq.html
│   ├── 11-cta.html
│   └── 12-related.html
└── seo/
    ├── meta-tags.md            # title/description/canonical/OG -> Wix SEO panel
    └── structured-data.json    # JSON-LD -> Wix Advanced SEO -> Structured Data
```

Each `sections/*.html` file starts with a comment block telling you the **native
Wix mapping** and the **correct heading level** for that block.

## Section map & heading hierarchy

One `<h1>` per page (Wix enforces this); every section title is an `<h2>`; card
titles and FAQ questions are `<h3>`.

| # | Section | Heading | Native Wix element |
|---|---|---|---|
| 01 | Hero | **H1** | Heading + Paragraph + Buttons + cards (decorative animation may stay a tiny embed) |
| 02 | What Are Hallucinogens? | H2 | Heading + 2 Paragraphs + tags |
| 03 | Signs & Symptoms | H2 / H3×3 | Repeater of 3 cards, each H3 + native list |
| 04 | Risks of Misuse | H2 / H3×6 | Repeater of 6 cards (H3 + text) |
| 05 | Hallucinogens vs. Therapeutic Psychedelics | H2 | Heading + 2 Paragraphs |
| 06 | Withdrawal & Recovery | H2 | Heading + 2 Paragraphs + tags |
| 07 | Dual Diagnosis | H2 | Heading + Paragraph (native internal links) + linked tags |
| 08 | Levels of Care (PHP/IOP/OP) | H2 / H3×3 | Repeater, abbreviation as H3 |
| 09 | Included Services | H2 | Heading + linked tags + Paragraph |
| 10 | FAQ | H2 / H3×5 | Native **Accordion**; questions as H3 |
| 11 | Closing CTA | H2 | Heading + Paragraph + Buttons (styled Box bg) |
| 12 | Related Care | H2 | Heading + native internal links |

## Do this in Wix Studio

1. **Move meta tags** → `seo/meta-tags.md` → Page SEO panel (Basics + Advanced + Social Share).
2. **Move schema** → `seo/structured-data.json` → Advanced SEO → Structured Data Markup.
   - Check Wix isn't already auto-emitting a Breadcrumb/FAQ schema to avoid duplicates.
   - Keep FAQ schema text identical to the visible FAQ, or Google drops it.
3. **Rebuild sections 02–12 natively** (Heading/Text/Repeater/Accordion). This is
   where ~95% of the SEO gain is — it makes the body text and internal links real.
4. **Hero**: native H1 + copy + buttons; keep only the decorative "Distortion to
   Clarity" SVG as a small embed if you want the animation.
5. **Images**: there are no `<img>` tags yet (all icons are inline SVG). When you
   add real images, give each descriptive `alt` text and enable lazy-loading.

## Copy fixes worth making while you rebuild (quality = on-page SEO)

- **§07** "hallucinogen use frequently overlaps…" → capitalize **"Hallucinogen"** (sentence start).
- **§08** "Recovery from hallucinogen works best" → "Recovery from hallucinogen **use** works best".
- **§11** "If hallucinogen is affecting your life" → "If hallucinogen **use** is affecting your life".

## Quick wins beyond the restructure

- **H1 carries no keyword.** Current: *"When perception bends, life follows. We help
  it come back into focus."* Keep the voice but work "hallucinogen" in, or ensure the
  §02 H2/intro carries "hallucinogen misuse treatment" prominently.
- **Title tag is ~86 chars** — likely truncated in SERPs. A tighter variant is in
  `seo/meta-tags.md`.
- **Add an OG image** (1200×630) — none exists; share CTR suffers without one.
- After publishing, validate with **Google Rich Results Test** and re-request
  indexing in Search Console.
```
