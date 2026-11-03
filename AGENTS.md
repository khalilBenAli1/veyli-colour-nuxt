# Veyli Colour

Independent original fictional makeup storefront. Preserve the expressive Syne/Figtree colour-wall direction and `/veyli-colour-nuxt/` static deployment base.

- Node 22.23.1 / npm 10.9.8. Project `.npmrc` pins standard peer resolution; never change host npm configuration. Install with `npm ci`.
- Commands: `npm run dev`, `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`, `npm run preview`.
- Route components compose features; pure pricing/cart/look/validation rules live in `domain`, fixture data in `data`, browser persistence in `adapters`, reactive bridges in typed composables and genuinely shared bag/wishlist state in Pinia.
- Keep contacts and dialog/form state local. Derive counts/totals from cart items. Never persist contact details or infer a complexion match.
- Look builder composes fixture colour stories; one lips, eyes and complexion-accent selection. Tint shades are excluded from automatic story defaults. Add-look is atomic and variant/stock aware.
- Namespaced storage owns only `veyli-colour:shop:v1`; validate known records, recover corrupt/blocked/unknown data and preserve other demos' storage.
- Explicit user close intent owns dialog state; native close events must not dismiss a newly reopened dialog.
- Media owner controls `public/images/**`, `docs/IMAGE_PROVENANCE.md`, `docs/image-prompts.json`. Do not overwrite or broad-format those files. Canonical small images use `-640.webp`.
- Verify meaningful regressions, public routes and hydration without suppressions. Compare overflow to clientWidth and increased-text ratios to original node baselines.
- Use intent-first Lore commits, verified milestone pushes, feature PRs and normal merge after green CI. No paid services, real payments or npm publication.
