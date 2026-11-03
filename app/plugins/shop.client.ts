import { defineNuxtPlugin } from '#app';
import { useShopStore } from '../stores/shop';
import type { StoragePort } from '../../adapters/persistence';
export default defineNuxtPlugin((app) => {
  app.hook('app:mounted', () => {
    let port: StoragePort | null;
    try {
      port = window.localStorage;
    } catch {
      port = null;
    }
    useShopStore(app.$pinia).hydrate(port);
  });
});
