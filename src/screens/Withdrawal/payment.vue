<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { paymentMethod } from "@/consts";
import router from "@/router";
import { withdrawalHandlerAPI } from "@/services/transactionAPI";
import { useAuthStore } from "@/stores/auth";
import type { withdrawalInfo, withdrawParamType } from "@/utils/types";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
defineProps<{
  payment_method: string;
}>();
const route = useRoute();
const payment = computed(
  () => paymentMethod.filter((e) => e.value === route.params.payment_method)[0],
);
const { amount } = route.query;
const withdraw_name = ref<string>("");
const authStore = useAuthStore();

const withdraw_no = ref<string>("");
// const amount = ref<number>(0);
const submit = async () => {
  if (!authStore.isLoggedIn || !authStore.user) return toast("Login first");
  if (!payment) {
    toast.error("Invalid payment method");
    return;
  } else if (!amount || !withdraw_name.value || !withdraw_no.value) {
    toast.error("Please fill in all fields");
    return;
  } else if (!amount) {
    toast.error("Amount must be a number");
    return;
  }
  const data: withdrawalInfo = {
    withdraw_name: withdraw_name.value,
    withdraw_no: withdraw_no.value,
    amount: parseFloat(amount as string),
    payment_method: payment.value?.value,
  };
  const param: withdrawParamType = {
    user_id: authStore.user.id,
    uuid: authStore.user.uid,
  };
  const response = await withdrawalHandlerAPI(data, param);
  if (response) {
    toast("Withdrawal form submitted successfully!");
    router.back()
    return;
  }
  toast("Internal error!");
  router.back()
};
</script>

<template>
  <main class="text-gray-100 bg-gray-950 p-4 w-full">
    <section class="w-full space-y-2">
      <div class="w-full flex flex-col rounded-t-2xl gap-2 bg-gray-900 py-6 items-center justify-center">
        <img
          :src="payment?.icon"
          alt="logo"
          class="rounded-4xl text-center w-30 h-30 overflow-hidden"
        />
        <p class="font-bold text-center text-2xl">{{ amount }} MMK</p>
      </div>

      <form
        class="flex flex-col gap-4 w-full bg-gray-900 p-4 py-6 rounded-b-2xl"
        v-on:submit.prevent="submit"
      >
        <Input
          v-model="withdraw_no"
          placeholder="Phone Number"
          class="p-2 border border-gray-300 w-full h-12 rounded-xl px-4"
        />

        <Input
          v-model="withdraw_name"
          placeholder="User Name"
          class="p-2 border border-gray-300 w-full h-12 rounded-xl px-4"
        />

        <!-- <Input v-model="amount" type="number" placeholder="Amount" class="p-2 border border-gray-300 w-full h-12 rounded-2xl px-4"/> -->
        <div></div>
        <button
          class="mt-6 bg-sky-600 h-12 text-gray-50 font-bold w-full rounded-xl flex justify-center items-center"
        >
          Submit
        </button>
      </form>
    </section>
  </main>
</template>
