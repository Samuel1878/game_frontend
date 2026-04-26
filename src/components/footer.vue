<script setup lang="ts">
import router from '@/router';
import { _18_plus, askgamblers, ayaPayLogo, discord_black, download_white, facebook_black, ga, gambling_therapy, gamcare, kbzBanking, kbzLogo, openDiscord, openTelegram, openViber, ssl_icon, telegram_black, trust, usdtLogo, viber_black, wavePayLogo } from '@/utils';
import { useI18n } from 'vue-i18n';

const year = new Date().getFullYear()
const {t} = useI18n();
const quickLinks = [
  { name: 'lobby', path: "/" },
  { name: 'slots', path: "/slots" },
  { name: 'buffalo', path: "/buffalo" },
    { name: 'fishing', path: "/fishing" },
      { name: 'casino', path: "/casino" },
        { name: 'arcade', path: "/arcade-games" },
  
]

const services = [
  { name: 'deposit', path: "/deposit" },
  { name: 'withdraw', path: "/withdrawal" },
  { name: 'download', path: "/download" },
    { name: 'promotion', path: "/promotions" },
]
const supportLinks = [
  { name: 'help_center', path: "/help" },
  { name: 'terms_and_conditions', path: "/about/terms" },
  { name: 'policy_and_privacy', path: "/about/privacy" },
  { name: 'responsibility', path: "/about/responsible" },
  {name:'faqs', path:"/info/faq"},
  {
    name:'limits_and_regulations',
    path:"/info/limits_and_regulations"
  }
];
// const eventLinks = [
//   {
//     name:'events_and_community',path:"/info/community"
//   },
//   {
//     name:'bonus',
//     path:"/info/bonus"
//   }
// ];
const payments = [
  {
    name:"KBZ pay",
    src:kbzLogo
  },
  {
    name:"Wave Money",
    src:wavePayLogo,
  },
  {
    name:"AYA pay",
    src:ayaPayLogo
  },
  {
    name:"KBZ Banking",
    src:kbzBanking
  },
  {
    name:"USDT",
    src:usdtLogo
  }
];
const socials = [
  {
    icon : facebook_black,
    action:()=>{}
  },
  {
    icon: telegram_black,
    action:openTelegram
  },
  {
    icon:viber_black,
    action:openViber
  },
  {
    icon:discord_black,
    action:openDiscord
  }
];
const certification = [
  gamcare,
  ga,
  trust,
  gambling_therapy,
  askgamblers,

]
</script>

<template>
  <footer class="bg-gray-900 text-gray-200 py-10">
    <div class="max-w-7xl flex flex-col items-center px-6 w-full">
      <!-- Brand -->
      <!-- <div class="gap-8 flex flex-col items-center w-full">
        <h2 class="text-lg font-extrabold text-white text-center">{{ t('footer_header') }}</h2>
        <div class="flex gap-1 flex-wrap items-center justify-center">
         <img v-for="value in footer_images" :src="value" class="h-10 md:h-15 lg:-18 my-2"/>
        </div>
      </div> -->
      <!-- Quick Links -->
      <div class="grid grid-cols-1 my-12 md:grid-cols-2 lg:grid-cols-4 w-full gap-8">
        <div class="border-t border-gray-400/20 py-2 pt-6">
          <h3 class="text-white font-semibold mb-4">{{ t('products') }}</h3>
          <div class="space-y-4">
            <div v-for="link in quickLinks" :key="link.name">
              <router-link
                :to="link.path"
              
              >
              <p class="hover:text-sky-400 text-md text-gray-500">
                      {{ t(link.name) }}
              </p>
               
              </router-link>
            </div>
          </div>
        </div>
         <div class="border-t border-gray-400/20 py-2 pt-6">
          <h3 class="text-white font-semibold mb-4">{{ t('services') }}</h3>
          <div class="space-y-4">
            <div v-for="link in services" :key="link.name">
              <router-link
                :to="link.path"
              
              >
              <p class="hover:text-sky-400 text-md text-gray-500">
                      {{ t(link.name) }}
              </p>
               
              </router-link>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-400/20 py-2">
          <h3 class="text-white font-semibold mb-4">{{ t('support') }}</h3>
          <div class="space-y-4">
            <div v-for="link in supportLinks" :key="link.name">
              <router-link
                :to="link.path"
              
              >
              <p class="hover:text-sky-400 text-md text-gray-500">
                      {{ t(link.name) }}
              </p>
               
              </router-link>
            </div>
          </div>
        </div>
       
        <div class="border-t border-gray-400/20 py-2">
          <h3 class="text-white font-semibold mb-4">{{ t('payment_method') }}</h3>
          <div class="flex gap-4 flex-wrap ">
            <div v-for="link in payments" :key="link.name" class="flex gap-2 flex-col items-center justify-between">
              
              <img :src="link.src" class="cover w-12 h-12 rounded-lg bg-none"/>
              <p class="text-white font-bold text-sm">
                {{ link.name}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="border-gray-700 w-full max-w-6xl border-y flex justify-between items-center py-7">
        <div class="flex gap-4">
          <img :src="_18_plus" class=""/>
          <img :src="ssl_icon" class=""/>
        </div>
        <div class="flex gap-2">
          <div @click="value.action" class="" v-for="value in socials">
          <img :src="value.icon"/>
          </div>
        </div>
      
      </div>
      <div class="flex items-center w-full justify-center gap-8 my-8 flex-wrap">
        <div class="flex items-center gap-2 justify-center">
          <div class="" v-for="value in certification">
            <img :src="value" class="h-7"/>
          </div>
        </div>
        <div class="" @click="router.push('/download')">
          <img :src="download_white" class="h-9"/>
        </div>
      </div>
    </div>
    <!-- Bottom Bar -->
    <div class="border-t border-slate-800 py-4 text-center text-sm text-gray-500">
      <p> © {{ year }} 999 Casino. All rights reserved.</p>
      <p class="text-white font-mono text-xs my-2">Gambling can be addictive. Play responsibly.</p>
     
    </div>

  </footer>
</template>