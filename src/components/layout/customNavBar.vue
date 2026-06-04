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
    class="pt-[env(safe-area-inset-top)] w-full border-b bg-gray-900/20 sticky top-0 z-40 backdrop-blur-2xl border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
  >
    <div class="relative flex items-center h-14 px-3 text-white">
      <!-- LEFT -->
      <div>
        <button @click="goBack" class="p-2 flex gap-2 items-center">
          <chevron-left class="w-6 h-6" />
          <p>{{ t("back") }}</p>
        </button>
      </div>

      <!-- CENTER (NO absolute) -->
      <div class="flex-1 flex justify-center font-semibold">
        <span v-if="title">{{ t(title) }}</span>
      </div>

      <!-- RIGHT -->
      <div class="flex items-center gap-2">
        <slot name="right" />
      </div>
    </div>
  </nav>
</template>
