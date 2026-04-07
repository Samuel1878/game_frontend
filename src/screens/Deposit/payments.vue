<script setup lang="ts">
import { paymentMethod, usdtRateToMMK } from "@/consts";
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
  Copy,
  CreditCardIcon,
  LoaderCircleIcon,
  PhoneIcon,
  RefreshCcw,
} from "lucide-vue-next";
import ApplyBreadCrumb from "@/components/breadcrumb/index.vue";
import type { depositFormData, PaymentMethod } from "@/utils/types";
import { useAuthStore } from "@/stores/auth";
import {
  depositHandlerAPI,
  getPaymentMethodsByType,
} from "@/services/transactionAPI";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { formatPrice } from "@/utils";
import Button from "@/components/ui/button/Button.vue";
const { t } = useI18n();
const route = useRoute();
const auth = useAuthStore();
const priority = ref(1);
const switching = ref(false);
const submitting = ref(false);
const changePriority = async () => {
  if (!payments.value?.length) return;

  switching.value = true;

  const priorities = [
    ...new Set(payments.value.map((e) => Number(e.priority))),
  ].sort((a, b) => a - b);

  const currentIndex = priorities.indexOf(priority.value);

  const nextIndex =
    currentIndex === -1 || currentIndex === priorities.length - 1
      ? 0
      : currentIndex + 1;

  priority.value = priorities[nextIndex] || 1;

  setTimeout(() => {
    switching.value = false;
  }, 300);
};
const chosenAccount = computed(() => {
  if (!payments.value?.length) return null;

  const found = payments.value.find(
    (e) => Number(e.priority) === priority.value,
  );

  if (found) return found;
  const sorted = [...payments.value].sort(
    (a, b) => Number(a.priority) - Number(b.priority),
  );

  return sorted[0] || null;
});
const payments = ref<PaymentMethod[] | null>(null);
const { amount } = route.query;
const form = ref({
  account_name: "",
  last5Digit: "",
  account_no: "",
});
const {  copy } = useClipboard({ source: "" });
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
      toast.error("Failed to fetch payment methods");
      return;
    }
    const data = await response;
    payments.value = data.sort(
      (a: PaymentMethod, b: PaymentMethod) => Number(a.id) - Number(b.id),
    );
    console.log("payment methods", data);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
  }
};
const submitHandler = async () => {
  if (submitting.value) return;
  submitting.value = true;
  try {
      if (!payment.value) {
    toast.error("Invalid payment method");
    return;
  } else if (
    // !form.value.account_name ||
    !form.value.last5Digit
    // !form.value.account_no
  ) {
    toast.error("Last 5 digit must not be empty");
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
      toast.success("Deposit request submitted successfully!");
      setTimeout(() => router.back(), 1000);
    } else {
      toast.error("Failed to submit deposit request.");
    }
  } finally {
    submitting.value = false;
  }
};
const copyHandler = () => {
  if (!chosenAccount.value?.account_number) return;

  copy(chosenAccount.value.account_number);

  toast.success(`Copied: ${chosenAccount.value.account_number.slice(-4)}`);
};
const breadcrumbs = [
  { label: "Deposit", to: "/deposit" },
  { label: payment?.value?.label },
];
</script>
<template>
  <main class="bg-gray-900 w-full flex items-center flex-col min-h-svh">
    <div class="w-full">
      <ApplyBreadCrumb :items="breadcrumbs" />
    </div>
    <section class="px-3 max-w-3xl h-full w-full space-y-2">
      <form class="w-full h-full gap-2" @submit.prevent="submitHandler">
        <div
          class="flex flex-col w-full flex-1 p-4 h-full bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-b-0 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0)] rounded-t-2xl gap-3"
        >
          <div class="space-y-2 w-full">
            <label for="account_name" class="text-slate-400 font-semibold:">{{
              t("sender_account_name")
            }}</label>
            <InputGroup
              class="h-12 rounded-lg w-full font-bold border border-gray-700 ring-sky-500 ring-0 bg-gray-900"
            >
              <InputGroupAddon>
                <CreditCardIcon class="text-gray-200" />
              </InputGroupAddon>
              <InputGroupInput
                :disabled="payment?.value === 'usdt'"
                class="w-full"
                v-model="form.account_name"
                type="text"
                :placeholder="t('name')"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText class="text-gray-100"></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class="space-y-2">
            <label for="account_name" class="text-gray-400 font-semibold:">{{
              t("phone_number")
            }}</label>
            <InputGroup
              class="h-12 rounded-lg font-bold border ring-sky-500 border-gray-700 bg-gray-900"
            >
              <InputGroupAddon>
                <PhoneIcon />
              </InputGroupAddon>
              <InputGroupInput
                :disabled="payment?.value === 'usdt'"
                v-model="form.account_no"
                type="number"
                placeholder="09xxxxxx"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText class="text-gray-100"></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class="space-y-2">
            <label for="account_name" class="text-gray-400 font-semibold:"
              >{{ t("last_5_digit_of_transaction") }}
            </label>
            <InputGroup
              class="h-12 rounded-lg font-bold border border-gray-700 ring-sky-500 ring-0 bg-gray-900"
            >
              <InputGroupAddon>
                <ChartNoAxesColumnDecreasing />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                name="last5Digit"
                v-model="form.last5Digit"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText class="text-gray-100"></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class="w-full p-2 flex justify-between items-center">
            <p
              class="text-gray-400 font-bold text-lg"
              v-show="payment?.value !== 'usdt'"
            >
              {{ t("amount") }}
            </p>
            <p
              class="text-gray-400 font-bold text-sm"
              v-show="payment?.value === 'usdt'"
            >
              Amount in MMK
            </p>
            <div class="text-right">
              <p class="text-sky-400 font-bold text-xl">
                {{ formatPrice(Number(amount)) }} MMK
              </p>
              <p
                v-show="payment?.value === 'usdt'"
                class="text-sky-400 text-lg font-normal"
              >
                {{
                  amount ? (Number(amount) / usdtRateToMMK).toFixed(2) : "0.00"
                }}
                USDT
              </p>
              <p
                v-show="payment?.value === 'usdt'"
                class="text-gray-500 text-sm font-normal"
              >
                1 USD ~ {{ usdtRateToMMK }} MMK
              </p>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col w-full mt-1 gap-4 relative rounded-b-2xl bg-linear-to-bl from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-t-0 border-white/10 shadow-[0_5px_50px_rgba(0,0,0,0.6)]"
        >
          <div class="absolute -top-3 flex justify-between -right-3 -left-3">
            <div class="h-6 w-6 bg-gray-900 rounded-full"></div>
            <div class="h-6 w-6 bg-gray-900 rounded-full"></div>
          </div>
          <div
            id="payments"
            class="flex items-center w-full justify-between px-4"
          >
            <div class="flex items-center gap-2 py-6">
              <div
                class="p-3 w-15 rounded-xl bg-black/40 backdrop-blur-2xl"
              >
                <img
                  :src="payment?.icon"
                  class="w-12 h-12 object-cover rounded-lg"
                />
              </div>
              <Transition name="fade-slide" mode="out-in">
                <div :key="chosenAccount?.id" class="w-full">
                  <button @click="copyHandler" class="cursor-pointer gap-3">
                    <p
                      class="text-gray-300 text-wrap"
                      :class="
                        chosenAccount?.value === 'usdt' ? 'text-sm' : 'text-lg'
                      "
                    >
                      <code>{{ chosenAccount?.account_number }}</code>
                    </p>
                  </button>

                  <p class="text-gray-50 font-bold">
                    {{ chosenAccount?.account_name }}
                  </p>
                </div>
              </Transition>
            </div>
            <Copy
              @click="copyHandler"
              class="text-sky-400 cursor-pointer hover:scale-110 active:scale-95 transition"
            />
          </div>
          <div class="flex justify-between items-center px-4 py-2">
            <div class="flex items-center gap-2">
              <span
                class="text-xs px-2 py-1 rounded-full font-semibold"
                :class="
                  priority === 1
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                "
              >
                {{ priority === 1 ? "Primary" : "Secondary" }}
              </span>
            </div>
            <div>
              <Button
                variant="outline"
                @click.prevent="changePriority"
                class="w-full active:scale-95 transition border-sky-400 text-sky-400 font-bold text-lg px-2 py-1"
              >
                <RefreshCcw :class="switching ? 'animate-spin' : ''" />
              </Button>
            </div>
          </div>
        </div>
        <div class="flex flex-1 mt-10">
         <button
  :disabled="submitting"
  type="submit"
  class="bg-sky-600 h-12 font-bold text-gray-50 w-full rounded-xl flex justify-center items-center gap-2 disabled:opacity-50"
>
  <LoaderCircleIcon v-if="submitting" class="animate-spin" />
  Submit
</button>
        </div>
      </form>
    </section>
  </main>
</template>
<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
