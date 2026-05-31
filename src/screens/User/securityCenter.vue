<script setup lang="ts">
import LanguageBtn from "@/components/languageBtn.vue";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import { Headset, KeyRoundIcon , ChevronRight, UserLock } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<template>

    <div class="min-h-screen bg-gray-900 w-full">
        <CustomNavBar title="security_center" backTo="/user/profile">
            <template #right>
                <button @click="openChat">
                    <Headset class="w-6 h-6" />
                </button>
                <LanguageBtn/>
            </template>
        </CustomNavBar>
        <section class="max-w-md mx-auto space-y-4 py-6 px-4">
            <router-link
                to="/user/security-center/update-password"
                class="cursor-pointer relative overflow-hidden px-4 flex justify-between items-center text-white border-b-2 h-16 glass-bg rounded-xl">
                <div class="flex items-center gap-3">
                    <UserLock class="w-5 h-5 text-yellow-400" />
                   <p class="text-lg font-medium">{{ t("update_password") }}</p> 
                </div>
                <ChevronRight class="w-4 h-4 text-gray-400" />
            </router-link>
            <router-link
                to="/user/security-center/fund-pin"
                class="cursor-pointer relative overflow-hidden px-4 flex justify-between items-center text-white border-b-2 h-16 glass-bg rounded-xl">
                <div class="flex items-center gap-3">
                    <KeyRoundIcon class="w-5 h-5 text-yellow-400" />
                   <p class="text-lg font-medium">{{ t("change_fund_pin") }}</p> 
                </div>
                <ChevronRight class="w-4 h-4 text-gray-400" />
            </router-link>
        </section>
    </div>
</template>