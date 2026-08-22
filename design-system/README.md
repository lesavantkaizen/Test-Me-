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

**Preferred — child theme.** Keeps the CSS in version control:

```php
// functions.php
add_action( 'wp_enqueue_scripts', function () {
    $base = get_stylesheet_directory_uri() . '/design-system/';
    $ver  = '1.0.0';
    wp_enqueue_style( 'ltw-tokens', $base . 'tokens.css', [], $ver );
    wp_enqueue_style( 'ltw-compat', $base . 'compat.css', [ 'ltw-tokens' ], $ver );
    wp_enqueue_style( 'ltw-fixes',  $base . 'fixes.css',  [ 'ltw-compat' ], $ver );
}, 100 ); // priority 100 so these load after Kadence
```

**Quicker — Customizer.** Paste the three files, in order, into
*Appearance → Customize → Additional CSS*. Works, but the CSS then lives only
in the database and drifts from this repo.

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
