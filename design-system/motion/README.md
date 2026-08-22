# Motion repair

Five of the 24 JavaScript blocks embedded in the homepage are corrupted. Four
of them fail to parse at all, which kills every interaction and animation they
drive.

**This is unrelated to the design-system work in the parent folder.** It was
already present in the 22 August snapshot, and the scripts are byte-identical
between then and the 21 August page update — so this corruption predates both.
The token CSS has never been deployed to the site.

## What is wrong

The scripts are embedded as `data:text/javascript;base64,…` URIs. Decoding them
shows the JavaScript was HTML-encoded **before** it was base64-encoded:

```js
if (event.key === "Escape" &#038;&#038; current) {   // should be &&
```

WordPress converts `&` to `&#038;` when it processes content. Whoever encoded
these blocks encoded the already-mangled text, baking the corruption in
permanently. Base64 then hid it from view — the page source looks fine, and
nothing surfaces until the browser tries to run it.

11 corrupted operators across 5 scripts. Four die on parse:

| Script | Section | Corrupted | Effect |
|---|---|---|---|
| `accreditation-panel.js` | "Verified and Accredited Care" | 2 | Dead. Clicking a credential does nothing. |
| `audience-spine.js` | "Who We Support" | 2 | Dead. Reveals never fire. |
| `help-cards.js` | Help cards | 2 | Dead. Card detail interaction lost. |
| `space-gallery.js` | "A Space Built Around You" | 2 | Dead. Gallery lightbox lost. |
| `video-embed.js` | Video embed | 3 | Parses, but builds a broken YouTube URL. |

`video-embed.js` is the subtle one — it still runs, but produces:

```
…/embed/pHIBaMqHp2A?autoplay=1&#038;rel=0&#038;modestbranding=1&#038;playsinline=1
```

YouTube sees one malformed parameter instead of four, so autoplay, related-video
suppression and inline playback are all silently ignored.

## The second problem: orphaned reveals

Separately, **27 of the 35 `.ltw-reveal` elements on the page never animate.**
Each section ships its own `IntersectionObserver` scoped to its own wrapper, and
several sections have no observer at all — including `.ltw-es`, the "Integrated
Mental Health & Substance Use Treatment" block.

Nothing is stuck invisible; those elements render at full opacity, so the page
reads correctly. They simply never move. That is the missing scroll motion in
the Mental Health section: not a broken animation, an absent one.

`reveal-fallback.js` adopts any `.ltw-reveal` no other observer has claimed. It
waits a tick so each section's own observer wins first, never removes
`is-visible`, honours `prefers-reduced-motion`, and is safe to run twice.

## Measured, before and after

Applied to a full local mirror of the live page:

| | Before | After |
|---|---|---|
| JavaScript parse errors | 4 | **0** |
| `.ltw-reveal` elements animating | 8 / 35 | **35 / 35** |
| Credential panel opens on click | no | **yes** |
| Accreditation root reaches `is-ready` | `false` | **`true`** |

Clicking a credential before the fix does nothing at all. After, the panel opens
to 211px with the correct title ("California DHCS Licensed").

## Applying it

### 1. The four broken scripts

Each lives in a Custom HTML block on the homepage. For each one:

1. Edit the block containing the `<script src="data:text/javascript;base64,…">`.
2. Replace the whole `src` value with the matching line from `data-uris.txt`.
3. Update, then hard-reload the page.

The corrected base64 contains no `&`, so WordPress has nothing left to mangle
and the fix stays fixed.

The readable sources are in this folder (`accreditation-panel.js` etc.) if you
would rather re-encode them yourself:

```bash
base64 -w0 accreditation-panel.js
```

### 2. The reveal fallback

Add `reveal-fallback.js` to the child theme and enqueue it in the footer, after
the section scripts:

```php
add_action( 'wp_footer', function () {
    wp_enqueue_script(
        'ltw-reveal-fallback',
        get_stylesheet_directory_uri() . '/design-system/motion/reveal-fallback.js',
        [], '1.0.0', true
    );
}, 20 );
```

## Stop this recurring

Base64 in a `data:` URI is what let a mangled script ship silently. Two changes
prevent a repeat:

1. **Move this JavaScript into the child theme** as real `.js` files and enqueue
   them. WordPress never rewrites an enqueued file, the code becomes reviewable
   and diffable, and it starts being cacheable.
2. Until then, **never paste JavaScript straight into a Custom HTML block.**
   `&&`, `<`, `>` and `&` in query strings all get encoded.

A quick check for corruption anywhere on the site — this finds the pattern
whether or not it is base64-wrapped:

```bash
curl -s -A "Mozilla/5.0" https://launchtowellne.wpenginepowered.com/ \
| grep -o 'base64,[A-Za-z0-9+/=]*' | sed 's/^base64,//' \
| python3 -c "
import sys, base64
bad = 0
for line in sys.stdin:
    s = line.strip()
    try:
        t = base64.b64decode(s + '=' * (-len(s) % 4)).decode('utf-8', 'replace')
    except Exception:
        continue
    bad += t.count('&#038;')
print('corrupted operators found:', bad)
"
```

Against the homepage today this prints `11`. Anything above `0` means scripts
are corrupted. Run it against the other templates too — only the homepage was
checked here.

(A pure-shell version of this is unreliable: unpadded base64 makes `base64 -d`
bail silently, which reports a clean `0` on a corrupted page.)
