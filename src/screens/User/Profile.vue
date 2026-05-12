<script setup lang="ts">
import { MembershipCenter, UserAction } from "@/consts";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { Phone, ChevronRight, Crown, CalendarDays } from "lucide-vue-next";
import moment from "moment";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const authStore = useAuthStore();
const uiStore = useUIStore();
</script>

<template>
  <main class="min-h-screen bg-gray-900 w-full px-4 py-4">
    <div class="max-w-md mx-auto space-y-4">
<section
    class="relative overflow-hidden rounded-3xl bg-[#0a0f1a] bg-linear-to-br from-gray-900/5 via-yellow-400/1 to-amber-500/10 border border-white/10 shadow-2xl group transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,179,8,0.15)]"
  >
    <!-- 🎲 Ambient Premium Glows -->
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50"></div>
    <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50"></div>

    <!-- ✨ Animated Shine Sweep -->
    <div class="absolute inset-0 z-0 pointer-events-none shine-sweep"></div>

    <div class="relative z-10 p-6 md:p-8">
      
      <!-- HEADER: Avatar & Info -->
      <div class="flex items-center justify-between">
        
        <div class="flex items-center gap-5">
          <!-- Premium Avatar -->
          <div class="relative">
            <!-- Outer spinning glow -->
            <div class="absolute inset-0 rounded-full bg-linear-to-tr from-yellow-600 via-yellow-300 to-yellow-600 blur-md opacity-40 animate-pulse"></div>
            
            <!-- Metallic Ring -->
            <div class="relative w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 bg-linear-to-b from-yellow-300 via-yellow-600 to-yellow-900 shadow-inner">
              <div class="w-full h-full rounded-full bg-gray-950 overflow-hidden border-[3px] border-[#0a0f1a]">
                <img
                  src="/images/profile.png"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Profile"
                />
              </div>
            </div>
            
            <!-- Active Status Badge (Overlapping Avatar) -->
            <div v-if="authStore.user" 
                 class="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0f1a] z-20 flex items-center justify-center"
                 :class="authStore.user?.status === 'Active' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-red-500'">
            </div>
          </div>

          <!-- User Details (Logged In) -->
          <div v-if="authStore.user && authStore.accessToken" class="flex flex-col justify-center">
            <h2 class="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-400 tracking-tight">
              {{ authStore.user?.name }}
            </h2>

            <div class="flex items-center gap-2 mt-1">
              <div class="bg-white/5 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-gray-400 border border-white/5 flex items-center gap-1.5 font-mono">
                <Phone class="w-3 h-3 text-yellow-500" />
                <span v-if="!authStore.user?.phone">***********</span>
                <span v-else>********{{ authStore.user?.phone.slice(-3) }}</span>
              </div>
              
              <!-- Subtle Status Text -->
              <span class="text-[10px] uppercase tracking-wider font-bold"
                    :class="authStore.user?.status === 'Active' ? 'text-green-400' : 'text-red-400'">
                {{ authStore.user?.status }}
              </span>
            </div>
          </div>

          <!-- Login CTA (Logged Out) -->
          <div v-else
            class="flex items-center gap-3 cursor-pointer group/btn"
            @click="uiStore.openAuthModal()"
          >
            <div>
              <h2 class="text-xl capitalize md:text-2xl font-black text-white tracking-tight group-hover/btn:text-yellow-400 transition-colors">
                {{ t("welcome") }}
              </h2>
              <p class="text-sm text-yellow-500/80 font-medium mt-0.5 flex items-center gap-1">
                {{ t("login_to_your_account") }} 
              </p>
            </div>
            <div class="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover/btn:bg-yellow-500 group-hover/btn:text-black transition-all duration-300">
               <ChevronRight class="w-5 h-5" />
            </div>
          </div>

        </div>
      </div>

      <!-- Divider -->
      <div class="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent my-6"></div>

      <!-- STATS GRID (Glass Cards) -->
      <div class="grid grid-cols-2 gap-3 md:gap-4 relative z-10">
        
        <!-- VIP Card -->
        <div class="bg-linear-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 group-hover:-translate-y-1 transition-all duration-300 hover:border-yellow-500/30">
          <div class="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
            <Crown class="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p class="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">{{ t("level") }}</p>
            <p class="text-lg md:text-xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              VIP {{ authStore.user?.level || 0 }}
            </p>
          </div>
        </div>

        <!-- Joined Card -->
        <div class="bg-linear-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 group-hover:-translate-y-1 transition-all duration-300 hover:border-sky-500/30 delay-75">
          <div class="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
            <CalendarDays class="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p class="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">{{ t("joined") }}</p>
            <p class="text-lg md:text-xl font-black text-white">
              {{ authStore.user?.created_at ? moment(authStore.user?.created_at).format("MMM YYYY") : '—' }}
            </p>
          </div>
        </div>

      </div>

    </div>
  </section>
      <section class="w-full flex justify-between gap-2 items-center">
        <div
          @click="router.push(value.path)"
          v-for="value in UserAction"
          class="cursor-pointer h-12 w-full flex justify-center items-center gap-2 rounded-full bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >
          <div class="h-6 w-6 flex justify-center items-center">
            <img :src="value.image" class="w-8 h-8" />
          </div>
          <p class="text-gray-300 text-sm">{{ t(value.label) }}</p>
        </div>
      </section>
      <section class="w-full">
        <div class="flex w-full items-center justify-between gap-2">
          <p class="p-2 rounded-full text-nowrap bg-yellow-400/40 text-xs text-glow">
            {{ t("membership_center") }}
          </p>
          <div class="h-0.5 w-full bg-amber-500/30" />
        </div>
        <div class="grid grid-cols-4 p-2 my-4 mb-20 gap-4">
          <div
            v-for="value in MembershipCenter"
            class="cursor-pointer my-2 flex flex-col items-center gap-2"
            @click="value.action"
          >
            <div
              class="h-14 w-14 flex flex-col rounded-full justify-center items-center bg-yellow-400/10 bg-linear-to-br from-yellow/5 via-yellow/10 to-yellow/5 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
            >
              <img v-if="value.image" :src="value.image" class="w-10 h-10" />
              <component
                v-else
                :is="value?.icon"
                class="w-8 h-8 text-[#c59c07b4]"
              />
            </div>
            <p class="text-gray-300 text-xs text-wrap text-center">
              {{ t(value.label) }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
<style scoped>
/* High-End Casino Shine Animation */
.shine-sweep {
  background: linear-gradient(
    140deg,
    transparent 0%,
    transparent 40%,
    rgba(231, 231, 226, 0.05) 45%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(221, 220, 215, 0.05) 55%,
    transparent 60%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shine 6s  infinite ease-in-out;
}

@keyframes shine {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>