# Meta tags → Wix SEO panel

These were inside the embed's `<head>`, where **Wix ignores them**. Re-enter them
in **Wix Studio → Pages → Hallucinogens → SEO (gear icon)**. The embed's `<head>`
does nothing for SEO — Wix owns the real document head.

## SEO Basics tab
| Field | Value |
|---|---|
| **Title tag** | `Hallucinogen Misuse Treatment (LSD, Psilocybin, PCP, Ketamine) — Launch To Wellness` |
| **Meta description** | `Treatment for hallucinogen misuse — LSD, psilocybin, PCP, ketamine & DMT. Learn the risks, HPPD, and how hallucinogens differ from therapeutic psychedelics.` |
| **URL slug** | `hallucinogens` (full path: `/what-we-treat/substance-use-treatment/hallucinogens`) |

> Title is 86 chars — slightly long; Google may truncate around ~60. A tighter
> alt: `Hallucinogen Misuse Treatment (LSD, Psilocybin, Ketamine) | Launch To Wellness`.

## Advanced SEO tab
| Tag | Value |
|---|---|
| **Canonical** | `https://www.launchtowellness.com/what-we-treat/substance-use-treatment/hallucinogens` |
| **robots** | `index, follow` (default — confirm it's not set to noindex) |
| **Structured data** | Add the JSON-LD from `../seo/structured-data.json` here |

> In Wix, the canonical is normally auto-set to the page's own URL. Only override
> it in Advanced SEO if you intend to point elsewhere. Don't hand-set it to the
> same URL unless you've confirmed Wix isn't already emitting one (avoid duplicate
> canonical tags).

## Social Share tab (Open Graph)
| Field | Value |
|---|---|
| **og:title** | `Hallucinogen Misuse Treatment (LSD, Psilocybin, PCP, Ketamine) — Launch To Wellness` |
| **og:description** | `Treatment for hallucinogen misuse — LSD, psilocybin, PCP, ketamine & DMT. Learn the risks, HPPD, and how hallucinogens differ from therapeutic psychedelics.` |
| **og:type** | `website` |
| **og:image** | *(none in source — add a 1200×630 share image; pages with an OG image get far better CTR when shared)* |

## Fonts note
The embed loads **Fraunces** + **Nunito Sans** from Google Fonts. If you rebuild
sections natively, set these as the site's Wix theme fonts instead so you're not
loading Google Fonts inside an iframe (faster, consistent typography).
