<script setup lang="ts">
import { amounts, paymentMethod, usdtRateToMMK } from "@/consts";
import { ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { CircleCheck} from "lucide-vue-next";
import router from "@/router";
import {formatPrice } from "@/utils";
import { useI18n } from "vue-i18n";
import HelpBox from "@/components/layout/helpBox.vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
const ui = useUIStore()
const amount = ref<number>();
const { t } = useI18n();
const chosePayment = ref("");
const setAmount = (a: number) => {
  amount.value = a;
};
const authStore = useAuthStore()
const choosePayment = (value: string) => {
  chosePayment.value = value
}

const goToPayment = () => {
  if(!authStore.user)return ui.openAuthModal();
  if (chosePayment.value === 'usdt') {
    if (amount.value && amount.value >= 10 && amount.value <= 40000) {
      router.push(`/deposit/${chosePayment.value}?amount=${amount.value}`);
    }
    return
  }
  
  if (chosePayment.value ==='kbzBank') {
     if (amount.value && amount.value >= 100000 && amount.value <= 50000000) {
      router.push(`/deposit/${chosePayment.value}?amount=${amount.value}`);
    }
    return
  }
  if (amount.value && amount.value >= 10000 && amount.value <= 1000000) {
    router.push(`/deposit/${chosePayment.value}?amount=${amount.value}`);
  }
};
</script>
<template>
  <main class="text-gray-100 flex justify-center bg-linear-to-b from-gray-900 to-gray-800 w-full">

    <div class="flex flex-col p-2 w-full max-w-3xl">
        <section
          class="p-4 space-y-4 relative rounded-2xl bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <div class="flex gap-2 w-full">
             <div class="rounded-full bg-yellow-400 p-1.5 h-1.5 mt-1.5 animate-pulse"/>
          <h1 class="text-sm font-bold">

            {{ t("choose_payment_method") }}
          </h1>
          </div>
          <div class="flex flex-wrap justify-center gap-2">
            <div v-for="payment in paymentMethod" :key="payment.id" @click="choosePayment(payment.value)"
              class="group  w-[30%] p-2 rounded-2xl relative bg-linear-to-br from-white/5 to-white/10 border-2  hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.97] transition flex flex-col items-center gap-2"
              :class="chosePayment === payment.value ? 'border-yellow-400 animate-pulse' : 'border-white/10'">
              <div class="p-2 rounded-xl bg-black/40 backdrop-blur-2xl group-hover:scale-110 transition">
                <img :src="payment.icon" class="w-10 h-10 object-cover rounded-lg" />
              </div>
              <CircleCheck v-show="chosePayment === payment.value"
                class="text-yellow-400 w-6 h-6 absolute right-2 top-2 font-bold" />
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
             <div class="rounded-full bg-yellow-400 p-1.5 h-1.5 mt-1.5 animate-pulse"/>
            <h1 class="text-sm font-bold tracking-wide">
              {{ t("set_deposit_amount") }}
            </h1>
          </div>
          <InputGroup :class="{ 'error-shake': !amount }"
            class="h-14 rounded-xl bg-gray-900/50 border border-white/10 focus-within:ring-2 focus-within:ring-yellow-400 transition">
            <InputGroupAddon>
              <InputGroupText class="text-gray-400 font-bold">K</InputGroupText>
            </InputGroupAddon>

            <InputGroupInput v-model="amount" type="number" class="text-yellow-400 text-lg font-bold bg-transparent"
              :placeholder="chosePayment !== 'usdt' ? '10,000 - 1,000,000' : '10 - 4,000'" />

            <InputGroupAddon align="inline-end">
              <InputGroupText class="text-gray-400">MMK</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <div v-if="chosePayment === 'usdt'" class="p-2 bg-gray-700/20 rounded-lg space-y-2">
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
                {{ Number(amount) * Number(usdtRateToMMK) }} MMK
              </span>
            </p>
          </div>
          <div class="grid grid-cols-4 gap-2 mt-4" v-else>
            <button v-for="a in amounts" :key="a" @click="setAmount(a)" :class="[
              'py-2 rounded-lg text-sm font-semibold active-button',
              amount === a
                ? 'gold-bg text-gray-900 shadow-lg shadow-yellow-400/30 animate-pulse'
                : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300',
            ]">
              {{ formatPrice(a) }}
            </button>
          </div>
          <button :disabled="!amount || !chosePayment" @click="goToPayment" 
          :class="!amount || !chosePayment ? 'gold-bg' : ' gold-bg '"
      class="w-full disabled:opacity-50 font-bold text-glow active-button rounded-lg h-12 flex items-center justify-center">
        {{ t('next') }}
      </button>
      </div>
  <HelpBox container-style=""/>
      
    </div>
    <!-- <div class="w-full  fixed bottom-0 right-0 left-0 p-4 glass-bg border-t">
      <button :disabled="!amount || !chosePayment" @click="goToPayment" 
          :class="!amount || !chosePayment ? 'bg-yellow-400/50' : ' gold-bg '"
      class="w-full disabled:bg-yellow-400/80 font-bold text-glow active-button rounded-lg h-12 flex items-center justify-center">
        {{ t('next') }}
      </button>
    </div> -->
    
  </main>

</template>
