<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Dialog, DialogContent } from "./ui/dialog";
import router from "@/router";
import { Button } from "./ui/button";
import { useFundPinStore } from "@/stores/fundPinStore";
import { storeToRefs } from "pinia";

const store = useFundPinStore();
const { isFundPinOpen } = storeToRefs(store);
const { t } = useI18n();

const goToSetup = () => {
  store.closeFundPin();

   router.push("/user/security-center/fund-pin");
};
const closeModal = () => {
  store.closeFundPin();
};
</script>

<template>
  <Dialog v-model:open="isFundPinOpen">
    <DialogContent
    :dismissible="false"
      @interact-outside.prevent
      :show-close-button="false"
      class="bg-linear-to-b from-gray-900 to-gray-800 text-white rounded-2xl p-0 w-full max-w-sm overflow-hidden border border-white/10 shadow-2xl"
    >
      <!-- HEADER -->
      <div class="px-6 pt-6 pb-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-400/20">
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 11h12v10H6V11z"/>
            </svg>
          </div>

          <div>
            <h2 class="text-lg font-semibold">
              {{ t("fundPin.title") }}
            </h2>
            <p class="text-xs text-white/50">
              {{ t("fundPin.subtitle") }}
            </p>
          </div>
        </div>
      </div>

      <!-- BODY -->
      <div class="px-6 py-5 space-y-4">
        <div class="bg-white/5 border border-white/10 rounded-xl p-4">
          <p class="text-sm text-white/80 leading-relaxed">
            {{ t("fundPin.message") }}
          </p>
        </div>

        <div class="flex items-start gap-2 text-xs text-white/50">
          <span class="mt-0.5">⚠️</span>
          <span>
            {{ t("fundPin.warning") }}
          </span>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="px-6 pb-6 flex gap-3">
        <Button
          class="flex-1 border-white/15 hover:bg-white/10 bg-gray-700/20 text-white"
           @click="closeModal"
        >
          {{ t("cancel") }}
        </Button>

        <Button
          class="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg shadow-amber-500/20"
          @click="goToSetup"
        >
          {{ t("fundPin.cta") }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>