<script setup lang="ts">
import { gameOptions } from "@/consts";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { ref, watch, nextTick } from "vue";

const { t ,locale} = useI18n();
const props = defineProps<{ current_page: string }>();

const container = ref<HTMLElement | null>(null);

const gotoPath = (path: string) => {
  router.push(path);
};
const scrollToActive = async () => {
  await nextTick();

  const el = container.value?.querySelector(
    `[data-active="true"]`
  ) as HTMLElement | null;

  el?.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest",
  });
};
watch(
  () => props.current_page,
  () => {
    scrollToActive();
  },
  { immediate: true }
);
</script>
<template>
  <aside class="mx-2 overflow-hidden rounded-full bg-gray-800/20  backdrop-blur-2xl border border-gray-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
  <div
    ref="container"
    class="p-1.5 flex overflow-x-auto no-scrollbar scroll-smooth"
  >
    <div
      v-for="option in gameOptions"
      :key="option.id"
      :data-active="props.current_page === option.label"
      class="cursor-pointer px-2 gap-2 rounded-full flex items-center justify-center whitespace-nowrap shrink-0"
      :class="props.current_page === option.label
        ? 'bg-gray-500/20'
        : ''"
      @click="gotoPath(option.path)"
    >
      <img :src="option.image" class="w-8 h-8" :alt="option.label" loading="eager" decoding="async" fetchpriority="high"/>
      <p class="text-white" :class="locale==='cn'?'text-sm':'text-xs'">{{ t(option.label) }}</p>
    </div>
  </div>

</aside>
</template>
