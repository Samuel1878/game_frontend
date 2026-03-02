<script setup lang="ts">
import { amounts, paymentMethod } from "@/consts";
import { ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,

} from '@/components/ui/input-group'
import { HistoryIcon } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
const amount = ref<number>();
  const authStore = useAuthStore()
const setAmount = (a: number) => {
  amount.value = a;
};
</script>
<template>
  <main class="text-gray-100 bg-gray-950 p-2 w-full">
  
    <section class="p-2 rounded-lg bg-gray-900">
     
        <div class="flex justify-between items-center my-3">
           <h1 class="text-md text-gray-50 font-bold">Set deposit amount*</h1>
      <button class="p-2" @click="router.push(`/profile/${authStore.user?.id}/transactions`)">
        <HistoryIcon/>
      </button>
    </div>
    
        <InputGroup  class="h-12 rounded-lg font-bold border-0 ring-sky-500 ring-1 bg-gray-800">
    
      <InputGroupAddon>
        <InputGroupText class="font-bold text-gray-200">K</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput v-model="amount"   type="number" placeholder="0.00" />
      <InputGroupAddon align="inline-end">
        <InputGroupText class="text-gray-100">MMK</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
     <!-- <Input
     
      placeholder="Enter Amount"
    /> -->
    <div
      class="text-gray-50 w-full grid grid-cols-4 grid-rows-2 my-3 gap-2"
    >
      <button
        @click="setAmount(a)"
        v-for="a in amounts"
        class="p-2 px-4 rounded-lg bg-gray-800 font-bold text-lg"
      >
        {{ a }}
      </button>
    </div>
   
    </section>

    <section 
      v-show="amount && amount > 1000"
      >
         <h1 class="text-md text-gray-50 my-3 font-bold text-center">Choose payment method</h1>
          <div class="flex items-center gap-2 w-full flex-wrap justify-center">
      
      <RouterLink
          :disabled="amount && amount>1000"
        v-for="payment in paymentMethod"
        :key="payment.id"
        :to="`/deposit/${payment.value}?amount=${amount}`"
        class="p-2 px-4 flex flex-col bg-gray-900 border border-sky-500 justify-between gap-4 rounded-xl items-center"
      >
        <img
          :src="payment.icon"
          alt="logo"
          class="w-15 h-15 p-2 bg-gray-800 object-cover rounded-2xl overflow-hidden"
        />

        <p class="text-gray-100 font-bold text-md">
          {{ payment.label }}
        </p>
      </RouterLink>
    </div>
    </section>
   
    <div class="rounded-md border border-gray-800 mt-6 p-3 text-sm">
      <p class="mb-2 text-lg font-bold">Deposit guide !</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut impedit ex
        ad!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut impedit ex
        ad!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut impedit ex
        ad!
      </p>
    </div>
  </main>
</template>
