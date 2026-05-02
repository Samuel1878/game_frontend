<script setup lang="ts">
import { amounts, paymentMethodOption, usdtRateToMMK } from "@/consts";
import { onMounted, ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Headset, PlusIcon } from "lucide-vue-next";
import router from "@/router";
import { bankThemes, formatPrice, openChat, receipt_icon } from "@/utils";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import HelpBox from "@/components/layout/helpBox.vue";
import moment from "moment";
import type { BankAccount, BankAccountPros, withdrawalInfo, withdrawParamType } from "@/utils/types";
import { useBankStore } from "@/stores/bank";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue-sonner";
import { withdrawalHandlerAPI } from "@/services/transactionAPI";
import { useWallet } from "@/stores/wallet";
import BankAccountDrawer from "@/components/bankAccountDrawer.vue";
const amount = ref<number>();

const withdrawForm = ref<{ number: string; name: string; method: string }>({
  number: "",
  name: "",
  method: ""
})
const walletStore = useWallet();
const authStore = useAuthStore();
const { t } = useI18n();
const setAmount = (a: number) => {
  amount.value = a;
};
const showDialog = ref(false);
const choosen = ref<boolean>(false);
const bankStore = useBankStore();
const { selectedPayment, filteredAccounts } = storeToRefs(bankStore);
onMounted(() => {
  bankStore.fetchAccounts()
})
const chooseAccount = (data: BankAccount) => {
  withdrawForm.value.name = data.account_name;
  withdrawForm.value.number = data.account_number;
  withdrawForm.value.method = data.value;
  choosen.value = true
};
const submit = async () => {
  if (!amount.value) return toast.error("please_enter_amount");
  if (amount.value > walletStore.balance) return toast.error(t("insufficient_balance"))
const amountNum = Number(amount.value);

  if (withdrawForm.value.method === "usdt") {
    if (amountNum < 45000 || amountNum > 20000000) {
      toast.error(t("amount_must_be_between_45000_10000000"));
      return;
      }
    } else {
    if (amountNum < 5000 || amountNum > 1000000) {
      toast.error(t("amount_must_be_between_5000_1000000"));
      return;
    }
  }

  if (!authStore.accessToken || !authStore.user) return toast.error(t("unauthorized"));
  if (!amount || !withdrawForm.value.name || !withdrawForm.value.number) {
    toast.error(t("choose_account"));
    return;
  }
  const data: withdrawalInfo = {
    withdraw_name: withdrawForm.value.name,
    withdraw_no: withdrawForm.value.number,
    amount: amount.value,
    payment_method: withdrawForm.value.method,
  };
  const param: withdrawParamType = {
    user_id: authStore.user.id,
    uuid: authStore.user.uid,
  };
  const response = await withdrawalHandlerAPI(data, param);
  if (response) {
    toast.success(t("success"));
    router.back();
    return;
  }
  toast.error(t("something_went_wrong"));
  router.back();
};

const isEdit = ref(false)
const selectedId = ref<number | null>(null)

const form = ref<BankAccountPros>({
  label: '',
  value: '',
  tag: 1,
  account_number: '',
  account_name: '',
  is_available: true
})

onMounted(() => {
  bankStore.fetchAccounts()
})

const openAdd = () => {
  isEdit.value = false
  showDialog.value = true
  form.value = { label: '', value: '', tag: 1, account_number: '', account_name: '', is_available: true }
}

// const openEdit = (acc: any) => {
//     isEdit.value = true
//     selectedId.value = acc.id
//     form.value = { ...acc }
//     showDialog.value = true
// }
const saveAccount = async () => {
  console.log(form)
  if (isEdit.value && selectedId.value) {
    await bankStore.updateAccount(selectedId.value, form.value)
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
    await bankStore.addAccount(form.value)
  }
  showDialog.value = false
}
</script>
<template>
  <CustomNavBar title="withdraw" backTo="/">
    <template #right>
      <button class="" @click="router.push('/user/withdraw-history')">
        <img class="w-7 h-7" :src="receipt_icon" />
      </button>
      <button v-on:click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <main class="text-gray-100 flex justify-center bg-linear-to-b from-gray-900 to-gray-800 w-full">
    <div class="flex flex-col p-2 w-full max-w-3xl">
      <section class="w-full">
