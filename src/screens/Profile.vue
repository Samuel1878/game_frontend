<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth'
import { profile } from '@/utils';
import { LogOutIcon, HistoryIcon, ChevronRightIcon, Phone, PiggyBankIcon, LockIcon, HeadsetIcon, MailIcon, LetterTextIcon, CircleQuestionMark, CopyIcon, Share2Icon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const authStore = useAuthStore();

</script>

<template>
  <main class="min-h-screen bg-linear-to-b w-full from-gray-900 to-gray-800 px-4 py-4">
    <div class="max-w-md mx-auto space-y-4">
      <section
        class="relative bg-linear-to-br from-gray-800 to-gray-900 backdrop-blur-xl border border-gray-700 rounded-lg p-8 shadow-2xl shadow-gray-900">
        <div class="flex items-center gap-4">

          <div class="relative w-20 h-15 rounded-full p-1 bg-linear-to-tr from-gray-600 to-amber-400">
            <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <img :src="profile" class="rounded-full cover" />
            </div>
          </div>
          <div class="flex flex-col gap-4 w-full">
            <h2 class="text-2xl font-bold text-gray-100">{{ authStore.user?.name }}</h2>
            <p class="text-gray-500 font-medium text-sm">ID: {{ authStore.user?.id }}</p>
          </div>
          <div>
            <div class="h-2 w-2 rounded-full" :class="authStore.user?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'" />
          </div>
        </div>
        <!-- Divider -->
        <div class="my-8 border-t border-gray-800"></div>
        <div class="space-y-5 text-sm flex justify-around items-center w-full">
          <div class="gap-2 flex flex-col items-center">
            <div>
              <p class="text-gray-100 text-lg font-bold"> Level {{ authStore.user?.level }}</p>
            </div>

            <p class="text-gray-500 font-medium text-sm">Account Level</p>
          </div>
          <div class="gap-2 flex flex-col items-center">
            <div>
              <p class="text-gray-100 text-lg font-bold"> Level {{ authStore.user?.level }}</p>
            </div>

            <p class="text-gray-500 font-medium text-sm">Account Level</p>
          </div>
        </div>
      </section>
      <div @click="router.push(`/transactions`)" class="cursor-pointer rounded-lg bg-linear-to-br flex justify-between from-gray-800 to-gray-900 border border-gray-700 shadow-inner hover:shadow-lg transition p-4 backdrop-blur-2xl">
        <div class="flex gap-3 items-center">
              <HistoryIcon />
              <p class="text-gray-100"> {{ t('transactions') }}</p>

            </div>
            <ChevronRightIcon class="w-5 h-5 text-gray-500" />
      </div>
      <div>
        <p></p>
        <div
          class="rounded-lg bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-inner hover:shadow-lg transition pl-4 py-2 backdrop-blur-2xl">
          <div @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700">
            <div class="flex gap-3 items-center">
              <PiggyBankIcon />
              <p class="text-gray-100"> {{ t('bank_accounts') }}</p>
            </div>
            <ChevronRightIcon class="w-5 h-5 text-gray-500" />
          </div>
          <div @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700">
            <div class="flex gap-3 items-center">
              <Phone />
              <p>{{ authStore.user?.phone ? authStore.user?.phone : t('phone_number') }}</p>

            </div>
            <div class="flex gap-2 items-center">
              <p class="text-gray-100"> {{authStore.user?.phone?t('change_number') : t('bind') }}</p>
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
            <div @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700">
            <div class="flex gap-3 items-center">
              <MailIcon />
              <p>{{ authStore.user?.email ? authStore.user?.email : t('email') }}</p>

            </div>
            <div class="flex gap-2 items-center">
              <p class="text-gray-100"> {{authStore.user?.email?t('change') : t('bind') }}</p>
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700">
            <div class="flex gap-3 items-center">
              <LockIcon />
              <p>{{ t('password')}}</p>

            </div>
            <div class="flex gap-2 items-center">
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4">
            <div class="flex gap-3 items-center">
              <LetterTextIcon />
              <p>{{ t('limits_and_regulations')}}</p>
            </div>
            <div class="flex gap-2 items-center">
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
           
  
        </div>
      </div>
      <div>
      
         <div
          class="rounded-lg bg-linear-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-inner hover:shadow-lg transition pl-4 py-2 backdrop-blur-2xl">
       <div @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700">
            <div class="flex gap-3 items-center">
              <Share2Icon />
              <p>{{ t('Referral Code')}}</p>
            </div>
            <div class="flex gap-2 items-center">
              <CopyIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
       
          <div @click="router.push(`/transactions`)"
            class="w-full flex items-center justify-between py-4 pr-4 border-b border-gray-700">
            <div class="flex gap-3 items-center">
              <HeadsetIcon />
              <p>{{ t('help_center')}}</p>
            </div>
            <div class="flex gap-2 items-center">
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
                  <div @click="router.push(`/faq`)"
            class="w-full flex items-center justify-between py-4 pr-4">
            <div class="flex gap-3 items-center">
              <CircleQuestionMark />
              <p>{{ t('faq')}}</p>
            </div>
            <div class="flex gap-2 items-center">
              <ChevronRightIcon class="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      <!-- Logout Button -->
      <button @click="authStore.logout"
        class="rounded-lg bg-linear-to-br mb-10 from-gray-800 to-gray-900 border border-gray-700 shadow-inner hover:shadow-lg transition p-4 mt-2 backdrop-blur-2xl w-full flex items-center justify-center gap-2">
        <LogOutIcon class="w-5 h-5" />
        Logout
      </button>

    </div>
  </main>
</template>