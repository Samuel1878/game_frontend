<script setup lang="ts">
import router from '@/router';
import { CalendarArrowDown, CalendarArrowUp, ClipboardClock, SpadeIcon } from 'lucide-vue-next';
import { useI18n } from "vue-i18n";
import {Popover,PopoverTrigger,PopoverContent} from "./ui/popover"
import { useAuthStore } from '@/stores/auth';
const {t} = useI18n();
const authStore = useAuthStore()
</script>
<template>
  <Popover>
    <PopoverTrigger class="border-0 px-1">
      <img src="/images/profile.png" class="w-7 h-7 rounded-full overflow-hidden" />
    </PopoverTrigger>
    <PopoverContent align="end" class="glass-bg border border-gray-700 p-0 mt-2 rounded-2xl">
        <div class="flex flex-col gap-2 w-full">
            <div  class="h-35 flex items-center w-full justify-center flex-col gap-2 border-b border-b-gray-700 cursor-pointer">
                <div class="p-0.5 bg-linear-to-tr from-sky-400 via-yellow-300 to-yellow-500 rounded-full" @click="router.push('/user/profile')">
                    <img src="/images/profile.png" class="w-14 h-14 rounded-full overflow-hidden" alt="Profile Logo"/>
                </div>
                <p class="text-lg text-white font-bold ">{{ authStore.user?.name }}</p>
            </div>
            <div class="space-y-4 pl-10 py-4" >
                <div class="h-10 flex items-center gap-4" @click="router.push('/user/betlist')">
                    <SpadeIcon class="w-7 h-7 text-orange-300/50"/>
                    <p class="text-shadow-lg font-bold text-gray-200">{{ t('bet_list') }}</p>
                </div>
               <div class="h-10 flex items-center gap-2" @click="router.push('/user/transactions')">
                     <ClipboardClock class="w-7 h-7 text-orange-300/50"/>
                    <p class="text-shadow-lg font-bold text-gray-200" >{{ t('transaction') }}</p>
                </div>
               <div class="h-10 flex items-center gap-2"  @click="router.push('/user/deposit-history')">
                     <CalendarArrowUp class="w-7 h-7 text-orange-300/50"/>
                    <p class="text-shadow-lg font-bold text-gray-200">{{ t('deposit_history') }}</p>
                </div>
                <div class="h-10 flex items-center gap-2"  @click="router.push('/user/withdraw-history')">
                    <CalendarArrowDown class="w-7 h-7 text-orange-300/50"/>
                    <p class="text-shadow-lg font-bold text-gray-200">{{ t('withdraw_history') }}</p>
                </div>
            </div>
            <div class="w-full p-4 border-t border-t-gray-700">
                <button class="gold-bg w-full h-10 rounded-lg text-shadow-xs font-bold" @click="authStore.logout()">
                    {{ t('logout') }}
                </button>
            </div>
        </div>
    </PopoverContent>
  </Popover>
</template>