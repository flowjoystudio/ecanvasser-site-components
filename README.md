# Ecanvasser site components

Interactive components for the Ecanvasser Webflow site, served from this repo via [jsDelivr](https://www.jsdelivr.com/).
Webflow only holds a tiny loader embed; the component code loads from the CDN when the visitor scrolls near it, so page speed isn't affected.

> This repo is **public** (jsDelivr only serves public repos). Never commit keys, tokens or private data.

## Components

| Component | Source | Built files | Webflow embed |
|---|---|---|---|
| Trial page demo ("a day in the field") | `src/trial-demo/` | `dist/trial-demo.js`, `dist/trial-demo.css`, `dist/img/` | `loader/trial-demo-embed.html` |

## Working on it

```bash
npm install
npm run build        # builds dist/ from src/
npm run serve        # then open http://localhost:8080/test/trial-demo.html
```

- `src/trial-demo/markup.html` – the demo's HTML (inlined into the JS at build time)
- `src/trial-demo/demo.css` – styles, all scoped to `#ec-demo`
- `src/trial-demo/demo.src.js` – behaviour
- `test/trial-demo.html` – local test page using the same loader, pointed at `../dist/`

## Releasing

1. `npm run build` and commit `dist/` (jsDelivr serves the committed files). Push to `main`.
2. Copy that commit's full hash (or tag it, e.g. `v1.0.1`, via GitHub → Releases → Draft a new release).
3. In Webflow, set `VERSION` in the trial page's code embed to the hash or tag (it's also in the poster `src`) and publish.

Rolling back = put the previous hash/tag back in the embed.

**Always reference a commit hash or tag**, never a branch (`@main`): those files are cached for a year and never change; branch files are cached for 12 hours, so updates appear unpredictably.

### Release log

| Version | Commit | Notes |
|---|---|---|
| v1.0.0 | `64054ce2d6340eb4ce0cf27505ab43fb0f4f83f3` | First release: trial page demo (desktop layout) |

## How the loader works

- The embed contains a `#ec-demo` container showing a static poster image (same size as the demo, so nothing jumps), plus a small script.
- When the container is within ~one screen of the viewport, it loads the CSS, then the JS.
- The JS replaces the poster with the live demo. If anything fails to load, the poster stays (it links to the sign-up).
- Personalisation reads `sessionStorage.ec_trial` (written by the Talk to Sales form). GTM events are pushed to `window.dataLayer`.

## Moving host later

The CDN address only lives in the loader (`BASE`). To move to e.g. `assets.ecanvasser.com`, change that one line.
