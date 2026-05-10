<script setup lang="ts">
import { paymentMethod } from "@/consts";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { toast } from "vue-sonner";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useClipboard } from "@vueuse/core";
import {
  ChartNoAxesColumnDecreasing,
  CopyIcon,
  Headset,
  RefreshCcw,
} from "lucide-vue-next";
import type { depositFormData, PaymentMethod } from "@/utils/types";
import { useAuthStore } from "@/stores/auth";
import {
  depositHandlerAPI,
  getPaymentMethodsByType,
} from "@/services/transactionAPI";
import router from "@/router";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat, receipt_icon } from "@/utils";
import HelpBox from "@/components/layout/helpBox.vue";
import LanguageBtn from "@/components/languageBtn.vue";
const { t } = useI18n();
const route = useRoute();
const auth = useAuthStore();
const priority = ref(1);
const switching = ref(false);
const submitting = ref(false);
const accountIndex = ref(0);
const changePriority = async () => {
  if (!payments.value?.length) return;

  switching.value = true;

  const samePriority = payments.value.filter(
    (e) => Number(e.priority) === priority.value
  );

  // ✅ if multiple in same priority → rotate inside group
  if (samePriority.length > 1) {
    accountIndex.value =
      (accountIndex.value + 1) % samePriority.length;
  } else {
    // 🔁 fallback → change priority
    const priorities = [
      ...new Set(payments.value.map((e) => Number(e.priority))),
    ].sort((a, b) => a - b);

    const currentIndex = priorities.indexOf(priority.value);

    const nextIndex =
      currentIndex === -1 || currentIndex === priorities.length - 1
        ? 0
        : currentIndex + 1;

    priority.value = priorities[nextIndex] || 1;

    accountIndex.value = 0; // reset index
  }

  setTimeout(() => {
    switching.value = false;
  }, 300);
};
const chosenAccount = computed(() => {
  if (!payments.value?.length) return null;

  const samePriority = payments.value.filter(
    (e) => Number(e.priority) === priority.value
  );

  if (!samePriority.length) return null;

  return samePriority[accountIndex.value % samePriority.length];
});
const payments = ref<PaymentMethod[] | null>(null);
const { amount } = route.query;
const form = ref({
  account_name: "",
  last5Digit: "",
  account_no: "",
});
const { copy } = useClipboard({ source: "" });
const payment = computed(
  () => paymentMethod.filter((e) => e.value === route.params.payment_method)[0],
);
onMounted(() => {
  getPaymentMethods();
});
const getPaymentMethods = async () => {
  try {
    const response = await getPaymentMethodsByType(
      payment.value?.value || "",
      true,
    );
    if (response === null) {
      toast.error(t("try_again"));
      return;
    }
    const data = await response;
    payments.value = data.sort(
      (a: PaymentMethod, b: PaymentMethod) => Number(a.id) - Number(b.id),
    );
    // console.log("payment methods", data);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
  }
};
// const isLast5Valid = computed(() => /^[0-9]{5}$/.test(form.value.last5Digit));
const submitHandler = async () => {
  if (submitting.value) return;
  submitting.value = true;
  try {
    if (!payment.value) {
      toast.error(t("try_again"));
      return;
    } else if (
      // !form.value.account_name ||
      !form.value.last5Digit
      // !form.value.account_no
    ) {
      toast.error(t("last_5_digit_must_be_filed"));
      return;
    } else if (!amount) {
      toast.error("Invalid amount!");
    } else if (auth.accessToken === null || auth.user === null) {
      toast.error("Login to submit deposit request");
      return;
    }
    const data: depositFormData = {
      account_name: form.value.account_name,
      tid: form.value.last5Digit,
      request_amount: parseFloat(amount as string),
      payment: payment.value?.value || null,
      account_no: form.value.account_no,
      user_id: auth.user?.id || null,
      uuid: auth.user?.uid || null,
      payment_account: chosenAccount.value?.account_name || null,
      payment_number: chosenAccount.value?.account_number || null,
    };
    const param = {
      user_id: auth.user?.id || null,
      uuid: auth.user?.uid || null,
    };
    console.log("payload", data);
    const response = await depositHandlerAPI(data, param);

    if (response) {
      toast.success(t('deposit_success'));
      setTimeout(() => router.push("/user/deposit-history"), 1000);
    } else {
      toast.error(t("try_again"));
    }
  } finally {
    submitting.value = false;
  }
};
const copyHandler = (value:any) => {
  if (!chosenAccount.value?.account_number) return;

  copy(value);

  toast.success(`${t('copied')}: ${value}`);
};

