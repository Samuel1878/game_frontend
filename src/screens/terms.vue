<script setup lang="ts">
import Footer from '@/components/footer.vue';
import LanguageBtn from '@/components/languageBtn.vue';
import CustomNavBar from '@/components/layout/customNavBar.vue';
import { openChat } from '@/utils';
import { Headset } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const {t} = useI18n();
</script>

<template>
     <CustomNavBar title="terms_title" backTo="/">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <div class=" bg-gray-900 text-gray-300 px-6 py-12">
    <div class="max-w-4xl mx-auto space-y-10">

      <!-- Title -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-white">
          {{ t("terms_title") }}
        </h1>
        <p class="text-sm text-gray-400">
          {{ t("terms_last_updated") }}
        </p>
      </div>

      <!-- Sections -->
      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("terms_acceptance_title") }}
        </h2>
        <p>
          {{ t("terms_acceptance_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("terms_eligibility_title") }}
        </h2>
        <p>
          {{ t("terms_eligibility_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("terms_account_title") }}
        </h2>
        <p>
          {{ t("terms_account_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("terms_bonus_title") }}
        </h2>
        <p>
          {{ t("terms_bonus_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("terms_termination_title") }}
        </h2>
        <p>
          {{ t("terms_termination_desc") }}
        </p>
      </section>

    </div>
  </div>
  <Footer/>
</template>