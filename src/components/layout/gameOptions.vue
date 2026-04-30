<script setup lang="ts">
import { gameOptions } from '@/consts';
import router from '@/router';
import { useI18n } from 'vue-i18n';
const {t} = useI18n();
const props = defineProps<{current_page:string}>();
const gotoPath = (path:string) => {
    console.log(path)
    router.push(path)
}
</script>
<template>
        <aside class="mx-2 overflow-hidden rounded-full bg-gray-900/10 
        bg-linear-to-br from-white/5 via-white/5 to-white/5
        backdrop-blur-2xl border border-white/10
        shadow-[0_10px_40px_rgba(0,0,0,0.1)] ">

        <div class="p-1.5 relative flex justify-between overflow-x-auto no-scrollbar scroll-smooth">
            <div v-for="option in gameOptions" class="cursor-pointer relative px-6 gap-2 rounded-full flex items-center justify-center flex-nowrap" 
            :class="props.current_page===option.label?'bg-gray-500/20':'bg-none'"
             @click="gotoPath(option.path)" :key="option.id">
                    <img :src="option.image" class="w-10 h-10"/>
                    <p class="text-sm text-white text-nowrap">{{t(option.label) }}</p>
           
            </div>
        </div>
        
    </aside>
   
</template>