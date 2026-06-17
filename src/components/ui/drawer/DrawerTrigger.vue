<script setup lang="ts">
import { inject } from "vue";
import { drawerContextKey } from "./context";

defineProps<{
  asChild?: boolean;
}>();

const drawer = inject(drawerContextKey);
</script>

<template>
  <button type="button" @click="drawer?.setOpen(true)">
    <slot />
  </button>
</template>
