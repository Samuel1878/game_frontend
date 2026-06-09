<script setup lang="ts">
import {
  amounts,
  paymentMethod,
  paymentMethodOption,
  usdtRateToMMK,
} from "@/consts";
import { computed, defineAsyncComponent, onActivated, ref, watch } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { ArrowDown, Lock, PlusIcon, Store, Wallet } from "lucide-vue-next";
import router from "@/router";
import { bankThemes, formatPrice } from "@/utils";
import { useI18n } from "vue-i18n";
import HelpBox from "@/components/layout/helpBox.vue";
import moment from "moment";
import type {
  BankAccount,
  BankAccountPros,
  withdrawalInfo,
  withdrawParamType,
} from "@/utils/types";
import { useBankStore } from "@/stores/bank";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue-sonner";
import { withdrawalHandlerAPI } from "@/services/transactionAPI";
import { useWallet } from "@/stores/wallet";
import FundPinDrawer from "@/components/fundPinDrawer.vue";
import Slider from "@/components/ui/slider/Slider.vue";
import Button from "@/components/ui/button/Button.vue";
import FundPinAlert from "@/components/fundPinAlert.vue";
import { useFundPinStore } from "@/stores/fundPinStore";
const BankAccountDrawer = defineAsyncComponent(
  () => import("@/components/bankAccountDrawer.vue"),
);
const amount = ref<number>();

const withdrawForm = ref<{ number: string; name: string; method: string }>({
  number: "",
  name: "",
  method: "",
});
const walletStore = useWallet();
const authStore = useAuthStore();
const byPercentage = ref(false);
const { t } = useI18n();
const setAmount = (a: number) => {
  amount.value = a;
};
const percentage = ref([0]);
const realAmount = computed<number>(() => {
  const balance = Number(walletStore.balance) || 0;
  const percent = Number(percentage.value?.[0]) || 0;

  return Math.floor((balance * percent) / 100);
});
const openPinDrawer = () => {
  if (!authStore.user) return router.push("/auth");
  if (!authStore.user.set_pin) {
    fundPinStore.openFundPin();
    return;
  }
  if (!amount.value) return toast.error("please_enter_amount");
  if (amount.value > walletStore.balance)
    return toast.error(t("insufficient_balance"));
  const amountNum = Number(amount.value);

  if (withdrawForm.value.method === "usdt") {
    if (amountNum < 45000 || amountNum > 20000000) {
      toast.error(t("amount_must_be_between_45000_10000000"));
      return;
    }
  } else {
    if (amountNum < 10000 || amountNum > 1000000) {
      toast.error(t("amount_must_be_between_10000_1000000"));
      return;
    }
  }
  if (!authStore.user) return toast.error(t("unauthorized"));
  if (!amount || !withdrawForm.value.name || !withdrawForm.value.number) {
    toast.error(t("choose_account"));

    return;
  }
  openDrawer.value = true;
};
const getPaymentIcon = (accountName: string) => {
  return paymentMethod.find((e) => e.value === accountName);
};
const showDialog = ref(false);
const choosen = ref<boolean>(false);
const bankStore = useBankStore();
const openDrawer = ref(false);
const { selectedPayment, filteredAccounts } = storeToRefs(bankStore);

const chooseAccount = (data: BankAccount) => {
  const isSelected =
    choosen.value && withdrawForm.value.number === data.account_number;

  if (isSelected) {
    withdrawForm.value.name = "";
    withdrawForm.value.number = "";
    withdrawForm.value.method = "";
    choosen.value = false;
    return;
  }
  withdrawForm.value.name = data.account_name;
  withdrawForm.value.number = data.account_number;
  withdrawForm.value.method = data.value;
  choosen.value = true;
};
const submit = async (params: any) => {
  console.log(params);
  if (!params) {
    openDrawer.value = false;
    return;
  }
  if (!amount.value) return toast.error("please_enter_amount");
  if (amount.value > walletStore.balance) {
    openDrawer.value = false;
    return toast.error(t("insufficient_balance"));
  }

  const amountNum = Number(amount.value);
  if (withdrawForm.value.method === "usdt") {
    if (amountNum < 45000 || amountNum > 20000000) {
      toast.error(t("amount_must_be_between_45000_10000000"));
      openDrawer.value = false;
      return;
    }
  } else {
    if (amountNum < 10000 || amountNum > 1000000) {
      toast.error(t("amount_must_be_between_10000_1000000"));
      openDrawer.value = false;
      return;
    }
  }
  if (!authStore.user) return toast.error(t("unauthorized"));
  if (!amount || !withdrawForm.value.name || !withdrawForm.value.number) {
    toast.error(t("choose_account"));
    openDrawer.value = false;
    return;
  }
  const data: withdrawalInfo = {
    withdraw_name: withdrawForm.value.name,
    withdraw_no: withdrawForm.value.number,
    amount: amount.value,
    payment_method: withdrawForm.value.method,
    fund_pin: params,
  };
  const param: withdrawParamType = {
    user_id: authStore.user.id,
    uuid: authStore.user.uid,
  };
  const response = await withdrawalHandlerAPI(data, param);
  if (response && response.data) {
    toast.success(t(response?.message || "success"));
    openDrawer.value = false;
    router.back();
    return;
  }
  openDrawer.value = false;
  toast.error(t(response?.message) || t("something_went_wrong"));
};

