import { inject, provide, type InjectionKey } from 'vue';
interface ShopUi {
  openBag: () => void;
}
const key: InjectionKey<ShopUi> = Symbol('veyli-ui');
export const provideShopUi = (ui: ShopUi) => provide(key, ui);
export function useShopUi(): ShopUi {
  const ui = inject(key);
  if (!ui) throw new Error('Shop UI provider is missing.');
  return ui;
}
