<script setup lang="ts">
import {  slotGameProviders } from '@/consts';


</script>
<template>
    <aside class="py-8 ">
        <!-- <div class="w-full text-center mt-2">
            <p class=" text-lg font-bold text-gray-400">
                Game Providers
            </p>
        </div> -->
        <div class="w-full p-2 relative flex justify-between gap-2 overflow-x-auto no-scrollbar scroll-smoot">

        <div v-for="provider in slotGameProviders" class="relative">
            <div class=" p-1 rounded-lg flex items-center justify-center bg-gray-900 
        bg-linear-to-br from-white/10 via-white/30 to-white/10
        backdrop-blur-2xl border-2 border-white/10
        shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                <img :src="provider.icon" class="min-w-32 w-auto max-w-42 h-20 object-fit rounded-lg"/>
            </div>
        </div>
        </div>
        
    </aside>
</template>
