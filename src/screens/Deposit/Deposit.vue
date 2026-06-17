<script setup lang="ts">
import { amounts, paymentMethod, usdtRateToMMK } from "@/consts";
import { computed, onActivated, onMounted, ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { CircleCheck, Wallet } from "lucide-vue-next";
import router from "@/router";
import { formatPrice } from "@/utils";
import { useI18n } from "vue-i18n";
import HelpBox from "@/components/layout/helpBox.vue";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import { getCompanyDepositAccounts } from "@/services/depositAPI";
import {
  methodTypeToUiPaymentValue,
  type CompanyPaymentAccountResponse,
} from "@/services/paymentMethodsAPI";
import { moneyToNumber } from "@/utils/money";
const amount = ref<number>();
const { t } = useI18n();
const chosePayment = ref("");
const loadingMethods = ref(false);
const companyAccounts = ref<CompanyPaymentAccountResponse[]>([]);
const setAmount = (a: number) => {
  amount.value = a;
};
const authStore = useAuthStore();
const choosePayment = (value: string) => {
  chosePayment.value = value;
};
const availablePaymentMethods = computed(() =>
  paymentMethod.filter((payment) =>
    companyAccounts.value.some(
      (account) =>
        account.isActive &&
        methodTypeToUiPaymentValue(account.methodType) === payment.value,
    ),
  ),
);
const selectedAccounts = computed(() =>
  companyAccounts.value.filter(
    (account) => methodTypeToUiPaymentValue(account.methodType) === chosePayment.value,
  ),
);
const selectedLimits = computed(() => {
  const accounts = selectedAccounts.value;
  const mins = accounts.map((account) => moneyToNumber(account.minAmount));
  const maxs = accounts
    .map((account) => account.maxAmount)
    .filter(Boolean)
    .map((value) => moneyToNumber(value));

  return {
    min: mins.length ? Math.min(...mins) : 0,
    max: maxs.length ? Math.max(...maxs) : 0,
    currency: accounts[0]?.currency ?? "MMK",
  };
});
const amountPlaceholder = computed(() => {
  const { min, max, currency } = selectedLimits.value;
  if (!chosePayment.value || (!min && !max)) return "0";
  return `${min ? formatPrice(min) : 0}${max ? ` - ${formatPrice(max)}` : "+"} ${currency}`;
});
const loadCompanyAccounts = async () => {
  loadingMethods.value = true;
  try {
    companyAccounts.value = await getCompanyDepositAccounts();
    if (
      chosePayment.value &&
      !availablePaymentMethods.value.some((payment) => payment.value === chosePayment.value)
    ) {
      chosePayment.value = "";
    }
  } catch (error: any) {
    companyAccounts.value = [];
    toast.error(error?.response?.data?.message || t("try_again"));
  } finally {
    loadingMethods.value = false;
  }
};

const goToPayment = () => {
  if (!authStore.user)
    return router.push({ path: "/auth", query: { mode: "login" } });
  if (!selectedAccounts.value.length) {
    toast.warning(t("payment_method_not_available"));
    return;
  }
  const amountValue = Number(amount.value ?? 0);
  const { min, max } = selectedLimits.value;
  if (!amountValue || amountValue <= 0) {
    toast.warning(t("invalid_amount"));
    return;
  }
  if ((min && amountValue < min) || (max && amountValue > max)) {
    toast.warning(`${t("amount_must_be_between")} ${amountPlaceholder.value}`);
    return;
  }

  router.push(`/deposit/${chosePayment.value}?amount=${amount.value}`);
};
onActivated(loadCompanyAccounts);
onMounted(loadCompanyAccounts);
</script>
<template>
  <main class="text-gray-100 flex justify-center bg-gray-900 w-full">
    <div class="flex flex-col p-2 w-full max-w-3xl">
      <section
        class="p-4 space-y-4 relative rounded-2xl bg-gray-800/20 border border-gray-500/20 backdrop-blur-md shadow-2xl"
      >
        <div class="flex gap-2 w-full">
          <div
            class="rounded-full bg-yellow-400/20 border border-yellow-500 shadow-innter p-1.5 h-1.5 mt-0.5"
          />
          <h1 class="text-sm font-bold">
            {{ t("choose_payment_method") }}
          </h1>
        </div>
        <div class="flex flex-wrap justify-center gap-2">
          <div
            v-for="payment in availablePaymentMethods"
            :key="payment.id"
            @click="choosePayment(payment.value)"
            class="group w-[30%] p-2 rounded-2xl relative bg-linear-to-br from-gray-800/5 to-gray-500/10 border-2 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.97] transition flex flex-col items-center gap-2"
            :class="
              chosePayment === payment.value
                ? 'border-yellow-400 animate-pulse'
                : 'border-white/10'
            "
          >
            <div
              class="p-2 rounded-xl bg-black/40 backdrop-blur-2xl group-hover:scale-110 transition"
            >
              <img
                :src="payment.icon"
                class="w-10 h-10 object-cover rounded-lg"
                fetchpriority="high"
                decoding="async"
                :alt="payment.label"
              />
            </div>
            <CircleCheck
              v-show="chosePayment === payment.value"
              class="text-yellow-400 w-6 h-6 absolute right-2 top-2 font-bold"
            />
            <p class="font-semibold text-gray-200 group-hover:text-white">
              {{ payment.label }}
            </p>
          </div>
          <p
            v-if="!loadingMethods && !availablePaymentMethods.length"
            class="text-sm text-gray-400 py-8"
          >
            {{ t("no_payment_methods_available") }}
          </p>
        </div>
        <p class="text-red-400 text-xs font-normal leading-loose">
          {{ t("deposit_payment_description") }}
        </p>
      </section>
      <div
        class="p-4 mt-2 space-y-4 relative rounded-2xl bg-gray-800/20 border border-gray-500/20 backdrop-blur-md shadow-2xl"
      >
        <div class="flex gap-2 w-full mb-4">
          <div
            class="rounded-full bg-yellow-400/20 border border-yellow-500 shadow-innter p-1.5 h-1.5 mt-0.5"
          />
          <h1 class="text-sm font-bold tracking-wide">
            {{ t("set_deposit_amount") }}
          </h1>
        </div>
        <InputGroup
          :class="{ 'error-shake': !amount }"
          class="h-14 rounded-xl bg-gray-900/50 border border-white/10 focus-within:ring-2 focus-within:ring-yellow-400 transition"
        >
          <InputGroupAddon>
            <Wallet class="text-yellow-400 w-6 h-6" />
          </InputGroupAddon>

          <InputGroupInput
            v-model="amount"
            type="number"
            class="text-yellow-400 text-lg font-bold bg-transparent"
            :placeholder="
              amountPlaceholder
            "
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-400">
              {{ selectedLimits.currency }}
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <div
          v-if="chosePayment === 'usdt'"
          class="p-4 bg-gray-700/30 border border-gray-700/50 rounded-xl space-y-3"
        >
          <!-- Header Title -->
          <div class="flex items-center gap-2 pb-2 border-b border-gray-700/40">
            <div class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <p
              class="text-sm font-semibold text-yellow-400 uppercase tracking-wider"
            >
              USDT {{ t("payment_method") }}
            </p>
          </div>

          <!-- Exchange Rate Row -->
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-400 font-medium">
              {{ t("exchange_rate") }}
            </span>
            <span
              class="text-gray-200 font-mono font-semibold bg-gray-800/60 px-2 py-0.5 rounded border border-gray-700/30"
            >
              1 USD ≈ {{ usdtRateToMMK }} MMK
            </span>
          </div>

          <!-- Expected Return Row -->
          <div
            v-show="amount"
            class="flex justify-between items-center pt-1 text-sm"
          >
            <span class="text-gray-400 font-medium">
              {{ t("you_will_receive_about") }}
            </span>
            <span class="text-base font-bold text-yellow-400 font-mono">
              {{ (Number(amount) * Number(usdtRateToMMK)).toLocaleString() }}
              MMK
            </span>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4" v-else>
          <button
            v-for="a in amounts"
            :key="a"
            @click="setAmount(a)"
            :class="[
              'py-2 rounded-lg text-sm font-semibold active-button',
              amount === a
                ? 'bg-yellow-500/20 animate-pulse text-white border border-yellow-400 shadow-lg shadow-yellow-500/10'
                : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300',
            ]"
          >
            {{ formatPrice(a) }}
          </button>
        </div>
        <Button
          :disabled="loadingMethods || !amount || !chosePayment"
          @click="goToPayment"
          :class="loadingMethods || !amount || !chosePayment ? 'gold-bg' : ' gold-bg '"
          class="w-full disabled:opacity-50 font-bold text-glow active-button rounded-lg h-12 flex items-center justify-center"
        >
          {{ loadingMethods ? t("loading") : t("next") }}
        </Button>
      </div>
      <HelpBox container-style="" />
    </div>
  </main>
</template>
