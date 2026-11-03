import {
  getProduct,
  getShade,
  products,
  storyKeys,
  type Product,
  type Shade,
  type StoryKey,
} from '../data/catalog';
import {
  addItemsAtomically,
  readProductChoice,
  type CartItem,
  type CartResult,
} from './cart';
export const lookSlots = ['lips', 'eyes', 'accent'] as const;
export type LookSlot = (typeof lookSlots)[number];
export interface LookChoice {
  readonly productId: string;
  readonly shadeId: string;
}
export interface LookDraft {
  readonly story: StoryKey;
  readonly choices: Partial<Record<LookSlot, LookChoice>>;
}
export interface LookOption extends LookChoice {
  readonly key: string;
  readonly product: Product;
  readonly shade: Shade;
}
export const stories: Readonly<
  Record<StoryKey, { name: string; description: string; color: string }>
> = {
  rose: {
    name: 'Rose Play',
    description:
      'Rose and berry tones, with a softer eye and a fresh colour accent.',
    color: '#cf8caa',
  },
  warm: {
    name: 'Golden Hour',
    description: 'Coral lips, copper warmth and a golden complexion accent.',
    color: '#e5b864',
  },
  plum: {
    name: 'Plum Pulse',
    description: 'A deeper lip, plum eyes and a rich colour accent.',
    color: '#794466',
  },
  neutral: {
    name: 'Soft Focus',
    description: 'A quieter lip, neutral eyes and a pearl-toned accent.',
    color: '#d9bdaa',
  },
};
const defaults: Readonly<
  Record<StoryKey, Readonly<Record<LookSlot, LookChoice>>>
> = {
  rose: {
    lips: { productId: 'satin-stroke', shadeId: 'rose' },
    eyes: { productId: 'fourfold-eyes', shadeId: 'plum-story' },
    accent: { productId: 'soft-signal', shadeId: 'guava' },
  },
  warm: {
    lips: { productId: 'velvet-stain', shadeId: 'coral' },
    eyes: { productId: 'fourfold-eyes', shadeId: 'copper-story' },
    accent: { productId: 'light-index', shadeId: 'gold' },
  },
  plum: {
    lips: { productId: 'satin-stroke', shadeId: 'berry' },
    eyes: { productId: 'fourfold-eyes', shadeId: 'plum-story' },
    accent: { productId: 'soft-signal', shadeId: 'plum' },
  },
  neutral: {
    lips: { productId: 'mirror-glaze', shadeId: 'clear' },
    eyes: { productId: 'fourfold-eyes', shadeId: 'neutral-canvas' },
    accent: { productId: 'light-index', shadeId: 'pearl' },
  },
};
export function isCompatible(
  story: StoryKey,
  slot: LookSlot,
  product: Product,
  shade: Shade,
): boolean {
  return (
    (slot === 'lips'
      ? product.category === 'Lips'
      : slot === 'eyes'
        ? product.category === 'Eyes'
        : product.category === 'Complexion') && shade.looks.includes(story)
  );
}
export function lookOptions(story: StoryKey, slot: LookSlot): LookOption[] {
  return products.flatMap((product) =>
    product.shades.flatMap((shade) =>
      isCompatible(story, slot, product, shade)
        ? [
            {
              productId: product.id,
              shadeId: shade.id,
              key: product.id + ':' + shade.id,
              product,
              shade,
            },
          ]
        : [],
    ),
  );
}
export function createLook(story: StoryKey): LookDraft {
  return {
    story,
    choices: Object.fromEntries(
      lookSlots.map((slot) => [slot, { ...defaults[story][slot] }]),
    ),
  };
}
export function lookLines(draft: LookDraft): LookOption[] {
  return lookSlots.flatMap((slot) => {
    const choice = draft.choices[slot];
    if (!choice) return [];
    const product = getProduct(choice.productId);
    const shade = getShade(choice.productId, choice.shadeId);
    return product && shade && isCompatible(draft.story, slot, product, shade)
      ? [
          {
            ...choice,
            key: choice.productId + ':' + choice.shadeId,
            product,
            shade,
          },
        ]
      : [];
  });
}
export const lookTotal = (draft: LookDraft) =>
  lookLines(draft).reduce((sum, line) => sum + line.product.priceCents, 0);
export function changeLookChoice(
  draft: LookDraft,
  slot: LookSlot,
  key: string,
): LookDraft {
  const choices = { ...draft.choices };
  if (!key) {
    delete choices[slot];
    return { ...draft, choices };
  }
  const option = lookOptions(draft.story, slot).find(
    (item) => item.key === key,
  );
  if (!option) return draft;
  return {
    ...draft,
    choices: {
      ...choices,
      [slot]: { productId: option.productId, shadeId: option.shadeId },
    },
  };
}
export function addLookAtomically(
  cart: readonly CartItem[],
  draft: LookDraft,
): CartResult {
  const selected = lookSlots.filter(
    (slot) => draft.choices[slot] !== undefined,
  );
  if (
    !storyKeys.includes(draft.story) ||
    !selected.length ||
    Object.keys(draft.choices).some(
      (key) => !lookSlots.some((slot) => slot === key),
    ) ||
    selected.some((slot) => {
      const choice = readProductChoice(draft.choices[slot]);
      const product = choice && getProduct(choice.productId);
      const shade = choice && getShade(choice.productId, choice.shadeId);
      return (
        !product ||
        !shade ||
        !shade.stock ||
        !isCompatible(draft.story, slot, product, shade)
      );
    })
  )
    return {
      ok: false,
      error:
        'Choose at least one compatible, available piece for your colour story.',
    };
  return addItemsAtomically(
    cart,
    selected.map((slot) => ({ ...draft.choices[slot], quantity: 1 })),
  );
}
