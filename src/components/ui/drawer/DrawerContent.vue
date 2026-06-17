<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { inject } from "vue";
import { cn } from "@/lib/utils";
import { drawerContextKey } from "./context";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const drawer = inject(drawerContextKey);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="drawer?.open.value"
      class="fixed inset-0 z-50 flex items-end"
      role="presentation"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/50"
        aria-label="Close drawer"
        @click="drawer.setOpen(false)"
      />
      <div
        data-slot="drawer-content"
        role="dialog"
        aria-modal="true"
        :class="cn(
          'relative z-10 w-full bg-background outline-none',
          props.class,
        )"
      >
        <div class="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" />
        <slot />
      </div>
    </div>
  </Teleport>
</template>
