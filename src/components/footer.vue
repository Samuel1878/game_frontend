<script setup lang="ts">
import router from '@/router';
import { goFacebook, openDiscord, openTelegram, openViber } from '@/utils';
import { useI18n } from 'vue-i18n';

const year = new Date().getFullYear();
const { t } = useI18n();

const quickLinks = [
  { name: 'lobby', path: "/" },
  { name: 'slots', path: "/slots" },
  { name: 'buffalo', path: "/buffalo" },
  { name: 'fishing', path: "/fishing" },
  { name: 'casino', path: "/casino" },
  { name: 'arcade', path: "/arcade-games" },
];

const services = [
  { name: 'deposit', path: "/deposit" },
  { name: 'withdraw', path: "/withdrawal" },
  { name: 'download', path: "/download" },
  { name: 'promotion', path: "/promotions" },
];

const supportLinks = [
  { name: 'help_center', path: "/help" },
  { name: 'terms_and_conditions', path: "/terms" },
  { name: 'policy_and_privacy', path: "/privacy" },
  { name: 'responsible_gaming', path: "/responsible" },
  { name: 'faq', path: "/faq" },
];

const payments = [
  { name: "KBZ pay", src: "/payments/kbzpay.webp" },
  { name: "Wave Money", src: "/payments/wavepay.webp" },
  { name: "AYA pay", src: "/payments/ayabanking.webp" },
  { name: "KBZ Banking", src: "/payments/kbzbanking-new.webp" },
  { name: "USDT", src: "/payments/USDT.webp" }
];

const socials = [
  { icon: "/socials/facebook_black.svg", action: goFacebook },
  { icon: "/socials/telegram_black.svg", action: openTelegram },
  { icon: "/socials/viber_black.webp", action: openViber },
  { icon: "/socials/discord_black.webp", action: openDiscord }
];

const certification = [
  "/partners/gamcare.webp",
  "/partners/ga.svg",
  "/partners/trust.webp",
  "/partners/gambling_therapy.webp",
  "/partners/askgamblers.webp",
];
</script>

<template>
  <footer class="bg-gray-950/50 text-gray-200 pt-12 pb-20">
    <div class="max-w-7xl mx-auto px-6 w-full">
      
      <!-- Brand Section -->
      <div class="flex flex-col items-center mb-10">
        <img src="/logo.webp" fetchpriority="low" class="h-24 md:h-30 mb-4 object-contain" alt="Logo"/>
        <p class="text-gray-400 font-medium leading-relaxed text-xs text-center max-w-2xl">
          {{ t('marketing') }}
        </p>
      </div>

      <!-- Links Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 w-full gap-8 mb-12">
        <!-- Products -->
        <div class="border-t border-gray-700/50 pt-6">
          <h3 class="text-white font-bold mb-5 text-sm uppercase tracking-wide">{{ t('products') }}</h3>
          <div class="flex flex-col gap-3">
            <router-link v-for="link in quickLinks" :key="link.name" :to="link.path" class="hover:text-amber-400 text-sm text-gray-500 transition-colors">
              {{ t(link.name) }}
            </router-link>
          </div>
        </div>

        <!-- Services -->
        <div class="border-t border-gray-700/50 pt-6">
          <h3 class="text-white font-bold mb-5 text-sm uppercase tracking-wide">{{ t('services') }}</h3>
          <div class="flex flex-col gap-3">
            <router-link v-for="link in services" :key="link.name" :to="link.path" class="hover:text-amber-400 text-sm text-gray-500 transition-colors">
              {{ t(link.name) }}
            </router-link>
          </div>
        </div>

        <!-- Support -->
        <div class="border-t border-gray-700/50 pt-6">
          <h3 class="text-white font-bold mb-5 text-sm uppercase tracking-wide">{{ t('support') }}</h3>
          <div class="flex flex-col gap-3">
            <router-link v-for="link in supportLinks" :key="link.name" :to="link.path" class="hover:text-amber-400 text-sm text-gray-500 transition-colors">
              {{ t(link.name) }}
            </router-link>
          </div>
        </div>
       
        <!-- Payments -->
        <div class="border-t border-gray-700/50 pt-6">
          <h3 class="text-white font-bold mb-5 text-sm uppercase tracking-wide">{{ t('payment_method') }}</h3>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="link in payments" :key="link.name" class="flex flex-col items-center gap-1 group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded-lg flex items-center justify-center p-1 border border-transparent group-hover:border-gray-600 transition-all">
                <img :src="link.src" class="w-full h-full object-contain rounded-md"/>
              </div>
              <p class="text-[10px] text-gray-500 text-center truncate w-full">
                {{ link.name }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Socials & Security Bar -->
      <div class="border-y border-gray-800 w-full flex  md:flex-row justify-between items-center py-6 gap-6">
        <div class="flex gap-6 items-center opacity-70">
          <img src="/partners/18plus.webp" class="h-8"/>
          <img src="/partners/ssl_icon.webp" class="h-8"/>
        </div>
        <div class="flex gap-4">
          <div 
            @click="value.action" 
            v-for="(value, i) in socials" :key="i"
            class="cursor-pointer hover:scale-110 transition-transform active:scale-95"
          >
            <img :src="value.icon" class="w-7 h-7 md:w-10 md:h-10"/>
          </div>
        </div>
      </div>

      <!-- Certification & Download -->
      <div class="flex flex-col md:flex-row items-center w-full justify-center gap-8 py-10 flex-wrap">
        <div class="flex items-center gap-4 md:gap-8 justify-center flex-wrap opacity-50 hover:opacity-100 transition-opacity">
          <div v-for="value in certification" :key="value">
            <img :src="value" class="h-6 md:h-7 grayscale hover:grayscale-0 transition-all"/>
          </div>
        </div>
        <div class="cursor-pointer hover:opacity-80 transition" @click="router.push('/download')">
          <img src="/partners/download_white.webp" class="h-10"/>
        </div>
      </div>
    </div>

    <!-- Legal Bottom Bar -->
    <div class="border-t border-gray-800 pt-8 pb-12 text-center px-6">
      <p class="text-xs text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed">
        {{ t("responsible_warning") }}
      </p>
      <p class="text-sm text-gray-500 font-medium">
        © {{ year }} {{ t("brand_name") }}. {{ t("all_rights_reserved") }}
      </p>
    </div>
  </footer>
</template>
