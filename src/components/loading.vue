<script setup lang="ts">
import { Spinner } from './ui/spinner'

const props = defineProps<{
  show: boolean
  message?: string
}>()
</script>

<template>
  <div
    v-show="props.show"
    class="z-50 fixed inset-0 bg-slate-700/50 backdrop-blur-md flex justify-center items-center"
  >
    <div class="flex flex-col items-center gap-3">
      <Spinner class="text-sky-400 w-12 h-12 animate-spin" />
      <p class="text-sky-500 text-lg font-mono">
        {{ props.message || 'Loading . . .' }}
      </p>
      <slot />
    </div>
  </div>
</template>