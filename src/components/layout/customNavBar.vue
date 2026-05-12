<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const props = defineProps<{
  title?: string;
  backTo?: string;
}>();
const { t } = useI18n();
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
  <nav
    class="pt-[env(safe-area-inset-top)] w-full border-b bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 sticky z-40 top-0 left-0 right-0 backdrop-blur-2xl border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
  >
    <div class="flex items-center h-14 px-3 z-40">
      <div class="z-10">
        <button
          v-if="backTo !== undefined"
          @click="goBack"
          class="p-2 flex gap-2 items-center text-white"
        >
          <chevron-left class="text-white w-6 h-6" />
          <p>{{ t("back") }}</p>
        </button>
      </div>

      <!-- CENTER (Absolute for perfect centering) -->
      <div
        v-if="title"
        class="absolute left-1/2 -translate-x-1/2 text-center font-semibold text-white"
      >
        {{ t(title) }}
      </div>

      <!-- RIGHT (Actions) -->
      <div class="ml-auto flex items-center gap-2 z-10 text-white">
        <slot name="right" />
      </div>
    </div>
  </nav>
</template>
