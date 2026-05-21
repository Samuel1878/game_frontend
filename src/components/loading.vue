<script setup lang="ts">
import { useLoaderStore } from "@/stores/loaderStore";
import { storeToRefs } from "pinia";

const ui = useLoaderStore();
const { loading } = storeToRefs(ui);
</script>

<template>
  <div
    v-if="loading"
    class="fixed inset-0 z-9999 flex items-center justify-center bg-black/10 backdrop-blur-sm"
  >
    <div class="p-6 rounded-lg bg-gray-800">
      <div class="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-yellow-500" />
    </div>
  
  </div>
</template>