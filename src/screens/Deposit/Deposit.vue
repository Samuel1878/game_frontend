<script setup lang="ts">
import { amounts, paymentMethodDeposit, usdtRateToMMK } from "@/consts";
import { ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { CircleCheck, Headset } from "lucide-vue-next";
import router from "@/router";
import {formatPrice, openChat, receipt_icon } from "@/utils";
import { useI18n } from "vue-i18n";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import HelpBox from "@/components/layout/helpBox.vue";
import LanguageBtn from "@/components/languageBtn.vue";
const amount = ref<number>();
const { t } = useI18n();
const chosePayment = ref("");
const setAmount = (a: number) => {
  amount.value = a;
};
const choosePayment = (value: string) => {
  chosePayment.value = value
}

const goToPayment = () => {
  if (chosePayment.value === 'usdt') {
    if (amount.value && amount.value >= 10 && amount.value <= 40000) {
      router.push(`/deposit/${chosePayment.value}?amount=${amount.value}`);
    }
    return
  }
  if (amount.value && amount.value >= 5000 && amount.value <= 1000000) {
    router.push(`/deposit/${chosePayment.value}?amount=${amount.value}`);
  }
};
</script>
<template>
  <CustomNavBar title="deposit" backTo="/">
    <template #right>
      <button
        class=""
        @click="router.push('/user/deposit-history')">
       <img class="w-7 h-7" :src="receipt_icon" />
      </button>
      <button
        v-on:click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn/>
    </template>
  </CustomNavBar>
  <main class="text-gray-100 flex justify-center bg-linear-to-b from-gray-900 to-gray-800 w-full">

    <div class="flex flex-col p-2 w-full max-w-3xl">
        <section
          class="p-4 space-y-4 relative rounded-2xl bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div class="flex gap-2 w-full">
             <div class="rounded-full bg-sky-400 p-1.5 h-1.5 mt-1.5"/>
          <h1 class="text-md font-bold">

            {{ t("choose_payment_method") }}
          </h1>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="payment in paymentMethodDeposit" :key="payment.id" @click="choosePayment(payment.value)"
              class="group p-4 rounded-2xl relative bg-linear-to-br from-white/5 to-white/10 border-2  hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-500/10 active:scale-[0.97] transition flex flex-col items-center gap-3"
              :class="chosePayment === payment.value ? 'border-sky-400' : 'border-white/10'">
              <div class="p-2 rounded-xl bg-black/40 backdrop-blur-2xl group-hover:scale-110 transition">
                <img :src="payment.icon" class="w-12 h-12 object-cover rounded-lg" />
              </div>
              <CircleCheck v-show="chosePayment === payment.value"
                class="text-sky-400 w-7 h-7 absolute right-2 top-2 font-bold" />
              <p class="font-semibold text-gray-200 group-hover:text-white">
                {{ payment.label }}
              </p>
            </div>
          </div>
          <p class="text-red-400 text-xs font-normal leading-loose">
            {{ t('deposit_payment_description') }}
          </p>
        </section>
        <div class="p-4 mt-2 space-y-4 relative rounded-2xl glass-bg">
          <div class="flex gap-2 w-full mb-4">
             <div class="rounded-full bg-sky-400 p-1.5 h-1.5 mt-1.5"/>
            <h1 class="text-md font-bold tracking-wide">
              {{ t("set_deposit_amount") }}
            </h1>
          </div>
          <InputGroup
            class="h-14 rounded-xl bg-gray-900/50 border border-white/10 focus-within:ring-2 focus-within:ring-sky-400 transition">
            <InputGroupAddon>
              <InputGroupText class="text-gray-400 font-bold">K</InputGroupText>
            </InputGroupAddon>

            <InputGroupInput v-model="amount" type="number" class="text-sky-400 text-lg font-bold bg-transparent"
              :placeholder="chosePayment !== 'usdt' ? '5,000 - 1,000,000' : '10 - 4,000'" />

            <InputGroupAddon align="inline-end">
              <InputGroupText class="text-gray-400">MMK</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <div v-if="chosePayment === 'usdt'" class="p-2 bg-gray-700/20 rounded-lg space-y-2">
            <p class="text-md text-sky-400 font-normal">
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
              <span class="text-sky-400 text-md font-bold">
                {{ Number(amount) * Number(usdtRateToMMK) }} MMK
              </span>
            </p>
          </div>
          <div class="grid grid-cols-4 gap-2 mt-4" v-else>
            <button v-for="a in amounts" :key="a" @click="setAmount(a)" :class="[
              'py-2 rounded-lg text-sm font-semibold active-button',
              amount === a
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300',
            ]">
              {{ formatPrice(a) }}
            </button>
          </div>
      </div>
  <HelpBox container-style=""/>
      
    </div>
    <div class="w-full  fixed bottom-0 right-0 left-0 p-4 glass-bg border-t">
      <button :disabled="!amount || !chosePayment" @click="goToPayment" class="w-full disabled:bg-gray-400/50 font-bold text-white active-button rounded-lg h-12 bg-sky-400 flex items-center justify-center">
        {{ t('next') }}
      </button>
    </div>
    
  </main>

</template>
