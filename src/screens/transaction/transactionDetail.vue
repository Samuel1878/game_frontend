<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import moment from "moment";
import {
  CopyIcon,
  Wallet2,
  Headset,
  ArrowDown,
  ArrowUp,
  Minus,
  LoaderCircle,
  Gift,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { formatPrice, openChat } from "@/utils";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import { storeToRefs } from "pinia";
import { useTransactionDetail } from "@/stores/transactionDetailStore";
import { captureElement } from "@/utils/shareHandler";
const store = useTransactionDetail();
const receiptRef = ref<HTMLElement | null>(null);
const { selectedTransaction } = storeToRefs(store);
const router = useRouter();
const { t } = useI18n();
const copiedField = ref<string | null>(null);
const handleBack = () => {
  const nativeBack = history.state?.back;
  if (
    nativeBack &&
    typeof nativeBack === "string" &&
    nativeBack.startsWith("/")
  ) {
    router.back();
  } else {
    router.push("/user/transactions"); // Logical default fallback
  }
};
const statusConfig = computed(() => {
  const type = selectedTransaction.value?.type;
  switch (type) {
    case 'deposit':
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        icon: ArrowDown,
        text:'text-emerald-400'
      };
    case 'withdraw':
      return {
        bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        icon: ArrowUp,
        text:'text-amber-400'
      };
    case 'adjustment':
      return {
        bg: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
        icon: Minus,
        text:'text-gray-400'
      };
    case 'refund':
      return {
        bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
        icon: LoaderCircle,
        text:'text-yellow-400'
      };
    default:
      return {
        bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        icon: Gift,
        text:'text-blue-400'
      };
  }
});
const handleCopy = async (text: string | undefined, field: string) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    copiedField.value = field;
    toast.success(`${t(field)} ${t("copied_to_clipboard") || "copied!"}`);
    setTimeout(() => {
      copiedField.value = null;
    }, 2000);
  } catch (err) {
    toast.error("Failed to copy");
  }
};

async function captureAndShare() {
  await captureElement(
    receiptRef,
    `receipt-${selectedTransaction.value?.txn_id}.png`
  );
}
</script>
<template>
  <main
    class="min-h-screen relative w-full bg-gray-900 text-white flex flex-col antialiased selection:bg-amber-500/30"
  >
    <CustomNavBar title="detail" backTo="/user/transactions" @back="handleBack">
    <template #right>
      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
    <div
      class="flex-1 overflow-y-auto p-4 max-w-md w-full mx-auto space-y-4 pb-24 bg-gray-900"
      ref="receiptRef"
    >
      <div v-if="selectedTransaction" class="space-y-4">
        <div
          class="p-6 bg-linear-to-b from-gray-800/40 to-transparent border border-gray-900 rounded-3xl flex flex-col items-center text-center shadow-xl"
        >
          <div
            class="w-12 h-12 rounded-full border flex items-center justify-center mb-3"
            :class="statusConfig.bg"
          >
            <component :is="statusConfig.icon" class="w-6 h-6" />
          </div>
          <span
            class="text-gray-500 font-semibold text-xs uppercase tracking-widest"
          >
            {{ t("amount") || "Total Amount" }}
          </span>
          <h2
            :class="statusConfig.text"
            class="text-3xl font-black mt-1"
          >
            {{ formatPrice(selectedTransaction.amount || 0) }}
            <span class="text-sm font-bold ml-0.5" :class="statusConfig.text">MMK</span>
          </h2>
        </div>

        <div
          class="bg-gray-800/20 border border-gray-900 rounded-3xl px-5 py-2 divide-y divide-gray-700/20 shadow-lg"
        >
          <div class="flex justify-between items-center py-3.5 group">
            <span class="text-gray-400 text-sm font-medium">{{
              t("invoice_id")
            }}</span>
            <button
              @click="handleCopy(selectedTransaction.txn_id, 'invoice_id')"
              class="text-gray-100 text-sm font-mono font-semibold flex items-center gap-1.5 hover:text-yellow-400 transition-colors"
            >
              <span>{{ selectedTransaction.txn_id }}</span>
              <CopyIcon
                class="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity"
                :class="{
                  'text-emerald-400 opacity-100': copiedField === 'invoice_id',
                }"
              />
            </button>
          </div>
          <div class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{
              t("payment_method")
            }}</span>
            <div class="flex items-center gap-2">
              <div
                class="w-5 h-5 rounded-md bg-gray-950 border border-gray-800 flex items-center justify-center"
              >
                <Wallet2 class="w-3 h-3 text-yellow-400" />
              </div>
              <span class="text-gray-100 font-semibold text-sm">{{
                selectedTransaction.payment_method
              }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{
              t("transaction")
            }}</span>
            <div class="flex items-center gap-2">

              <span class="text-gray-100 font-semibold text-sm capitalize">{{
                t(selectedTransaction.type.toLowerCase())
              }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center py-3.5">
            <span class="text-gray-400 text-sm font-medium">{{
              t("date")
            }}</span>
            <span class="text-gray-300 text-sm font-semibold">
              {{
                moment(selectedTransaction.created_at).format(
                  "DD MMM YYYY, hh:mm A",
                )
              }}
            </span>
          </div>

          <div
            v-if="selectedTransaction.remark"
            class="py-3.5 flex flex-col gap-1.5"
          >
            <span
              class="text-gray-500 text-xs font-semibold uppercase tracking-wider"
              >{{ t("remark") }}</span
            >
            <div
              class="bg-gray-800/30 border border-gray-900 p-3 rounded-2xl text-gray-300 text-xs leading-relaxed italic"
            >
              "{{ selectedTransaction.remark }}"
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer
      class="w-full z-30 p-4 bg-gray-800/20 backdrop-blur-2xl border-t border-gray-700/50"
    >
      <div class="max-w-md mx-auto">
        <Button
          @click="captureAndShare"
          class="w-full h-12 gold-bg hover:opacity-95 active:scale-[0.99] disabled:opacity-40 text-gray-950 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/5 transition-all"
        >
          {{ t("download") }}
        </Button>
      </div>
    </footer>
  </main>
</template>

<style scoped>
/* Luxury custom background setup gradients */
.gold-bg {
  background: linear-gradient(135deg, #ffe066 0%, #f59e0b 100%);
}
</style>
