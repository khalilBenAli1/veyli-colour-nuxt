import { onScopeDispose } from 'vue';
import { useRouter } from '#imports';
import type { NavigationFailure, LocationQueryRaw } from 'vue-router';
export function useQueryUpdates() {
  const router = useRouter();
  let active = true;
  let pending: Promise<NavigationFailure | void> = Promise.resolve();
  onScopeDispose(() => {
    active = false;
  });
  function enqueue(operation: () => Promise<NavigationFailure | void>) {
    const request = pending.then(() => (active ? operation() : undefined));
    pending = request.catch(() => undefined);
    return request;
  }
  const change = (key: string, value: string) =>
    enqueue(() => {
      const query: LocationQueryRaw = { ...router.currentRoute.value.query };
      if (value) query[key] = value;
      else delete query[key];
      return router.replace({ query });
    });
  const reset = () =>
    enqueue(() =>
      router.replace({ path: router.currentRoute.value.path, query: {} }),
    );
  return { change, reset };
}
