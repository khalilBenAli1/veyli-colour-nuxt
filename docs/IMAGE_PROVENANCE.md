# Veyli Colour image provenance

Original illustrative beauty photography created **November 3, 2026** for this fictional portfolio application, using the **built-in Image Generation tool**. Sixteen separate asset calls produced ten distinct closed product packages, three open Satin Stroke shade photographs, and three campaign images. No API key, CLI image-generation fallback, paid third-party agent, real-brand artwork, stock image, private client photo, or previous portfolio brand image was used.

All selected source outputs were visually inspected before export. Exact prompts, source-master identifiers and SHA-256 digests, reference roles, actual native dimensions, delivery dimensions, byte counts, opacity and full SHA-256 hashes are recorded in [image-prompts.json](image-prompts.json). Raw giant PNG masters remain outside the Git repository in the local built-in generation archive; the public app uses only the optimized local WebP files.

## Asset contract and visual treatment

The canonical names and packaging follow PRODUCT_IMAGE_BRIEF.json. Warm-white/blush studio surfaces, deep-burgundy details, pearl and silver packaging, and expressive berry/coral/plum/gold campaign colours establish Veyli’s own beauty-editorial direction. There are no embedded UI labels, logotypes, third-party brand logos or watermarks. Font and application-code licensing are maintained separately by the application owner.

- **Ten distinct closed packages:** every catalog package is genuinely closed and opaque, with no visible shade-specific liquid, powder, cream or bullet. A single neutral package image can therefore represent that product’s fixture shades without showing a contradictory pigment. Square, round, oval, tapered, pearl, silver-spined and rectangular silhouettes distinguish the SKUs.
- **Three open Satin Stroke variants:** Berry was edited from the inspected canonical closed silver/burgundy package. Rose and Brick were colour-only edits of the inspected open Berry photograph, with the canonical closed package also supplied as a geometry reference. The silver barrel, burgundy join, removed cap, framing and light remain visually consistent. The intended fixture colours are Berry `#75243f`, Rose `#ad6475`, and Brick `#a44736`.
- **Three campaigns:** a fictional adult Black model, a fictional adult androgynous light-freckled model, and an original tactile pigment macro. Both portraits are appropriate beauty-editorial crops of clothed fictional adults, requested without celebrity likeness. Campaign makeup is artistic illustration, not a customer skin-match, camera try-on, exact on-skin result or performance guarantee.

## Native versus delivery size

The prompts requested particular working dimensions; the table reports the dimensions the tool **actually returned**, rather than treating the requested dimensions as generated resolution. Fourteen source images are downsampled for their full delivery versions. The two portrait masters are 1122×1402 and are **mildly upscaled by approximately 6.95% in width** to the agreed 1200px full size; their 640px siblings are downsampled. No native 4K claim is made. Aspect ratios are preserved, so the portraits export as 1200×1499 and 640×800, and the landscape pigment image as 1200×800 and 640×427.

| Canonical full file | Actual native PNG | Full WebP | Full bytes | Small WebP | Small bytes |
| --- | --- | --- | ---: | --- | ---: |
| `satin-stroke-pack.webp` | 1254×1254 | 1200×1200 | 19,802 | 640×640 | 6,666 |
| `mirror-glaze-pack.webp` | 1254×1254 | 1200×1200 | 18,062 | 640×640 | 6,350 |
| `line-theory-pack.webp` | 1254×1254 | 1200×1200 | 19,322 | 640×640 | 6,508 |
| `velvet-stain-pack.webp` | 1254×1254 | 1200×1200 | 16,440 | 640×640 | 5,772 |
| `fourfold-eyes-pack.webp` | 1254×1254 | 1200×1200 | 50,806 | 640×640 | 11,662 |
| `fine-gesture-pack.webp` | 1254×1254 | 1200×1200 | 18,362 | 640×640 | 7,292 |
| `lash-form-pack.webp` | 1254×1254 | 1200×1200 | 18,418 | 640×640 | 7,576 |
| `sheer-canvas-pack.webp` | 1254×1254 | 1200×1200 | 20,848 | 640×640 | 6,776 |
| `soft-signal-pack.webp` | 1254×1254 | 1200×1200 | 34,646 | 640×640 | 8,652 |
| `light-index-pack.webp` | 1254×1254 | 1200×1200 | 38,954 | 640×640 | 10,380 |
| `satin-stroke-berry.webp` | 1254×1254 | 1200×1200 | 28,022 | 640×640 | 9,426 |
| `satin-stroke-rose.webp` | 1254×1254 | 1200×1200 | 27,600 | 640×640 | 9,596 |
| `satin-stroke-brick.webp` | 1254×1254 | 1200×1200 | 29,756 | 640×640 | 9,692 |
| `campaign-deep-skin.webp` | 1122×1402 | 1200×1499 (upscaled) | 115,320 | 640×800 | 35,826 |
| `campaign-freckled-skin.webp` | 1122×1402 | 1200×1499 (upscaled) | 139,296 | 640×800 | 44,790 |
| `campaign-pigments.webp` | 1536×1024 | 1200×800 | 196,736 | 640×427 | 56,672 |

Each small filename is the canonical stem followed by `-640.webp`. Files live in `public/images/`; for example `satin-stroke-pack.webp` pairs with `satin-stroke-pack-640.webp`. The application owner confirmed this filename and shape contract before integration.

## Processing and verification

Delivery processing used **Sharp 0.35.5** from the existing bundled runtime, with no new dependency added: orientation normalization, opaque flattening against warm white, aspect-preserving width resize, and WebP quality 82 / effort 6. Processing did not change product colours, recolour people, create fake alternate SKUs, or add labels. The open-shade changes were performed by Image Generation using the documented references.

Verified after export:

- Exactly **16 canonical assets and 32 WebP files** matching the brief: 10 closed packages, 3 open shades, 3 campaigns, each at 1200px and 640px width.
- Every file decodes, has the expected dimensions, is opaque, and matches its recorded SHA-256 hash.
- All 32 delivery hashes are unique; the ten closed SKUs do not reuse one photograph as different products.
- Full-size files total **792,390 bytes**; small files total **243,636 bytes**; all 32 total **1,036,026 bytes**. The largest delivery file is the 1200px pigment macro at **196,736 bytes**.
- No rejected generation was selected and no existing app-owner file was overwritten. No application, package, font or Git files were edited by the media role.

## Interpretation limits

Images are AI-generated illustrative artwork of fictional packaging and people. Photographic lighting, highlights, screen rendering and compression affect perceived pigment colours; the named hex values remain the fixture/UI reference, not a colour-calibrated match or prediction on anyone’s skin. Generated package geometry is visually consistent, not manufacturing/CAD evidence. Asset provenance does not assert real product availability, certifications, medical effects, endorsements or exclusive legal rights in generated artwork.
