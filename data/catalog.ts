export const storyKeys = ['rose', 'warm', 'plum', 'neutral'] as const;
export type StoryKey = (typeof storyKeys)[number];
export type Category = 'Lips' | 'Eyes' | 'Complexion';
export type Finish =
  'Satin' | 'Gloss' | 'Matte' | 'Mixed' | 'Natural' | 'Luminous';
export interface Shade {
  readonly id: string;
  readonly name: string;
  readonly family: string;
  readonly hex: string;
  readonly stock: number;
  readonly looks: readonly StoryKey[];
  readonly image?: string;
}
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly category: Category;
  readonly type: string;
  readonly finish: Finish;
  readonly priceCents: number;
  readonly image: string;
  readonly description: string;
  readonly shades: readonly Shade[];
}
export const products = [
  {
    id: 'satin-stroke',
    name: 'Satin Stroke',
    category: 'Lips',
    type: 'Lip colour',
    finish: 'Satin',
    priceCents: 3200,
    image: '/images/satin-stroke-pack.webp',
    shades: [
      {
        id: 'berry',
        name: 'Berry',
        family: 'Berry',
        hex: '#75243f',
        stock: 4,
        looks: ['rose', 'plum'],
        image: '/images/satin-stroke-berry.webp',
      },
      {
        id: 'rose',
        name: 'Rose',
        family: 'Rose',
        hex: '#ad6475',
        stock: 6,
        looks: ['rose', 'neutral'],
        image: '/images/satin-stroke-rose.webp',
      },
      {
        id: 'brick',
        name: 'Brick',
        family: 'Red',
        hex: '#a44736',
        stock: 0,
        looks: ['warm'],
        image: '/images/satin-stroke-brick.webp',
      },
    ],
    description:
      'Satin colour, a soft sheen, and three ways to make your mark. Choose a mood and let the rest follow.',
  },
  {
    id: 'mirror-glaze',
    name: 'Mirror Glaze',
    category: 'Lips',
    type: 'Lip gloss',
    finish: 'Gloss',
    priceCents: 2900,
    image: '/images/mirror-glaze-pack.webp',
    shades: [
      {
        id: 'roseglass',
        name: 'Roseglass',
        family: 'Rose',
        hex: '#bd7b8a',
        stock: 6,
        looks: ['rose', 'neutral'],
      },
      {
        id: 'clear',
        name: 'Clear',
        family: 'Neutral',
        hex: '#e1c5bf',
        stock: 8,
        looks: ['warm', 'rose', 'plum', 'neutral'],
      },
      {
        id: 'honey',
        name: 'Honey',
        family: 'Brown',
        hex: '#ae7655',
        stock: 4,
        looks: ['warm'],
      },
    ],
    description:
      'A gloss-finish accent for your lip wardrobe. A little light, a little colour, entirely your call.',
  },
  {
    id: 'line-theory',
    name: 'Line Theory',
    category: 'Lips',
    type: 'Lip pencil',
    finish: 'Matte',
    priceCents: 2200,
    image: '/images/line-theory-pack.webp',
    shades: [
      {
        id: 'spice',
        name: 'Spice',
        family: 'Brown',
        hex: '#985b4c',
        stock: 5,
        looks: ['warm'],
      },
      {
        id: 'cocoa',
        name: 'Cocoa',
        family: 'Brown',
        hex: '#613f38',
        stock: 3,
        looks: ['plum', 'neutral'],
      },
      {
        id: 'mauve',
        name: 'Mauve',
        family: 'Rose',
        hex: '#986170',
        stock: 4,
        looks: ['rose'],
      },
    ],
    description:
      'A matte pencil for a defined line or a softer edge. Spice, Cocoa or Mauve: write it your way.',
  },
  {
    id: 'velvet-stain',
    name: 'Velvet Stain',
    category: 'Lips',
    type: 'Lip tint',
    finish: 'Matte',
    priceCents: 2800,
    image: '/images/velvet-stain-pack.webp',
    shades: [
      {
        id: 'raisin',
        name: 'Raisin',
        family: 'Berry',
        hex: '#6c3e50',
        stock: 4,
        looks: ['plum'],
      },
      {
        id: 'coral',
        name: 'Coral',
        family: 'Coral',
        hex: '#cb725e',
        stock: 5,
        looks: ['warm', 'rose'],
      },
    ],
    description:
      'A matte colour gesture in Raisin or Coral. Keep it quiet, or make it the whole look.',
  },
  {
    id: 'fourfold-eyes',
    name: 'Fourfold Eyes',
    category: 'Eyes',
    type: 'Eye palette',
    finish: 'Mixed',
    priceCents: 6200,
    image: '/images/fourfold-eyes-pack.webp',
    shades: [
      {
        id: 'copper-story',
        name: 'Copper Story',
        family: 'Gold',
        hex: '#b27a52',
        stock: 4,
        looks: ['warm'],
      },
      {
        id: 'plum-story',
        name: 'Plum Story',
        family: 'Plum',
        hex: '#72475f',
        stock: 2,
        looks: ['plum', 'rose'],
      },
      {
        id: 'neutral-canvas',
        name: 'Neutral Canvas',
        family: 'Neutral',
        hex: '#a08d7f',
        stock: 3,
        looks: ['neutral', 'rose'],
      },
    ],
    description:
      'Three edited eye-colour stories, from copper warmth to a softer neutral canvas. Start with a colour, then play.',
  },
  {
    id: 'fine-gesture',
    name: 'Fine Gesture',
    category: 'Eyes',
    type: 'Eye liner',
    finish: 'Matte',
    priceCents: 2600,
    image: '/images/fine-gesture-pack.webp',
    shades: [
      {
        id: 'ink',
        name: 'Ink',
        family: 'Black',
        hex: '#242024',
        stock: 8,
        looks: ['warm', 'rose', 'plum', 'neutral'],
      },
      {
        id: 'espresso',
        name: 'Espresso',
        family: 'Brown',
        hex: '#503a31',
        stock: 5,
        looks: ['warm', 'neutral'],
      },
    ],
    description:
      'An expressive matte line in Ink or Espresso. A small detail with its own point of view.',
  },
  {
    id: 'lash-form',
    name: 'Lash Form',
    category: 'Eyes',
    type: 'Mascara',
    finish: 'Satin',
    priceCents: 3400,
    image: '/images/lash-form-pack.webp',
    shades: [
      {
        id: 'black',
        name: 'Black',
        family: 'Black',
        hex: '#19181b',
        stock: 7,
        looks: ['warm', 'rose', 'plum', 'neutral'],
      },
      {
        id: 'brown',
        name: 'Brown',
        family: 'Brown',
        hex: '#5c4032',
        stock: 4,
        looks: ['warm', 'neutral'],
      },
    ],
    description:
      'A satin-finish lash accent in Black or Brown, in a sculptural case made for your beauty shelf.',
  },
  {
    id: 'sheer-canvas',
    name: 'Sheer Canvas',
    category: 'Complexion',
    type: 'Complexion tint',
    finish: 'Natural',
    priceCents: 4400,
    image: '/images/sheer-canvas-pack.webp',
    shades: [
      {
        id: 'porcelain-01',
        name: 'Porcelain 01',
        family: 'Light',
        hex: '#ead0ba',
        stock: 6,
        looks: [],
      },
      {
        id: 'light-02',
        name: 'Light 02',
        family: 'Light',
        hex: '#dfb795',
        stock: 8,
        looks: [],
      },
      {
        id: 'beige-04',
        name: 'Beige 04',
        family: 'Medium',
        hex: '#be8862',
        stock: 5,
        looks: [],
      },
      {
        id: 'olive-05',
        name: 'Olive 05',
        family: 'Medium',
        hex: '#a58157',
        stock: 0,
        looks: [],
      },
      {
        id: 'deep-07',
        name: 'Deep 07',
        family: 'Deep',
        hex: '#805136',
        stock: 6,
        looks: [],
      },
      {
        id: 'rich-09',
        name: 'Rich 09',
        family: 'Deep',
        hex: '#583624',
        stock: 4,
        looks: [],
      },
    ],
    description:
      'Six named complexion colours to explore at your own pace. Choose your shade yourself; there is no automatic match.',
  },
  {
    id: 'soft-signal',
    name: 'Soft Signal',
    category: 'Complexion',
    type: 'Cream blush',
    finish: 'Natural',
    priceCents: 3600,
    image: '/images/soft-signal-pack.webp',
    shades: [
      {
        id: 'guava',
        name: 'Guava',
        family: 'Coral',
        hex: '#cf786f',
        stock: 6,
        looks: ['warm', 'rose'],
      },
      {
        id: 'plum',
        name: 'Plum',
        family: 'Plum',
        hex: '#86526a',
        stock: 4,
        looks: ['plum', 'rose'],
      },
      {
        id: 'rust',
        name: 'Rust',
        family: 'Brown',
        hex: '#ad6450',
        stock: 0,
        looks: ['warm'],
      },
    ],
    description:
      'A cream-colour accent for the complexion, with Guava, Plum and Rust in the palette. Make room for a little colour.',
  },
  {
    id: 'light-index',
    name: 'Light Index',
    category: 'Complexion',
    type: 'Highlighter',
    finish: 'Luminous',
    priceCents: 3800,
    image: '/images/light-index-pack.webp',
    shades: [
      {
        id: 'pearl',
        name: 'Pearl',
        family: 'Neutral',
        hex: '#e8d5bd',
        stock: 5,
        looks: ['rose', 'neutral'],
      },
      {
        id: 'gold',
        name: 'Gold',
        family: 'Gold',
        hex: '#cba676',
        stock: 6,
        looks: ['warm'],
      },
      {
        id: 'bronze',
        name: 'Bronze',
        family: 'Brown',
        hex: '#ab7d55',
        stock: 4,
        looks: ['plum', 'warm'],
      },
    ],
    description:
      'A luminous complexion accent in Pearl, Gold or Bronze. Pick the tone that fits the story you want to tell.',
  },
] as const satisfies readonly Product[];
export const getProduct = (id: string): Product | undefined =>
  products.find((product) => product.id === id);
export const getShade = (
  productId: string,
  shadeId: string,
): Shade | undefined =>
  getProduct(productId)?.shades.find((shade) => shade.id === shadeId);
export const shadeImage = (product: Product, shade: Shade) =>
  shade.image ?? product.image;
export const money = (cents: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
