<script setup lang="ts">
import { useLoaderStore } from "@/stores/loaderStore";
import { storeToRefs } from "pinia";

const store = useLoaderStore();
const { transitioning } = storeToRefs(store);
</script>

<template>
  <div class="relative">
    <RouterView v-slot="{ Component }">
      <transition
        mode="out-in"
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <component :is="Component" :key="$route.fullPath" />
      </transition>
    </RouterView>

    <!-- optional soft overlay during transition -->
    <div
      v-if="transitioning"
      class="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
    />
  </div>
</template>