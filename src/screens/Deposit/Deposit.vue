<script setup lang="ts">
import { amounts, paymentMethod } from "@/consts";
import { ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Headset, HistoryIcon } from "lucide-vue-next";
import router from "@/router";
import { discord, formatPrice, telegram, viber } from "@/utils";
import { useI18n } from "vue-i18n";
const amount = ref<number>();
const { t } = useI18n()
const setAmount = (a: number) => {
  amount.value = a;
};
</script>
<template>
  <main class="text-gray-100 bg-gray-950 flex flex-col justify-between p-2 w-full">
    <div>
    <section class="p-2 rounded-lg bg-linear-to-br shadow-inner shadow-gray-800 from-gray-800 to-gray-900">

      <div class="flex justify-between items-center my-3">
        <h1 class="text-md text-gray-50 font-bold">{{ t('set_deposit_amount') }}</h1>
        <button class="p-2" @click="router.push(`/transactions`)">
          <HistoryIcon />
        </button>
      </div>

      <InputGroup class="h-12 rounded-lg font-bold border-0 ring-gray-700 ring bg-gray-950">

        <InputGroupAddon>
          <InputGroupText class="font-bold text-gray-200">K</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput v-model="amount" type="number" class="text-sky-400" placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText class="text-gray-100">MMK</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <div class="text-sky-400 w-full grid grid-cols-4 grid-rows-2 my-3 gap-2">
        <button @click="setAmount(a)" v-for="a in amounts" class="border border-gray-700 p-2 rounded-lg bg-gray-900 font-bold text-md">
          {{ formatPrice(a) }}
        </button>
      </div>

    </section>

    <section v-show="amount && amount > 1000">
      <h1 class="text-md text-gray-50 my-3 font-bold text-center">{{ t('choose_payment_method') }}</h1>
      <div class="grid grid-cols-2 gap-4">

        <RouterLink :disabled="amount && amount > 1000" v-for="payment in paymentMethod" :key="payment.id"
          :to="`/deposit/${payment.value}?amount=${amount}`"
          class="p-2 px-4 flex flex-col bg-gray-900 shadow-inner cursor-pointer shadow-gray-700 justify-between gap-4 rounded-xl items-center">
          <img :src="payment.icon" alt="logo"
            class="w-15 h-15 p-2 bg-gray-800 object-cover rounded-2xl overflow-hidden" />

          <p class="text-gray-100 font-bold text-md">
            {{ payment.label }}
          </p>
        </RouterLink>
      </div>
    </section>
    </div>
    

    <div class="rounded-md border-gray-800 bg-gray-900 mt-6 p-3 text-sm">
      <p class="mb-4 text-center text-lg font-bold">{{ t('need_help') }}</p>
      <div class="flex items-center justify-center gap-4">
        <div class="text-black bg-amber-400 h-9 rounded-full w-9 flex justify-center items-center">
          <Headset/>
        </div>
        <div>
          <img :src="viber"/>
        </div>
         <div>
          <img :src="telegram"/>
        </div>
         <div>
          <img :src="discord"/>
        </div>
      </div>
    </div>
  </main>
</template>
