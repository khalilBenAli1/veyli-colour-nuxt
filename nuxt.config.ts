import { products } from './data/catalog';
export default defineNuxtConfig({
  compatibilityDate: '2026-11-03',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  // Every route is explicitly generated and data is local; no runtime build-manifest lookup is required.
  experimental: { appManifest: false },
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~/features', pathPrefix: false },
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/shopping.css',
    '~/assets/css/checkout.css',
  ],
  typescript: { strict: true },
  app: {
    baseURL: '/veyli-colour-nuxt/',
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Veyli Colour — Every shade. Every side.',
      meta: [
        {
          name: 'description',
          content:
            'An expressive original beauty collection. Explore named shades, build a colour story and try a local shopping experience.',
        },
        { name: 'theme-color', content: '#4c1032' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/veyli-colour-nuxt/favicon.svg',
        },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [
        '/',
        '/shop',
        '/looks',
        '/wishlist',
        '/about',
        '/checkout',
        ...products.map((p) => `/products/${p.id}`),
      ],
    },
  },
});
