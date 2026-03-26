<script setup lang="ts">
import {  slotGameProviders } from '@/consts';

</script>
<template>
    <aside class="py-8 bg-gray-900">
        <!-- <div class="w-full text-center mt-2">
            <p class=" text-lg font-bold text-gray-400">
                Game Providers
            </p>
        </div> -->
        <div class="w-full p-2 flex justify-between gap-2 overflow-x-auto no-scrollbar scroll-smoot">

        <div v-for="provider in slotGameProviders" class="">
            <div class="bg-gray-700 p-1 rounded-lg flex items-center justify-center bg-linear-to-tl from-gray-900 to-gray-800">
                <img :src="provider.icon" class="min-w-32 w-auto max-w-42 h-20 object-fit rounded-lg"/>
            </div>
        </div>
        </div>
        
    </aside>
</template>
