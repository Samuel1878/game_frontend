<script setup lang="ts">
import { paymentMethod } from "@/consts";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,

} from '@/components/ui/input-group'
import { toast } from "vue-sonner";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useClipboard } from "@vueuse/core";
import { Copy, CreditCardIcon } from "lucide-vue-next";
import breadcrumb from "@/components/breadcrumb/index.vue";
import type { depositFormData } from "@/utils/types";
import { useAuthStore } from "@/stores/auth";
import { depositHandlerAPI } from "@/services/transactionAPI";
const source = ref("09883370394");
const name = ref("SARMWELA");
console.log()
const { text, copy, isSupported } = useClipboard({ source });
const route = useRoute();
const auth = useAuthStore();
console.log(route.query);
const {amount} = route.query;
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
    toast.error("Invalid amount!")
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
    uuid: auth.user?.uid || null
  }
    console.log("payload",data);
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
</script>
<template>
  <main class="bg-gray-950">
    <breadcrumb :payment="payment?.value" />
    <section class="p-4 h-full">
      <header class="flex gap-2 items-center justify-between"></header>
      <form
        class="flex flex-col justify-between bg-gray-950 h-full gap-2"
        @submit.prevent="submitHandler"
      >
        <div class="flex flex-col gap-4 relative bg-gray-900 p-4 rounded-t-2xl">
                    <p class=" text-gray-50 font-bold text-2xl">{{ payment?.label }}</p>
          <div id="payments" class="flex flex-col">

            <div class="flex items-center flex-col ">
              <img
                :src="payment?.icon"
                alt="logo"
                class="rounded-4xl w-30 h-30 overflow-hidden"
              />
            
            </div>

            <div v-if="isSupported" class="flex justify-between my-2">
              <p>Phone Number:</p>
              <button @click="copyHandler" class="cursor-pointer flex gap-2">
                 <p class="text-lg">
                <code>{{ text || source }}</code>
              </p><Copy />
              </button>
            </div>
            <div class="my-2 flex justify-between">
              <p>Name</p>
              <p>{{ name }}</p>
            </div>
          </div>
          <p>{{ amount }}</p>
        </div>
        <div class="flex flex-col flex-1 p-4 h-full bg-gray-900 rounded-b-2xl gap-3">
          <div class="space-y-1">
            <label for="account_name">Account Name</label>
            <!-- <input
              type="text"
              name="account_name"
              v-model="form.account_name"
              class="p-2 border border-gray-300 w-full h-12 rounded-xl px-4"
              placeholder=""
            /> -->
            <InputGroup  class="h-12 rounded-lg font-bold border-0 ring-sky-500 ring-1 bg-gray-800">
    
      <InputGroupAddon>
                <CreditCardIcon />
      </InputGroupAddon>
      <InputGroupInput v-model="amount"   type="number" placeholder="0.00" />
      <InputGroupAddon align="inline-end">
        <InputGroupText class="text-gray-100"></InputGroupText>
      </InputGroupAddon>
    </InputGroup>
          </div>
          <div class="space-y-1">
            <p>Phone Number/Account No.</p>
            <input
              type="text"   
              name="account_no"
              v-model="form.account_no"
              class="p-2 border border-gray-300 w-full h-12 rounded-xl px-4"
              placeholder="09xxxxxxxx"
            />
          </div>

          <div class="space-y-1">
            <label for="last5Digit">Last 5 digit of the transaction *</label>
            <input
              type="text"   
               name="last5Digit"
              v-model="form.last5Digit"
              class="p-2 border border-gray-300 w-full h-12 rounded-xl px-4"
              placeholder="5 digit"
            />
          </div>
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