const isEdit = ref(false);
const selectedId = ref<number | null>(null);

const form = ref<BankAccountPros>({
  label: "",
  value: "",
  tag: 1,
  account_number: "",
  account_name: "",
  is_available: true,
});
const fundPinStore = useFundPinStore();

onActivated(async () => {
  if (authStore.user?.set_pin === false) {
      fundPinStore.openFundPin();
    }
  bankStore.fetchAccounts();
});

const openAdd = () => {
  isEdit.value = false;
  showDialog.value = true;
  form.value = {
    label: "",
    value: "",
    tag: 1,
    account_number: "",
    account_name: "",
    is_available: true,
  };
};
const saveAccount = async () => {
  // console.log(form);
  if (isEdit.value && selectedId.value) {
    await bankStore.updateAccount(selectedId.value, form.value);
  } else {
    if (form.value.account_number.length < 5) {
      toast.error("Account number must be at least 5 characters long");
      return;
    }
    if (form.value.account_name.length < 3) {
      toast.error("Account name must be at least 3 characters long");
      return;
    }
    if (!form.value.value) {
      toast.error("Please select a payment method");
      return;
    }
    await bankStore.addAccount(form.value);
  }
  showDialog.value = false;
};
watch([percentage, byPercentage], () => {
  if (byPercentage.value) {
    amount.value = realAmount.value;
  }
});
</script>
<template>
  <main
    class="text-gray-100 flex justify-center bg-linear-to-b from-gray-900 to-gray-800 w-full"
  >
    <div class="flex flex-col gap-2 p-3 w-full max-w-6xl">
      <div class="p-4 space-y-2 relative rounded-2xl info-bg overflow-hidden">
        <!-- Top summary -->
        <div class="flex justify-between">
          <p class="text-gray-300 font-medium text-md">
            {{ t("withdraw_amount") }}
          </p>

          <div class="flex flex-col gap-1 items-end">
            <p class="text-yellow-400 font-bold text-lg">
              {{ formatPrice(amount || 0) }} MMK
            </p>
            <span
              class="text-gray-500 text-xs font-semibold"
              v-show="walletStore.balance"
            >
              {{ formatPrice(walletStore.balance) }} ~
              {{
                amount
                  ? formatPrice(walletStore.balance - amount)
                  : formatPrice(walletStore.balance)
              }}
              MMK
            </span>
          </div>
        </div>

        <!-- CSS GRID HEIGHT ANIMATION WRAPPER -->
        <div
          class="overflow-hidden transition-all duration-500 h-fit"
          
        >
          <div class="overflow-hidden">
            <Transition
              mode="out-in"
              enter-active-class="transition-opacity duration-200 delay-100"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-150"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <!-- STATE A: EXPANDABLE DETAILS -->
              <div
                v-if="withdrawForm?.name"
                key="details"
                class="border-t pt-2 border-yellow-500/20 border-dashed space-y-1"
              >
                <div class="flex justify-between items-center">
                  <p class="text-gray-300 font-medium text-xs">
                    {{ t("name") }}
                  </p>
                  <p class="text-gray-100 font-normal text-md">
                    {{ withdrawForm.name }}
                  </p>
                </div>

                <div class="flex justify-between items-center">
                  <p class="text-gray-300 font-medium text-xs">
                    {{ t("account_number") }}
                  </p>
                  <p class="text-gray-100 font-bold text-md">
                    {{ withdrawForm.number }}
                  </p>
                </div>

                <div class="flex justify-between items-center">
                  <p class="text-gray-300 font-medium text-xs">
                    {{ t("payment_method") }}
                  </p>
                  <p class="text-gray-100 font-normal text-md">
                    {{ withdrawForm.method }}
                  </p>
                </div>
              </div>

              <!-- STATE B: EMPTY STATE ALERT -->
              <div
                v-else
                key="empty"
                class="flex justify-center items-center gap-2 pt-2 border-t border-dashed border-gray-800"
              >
                <p class="text-gray-300 font-medium text-xs">
                  {{ t("choose_payment_method") }}
                </p>
                <ArrowDown class="w-4 h-4 text-green-400 animate-bounce" />
              </div>
            </Transition>
          </div>
        </div>
      </div>
      <section class="w-full">
        <div class="w-full space-y-4">
          <div class="flex gap-2 overflow-x-auto no-scrollbar px-1 py-2">
            <div
              @click="router.push('/withdraw/store')"
              class="px-4 cursor-pointer h-10 rounded-full flex justify-center items-center border border-yellow-500"
            >
              <Store class="w-6 h-6 text-yellow-500" />
            </div>
            <div
              v-for="payment in paymentMethodOption"
              :key="payment.value"
              @click="bankStore.setFilter(payment.value)"
              class="shrink-0 px-4 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border"
              :class="
                selectedPayment === payment.value
                  ? 'bg-yellow-500/20 text-white border-yellow-400 shadow-lg shadow-sky-400/10 scale-105'
                  : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500'
              "
            >
              <span class="text-sm font-semibold whitespace-nowrap capitalize">
                {{ payment.label }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="flex gap-2 py-2 no-scrollbar"
          :class="
            filteredAccounts?.length ? 'overflow-x-scroll' : 'justify-center'
          "
        >
          <!-- BANK ACCOUNTS -->
          <template v-if="filteredAccounts?.length">
            <div
              v-for="acc in filteredAccounts"
              :key="acc.id"
              @click="chooseAccount(acc)"
              :class="[
                'p-3 min-w-70 rounded-2xl shine-auto active-button shadow-xl bg-linear-to-bl text-white relative overflow-hidden transition hover:scale-[1.02]',
                bankThemes[acc.value] ||
                  'from-gray-600 via-white/10 to-gray-800',
                acc.value === withdrawForm.method
                  ? 'animate-pulse border-gray-500 border-2 '
                  : 'animate-none border-0',
              ]"
            >
              <div class="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>
              <div
                v-if="acc.value === withdrawForm.method"
                class="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm"
              >
                <div class="absolute inset-0 flex items-center justify-center">
                  <div
                    class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-yellow-400 font-bold shadow-xl"
                  >
                    <Lock class="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div
                class="w-10 h-3 rounded mb-4"
                :class="
                  acc.value === 'wavePay' ? 'bg-sky-500' : 'bg-yellow-500'
                "
              ></div>

              <div class="relative z-10 space-y-4">
                <p class="text-xs opacity-70 uppercase tracking-widest">
                  {{ acc.label }}
                </p>
                <p class="tracking-widest font-semibold" :class="acc.value==='usdt'?'text-sm':'text-xl'">
                  {{ acc.account_number }}
                </p>
                <div class="flex justify-between items-end">
                  <p class="text-sm">{{ acc.account_name }}</p>
                  <p class="text-xs opacity-70">
                    {{ moment(acc.created_at).format("MM/YY") }}
                  </p>
                </div>
              </div>

              <div
                class="absolute top-3 right-3 overflow-hidden rounded-lg p-2 bg-white/10 backdrop-blur-2xl"
              >
                <img
                  class="w-8 h-8 rounded-sm"
                  :src="getPaymentIcon(acc.value)?.icon"
                  :alt="acc.label"
                />
              </div>
            </div>
            <div
              @click="openAdd"
              class="border-2 min-h-40 border-gray-600/50 min-w-xs cursor-pointer flex flex-col justify-center items-center rounded-2xl shadow-inner text-white overflow-hidden mx-auto"
            >
              <p>{{ t("add_bank_account") }}</p>
              <PlusIcon class="w-16 h-16" />
            </div>
          </template>

          <!-- EMPTY STATE / ADD BUTTON CENTERED -->
          <div
            v-else
            @click="openAdd"
            class="border-2 min-h-40 border-gray-600/50 min-w-xs cursor-pointer flex flex-col justify-center items-center rounded-2xl shadow-inner text-white overflow-hidden mx-auto"
          >
            <p>{{ t("add_bank_account") }}</p>
            <PlusIcon class="w-16 h-16" />
          </div>
        </div>
      </section>
      <div class="px-4 py-2 mt-2 space-y-4 relative bg-gray-800/20 border-gray-500/20 backdrop-blur-md shadow-2xl border rounded-2xl">
        <div class="flex gap-2 w-full mb-4 justify-between items-center">
          <h1 class="text-md font-bold tracking-wide leading-loose">
            {{ t("set_withdraw_amount") }}
          </h1>
          <div class="flex items-center gap-2">
            <button
              @click="byPercentage = !byPercentage"
              class="text-xs text-gray-400 p-2 rounded-lg border border-gray-700 hover:bg-gray-700/50 bg-gray-800/50 transition"
            >
              {{
                byPercentage ? t("switch_to_manual") : t("switch_to_percentage")
              }}
            </button>
          </div>
        </div>
        <InputGroup
          class="h-14 rounded-xl bg-gray-900/50 border border-white/10 focus-within:ring-2 focus-within:ring-yellow-400 transition"
        >
          <InputGroupAddon>
            <Wallet class="text-yellow-400 w-6 h-6"/>
          </InputGroupAddon>
          <InputGroupInput
            v-model="amount"
            type="number"
            class="text-yellow-400 text-lg font-bold bg-transparent"
            :placeholder="
              withdrawForm.method !== 'usdt'
                ? '10,000 - 1,000,000'
                : '45,000 - 10,000,000'
            "
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-400">MMK</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0 translate-y-2"
          enter-to-class="opacity-100 max-h-40 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-40 translate-y-0"
          leave-to-class="opacity-0 max-h-0 translate-y-2"
        >
        <div
          v-if=" withdrawForm.method === 'usdt'"
          class="p-4 info-bg rounded-xl space-y-3"
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
              {{ (Number(amount) / Number(usdtRateToMMK)).toLocaleString() }}
              MMK
            </span>
          </div>
        </div>

          <div v-else>
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0 translate-y-2"
              enter-to-class="opacity-100 max-h-40 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-40 translate-y-0"
              leave-to-class="opacity-0 max-h-0 translate-y-2"
            >
              <div v-if="byPercentage" class="mt-4">
                <Slider
                  v-model="percentage"
                  :min="0"
                  :max="100"
                  :step="1"
                  class="relative flex w-full touch-none select-none items-center"
                  data-slot="slider"
                  :class="[
                    // Track
                    '**:data-[slot=slider-track]:relative',
                    '**:data-[slot=slider-track]:h-2',
                    '**:data-[slot=slider-track]:w-full',
                    '**:data-[slot=slider-track]:grow',
                    '**:data-[slot=slider-track]:overflow-hidden',
                    '**:data-[slot=slider-track]:rounded-full',
                    '**:data-[slot=slider-track]:bg-white/10',

                    // Range (filled part)
                    '**:data-[slot=slider-range]:absolute',
                    '**:data-[slot=slider-range]:h-full',
                    '**:data-[slot=slider-range]:bg-linear-to-r',
                    '**:data-[slot=slider-range]:from-yellow-400',
                    '**:data-[slot=slider-range]:to-yellow-500',
                    '**:data-[slot=slider-range]:shadow-[0_0_10px_rgba(250,204,21,0.4)]',

                    // Thumb
                    '**:data-[slot=slider-thumb]:block',
                    '**:data-[slot=slider-thumb]:h-5',
                    '**:data-[slot=slider-thumb]:w-5',
                    '**:data-[slot=slider-thumb]:rounded-full',
                    '**:data-[slot=slider-thumb]:border-2',
                    '**:data-[slot=slider-thumb]:border-black/40',
                    '**:data-[slot=slider-thumb]:bg-yellow-400',
                    '**:data-[slot=slider-thumb]:shadow-[0_0_0_4px_rgba(250,204,21,0.25)]',
                    '**:data-[slot=slider-thumb]:transition-transform',
                    '**:data-[slot=slider-thumb]:duration-200',
                    '**:data-[slot=slider-thumb]:hover:scale-110',
                    '**:data-[slot=slider-thumb]:active:scale-95',
                  ]"
                />
                <div class="grid grid-cols-4 gap-2 mt-4">
                  <Button
                    class="rounded-lg text-sm font-semibold active-button bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300"
                    @click="percentage = [25]"
                  >
                    25%
                  </Button>

                  <Button
                    class="rounded-lg text-sm font-semibold active-button bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300"
                    @click="percentage = [50]"
                  >
                    50%
                  </Button>

                  <Button
                    class="rounded-lg text-sm font-semibold active-button bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300"
                    @click="percentage = [75]"
                  >
                    75%
                  </Button>

                  <Button
                    class="gold-bg text-black"
                    @click="percentage = [100]"
                  >
                {{ t('max') }}
                  </Button>
                </div>
              </div>
              <div v-else>
                <div class="grid grid-cols-4 gap-2 mt-4">
                  <button
                    v-for="a in amounts"
                    :key="a"
                    :disabled="byPercentage"
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
              </div>
            </Transition>
          </div>
        </Transition>
        <button
          @click="openPinDrawer"
          :disabled="!amount || !choosen"
          :class="!amount || !choosen ? 'opacity-50 ' : 'opacity-100'"
          class="w-full disabled:opacity-50 mb-2 gold-bg mt-4 font-bold text-black active-button rounded-lg h-12 flex items-center justify-center"
        >
          {{ t("next") }}
        </button>
      </div>

      <HelpBox container-style="" />
    </div>
  </main>
  <FundPinDrawer
    v-model:open="openDrawer"
    :amount="amount || 0"
    @confirm="submit"
  />
  <BankAccountDrawer
    v-model:open="showDialog"
    v-model:modelValue="form"
    :isEdit="isEdit"
    @save="saveAccount"
  />
  <FundPinAlert />
</template>
