<script setup lang="ts">
import Footer from '@/components/footer.vue';
import LanguageBtn from '@/components/languageBtn.vue';
import CustomNavBar from '@/components/layout/customNavBar.vue';
import { openChat } from '@/utils';
import { Headset } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
</script>

<template>
   <CustomNavBar title="responsible_gaming" backTo="/">
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
          {{ t("responsible_gaming") }}
        </h1>
        <p class="text-sm text-gray-400">
          {{ t("responsible_gaming_desc") }}
        </p>
      </div>

      <!-- Sections -->
      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("play_responsibly_title") }}
        </h2>
        <p>
          {{ t("play_responsibly_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("self_control_title") }}
        </h2>
        <p>
          {{ t("self_control_desc") }}
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-xl text-yellow-400 font-semibold">
          {{ t("underage_title") }}
        </h2>
        <p>
          {{ t("underage_desc") }}
        </p>
      </section>

      <!-- Support box -->
      <section class="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-2">
        <p class="text-red-400 font-semibold">
          {{ t("need_support_title") }}
        </p>
        <p>
          {{ t("need_support_desc") }}
        </p>
      </section>

    </div>
  </div>
  <Footer/>
</template>