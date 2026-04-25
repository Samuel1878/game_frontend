<script setup lang="ts">
import type { withdrawalInfo } from "@/utils/types";
import { computed } from "vue";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, DownloadIcon } from "lucide-vue-next";
import { formattedAmount } from "@/utils";
import { useI18n } from "vue-i18n";

interface Props {
  open: boolean;
  withdrawal: withdrawalInfo | null;
}
const {t} = useI18n();

const props = defineProps<Props>();
const emit = defineEmits(["update:open", "exported"]);

const close = () => emit("update:open", false);



const formattedDate = computed(() =>
  props.withdrawal?.created_at
    ? moment(props.withdrawal.created_at).format("DD-MM-YYYY hh:mm A")
    : "-"
);

const copyTxn = () => {
  if (props.withdrawal?.txn_id) {
    navigator.clipboard.writeText(props.withdrawal.txn_id);
  }
};

const exportData = () => {
  if (!props.withdrawal) return;

  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(props.withdrawal, null, 2));

  const link = document.createElement("a");
  link.href = dataStr;
  link.download = `withdrawal-${props.withdrawal.txn_id || "record"}.json`;
  link.click();

  emit("exported", props.withdrawal);
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="w-sm bg-gray-900 cursor-pointer bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_5px_rgba(0,0,0,0.5)] transition text-white max-w-lg rounded-2xl">
      
      <DialogHeader>
        <DialogTitle class="text-xl font-bold">
          {{ t("detail") }}
        </DialogTitle>
      </DialogHeader>

      <div v-if="withdrawal" class="space-y-4 mt-4">

        <!-- Transaction ID -->
        <div class="flex justify-between items-center">
          <span class="text-gray-400 text-sm">{{ t("invoice_id") }}</span>
          <div class="flex items-center gap-2">
            <span class="font-semibold text-sm">{{ withdrawal.txn_id }}</span>
            <CopyIcon class="w-4 h-4 cursor-pointer text-gray-400 hover:text-white" @click="copyTxn" />
          </div>
        </div>

        <!-- Amount -->
        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t("amount") }}</span>
          <span class="text-emerald-400 font-semibold">
            {{ formattedAmount(Number(props.withdrawal?.amount)) }}
          </span>
        </div>

        <!-- Payment Method -->
        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t("payment_method") }}</span>
          <span>{{ withdrawal.payment_method }}</span>
        </div>

        <!-- Withdraw Account -->
        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t("account_name") }}</span>
          <span>{{ withdrawal.withdraw_name }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t("account_number") }}</span>
          <span>{{ withdrawal.withdraw_no }}</span>
        </div>

        <!-- Status -->
        <div class="flex justify-between items-center">
          <span class="text-gray-400 text-sm">{{ t("status") }}</span>
          <span
            class="px-3 py-1 text-sm rounded-full"
            :class="{
              'bg-emerald-600 text-white': withdrawal.status === 'approved',
              'bg-yellow-500 text-black': withdrawal.status === 'pending',
              'bg-red-600 text-white': withdrawal.status === 'rejected'
            }"
          >
            {{ withdrawal.status }}
          </span>
        </div>

        <!-- Date -->
        <div class="flex justify-between">
          <span class="text-gray-400 text-sm">{{ t("date") }}</span>
          <span class="text-gray-400 text-sm">
            {{ formattedDate }}
          </span>
        </div>

        <!-- Remark -->
        <div v-if="withdrawal.remark" class="border-t border-gray-800 pt-3">
          <p class="text-gray-400 text-sm mb-1">{{ t("remark") }}</p>
          <p class=" text-gray-200 text-xs">{{ withdrawal.remark }}</p>
        </div>
      </div>

      <DialogFooter class="mt-6 flex justify-between">
        <Button variant="outline" @click="close">
          {{ t("close") }}
        </Button>

        <Button
          class="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
          @click="exportData"
        >
          <DownloadIcon class="w-4 h-4" />
          {{ t("download") }}
        </Button>
      </DialogFooter>

    </DialogContent>
  </Dialog>
</template>