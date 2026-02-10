<script setup lang="ts">
import { paymentMethod } from "@/consts";
import { toast } from "vue-sonner";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useClipboard } from "@vueuse/core";
import { Copy } from "lucide-vue-next";
import breadcrumb from "@/components/breadcrumb/index.vue";
import type { depositFormData } from "@/utils/types";
import { useAuthStore } from "@/stores/auth";
import { depositHandlerAPI } from "@/services/transactionAPI";
const source = ref("09883370394");
const name = ref("SARMWELA");
const { text, copy, isSupported } = useClipboard({ source });
const route = useRoute();
const auth = useAuthStore();
const form = ref({
  account_name: "",
  last5Digit: "",
  amount: "",
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
    !form.value.account_name ||
    !form.value.last5Digit ||
    !form.value.amount ||
    !form.value.account_no
  ) {
    toast.error("Please fill in all fields");
    return;
  } else if (isNaN(parseFloat(form.value.amount))) {
    toast.error("Amount must be a number");
    return;
  } else if (auth.isLoggedIn === false) {
    toast.error("Login to submit deposit request");

    return;
  }
  const data: depositFormData = {
    account_name: form.value.account_name,
    tid: form.value.last5Digit,
    request_amount: parseFloat(form.value.amount),
    payment: payment.value?.value || null,
    account_no: form.value.account_no,
    user_id: auth.user?.id || null,
    uuid: auth.user?.uid || null,
    status: "pending",
    inv_id: `INV-${Date.now()}`,
    completed: false,
    payment_account: name.value,
    payment_number: source.value,
  };
    console.log("payload",data);
  const response = await depositHandlerAPI(data);

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
  <main class="bg-gray-900">
    <breadcrumb :payment="payment?.value" />
    <section class="p-4 h-full">
      <header class="flex gap-2 items-center justify-between"></header>
      <form
        class="flex flex-col justify-between bg-gray-800 h-full rounded-2xl p-4 gap-4"
        @submit.prevent="submitHandler"
      >
        <div class="flex flex-col gap-4 py-4 my-2">
          <div id="payments" class="flex flex-col">
            <div class="flex items-center flex-col bg-amber-100">
              <img
                :src="payment?.icon"
                alt="logo"
                class="rounded-4xl w-30 h-15 overflow-hidden"
              />
              <p>{{ payment?.label }}</p>
            </div>

            <div v-if="isSupported" class="flex justify-between my-2">
              <p class="text-lg">
                <code>{{ text || source }}</code>
              </p>
              <button @click="copyHandler" class="cursor-pointer">
                <Copy />
              </button>
            </div>
            <div class="my-2">
              {{ name }}
            </div>
          </div>
        </div>
        <div class="flex flex-col flex-1 h-full bg-gray-800 rounded-2xl gap-2">
          <div class="space-y-1">
            <label for="amount">Amount</label>
            <input
              type="number"
              v-model="form.amount"
                name="amount" 
              class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"
              placeholder=""
            />
          </div>
          <div class="space-y-1">
            <label for="account_name">Account Name</label>
            <input
              type="text"
              name="account_name"
              v-model="form.account_name"
              class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"
              placeholder=""
            />
          </div>
          <div class="space-y-1">
            <p>Phone Number/Account No.</p>
            <input
              type="text"   
              name="account_no"
              v-model="form.account_no"
              class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"
              placeholder="09xxxxxxxx"
            />
          </div>

          <div class="space-y-1">
            <label for="last5Digit">Last 5 digit of the transaction</label>
            <input
              type="text"   
               name="last5Digit"
              v-model="form.last5Digit"
              class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"
              placeholder="5 digit"
            />
          </div>
        </div>
        <div class="flex flex-1 mt-10">
          <button
            type="submit"
            class="bg-amber-300 h-12 text-gray-950 w-full rounded-2xl flex justify-center items-center"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  </main>
</template>
