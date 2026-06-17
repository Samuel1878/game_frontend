<script setup lang="ts">
import { computed, onUnmounted, provide, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import { drawerContextKey } from "./context";

const props = withDefaults(defineProps<{
  open?: boolean;
}>(), {
  open: false,
});

const emit = defineEmits<{
  "update:open": [open: boolean];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const setOpen = (value: boolean) => {
  isOpen.value = value;
};

watch(isOpen, (value) => {
  document.body.style.overflow = value ? "hidden" : "";
});

useEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Escape" && isOpen.value) {
    setOpen(false);
  }
});

onUnmounted(() => {
  document.body.style.overflow = "";
});

provide(drawerContextKey, {
  open: isOpen,
  setOpen,
});
</script>

<template>
  <slot />
</template>