<div class="w-full space-y-4">

  <!-- HEADER -->
  <div class="flex items-center gap-3">
    <div class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
    <h2 class="text-white text-base font-semibold tracking-wide">
      {{ t("choose_withdraw_account") }}
    </h2>
  </div>

  <!-- FILTER BAR -->
  <div class="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1">
    
    <div
      v-for="payment in paymentMethodOption"
      :key="payment.value"
      @click="bankStore.setFilter(payment.value)"
      class="shrink-0 px-4 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border"
      :class="selectedPayment === payment.value
        ? 'bg-yellow-400 text-black border-yellow-300 shadow-lg shadow-sky-400/20 scale-105'
        : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500'"
    >
      <span class="text-sm font-semibold whitespace-nowrap">
        {{ payment.label }}
      </span>
    </div>

    </div>

  </div>
        <div class="flex gap-2 py-2 no-scrollbar"
          :class="filteredAccounts?.length ? 'overflow-x-scroll' : 'justify-center'">
          <!-- BANK ACCOUNTS -->
          <template v-if="filteredAccounts?.length">
            <div v-for="acc in filteredAccounts" :key="acc.id" @click="chooseAccount(acc)" :class="[
              'p-3 min-w-70 rounded-2xl shine-auto active-button shadow-xl bg-linear-to-bl text-white relative overflow-hidden transition hover:scale-[1.02]',
              bankThemes[acc.value] || 'from-gray-600 via-white/10 to-gray-800',
              acc.is_available
                ? 'shadow-green-500/10 shadow-lg'
                : 'shadow-red-500/10 shadow-inner',
                acc.value === withdrawForm.method ? 'animate-pulse border-yellow-400 border-2' : 'animate-none border-0'
            ]">
              <div class="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>

              <div class="w-10 h-3 rounded mb-4" :class="acc.value === 'wavePay' ? 'bg-sky-500' : 'bg-yellow-500'">
              </div>

              <div class="relative z-10 space-y-3">
                <p class="text-xs opacity-70 uppercase tracking-widest">
                  {{ acc.label }}
                </p>
                <p class="text-xl tracking-widest font-semibold">
                  {{ acc.account_number }}
                </p>
                <div class="flex justify-between items-end">
                  <p class="text-sm">{{ acc.account_name }}</p>
                  <p class="text-xs opacity-70">
                    {{ moment(acc.created_at).format("MM/YY") }}
                  </p>
                </div>
              </div>

              <div class="absolute top-3 right-3">
                <span class="text-xs px-2 py-1 rounded-full font-semibold"
                  :class="acc.is_available ? 'bg-green-500/80' : 'bg-red-500/80'">
                  {{ acc.is_available ?t( "active") : t("closed")  }}
                </span>
              </div>
            </div>
             <div @click="openAdd"
            class="border-2 min-h-40 border-gray-600/50 min-w-xs cursor-pointer flex flex-col justify-center items-center rounded-2xl shadow-inner text-white overflow-hidden mx-auto">
            <p>{{ t("add_bank_account") }}</p>
            <PlusIcon class="w-16 h-16" />
          </div>
          </template>

          <!-- EMPTY STATE / ADD BUTTON CENTERED -->
          <div v-else @click="openAdd"
            class="border-2 min-h-40 border-gray-600/50 min-w-xs cursor-pointer flex flex-col justify-center items-center rounded-2xl shadow-inner text-white overflow-hidden mx-auto">
            <p>{{ t("add_bank_account") }}</p>
            <PlusIcon class="w-16 h-16" />
          </div>
        </div>
      </section>
      <div class="p-4 mt-2 space-y-4 relative rounded-2xl glass-bg">
        <div class="flex gap-2 w-full mb-4">
          <div class="rounded-full bg-yellow-400 p-1 h-1 mt-1.5 animate-pulse" />
          <h1 class="text-md font-bold tracking-wide">
            {{ t("set_withdraw_amount") }}
          </h1>
        </div>
        <InputGroup
          class="h-14 rounded-xl bg-gray-900/50 border border-white/10 focus-within:ring-2 focus-within:ring-yellow-400 transition">
          <InputGroupAddon>
            <InputGroupText class="text-gray-400 font-bold">K</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput v-model="amount" type="number" class="text-yellow-400 text-lg font-bold bg-transparent"
            :placeholder="withdrawForm.method !== 'usdt' ? '5,000 - 1,000,000' : '45,000 - 10,000,000'" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-400">MMK</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <div v-if="withdrawForm.method === 'usdt'" class="p-2 bg-gray-700/20 rounded-lg space-y-2">
          <p class="text-md text-yellow-400 font-normal">
            USDT
          </p>
          <p class="text-gray-100">
            {{ t("exchange_rate") }}
          </p>
          <p class="text-gray-500 text-sm font-semibold">
            1 USD ~ {{ usdtRateToMMK }} MMK
          </p>
          <p class="text-gray-200 text-sm" v-show="amount">
            {{ t("you_will_receive_about") }}:
            <span class="text-yellow-400 text-md font-bold">
              {{ Number(amount) / Number(usdtRateToMMK) }} USDT
            </span>
          </p>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4" v-else>
          <button v-for="a in amounts" :key="a" @click="setAmount(a)" :class="[
            'py-2 rounded-lg text-sm font-semibold active-button',
            amount === a
              ? 'bg-yellow-500 animate-pulse text-black shadow-lg shadow-yellow-500/20'
              : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300',
          ]">
            {{ formatPrice(a) }}
          </button>
        </div>
      </div>
      <div class="p-4 mt-2 space-y-4 relative rounded-2xl glass-bg">
        <div class="flex justify-between items-center">
          <p class="text-gray-300 font-medium text-xs">
            {{ t("available_amount") }}
          </p>
          <p class="text-yellow-400 font-bold text-lg">{{ walletStore.balance }} MMK</p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-gray-300 font-medium text-xs">
            {{ t("name") }}
          </p>
          <p class="text-gray-100 font-normal text-md">{{ withdrawForm.name }}</p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-gray-300 font-medium text-xs">
            {{ t("account_number") }}
          </p>
          <p class="text-gray-100 font-bold text-lg">{{ withdrawForm.number }}</p>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-gray-300 font-medium text-xs">
            {{ t("payment_method") }}
          </p>
          <p class="text-gray-100 font-normal text-lg">{{ withdrawForm.method }}</p>
        </div>
      </div>
      <HelpBox container-style="" />
    </div>
    <div class="w-full  fixed bottom-0 right-0 left-0 p-4 glass-bg border-t">
      <button @click="submit"
        :class="!amount || !choosen ? 'bg-yellow-400/50' : ' gold-bg '"
        class="w-full disabled:bg-yellow-400/70 font-bold text-black active-button rounded-lg h-12 flex items-center justify-center">
        {{ t('next') }}
      </button>
    </div>
  </main>
  <BankAccountDrawer v-model:open="showDialog" v-model:modelValue="form" :isEdit="isEdit" @save="saveAccount" />
</template>
