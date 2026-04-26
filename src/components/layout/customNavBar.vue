<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps<{
  title: string;
  backTo?: string;
}>();
const {t} = useI18n();
const router = useRouter();

const goBack = () => {
  if (props.backTo) {
    router.push(props.backTo);
  } else {
    router.back();
  }
};
</script>

<template>
  <header class="relative flex items-center h-14 px-3 w-full border-b bg-gray-900 
        bg-linear-to-br from-white/5 via-white/10 to-white/5
        backdrop-blur-2xl border-white/5
        shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
    <div class="z-10">
      <button
        v-if="backTo !== undefined"
        @click="goBack"
        class="p-2 flex gap-2 items-center"
      >
        <chevron-left class="text-white w-6 h-6" />
        <p>{{ t('back') }}</p>
      </button>
    </div>

    <!-- CENTER (Absolute for perfect centering) -->
    <div class="absolute left-1/2 -translate-x-1/2 text-center font-semibold">
      {{ t(title) }}
    </div>

    <!-- RIGHT (Actions) -->
    <div class="ml-auto flex items-center gap-2 z-10">
      <slot name="right" />
    </div>

  </header>
</template>