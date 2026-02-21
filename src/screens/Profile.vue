<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { User2Icon } from 'lucide-vue-next';

const authStore = useAuthStore();
console.log("user", authStore.user)

</script>

<template> 
<main class="max-w-7xl bg-gray-950 p-4 flex h-full flex-col w-full gap-10 justify-between">
  <section class="flex flex-col gap-4 w-full p-4 bg-gray-900">
    <div class="rounded-full self-center bg-gray-100 w-30 h-30 p-2 overflow-hidden">
      <User2Icon class="text-gray-900 w-full h-full"/>
    </div>
    <div class="flex justify-between items-center">
      <p class="text-gray-300 font-normal text-md">Id</p>
      <p class="text-gray-50 font-bold text-md">{{ authStore.user?.uid }}</p>
    </div>
    <div class="flex justify-between items-center">
      <p class="text-gray-300 font-normal text-md">Name</p>
      <p class="text-gray-50 font-bold text-md">{{ authStore.user?.name }}</p>
    </div>
    <div class="flex justify-between items-center">
      <p class="text-gray-300 font-normal text-md">Level</p>
      <p class="text-gray-50 font-bold text-md">{{ authStore.user?.level }}</p>
    </div>
     <div class="flex justify-between items-center">
      <p class="text-gray-300 font-normal text-md">Status</p>
      <p class="text-gray-50 font-bold text-md">{{ authStore.user?.status }}</p>
    </div>
  </section>
  <button class="w-full h-12 rounded-lg text-gray-50 font-bold bg-sky-600">
    Logout
  </button>
  </main>
</template>
