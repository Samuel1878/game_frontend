<script setup lang="ts">
import { gameOptions } from "@/consts";
import router from "@/router";
// import { ref, watch, nextTick } from "vue";
const props = defineProps<{ current_page: string }>();
// const container = ref<HTMLElement | null>(null);
const gotoPath = (path: string) => {
  router.push(path);
};
// watch(
//   () => props.current_page,
//   async () => {
//       await nextTick();
//     requestAnimationFrame(scrollToActive);
//   },
//   { immediate: true }
// );
// const scrollToActive = async () => {
//   const el = container.value?.querySelector(
//     `[data-active="true"]`
//   ) as HTMLElement | null;
//  el?.scrollIntoView({
//   behavior: "auto", // important
//   inline: "center",
//   block: "nearest",
// });
// requestAnimationFrame(() => {
//   el?.scrollIntoView({
//     behavior: "auto",
//     inline: "center",
//     block: "nearest",
//   });
// });
// };

</script>
<template>
  <aside class="mx-2 overflow-hidden">
  <div
    ref="container"
    class="p-1.5 flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
  >
    <div
      v-for="option in gameOptions"
      :key="option.id"
      :data-active="props.current_page === option.label"
      class="cursor-pointer whitespace-nowrap shrink-0 relative" 
      
      @click="gotoPath(option.path)"
    >
      <div 
        class="p-2 bg-gray-800 rounded-full shadow-lg"
        :class="props.current_page === option.label
        ? 'border-yellow-400 outline-4 outline-gray-500/20 border-2'
        : 'border-0 outline-0'">
         <img :src="option.image" class="h-8 w-8" :alt="option.label" loading="eager" fetchpriority="high"/>
      </div>
    </div>
  </div>

</aside>
</template>
