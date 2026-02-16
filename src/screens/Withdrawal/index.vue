<script setup lang="ts">
import { amounts, paymentMethod } from "@/consts";
import { ref } from "vue";
const amount = ref<number>();
const setAmount = (a:number)=>{
  amount.value = a
}
</script>
<template>
   <main class="text-gray-100 bg-gray-950 p-2 w-full">
 <h1 class="text-md text-gray-50 my-3 font-bold">
      Set withrawal amount
    </h1>
    <div class="text-gray-50 w-full grid grid-cols-4 grid-rows-2 my-3 mt-6 gap-2">
      <button @click="setAmount(a)" v-for="a in amounts" class="p-2 px-4 rounded-lg bg-gray-900 font-bold text-lg">
        {{ 
          a }}
      </button>
    </div>
    <Input class="my-2 rounded-lg font-bold" v-model="amount" type="number" placeholder="Enter Amount"/>
     <h1 class="text-md text-gray-50 my-3 font-bold">
      Choose payment method
    </h1>
    <div class="flex flex-col gap-4 w-full flex-wrap justify-center">
         
      <RouterLink
        v-show="amount && amount>1000"
        v-for="payment in paymentMethod"
        :key="payment.id"
        :to="`/withdraw/${payment.value}?amount=${amount}`"
        class="bg-gray-900 p-2 px-4 flex justify-between gap-4 rounded-2xl items-center"
      >
        <img :src="payment.icon" alt="logo" class="w-15 h-15 object-cover rounded-3xl overflow-hidden" />

        <p class="text-gray-100 font-bold text-md">
          {{ payment.label }}
        </p>
      </RouterLink>
    </div>
    
  </main>
</template>
