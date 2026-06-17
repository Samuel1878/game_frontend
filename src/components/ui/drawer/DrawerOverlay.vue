<script lang="ts" setup>
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
  <button
    type="button"
    data-slot="drawer-overlay"
    :class="cn('fixed inset-0 z-50 bg-black/50', props.class)"
    aria-label="Close drawer"
    @click="drawer?.setOpen(false)"
  />
</template>
