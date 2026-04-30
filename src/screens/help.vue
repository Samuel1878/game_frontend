<script setup lang="ts">
import Footer from '@/components/footer.vue';
import LanguageBtn from '@/components/languageBtn.vue';
import CustomNavBar from '@/components/layout/customNavBar.vue';
import HelpBox from '@/components/layout/helpBox.vue';
import { openChat } from '@/utils';
import { Headset } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
const {t} = useI18n()
</script>

<template>
    <CustomNavBar title="help_center" backTo="/">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <div class=" bg-slate-950 text-gray-300 px-6 py-6">
    <div class="max-w-4xl mx-auto space-y-10">
      <h1 class="text-4xl font-bold text-white">
        {{ t("help_center") }}
      </h1>

      <section class="space-y-4">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("account_issues") }}
        </h2>
        <p>
          {{ t("account_issues_desc") }}
        </p>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("deposit_withdraw") }}
        </h2>
        <p>
          {{ t("deposit_withdraw_desc") }}
        </p>
      </section>

      <section class="space-y-4">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("game_launch_issues") }}
        </h2>
        <p>
          {{ t("game_launch_issues_desc") }}
        </p>
      </section>

      <HelpBox container-style="w-full"/>
    </div>

  </div>
  <Footer/>
</template>