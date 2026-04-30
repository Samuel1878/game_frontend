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
      <CustomNavBar backTo="/">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <div class=" bg-gray-900 text-gray-300 px-6 py-6">
    <div class="max-w-4xl mx-auto space-y-10">
      
      <!-- Title -->
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-white">
          {{ t("privacy_policy") }}
        </h1>
        <p class="text-sm text-gray-400">
          {{ t("privacy_last_updated") }}
        </p>
      </div>

      <!-- Sections -->
      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("privacy_collect_title") }}
        </h2>
        <p>
          {{ t("privacy_collect_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("privacy_use_title") }}
        </h2>
        <p>
          {{ t("privacy_use_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("privacy_protection_title") }}
        </h2>
        <p>
          {{ t("privacy_protection_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("privacy_third_party_title") }}
        </h2>
        <p>
          {{ t("privacy_third_party_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("privacy_user_rights_title") }}
        </h2>
        <p>
          {{ t("privacy_user_rights_desc") }}
        </p>
      </section>

    </div>
    
  </div>
  <Footer/>
</template>