# Runtime and deployment baseline

Verified 2026-11-03 against the package registry, official Nuxt/Pinia documentation and the current official Actions releases.

- Nuxt 4.6.4 supports Node `^22.22.3 || ^24.15.0 || >=26.0.0`; app baseline 22.23.1 satisfies that range. Vue/Pinia/module versions are exact in the lockfile.
- TypeScript 6 is the supported lint/type baseline for the installed TypeScript-ESLint integration. No forced peers or disabled checks are used.
- A clean `npm ci` completed with project-local `legacy-peer-deps=false` before the foundation checks.
- Nuxt's static generation emits real HTML for the 10 product routes and site pages. The explicit repository base is `/veyli-colour-nuxt/`; preview serves those built files at the same base.
- The app's Node baseline is independent of the Actions runtime. Official release action metadata was checked for Node 24, then pinned to immutable full commits.

| Action                | Official release | Commit                                     | Runtime                                       |
| --------------------- | ---------------- | ------------------------------------------ | --------------------------------------------- |
| checkout              | v7.0.1           | `3d3c42e5aac5ba805825da76410c181273ba90b1` | node24                                        |
| setup-node            | v7.1.0           | `949feb2413d6458794dcd2491c4babbbce0c15c1` | node24                                        |
| configure-pages       | v6.0.0           | `45bfe0192ca1faeb007ade9deae92b16b8254a0d` | node24                                        |
| upload-pages-artifact | v5.0.0           | `fc324d3547104276b827a68afc52ff2a11cc49c9` | official composite, pinned upload-artifact v7 |
| deploy-pages          | v5.0.1           | `368f82528645a54fb793d4d04e342629a3f51346` | node24                                        |

Primary references: [Nuxt deployment](https://nuxt.com/docs/4.x/getting-started/deployment), [Pinia/Nuxt](https://pinia.vuejs.org/ssr/nuxt.html), [official Actions](https://github.com/actions).
