<script setup lang="ts">
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import {
    LogOut,
    PlusCircle,
    ArrowDownToLine,
    LogIn,
    UserPlus,
    Coins,

    HeadsetIcon,
    Download,
    Gift,
    CircleAlertIcon,
} from "lucide-vue-next";
import { useWallet } from "@/stores/wallet";
import { useI18n } from "vue-i18n";
import { gameOptions } from "@/consts";
import { formatPrice, openChat, openDiscord, openTelegram, openViber, versionNo } from "@/utils";
import LanguageLongBtn from "./languageLongBtn.vue";
import { watch } from "vue";
import { useUIStore } from "@/stores/ui";

const authStore = useAuthStore();
const router = useRouter();
const wallet = useWallet();
const ui = useUIStore();
const handleLogout = () => {
    router.push("/");
};

const route = useRoute();
const { setOpenMobile } = useSidebar();
const handleLogin = (v:boolean) => {
    setOpenMobile(false);
    ui.openAuthModal('/', v)
}
watch(
    () => route.path,
    () => {
        setOpenMobile(false);
    },
);
const { t } = useI18n();
</script>

<template>
    <Sidebar collapsible="offcanvas" class="border-r border-white/5 bg-[#0a0f1a]">
        <SidebarHeader class="p-4 border-b border-white/10 flex flex-col gap-3 bg-gray-800">
            <!-- Logo -->
            <div class="font-black text-yellow-400 flex gap-2 items-center justify-between tracking-widest text-center">
                <img src="/logo.png" class="w-19" />
                <div v-if="authStore.user" @click="router.push('/user/profile')">
                    <img src="/images/profile.png" class="w-7 h-7 rounded-full overflow-hidden" />
                </div>
                <!-- <p class="text-2xl ">TZ99</p> -->
            </div>

            <!-- Logged In State -->
            <div v-if="authStore.user" class="flex flex-col gap-3">
                <!-- Balance Display -->
                <div class="bg-white/5 rounded-xl p-3 flex flex-col items-center border border-white/5 shadow-inner">
                    <span class="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Balance</span>
                    <div class="flex items-center gap-1.5 text-yellow-400 font-black text-lg">
                        <Coins class="w-5 h-5" />
                        <span>{{ formatPrice(wallet?.balance || 0) }}<span class="text-white"> Ks</span></span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                    <button @click="router.push('/deposit')"
                        class="flex-1 bg-linear-to-r gold-bg hover:from-yellow-400 hover:to-yellow-500 text-black text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <PlusCircle class="w-3.5 h-3.5" /> {{ t('deposit') }}
                    </button>
                    <button @click="router.push('/withdraw')"
                        class="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all">
                        <ArrowDownToLine class="w-3.5 h-3.5" /> {{ t("withdraw") }}
                    </button>
                </div>
            </div>
            <div v-else class="flex flex-col gap-2 mt-2">
                <button
                    @click="handleLogin(false)"
                    class="w-full bg-linear-to-r gold-bg hover:from-yellow-400 hover:to-yellow-500 text-black text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all">
                     <UserPlus class="w-4 h-4" /> {{ t("register") }}
                </button>
                <button
                    @click="handleLogin(true)"
                    class="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all">
                    <LogIn class="w-4 h-4" />{{ t("login") }}
                </button>
            </div>
        </SidebarHeader>
        <SidebarContent class="p-2 flex flex-col justify-between bg-gray-800">
            <div>
                <SidebarGroup class="bg-gray-700/20 rounded-lg">
                    <SidebarGroupLabel class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-2">
                        {{ t("games") }}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu class="space-y-4">
                            <SidebarMenuItem class="" v-for="game in gameOptions" :key="game.id">
                                <SidebarMenuButton as-child>
                                    <router-link :to="game.path"
                                        class="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">
                                        <img :src="game.image" class="w-8 h-8" />
                                        <span class="font-medium text-md">{{ t(game.label) }}</span>
                                    </router-link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </div>
            <div>
                <SidebarGroup class="bg-gray-700/20 rounded-lg">
                    <SidebarGroupLabel class="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-2">
                        {{ t("services") }}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu class="space-y-4">
                            <SidebarMenuItem class="">
                                <SidebarMenuButton as-child>
                                    <router-link to="/download"
                                        class="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">
                                        <Download class="w-8 h-8" />
                                        <span class="font-medium text-md">{{ t('download') }}</span>
                                    </router-link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem class="">
                                <SidebarMenuButton as-child>
                                    <router-link to="/promotions"
                                        class="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">
                                        <Gift class="w-8 h-8" />
                                        <span class="font-medium text-md">{{ t('promotions') }}</span>
                                    </router-link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem class="">
                                <SidebarMenuButton as-child>
                                    <router-link to="/faq"
                                        class="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors">
                                        <CircleAlertIcon class="w-8 h-8" />
                                        <span class="font-medium text-md">{{ t('faq') }}</span>
                                    </router-link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </div>
            <div>
                <SidebarGroup class="bg-gray-700/20 rounded-lg"">
                    <SidebarGroupLabel
                        class=" text-xs text-gray-500 flex justify-center items-center font-semibold text-center uppercase
                                tracking-wider mb-2 p-2">
                    {{ t('need_help') }}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem class="flex gap-2 justify-around items-center pb-2">
                                <div @click="openChat" class="cursor-pointer">
                                    <HeadsetIcon class="w-8 h-8 text-yellow-500" />
                                </div>
                                <div @click="openTelegram" class="cursor-pointer">
                                    <img src="/socials/telegram.svg" class="w-8 h-8" />
                                </div>
                                <div @click="openDiscord" class="cursor-pointer">
                                    <img src="/socials/discord.svg" class="w-8 h-8" />
                                </div>
                                <div @click="openViber" class="cursor-pointer">
                                    <img src="/socials/viber_black.svg" class="w-8 h-8" />
                                </div>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </div>
            <div>
                <SidebarMenu>
                    <SidebarMenuItem >
                        <LanguageLongBtn />
                    </SidebarMenuItem>
                    <SidebarMenuItem class="my-4">
                        <SidebarMenuButton as-child>
                            <button v-if="authStore.user" @click="handleLogout"
                                class="w-full flex bg-red-400/50 items-center justify-center gap-2 text-red-500 hover:text-red-300 hover:bg-red-400/10 py-2.5 rounded-lg transition-colors font-semibold text-sm">
                                <LogOut class="w-4 h-4" />
                                {{ t('logout') }}
                            </button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <div class="w-full text-center">
                        <p class="text-gray-400 font-mono">Version {{ versionNo }}</p>
                    </div>
                </SidebarMenu>

            </div>
            <!-- Bottom Section: User / Settings -->

        </SidebarContent>

        <!-- FOOTER: Logout -->
        <!-- <SidebarFooter class="p-4 border-0 bg-gray-800">
      <div class="w-full text-center">
        <p class="text-gray-400 font-mono">Version {{ versionNo }}</p>
      </div>
    </SidebarFooter> -->
    </Sidebar>
</template>
