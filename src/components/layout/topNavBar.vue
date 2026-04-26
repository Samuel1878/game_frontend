<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { useWallet } from '@/stores/wallet';
import { formatPrice } from '@/utils';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import LanguageBtn from '../languageBtn.vue';
import { Wallet } from 'lucide-vue-next';
const route = useRoute();
const wallet = useWallet();
const uiStore = useUIStore();
const authStore = useAuthStore();

const { t } = useI18n();
const goToLoginHandler = () => {
  uiStore.openAuthModal();
};
</script>
<template>
     <nav
        v-if="!route.meta.hideTopNav"
      class="sticky top-0 right-0 left-0 z-30 w-full border-b-2 bg-gray-900 
        bg-linear-to-br from-white/5 via-white/10 to-white/5
        backdrop-blur-2xl border-white/5
        shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between p-4 h-14">
        <RouterLink
          to="/"
          class="flex items-center"
        >
          <p class="text-sky-400 font-extrabold text-4xl font-sans">T9BET</p>
      
        </RouterLink>
        <div class="hidden items-center gap-6 lg:flex">
          <RouterLink class="nav-link" to="/">Home</RouterLink>
          <RouterLink class="nav-link" to="/games">Games</RouterLink>
          <RouterLink class="nav-link" to="/deposit">Deposit</RouterLink>
          <RouterLink class="nav-link" to="/withdraw">Withdraw</RouterLink>
        </div>
        <div class="flex items-center gap-2 justify-end">
          <div
        
            v-show="authStore.user"
            class="flex items-center gap-2 px-2 h-10 bg-gray-800/40 rounded-md border border-white/20 shadow-inner hover:shadow-lg transition-shadow duration-300"
          ><Wallet class="w-6 h-6 text-sky-400" />
            <!-- <img :src="wallet_icon" class="w-8 h-8"/> -->
            <p class="font-bold text-md text-yellow-500">
              {{ formatPrice(wallet.balance || 0) || "0.00" }}
            </p>
          </div>

          <button
            @click="goToLoginHandler"
            v-if="!authStore.user"
            class="rounded-sm px-4 py-2 font-medium bg-sky-600 text-gray-50"
          >
            {{ t("login") }}
          </button>
          <LanguageBtn />
        </div>
      </div>
    </nav>
</template>