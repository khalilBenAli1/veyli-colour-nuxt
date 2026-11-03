# Veyli Colour

An expressive makeup storefront with **Nuxt 4, Vue Composition API, strict TypeScript and Pinia**. Original fictional brand, created in November 2026.

![Veyli's actual colour-wall interface](docs/screenshots/home-desktop.jpg)

Public demo publication is pending the final release workflow and public checks.

## Colour, chosen by you

- Ten products and thirty named shades across lips, eyes and complexion, with category/finish/family/price filters, sorting, search and URL state.
- Matching open Satin Stroke photographs for Berry/Rose/Brick; other opaque closed cases remain genuinely shade-neutral. Selected shade names, families and availability stay visible.
- A variant-aware saved-shade list that restores the exact choice after reload, including an unavailable favourite.
- An editable colour-story builder: choose a mood, change or remove lips/eyes/complexion accents, see the current subtotal and add every remaining compatible piece atomically.
- A persistent bag with correct variant merging, integer-cent totals, source-stock limits and standard delivery (€5 below €75, included otherwise).
- A local checkout with supported format checks, useful focus/error feedback, sample details and a copied/frozen confirmation that cannot change when the bag or saved shades reset.
- A distinct Syne/Figtree visual system, original inclusive editorial imagery, named colour controls, mobile menu, native dialogs and reduced-motion support.

The builder pairs explicit colour-story tags; it does not infer skin tone, choose a foundation match or offer camera try-on. Swatches/editorial images are illustrative, not a prediction of colour on skin. This portfolio app makes no real purchase, payment, delivery, account or message.

## Run it

Use **Node 22.23.1 / npm 10.9.8**. Exact packages and the frozen lockfile are committed; the project pins standard peer resolution without changing host settings.

```sh
npm ci
npm run dev
```

Local URL: `http://127.0.0.1:4204/veyli-colour-nuxt/`.

```sh
npm run build
npm run preview
```

Nuxt generates real HTML for all 10 product routes and the six site routes under the repository base. The deliberate 404 page and direct route refreshes work with static hosting.

## Try the full journey

1. Filter the shop or open Satin Stroke. Switch Berry/Rose/Brick: the named choice and matching photo change; Brick demonstrates unavailable stock.
2. Save Rose, then reload the saved-shades page. It returns as Rose, rather than a generic product.
3. Build a Rose Play colour story. Remove Eyes: the remaining two-piece subtotal becomes €68 and can be added to the bag. A stock conflict rejects the whole addition.
4. Continue to checkout, use sample details, acknowledge the demo and finish. Reset the bag/saved shades: the confirmed edit keeps its original lines and total.

Bag/saved choices use `veyli-colour:shop:v1`. Only validated product IDs, shade IDs and quantities are persisted. Contact fields stay in feature memory; email, full name, consent and the confirmation are excluded from browser storage. Reset removes this app's key alone.

## Checks and evidence

```sh
npm run lint
npm run format:check
npm run typecheck
npm test
npx playwright install chromium webkit
npm run test:e2e
node scripts/measure.mjs
node scripts/capture.mjs
```

The verified local release gate contains **38 unit/store/composable tests** and **54 browser cases without retries** across Chromium, touch-mobile Chromium and WebKit. It covers same-turn URL changes, source-stock/cents/atomicity, malformed-record recovery, cross-demo storage preservation, request-scoped stores, cold default/query hydration, supported email formats, keyboard/focus, privacy, immutable confirmation, narrow unbroken text and exact idempotent 2× scaling. Layouts use clientWidth assertions at 320/390/768/1440. Automated accessibility scans complement interaction/visual checks; no certification or Lighthouse score is claimed.

- [Architecture and data flow](docs/ARCHITECTURE.md)
- [Delivery checks and limits](docs/DELIVERY.md)
- [Actual screenshots](docs/screenshots)
- [Measured build payload](docs/payload-report.json)
- [Image/font provenance](ASSETS.md)
- [Runtime and pinned Node 24 Actions](docs/RUNTIME_AND_CI.md)

GitHub Actions uses frozen installation, strict checks, the full browser suite and immutable official Node 24 action commits. Pages deployment runs only after a passing main build. The optional runtime build-manifest lookup is disabled for this explicitly generated local-fixture app; primary sources and the reason are documented in the architecture notes.

Original code is MIT-licensed. Generated images and OFL fonts retain their separate notices.
