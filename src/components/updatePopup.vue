<template>
  <div v-if="showUpdate" class="fixed inset-0 bg-black/60 flex items-center justify-center">
    <div class="bg-white p-4 rounded w-[300px]">
      <h2 class="text-lg font-bold">{{ t("update_available") }}</h2>

      <p class="mt-2 text-sm">
        {{ updateData.message }}
      </p>

      <button
        class="mt-4 w-full bg-blue-600 text-white py-2 rounded"
        @click="downloadUpdate"
      >
        {{ t("update_now") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppUpdate } from "@/lib/updateMobileHook";
import { useI18n } from "vue-i18n";
const {t} = useI18n()
const { showUpdate, updateData, downloadUpdate } = useAppUpdate();
</script>