<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
const props = defineProps<{ open: boolean; title: string; drawer?: boolean }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement | null>(null);
const sync = async () => {
  await nextTick();
  const node = dialog.value;
  if (props.open && node && !node.open) node.showModal();
  else if (!props.open && node?.open) node.close();
};
watch(() => props.open, sync);
onMounted(sync);
function backdrop(event: MouseEvent) {
  if (event.target !== event.currentTarget || !dialog.value) return;
  const box = dialog.value.getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    emit('close');
}
</script>
<template>
  <dialog
    ref="dialog"
    :class="['beauty-dialog', { drawer }]"
    :aria-label="title"
    @cancel.prevent="emit('close')"
    @click="backdrop"
  >
    <div class="dialog-heading">
      <h2>{{ title }}</h2>
      <button
        type="button"
        class="icon-button"
        :aria-label="'Close ' + title"
        @click="emit('close')"
      >
        <BeautyIcon name="close" />
      </button>
    </div>
    <slot />
  </dialog>
</template>
