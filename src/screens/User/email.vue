<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const {t} = useI18n();
</script>
<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div class="text-white text-2xl font-bold">
      {{ t("email_verification") }}
    </div>
  </div>
</template>