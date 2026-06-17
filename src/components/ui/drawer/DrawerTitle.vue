<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h2
    data-slot="drawer-title"
    :class="cn('text-foreground font-semibold', props.class)"
  >
    <slot />
  </h2>
</template>
