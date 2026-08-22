# Launch To Wellness — Design System

Source of truth for colour, type, spacing, radius, elevation and motion on
[launchtowellness.com](https://www.launchtowellness.com) (WordPress + Kadence,
currently staged at `launchtowellne.wpenginepowered.com`).

See [`../AUDIT.md`](../AUDIT.md) for the findings that produced this.

## Files

| File | Purpose |
|---|---|
| `tokens.css` | The system. Every intentional value, declared once. |
| `compat.css` | Maps the 239 legacy custom properties onto the tokens. Temporary. |
| `fixes.css` | Corrective overrides for defects measured on the live page. |

## Installing

Load in this order — the order matters, `compat` must override the legacy
declarations and `fixes` must come last:

```
1. tokens.css
2. compat.css
3. fixes.css
```

### These must load in the footer, not the head

**43 `<style>` blocks are printed on the homepage, and 21 of them are in the
`<body>` — including 16 of the 19 hand-written section blocks.** Kadence emits
block CSS inline next to each block rather than in the head.

Anything loaded in `<head>` therefore comes *earlier in document order* than
those 16 blocks and loses every equal-specificity fight. This is measured, not
theoretical: injecting these three files in the head left 103 elements still
rendering Nunito Sans; injecting them before `</body>` cut that to 47.

That rules out *Appearance → Customize → Additional CSS*, which outputs to the
head. Use a child theme and hook the enqueue to `wp_footer`:

```php
// functions.php
add_action( 'wp_footer', function () {
    $base = get_stylesheet_directory_uri() . '/design-system/';
    $ver  = '1.0.0';
    wp_enqueue_style( 'ltw-tokens', $base . 'tokens.css', [], $ver );
    wp_enqueue_style( 'ltw-compat', $base . 'compat.css', [ 'ltw-tokens' ], $ver );
    wp_enqueue_style( 'ltw-fixes',  $base . 'fixes.css',  [ 'ltw-compat' ], $ver );
}, 1 );
```

A stylesheet in the footer is unusual and it does mean these rules are not
present at first paint. That is the correct trade here — they are corrections
layered over CSS that cannot be edited, and the alternative is an
`!important` arms race. As sections are migrated onto the tokens (see
*Migration*), move the enqueue back to `wp_enqueue_scripts` in the head.

### What CSS still cannot reach

After the footer enqueue, ~47 elements still render Nunito Sans. These are the
Kadence **header and navigation blocks**, whose CSS uses deliberately repeated
class selectors (`.kb-link-wrap.kb-link-wrap.kb-link-wrap`) to outrank
everything.

Do not fight those with CSS. Change them at source: *Customize → Typography*
for the global faces, and the header block's own typography settings in the
editor. Setting both to Inter resolves the remainder.

## Rules

1. **No raw values in component CSS.** No hex codes, no `px` font sizes, no
   ad-hoc spacing. Reference a token or add one here first.
2. **Components use the semantic roles**, not the base ramp. Use
   `var(--ltw-text-secondary)`, not `var(--ltw-slate)`. The ramp is the
   palette; the roles are the contract.
3. **Three breakpoints, `min-width` only**: 640px, 1024px, 1280px. Never write
   a `max-width` query — scope to the next step up instead.
4. **14px is the type floor.** No token below it exists. The one exception is
   `--ltw-text-eyebrow` (13px), which is only legible because it carries
   uppercase + 600 weight + wide tracking. Do not use it for sentences.
5. **`#e8a15b` is never text on a light background.** It measures 2.17:1 on
   white. Use `--ltw-text-accent` (`#9a5f22`, 5.21:1) for accent text, and
   keep the orange for fills, rules and icons on navy.

## Fonts

**Fraunces** for display, **Inter** for everything else. Nunito Sans is retired.

Install exactly these faces — a weight referenced but not installed gets
synthesised by the browser, which looks subtly wrong:

| Family | Weights | Styles |
|---|---|---|
| Fraunces | 600, 700 | upright |
| Inter | 400, 500, 600, 700 | upright |

Six faces. The live site currently carries **34** (1.24MB).

### Type roles

| Role | Face | Size |
|---|---|---|
| h1–h4, page titles, hero titles | **Fraunces** | the `--ltw-text-h*` scale |
| **Card headings** | **Inter**, 700 | `--ltw-text-card-title` — 16px |
| Body, lede, UI, labels, meta, eyebrows, buttons, nav | **Inter** | the matching token |

**A card heading is the only place Inter is used as a heading face.** It is
16px/700 — the same size as the card's body copy, on purpose. Weight and the
uppercase treatment carry the distinction; matching the size keeps cards
compact and stops card titles competing with section headings. At 16px a
display serif goes muddy, which is why Fraunces does not run here.

