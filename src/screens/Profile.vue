<script setup lang="ts">
import SideBar from '@/components/layout/sideBar.vue';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
console.log("user", authStore.user)

</script>

<template> 
<main>


  <SidebarProvider class="flex">
    <SideBar class="bg-gray-100 flex"/>
    <section class="bg-gray-900 flex w-full p-4">
      <div class="flex gap-4 items-center">
        <p>Total Balance</p>
        <p>{{ authStore?.user?.balance }}</p>
      </div>
    </section>
  </SidebarProvider>
  </main>
</template>
