<script setup lang="ts">
import { paymentMethod } from "@/consts";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { toast } from "vue-sonner";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useClipboard } from "@vueuse/core";
import { Copy, CreditCardIcon, LetterText, PhoneIcon } from "lucide-vue-next";
import ApplyBreadCrumb from "@/components/breadcrumb/index.vue";
import type { depositFormData } from "@/utils/types";
import { useAuthStore } from "@/stores/auth";
import { depositHandlerAPI } from "@/services/transactionAPI";
const source = ref("09883370394");
const name = ref("SARMWELA");
console.log();
const { text, copy, isSupported } = useClipboard({ source });
const route = useRoute();
const auth = useAuthStore();
console.log(route.query);
const { amount } = route.query;
const form = ref({
  account_name: "",
  last5Digit: "",
  account_no: "",
});

const payment = computed(
  () => paymentMethod.filter((e) => e.value === route.params.payment_method)[0],
);

const submitHandler = async () => {
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
  } else if (auth.isLoggedIn === false) {
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

    payment_account: name.value,
    payment_number: source.value,
  };
  const param = {
    user_id: auth.user?.id || null,
    uuid: auth.user?.uid || null,
  };
  console.log("payload", data);
  const response = await depositHandlerAPI(data, param);

  if (response) {
    toast.success("Deposit request submitted successfully!");
  } else {
    toast.error("Failed to submit deposit request.");
  }
};
const copyHandler = () => {
  copy();
  toast("Copied sucessfully! ");
};
const breadcrumbs = [
  { label: "Deposit", to: "/deposit" },
  { label: payment?.value?.label },
];
</script>
<template>
  <main class="bg-state-900 w-full">
    <ApplyBreadCrumb :items="breadcrumbs" />
    <section class="px-3 h-full w-full">
      <form
        class="space-y-2 w-full h-full gap-2"
        @submit.prevent="submitHandler"
      >
        <div class="flex flex-col gap-4 relative bg-slate-900 p-2 rounded-t-2xl">
          <div id="payments" class="flex flex-col">
            <div class="flex rounded-lg items-center gap-3 bg-slate-800 p-2">
              <img
                :src="payment?.icon"
                alt="logo"
                class="rounded-xl w-14 h-14 overflow-hidden"
              />
              <div>
               
                <button @click="copyHandler" class="cursor-pointer flex gap-3">
                  <p class="text-lg">
                    <code>{{ text || source }}</code>
                  </p>
                  <Copy class="text-sky-600"/>
                </button>
                 <p class="text-slate-30 font-bold">{{ name }}</p>
              </div>
            </div>
          </div>
       
        </div>
        <div class="w-full bg-slate-900 p-2 flex justify-between items-center">
          <p>Amount</p>
   <p class="text-white font-bold text-2xl">K {{ amount }}</p>

        </div>
        <div
          class="flex flex-col w-full flex-1 p-4 h-full bg-gray-900 rounded-b-2xl gap-3"
        >
          <div class="space-y-1.5 w-full">
            <label for="account_name" class="text-slate-400 font-semibold:">Account Name</label>
            <InputGroup
              class="h-12 rounded-lg w-full font-bold border-0 ring-sky-500 ring-1 bg-gray-800"
            >
              <InputGroupAddon>
                <CreditCardIcon />
              </InputGroupAddon>
              <InputGroupInput class="w-full" v-model="form.account_name" type="text" placeholder="Name" />
              <InputGroupAddon align="inline-end">
                <InputGroupText class="text-gray-100"></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class="space-y-1.5">
            <label for="account_name" class="text-slate-400 font-semibold:">Phone Number/Account No.</label>
            <InputGroup
              class="h-12 rounded-lg font-bold border-0 ring-sky-500 ring-1 bg-gray-800"
            >
              <InputGroupAddon>
                <PhoneIcon />
              </InputGroupAddon>
              <InputGroupInput v-model="form.account_no" type="number" placeholder="09xxxxxx" />
              <InputGroupAddon align="inline-end">
                <InputGroupText class="text-gray-100"></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class="space-y-1.5">
            <label for="account_name" class="text-slate-400 font-semibold:">Last 5 digit of the transaction *</label>
            <InputGroup
              class="h-12 rounded-lg font-bold border-0 ring-sky-500 ring-1 bg-gray-800"
            >
              <InputGroupAddon>
                <LetterText />
              </InputGroupAddon>
              <InputGroupInput  type="text"
              name="last5Digit"
              v-model="form.last5Digit" />
              <InputGroupAddon align="inline-end">
                <InputGroupText class="text-gray-100"></InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <!-- <div class="space-y-1">
            <p>Phone Number/Account No.</p>
            <input
              type="text"
              name="account_no"
              v-model="form.account_no"
              class="p-2 border border-gray-300 w-full h-12 rounded-xl px-4"
              placeholder="09xxxxxxxx"
            />
          </div> -->
<!-- 
          <div class="space-y-1">
            <label for="last5Digit">Last 5 digit of the transaction *</label>
            <input
              type="text"
              name="last5Digit"
              v-model="form.last5Digit"
              class="p-2 border border-gray-300 w-full h-12 rounded-xl px-4"
              placeholder="5 digit"
            />
          </div> -->
        </div>
        <div class="flex flex-1 mt-10">
          <button
            type="submit"
            class="bg-sky-600 h-12 font-bold text-gray-50 w-full rounded-xl flex justify-center items-center"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  </main>
</template>
