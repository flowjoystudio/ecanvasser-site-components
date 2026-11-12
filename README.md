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
| v1.1.0 | `9d1d3f3a9c0dcbfadfb88da054f4c398dbbca7c0` | Responsive layout, mobile still image, outcome-coloured interaction gradient |
| v1.2.0 | `4f5e28e39e478ce90f5467d7b77767e289a4c5d3` | Final screen: soft grey, vertically centred stat cards |
| v1.3.0 | `2e74a2033a69e429e0c7efeb87f7938a3c5b7d69` | Narrow screens: prompt + dimming when viewing the device with nothing to do |
| v1.4.0 | `86cd82aa2d2215d2be7fddd1bc7071c55018b9c4` | Narrow screens: prompt bar removed; cyan pulse on the tab with the next step |
| v1.4.1 | `34f1464d3ac72dd56b3102092486b6f67870ca77` | Narrow screens: no fade on the idle device |
| v1.4.2 | `7ab2c82589b0993eb0cc665c75abc2849a199b29` | Device shadows no longer clipped; still images regenerated |
| v1.4.3 | `17046d13e322f52b28de79238aa3b1541a90adf0` | Visitor avatar shows their initial (or a person icon); step one pulses the map and "Draw it for me" |
| v1.4.4 | `2c4fc339c1eff47d4b91f39c1d20554ba73afd27` | Step one map prompt: solid cyan ring inside the map, under the controls (fixed an animation name clash that made it vanish) |
| v1.4.5 | `ae754b38d3dd11a102563f9653a5d5d5fbd40328` | Step one prompt replaced by a looping cyan polygon being clicked out on the map (polygon mode); prompt comes back after Cancel; stills show the finished shape |
| v1.4.6 | `310f3ca562481021df8c268ab4c663873bead731` | Free Draw version of the step one prompt (a loop drawn with a dot following); optional company logo on the phone from the work email via Brandfetch, switched on by data-brandfetch-id on the loader |

## Responsive behaviour

- The demo measures its own container (not the window), so it behaves the same in any Webflow column.
- **900px and wider:** desktop and phone side by side, scaled down proportionally to fit.
- **Under 900px:** one device at a time, with a "Web app / Mobile app" switch. It changes automatically with each step; a red badge on the other tab shows when something has changed there (e.g. a door logged on the web map).
- Still images: `poster.webp` (wide) and `poster-mobile.webp` (narrow). Regenerate after visual changes: `npm run build && python3 test/posters.py`.

## How the loader works

- The embed contains a `#ec-demo` container showing a static poster image (same size as the demo, so nothing jumps), plus a small script.
- When the container is within ~one screen of the viewport, it loads the CSS, then the JS.
- The JS replaces the poster with the live demo. If anything fails to load, the poster stays (it links to the sign-up).
- Personalisation reads `sessionStorage.ec_trial` (written by the Talk to Sales form). GTM events are pushed to `window.dataLayer`.

## Moving host later

The CDN address only lives in the loader (`BASE`). To move to e.g. `assets.ecanvasser.com`, change that one line.
