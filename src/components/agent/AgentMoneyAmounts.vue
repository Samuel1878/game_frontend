<script setup lang="ts">
import type { AgentMoneyAmount } from "@/utils/types";

const props = withDefaults(
  defineProps<{
    amounts?: AgentMoneyAmount[] | null;
    compact?: boolean;
  }>(),
  { compact: false },
);

const formatAmount = (amount: string) => {
  const number = Number(amount);
  if (!Number.isFinite(number)) return amount;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(number);
};
</script>

<template>
  <span v-if="!props.amounts?.length" class="text-gray-500">—</span>
  <span
    v-else-if="props.compact"
    class="text-sm font-semibold leading-5"
  >
    {{ props.amounts.map((item) => `${item.currency} ${formatAmount(item.amount)}`).join(" · ") }}
  </span>
  <span v-else class="flex flex-col gap-1">
    <span
      v-for="item in props.amounts"
      :key="item.currency"
      class="text-sm font-semibold leading-5"
    >
      {{ item.currency }} {{ formatAmount(item.amount) }}
    </span>
  </span>
</template>