</script>
<template>
  <main class="bg-gray-900 w-full gap-2 flex items-center flex-col">
  <CustomNavBar title="transfer" backTo="/deposit">
    <template #right>
      <button>
        <img class="w-7 h-7" :src="receipt_icon" />
      </button>
      <button @click="openChat">
        <Headset class="w-6 h-6 text-yellow-400" />
      </button>
      <LanguageBtn/>
    </template>
  </CustomNavBar>
    <section class="px-2 max-w-3xl h-full w-full space-y-2">
      <form class="w-full  space-y-2" @submit.prevent="submitHandler">
        <div class="flex justify-between w-full px-3 p-2 items-center rounded-lg glass-bg border">
          <div class="rounded-lg overflow-hidden bg-black/40 backdrop-blur-2xl">
            <img :src="payment?.icon" class="w-12 h-12" />
          </div>
          <p class="font-bold text-white">{{ payment?.label }}</p>
          <button type="button" @click="changePriority"
            class="active:scale-95 transition text-sky-400 font-bold text-lg px-2 py-1">
              <RefreshCcw :class="switching ? 'animate-spin' : ''" />
          </button>
        </div>
        <div
          class="flex flex-col w-full p-4 gap-6 h-full bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0)] rounded-lg">
          <div class="w-full flex justify-between items-center">
            <p class="text-xs text-gray-300">{{ t('name') }}</p>
            <p class="text-lg text-yellow-500 font-bold">{{ chosenAccount?.account_name }}</p>
          </div>
          <div class="w-full flex justify-between items-center">
            <p v-show="payment?.value!=='usdt'" class="text-xs text-gray-300">{{ t('account_number') }}</p>
            <div class="flex gap-2 items-center">
              <p class=" text-amber-400 font-bold" :class="payment?.value==='usdt'?'text-xs':'text-xl'">{{ chosenAccount?.account_number }}</p>
              <button type="button" class="flex gap-1 items-center p-2 rounded-full bg-gray-500/20" @click="copyHandler(chosenAccount?.account_number??'')">
                <CopyIcon class="text-gray-200 w-4 h-4" />
                <p class="text-xs text-gray-300">{{ t("copy") }}</p>
              </button>
            </div>

          </div>
           <div class="w-full flex justify-between items-center">
            <p class="text-xs text-gray-300">{{ t('amount') }}</p>
            <div class="flex gap-2 items-center">
              <p class="text-lg text-gray-50 font-bold">{{ amount }}</p>
              <button type="button" class="flex gap-1 items-center p-2 rounded-full bg-gray-500/20" @click="copyHandler(amount??'')">
                <CopyIcon class="text-gray-200 w-4 h-4" />
                <p class="text-xs text-gray-200">{{ t("copy") }}</p>
              </button>
            </div>

          </div>
        </div>
        <div
          class="flex flex-col w-full flex-1 p-4 h-full bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-b-0 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0)] rounded-lg">
          <div class="space-y-2">
            <label for="account_name" class="text-gray-400 font-semibold:">{{ t("last_5_digit_of_transaction") }}
            </label>
            <InputGroup class="h-12 mt-2 rounded-lg text-white font-bold border border-gray-700 ring-yellow-500 ring-0 bg-gray-900">
              <InputGroupAddon>
                <ChartNoAxesColumnDecreasing />
              </InputGroupAddon>
              <InputGroupInput type="text" maxlength="6" name="last5Digit" v-model="form.last5Digit" />
              <InputGroupAddon align="inline-end">
                <InputGroupText class="text-gray-100"></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>  
        </div>
       
      </form>
      <div class="glass-bg border rounded-2xl p-4 mt-8 space-y-6">
        <h1 class="text-red-500 font-bold text-xl">
          {{ t("note") }}
        </h1>
        <div class="flex gap-2 w-full">
          <div class="rounded-full bg-amber-400 p-1.5 h-1.5 mt-1.5"/>
          <p class="text-xs leading-loose font-normal text-gray-300">{{ t('payment_note_1') }}</p>
        </div>
        <div class="flex gap-2 w-full">
           <div class="rounded-full bg-amber-400 p-1.5 h-1.5 mt-1.5"/>
          <p class="text-xs leading-loose font-normal text-gray-300">{{ t('payment_note_2') }}</p>
        </div>
      </div>
          <HelpBox containerStyle="w-full"/>
    </section>
    <div class="w-full  fixed bottom-0 right-0 left-0 p-4 glass-bg border-t">

          <button :disabled="submitting" type="submit"
            class="gold-bg active-button h-12 font-bold text-gray-900 w-full rounded-lg flex justify-center items-center gap-2 disabled:opacity-50">
            <RefreshCcw v-if="submitting" class="animate-spin" />
            {{ t('submit') }}
          </button>
    
    </div>

  </main>
</template>
