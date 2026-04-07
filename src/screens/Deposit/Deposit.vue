<script setup lang="ts">
import { amounts, paymentMethod, type paymentTypes } from "@/consts";
import { ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Headset, HistoryIcon } from "lucide-vue-next";
import router from "@/router";
import { discord, formatPrice, receipt_icon, telegram, viber } from "@/utils";
import { useI18n } from "vue-i18n";
const amount = ref<number>(0);
const { t } = useI18n();
const setAmount = (a: number) => {
  amount.value = a;
};
const goToPayment = (payment: paymentTypes) => {
  if (amount.value > 2000) {
    router.push(`/deposit/${payment.value}?amount=${amount.value}`);
  }
};
</script>
<template>
  <main
    class="text-gray-100 min-h-screen flex justify-center bg-linear-to-b from-gray-900 to-gray-800 w-full"
  >
    <div class="flex flex-col p-2 w-full max-w-3xl">
      <div>
        <!-- Amount Section -->
        <section
          class="p-4 rounded-2xl bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >
          <!-- Header -->
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-lg font-bold tracking-wide">
              {{ t("set_deposit_amount") }}
            </h1>
            <button
              class="p-2 border-white/10 border shadow-inner backdrop-blur-2xl rounded-lg bg-linear-to-br from-white/5 via-white/10 to-white/5 bg-gray-800 hover:bg-white/10 transition"
              @click="router.push('/transactions')"
            >
               <img class="" :src="receipt_icon"/>
            </button>
          </div>

          <!-- Input -->
          <InputGroup
            class="h-14 rounded-xl bg-gray-900/50 border border-white/10 focus-within:ring-2 focus-within:ring-sky-400 transition"
          >
            <InputGroupAddon>
              <InputGroupText class="text-gray-400 font-bold">K</InputGroupText>
            </InputGroupAddon>

            <InputGroupInput
              v-model="amount"
              type="number"
              class="text-sky-400 text-lg font-bold bg-transparent"
              placeholder="0.00"
            />

            <InputGroupAddon align="inline-end">
              <InputGroupText class="text-gray-400">MMK</InputGroupText>
            </InputGroupAddon>
          </InputGroup>

          <!-- Quick Amounts -->
          <div class="grid grid-cols-4 gap-2 mt-4">
            <button
              v-for="a in amounts"
              :key="a"
              @click="setAmount(a)"
              :class="[
                'py-2 rounded-lg text-sm font-semibold transition',
                amount === a
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300',
              ]"
            >
              {{ formatPrice(a) }}
            </button>
          </div>
        </section>

        <section class="mt-6">
          <h1 class="text-md font-bold text-center mb-4">
            {{ t("choose_payment_method") }}
          </h1>

          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="payment in paymentMethod"
              :key="payment.id"
              @click="goToPayment(payment)"
              class="group p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/10 border border-white/10 hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-500/10 active:scale-[0.97] transition flex flex-col items-center gap-3"
            >
              <div
                class="p-3 rounded-xl bg-black/40 backdrop-blur-2xl group-hover:scale-110 transition"
              >
                <img
                  :src="payment.icon"
                  class="w-12 h-12 object-cover rounded-lg"
                />
              </div>

              <p class="font-semibold text-gray-200 group-hover:text-white">
                {{ payment.label }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section
        class="mt-6 p-4 rounded-2xl bg-linear-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl"
      >
        <p class="text-center font-semibold mb-4">
          {{ t("need_help") }}
        </p>

        <div class="flex justify-center gap-5">
          <!-- Support -->
          <div
            class="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-md"
          >
            <Headset class="text-black" />
          </div>

          <!-- Socials -->
          <img
            :src="viber"
            class="w-10 h-10 hover:scale-110 transition cursor-pointer"
          />
          <img
            :src="telegram"
            class="w-10 h-10 hover:scale-110 transition cursor-pointer"
          />
          <img
            :src="discord"
            class="w-10 h-10 hover:scale-110 transition cursor-pointer"
          />
        </div>
      </section>
    </div>
  </main>
</template>
