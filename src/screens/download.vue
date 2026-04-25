<script setup lang="ts">
import { phone } from '@/utils';
import { InfoIcon, QrCode } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const {t} = useI18n()
</script>
<template>
    <main>
         <section
        id="download"
        class="p-8 bg-gray-900 flex flex-col items-center gap-4"
      >
        <h class="text-xl font-extrabold text-center">{{
          t("download_header")
        }}</h>
        <div class="flex flex-col items-center md:flex-row">
          <div class="md:p-0">
            <img :src="phone" />
          </div>
          <div class="flex gap-4 justify-center w-full my-4">
            <div class="p-2 bg-gray-900 rounded-lg">
              <QrCode class="w-25 h-25" />
            </div>
            <div class="flex flex-col items-center gap-4">
              <div
                class="bg-linear-to-br from-gray-700 to-gray-900 h-10 px-6 flex items-center shadow-gray-600 shadow-inner rounded-full justify-center"
              >
                <p class="text-gray-400 font-bold">{{ t('download_apk') }}</p>
              </div>
              <div class="text-sky-400 font-bold flex gap-2 underline">
                <span>
                  <InfoIcon />
                </span>
                {{ t('install_guide') }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
</template>