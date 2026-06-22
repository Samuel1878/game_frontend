<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { parseDate, type DateValue } from "@internationalized/date";
import DatePicker from "@/components/CalenderView.vue";
import type { AgentDashboardPeriod } from "@/utils/types";

const props = defineProps<{
  period: AgentDashboardPeriod;
  startDate?: string;
  endDate?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  "update:period": [value: AgentDashboardPeriod];
  "update:startDate": [value: string | undefined];
  "update:endDate": [value: string | undefined];
  apply: [];
}>();

const { t } = useI18n();
const periodOptions: AgentDashboardPeriod[] = ["today", "this_month", "custom"];

const asDateValue = (value?: string): DateValue | undefined => {
  if (!value) return undefined;
  try {
    return parseDate(value);
  } catch {
    return undefined;
  }
};

const asDateString = (value: DateValue | undefined) => value?.toString();

const setPeriod = (value: AgentDashboardPeriod) => {
  emit("update:period", value);
  if (value !== "custom") emit("apply");
};
</script>

<template>
  <section class="rounded-2xl border border-amber-400/10 bg-[#0f172a] p-3 space-y-3">
    <div class="flex gap-2 overflow-x-auto no-scrollbar">
      <button
        v-for="option in periodOptions"
        :key="option"
        type="button"
        class="filter-btn"
        :class="props.period === option && 'active-filter'"
        :disabled="props.loading"
        @click="setPeriod(option)"
      >
        {{ t(option) }}
      </button>
    </div>

    <template v-if="props.period === 'custom'">
      <div class="flex gap-2">
        <DatePicker
          :model-value="asDateValue(props.startDate)"
          :placeholder="t('start_date')"
          @update:model-value="emit('update:startDate', asDateString($event as DateValue | undefined))"
        />
        <DatePicker
          :model-value="asDateValue(props.endDate)"
          :placeholder="t('end_date')"
          @update:model-value="emit('update:endDate', asDateString($event as DateValue | undefined))"
        />
      </div>
      <button
        type="button"
        class="gold-action w-full"
        :disabled="!props.startDate || !props.endDate || props.loading"
        @click="emit('apply')"
      >
        {{ t('search') }}
      </button>
    </template>
  </section>
</template>

<style scoped>
.filter-btn {
  padding: 0.55rem 0.85rem;
  border-radius: 0.75rem;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #d1d5db;
  font-size: 0.875rem;
  white-space: nowrap;
}

.active-filter {
  background: rgba(250, 204, 21, 0.12);
  border-color: rgba(250, 204, 21, 0.3);
  color: #facc15;
}

.gold-action {
  height: 2.7rem;
  border-radius: 0.85rem;
  background: linear-gradient(135deg, #facc15, #d97706);
  color: #111827;
  font-weight: 700;
}

.gold-action:disabled,
.filter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
