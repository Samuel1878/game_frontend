<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import type { AgentDashboardPagination } from "@/utils/types";

const props = defineProps<{
  pagination: AgentDashboardPagination;
  loading?: boolean;
}>();

const emit = defineEmits<{ page: [value: number] }>();
const { t } = useI18n();
</script>

<template>
  <div class="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0f172a] px-4 py-3 text-sm text-gray-400">
    <span>{{ t('page') }} {{ props.pagination.page }} / {{ Math.max(props.pagination.totalPages, 1) }}</span>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="page-button"
        :disabled="props.loading || props.pagination.page <= 1"
        @click="emit('page', props.pagination.page - 1)"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
      <button
        type="button"
        class="page-button"
        :disabled="props.loading || props.pagination.page >= props.pagination.totalPages"
        @click="emit('page', props.pagination.page + 1)"
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.page-button {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.06);
}

.page-button:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
