<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { CheckCircle2, Headset, Megaphone, SquareAsterisk } from "lucide-vue-next";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import { openChat } from "@/utils";
import { useAuthStore } from "@/stores/auth";
import {
  getFundPinErrorStatus,
  getFundPinErrorTranslationKey,
  setupFundPin,
} from "@/services/fundPinAPI.service";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const fundPin = ref("");
const confirmFundPin = ref("");
const loading = ref(false);
const isConfigured = computed(() => authStore.fundPinStatus === true);

const cleanPin = (value: string | number) => String(value).replace(/\D/g, "").slice(0, 6);
const setFundPin = (event: Event) => {
  fundPin.value = cleanPin((event.target as HTMLInputElement).value);
};
const setConfirmFundPin = (event: Event) => {
  confirmFundPin.value = cleanPin((event.target as HTMLInputElement).value);
};
const clearPins = () => {
  fundPin.value = "";
  confirmFundPin.value = "";
};

const submit = async () => {
  if (loading.value || isConfigured.value) return;

  if (!/^\d{4,6}$/.test(fundPin.value) || !/^\d{4,6}$/.test(confirmFundPin.value)) {
    toast.error(t("fund_pin_must_be_4_to_6_digits"));
    return;
  }
  if (fundPin.value !== confirmFundPin.value) {
    toast.error(t("fund_pin_confirmation_mismatch"));
    return;
  }

  loading.value = true;
  try {
    await setupFundPin(fundPin.value, confirmFundPin.value);
    clearPins();
    await authStore.fetchUser();
    // Current backend sessions may not expose the flag from /me yet; retain the
    // confirmed state locally after the successful first-time setup response.
    authStore.setFundPinStatus(true);
    toast.success(t("fund_pin_set_successfully"));

    if (route.query.redirect === "withdraw") {
      await router.replace("/withdraw");
    }
  } catch (error) {
    clearPins();
    if (getFundPinErrorStatus(error) === 409) {
      authStore.setFundPinStatus(true);
    }
    toast.error(t(getFundPinErrorTranslationKey(error)));
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main class="min-h-screen w-full bg-gray-900 text-white">
    <CustomNavBar title="set_fund_pin" backTo="/user/security-center">
      <template #right>
        <button @click="openChat">
          <Headset class="w-6 h-6" />
        </button>
        <LanguageBtn />
      </template>
    </CustomNavBar>

    <section class="rounded-3xl p-5 m-4 bg-linear-to-br from-yellow-500/10 via-white/5 to-yellow-500/5 border border-yellow-500/20">
      <div class="flex items-center gap-4">
        <div class="size-14 rounded-xl bg-yellow-500/10 flex items-center justify-center">
          <SquareAsterisk :size="40" class="text-yellow-400" />
        </div>
        <div>
          <h2 class="font-semibold text-lg">{{ t("fund_pin") }}</h2>
          <p :class="isConfigured ? 'text-green-400' : 'text-yellow-400'" class="text-sm">
            {{ isConfigured ? t("active") : t("not_configured") }}
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <p class="text-white text-md font-semibold mt-4">{{ t("fund_pin_change_warning") }}</p>
        <p class="text-xs text-gray-400">
          <Megaphone class="text-gray-300 w-4 h-4 inline mr-2" />
          {{ t("fund_pin_change_warning_desc") }}
        </p>
      </div>

      <form v-if="!isConfigured" class="mt-6 space-y-4" @submit.prevent="submit">
        <label class="block space-y-2">
          <span class="text-sm text-gray-200">{{ t("enter_new_fund_pin") }}</span>
          <input
            :value="fundPin"
            type="password"
            inputmode="numeric"
            autocomplete="new-password"
            pattern="[0-9]*"
            minlength="4"
            maxlength="6"
            :placeholder="t('fund_pin_must_be_4_to_6_digits')"
            class="w-full h-12 rounded-xl border border-gray-600 bg-gray-800/70 px-4 text-center tracking-[0.45em] text-lg outline-none focus:border-yellow-400"
            @input="setFundPin"
          />
        </label>
        <label class="block space-y-2">
          <span class="text-sm text-gray-200">{{ t("confirm_new_fund_pin") }}</span>
          <input
            :value="confirmFundPin"
            type="password"
            inputmode="numeric"
            autocomplete="new-password"
            pattern="[0-9]*"
            minlength="4"
            maxlength="6"
            :placeholder="t('fund_pin_must_be_4_to_6_digits')"
            class="w-full h-12 rounded-xl border border-gray-600 bg-gray-800/70 px-4 text-center tracking-[0.45em] text-lg outline-none focus:border-yellow-400"
            @input="setConfirmFundPin"
          />
        </label>
      </form>

      <div class="mt-6 space-y-3">
        <div class="flex items-center gap-3"><CheckCircle2 class="size-4 text-green-400" /><span>{{ t("withdrawal_protection") }}</span></div>
        <div class="flex items-center gap-3"><CheckCircle2 class="size-4 text-green-400" /><span>{{ t("wallet_transfer_protection") }}</span></div>
        <div class="flex items-center gap-3"><CheckCircle2 class="size-4 text-green-400" /><span>{{ t("security_verification") }}</span></div>
      </div>
    </section>

    <div v-if="!isConfigured" class="fixed bottom-0 right-0 left-0 p-4">
      <Button :disabled="loading" class="w-full h-12 rounded-xl gold-bg text-glow active:scale-[0.98] transition" @click="submit">
        {{ loading ? t("loading") : t("set_fund_pin") }}
      </Button>
    </div>
  </main>
</template>
