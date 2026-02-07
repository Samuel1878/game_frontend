<script setup lang="ts">
import { paymentMethod } from "@/consts";
</script>
<template>
  <main class="text-gray-100 bg-gray-900 p-2">
    <div class="flex flex-col gap-4 w-full">
      <RouterLink
        v-for="payment in paymentMethod"
        :key="payment.id"
        :to="`/withdraw/${payment.value}`"
        class="bg-gray-800 p-2 flex justify-between gap-4 rounded-2xl items-center"
      >
        <img :src="payment.icon" alt="logo" class="w-14 h-14 rounded-2xl" />

        <p class="text-gray-100 font-bold text-md">
          {{ payment.label }}
        </p>
      </RouterLink>
    </div>
  </main>
</template>
