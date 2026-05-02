<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import router from '@/router';
import { BanknoteArrowUp, SpadeIcon, User2, Wallet } from 'lucide-vue-next';

import { useI18n } from "vue-i18n";
import Popover from './ui/popover/Popover.vue';
import PopoverTrigger from './ui/popover/PopoverTrigger.vue';
import PopoverContent from './ui/popover/PopoverContent.vue';
import { useAuthStore } from '@/stores/auth';
import { depositHistoryIcon, transaction, withdrawHistoryIcon } from '@/utils';
import { toast } from 'vue-sonner';
const {t} = useI18n();
const { locale } = useI18n();
const authStore = useAuthStore()
const changeLang = (path: string|any) => {
    router.push(path)
};

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
                    <img src="/images/profile.png" class="w-14 h-14 rounded-full overflow-hidden" />
                </div>
                <p class="text-lg text-white font-bold ">{{ authStore.user?.name }}</p>
            </div>
            <div class="space-y-4 pl-10 py-4" @click="toast.info(t('this_feature_will_be_available_soon'))">
                <div class="h-10 flex items-center gap-4">
                    <SpadeIcon class="w-7 h-7 text-orange-300/50 animate-pulse"/>
                    <p class="text-shadow-lg font-bold text-gray-200">{{ t('bet_history') }}</p>
                </div>
               <div class="h-10 flex items-center gap-2" @click="router.push('/user/transactions')">
                    <img :src="transaction" class="w-7 h-7"/>
                    <p class="text-shadow-lg font-bold text-gray-200" >{{ t('transaction') }}</p>
                </div>
               <div class="h-10 flex items-center gap-2"  @click="router.push('/user/deposit-history')">
                    <img :src="depositHistoryIcon" class="w-7 h-7"/>
                    <p class="text-shadow-lg font-bold text-gray-200">{{ t('deposit_history') }}</p>
                </div>
                <div class="h-10 flex items-center gap-2"  @click="router.push('/user/withdraw-history')">
                    <img :src="withdrawHistoryIcon" class="w-7 h-7"/>
                    <p class="text-shadow-lg font-bold text-gray-200">{{ t('withdraw_history') }}</p>
                </div>
            </div>
            <div class="w-full p-4 border-t border-t-gray-700">
                <button class="gold-bg w-full h-10 rounded-lg text-shadow-xs font-bold" @click="authStore.logout()">
                    {{ t('logout') }}
                </button>
            </div>
        </div>
      <!-- <SelectItem value="/user/profile" class="text-gray-100 font-bold py-2 text-md border-b border-b-gray-700">
        <span class="mr-2"><User2 class="w-8 h-8" /></span> {{ t('profile') }}
      </SelectItem>
      <SelectItem value="/deposit" class="text-gray-100 py-2 font-bold text-md border-b border-b-gray-700">
        <span class="mr-2"><Wallet class="w-8 h-8" /></span>{{ t("deposit") }}
      </SelectItem>
      <SelectItem value="/withdraw" class="text-gray-100 py-2 font-bold text-md">
        <span class="mr-2"><BanknoteArrowUp class="w-8 h-8" /></span> {{ t("withdraw") }}
      </SelectItem> -->
    </PopoverContent>
  </Popover>
</template>