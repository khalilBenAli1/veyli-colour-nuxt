# Delivery and verification

Veyli Colour was created in November 2026 as an original fictional makeup storefront. The public demo is awaiting the release workflow and independent public verification; no live URL is claimed here before it is checked.

## Verified application gate

- Clean frozen `npm ci` with project-local `legacy-peer-deps=false` and exact Node 22.23.1 / npm 10.9.8 baseline.
- ESLint and Prettier pass; strict Nuxt/TypeScript analysis passes.
- 38 unit/store/composable tests pass, covering atomic variant merging/stock/cents, reduced compatible stories, exact saved shade identity, valid-record field mutations, corrupt/unknown/blocked storage, other-demo sentinel preservation, per-Pinia isolation, supported customer formats and copied/frozen order data.
- 54 browser cases pass without retries across Chromium, actual touch-mobile context and WebKit. These cover discovery and same-turn URL updates/reload/reset, named-shade photos/unavailable states, saved-variant reload, quantity limits, reduced bundles and atomic stock failures, mobile menu/gallery keyboard focus, all 10 static product HTML routes and deliberate 404 behavior.
- All runtime page-error and hydration-mismatch assertions remain enabled. The manifest opt-out rationale and primary Nuxt sources are documented in [ARCHITECTURE.md](ARCHITECTURE.md).
- Critical text is checked at exact 2× against captured node baselines, with repeated application proving idempotence. Tests include prices, native form controls, 100-character unbroken names, long supported addresses and product names. Layout overflow compares document scroll width to clientWidth at 320/390/768/1440, never the expanding mobile visual viewport.
- The actual checkout journey checks first-error/review/confirmation focus, invalid unquoted punctuation followed by valid plus/apostrophe formats, no contact fields in browser storage or request URLs, no non-GET submissions, and a confirmation that remains unchanged after the bag/saved-shade reset.
- Stable reduced-motion automated WCAG A/AA scans report no findings on the tested home, catalogue, product and story surfaces. These support manual interaction checks and do not constitute certification.
- Twelve actual local export captures show zero runtime errors, hydration warnings, failed visible images or horizontal overflow. Root visual reviews passed the opening/shop/product/look/bag at 95 and checkout/confirmation at 94; these are internal visual assessments, not performance scores.

## Reproduction

```sh
npm ci
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
npx playwright install chromium webkit
npm run test:e2e
node scripts/measure.mjs
node scripts/capture.mjs
```

`npm run preview` serves the generated files at the production repository subpath on port 4204. Public checks use `DEMO_URL` with the same browser suite and capture helper.

## Intentional scope

The catalogue and stock are finite fictional data. The builder composes colour-tagged lips, eyes and complexion accents; it does not infer a skin tone or select a foundation match. Swatches/editorial makeup are illustrative, not a camera try-on or predicted result.

Checkout is local and simulated. No cards, real purchase, fulfilment, account, message service or saved contact record is implemented. Native browser storage can be unavailable; the current session remains usable. Physical-device and screen-reader certification were not performed.