Measured after applying this: all **49** card headings render at 16px/700
Inter, and 24 of the 26 non-card headings render Fraunces. The two exceptions
are the header site title and a mega-menu label, both of which are marked up as
headings but are really chrome — see T1 in `fixes.css`.

One judgement call is flagged inline: four accordion item titles are *not*
cards, so by this rule they take Fraunces. If they should follow the card rule
instead, `fixes.css` says which block to delete.

### Inter is not yet loaded

Measured on the live page: Inter appears in seven font stacks but has **no
`@font-face` anywhere on the site**. It exists only inside Kadence's remote
Google Fonts request, so it silently falls back to a system font whenever that
request is slow or blocked — which is most of why type looks inconsistent
between sections.

Fraunces and Nunito Sans *are* self-hosted, via the **WordPress Font Library**
(the page carries `class="wp-fonts-local"`). Inter was simply never added there.

**To fix, in order:**

1. *Appearance → Editor → Styles → Typography → Fonts → Install Fonts →*
   install **Inter** at 400/500/600/700, upright only.
2. Remove **Nunito Sans** from the Library — 16 faces, 620KB.
3. Trim **Fraunces** from 18 faces to 600/700 upright — saves ~548KB.
4. Once both families are local, drop Kadence's remote Google Fonts request
   (handle `kadence-fonts-gfonts`). Pointing Kadence's typography settings at
   the Library fonts normally stops it; otherwise dequeue it in the child theme:

```php
add_action( 'wp_enqueue_scripts', function () {
    wp_dequeue_style( 'kadence-fonts-gfonts' );
    wp_deregister_style( 'kadence-fonts-gfonts' );
}, 20 );
```

Net: ~1.06MB less font weight and no render-blocking third-party request.

Until step 1 is done, `--ltw-font-ui` falls through to the next entry in its
stack. Nothing breaks — it just isn't Inter yet.

## Colour contrast

Every semantic pairing in `tokens.css` was verified against WCAG 2.1 AA
(4.5:1 for body text). All 20 pairings pass; the tightest is
`--ltw-text-secondary` on `--ltw-mist` at 4.53:1.

Re-check after any palette change:

```bash
python3 - <<'PY'
def lum(h):
    h = h.lstrip('#')
    r, g, b = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

print(round(ratio('#9a5f22', '#ffffff'), 2))
PY
```

## Kadence alignment

The colour ramp is deliberately identical to the Kadence global palette, so
the theme's colour controls and these tokens cannot disagree. If a palette
slot changes in *Appearance → Customize → Colors*, change the matching token
here in the same commit.

| Kadence | Token | Value |
|---|---|---|
| palette1 | `--ltw-blue` | `#1b6084` |
| palette2 | `--ltw-navy` | `#0e2c3d` |
| palette3 | `--ltw-ink` | `#172d38` |
| palette4 | `--ltw-slate` | `#526671` |
| palette5 | `--ltw-mist` | `#d9e1e4` |
| palette6 | `--ltw-cloud` | `#eef2f2` |
| palette7 | `--ltw-white` | `#ffffff` |
| palette8 | `--ltw-sky-wash` | `#e8f4f9` |
| palette9 | `--ltw-ivory` | `#f7f4ee` |
| palette10 | `--ltw-orange` | `#e8a15b` |
| palette11 | `--ltw-success` | `#13612e` |
| palette12 | `--ltw-info` | `#397a9d` |
| palette13 | `--ltw-danger` | `#b84a4a` |
| palette14 | `--ltw-amber-text` | `#9a5f22` |

`palette15` duplicates `palette10` and should be retired.

## Migration

`compat.css` and the `!important` rules in `fixes.css` exist because the site
carries 251KB of hand-written CSS across 20 scoped section blocks that this
layer cannot edit. They are scaffolding, not architecture.

Per section block, in order of how much they hurt:

1. `ltw-wp-help`, `ltw-wp-acc`, `ltw-wp-services` — the largest blocks.
2. Replace local `--navy` / `--blue` / `--ink` declarations with the `--ltw-*`
   tokens, then delete those lines from `compat.css`.
3. Replace `px` font sizes and spacing with scale tokens.
4. Rewrite `max-width` queries as `min-width` at 640 / 1024 / 1280.
5. Drop the block's `!important` rules once nothing outranks it.

`compat.css` is finished when it is empty. Until then, treat a growing
`compat.css` as a regression.

## Verifying a change

The audit measurements were taken by mirroring the live page and rendering it
in headless Chromium. To re-measure after a change, capture the rendered
computed styles rather than reading the CSS — the source and the render
disagree in exactly the places that matter:

```js
// distinct rendered heading sizes, per level
const sizes = {};
for (const el of document.querySelectorAll('h1,h2,h3,h4')) {
  const level = el.tagName;
  const size  = getComputedStyle(el).fontSize;
  (sizes[level] ??= {})[size] = (sizes[level][size] || 0) + 1;
}
console.table(sizes);
```
