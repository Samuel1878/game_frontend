<template>
     <CustomNavBar title="faq" backTo="/">
    <template #right>

      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <div class=" bg-gray-900 text-gray-300 px-6 py-8">
    <div class="max-w-4xl mx-auto space-y-8">

      <h1 class="text-4xl font-bold text-white">
        {{ t("faq_title") }}
      </h1>

      <div class="space-y-6">

        <div v-for="(item, i) in faqList" :key="i" class="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <h2 class="text-yellow-400 font-semibold mb-2">
            {{ t(item.q) }}
          </h2>
          <p class="text-sm text-gray-300">
            {{ t(item.a) }}
          </p>
        </div>

      </div>

    </div>
  </div>
  <Footer/>
</template>

<script setup lang="ts">
import Footer from "@/components/footer.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import { Headset } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const faqList = [
  { q: "faq_q1", a: "faq_a1" },
  { q: "faq_q2", a: "faq_a2" },
  { q: "faq_q3", a: "faq_a3" },
  { q: "faq_q4", a: "faq_a4" },
  { q: "faq_q5", a: "faq_a5" },
  { q: "faq_q6", a: "faq_a6" },
  { q: "faq_q7", a: "faq_a7" }
];
</script>