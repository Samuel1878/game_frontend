<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Headset,
  Megaphone,
  SquareAsterisk,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import { useAuthStore } from "@/stores/auth";
import FundPinDrawer from "@/components/fundPinDrawer.vue";
import { changeFundPinAPI, setFundPinAPI, verifyFundPinAPI } from "@/services/fundPinAPI.service";
import CredentialAlert from "@/components/credentialAlert.vue";

const { t } = useI18n();
const showCredentialAlert = ref(false);
const oldPin = ref("");
const openDrawer = ref(false);
const authStore = useAuthStore();
const fundPin = ref("");
const loading = ref(false);
const isNew = computed(() => authStore.user?.set_pin === false);
const isVerified = ref(false);
const submit = async (pin:string) => {
  if (pin.length < 6) {
    toast.error(t("password_too_short"));
    return;
  }
  loading.value = true;
  try {
     fundPin.value = pin;
    if (isNew.value) {
      const response = await setFundPinAPI(pin);
      if (response) {
        toast.success(t("fund_pin_set_successfully"));
        authStore.setFundPinStatus(true);
        showCredentialAlert.value = true;
      } else {
        toast.error(t("something_went_wrong"));
      }
    } else {
        if (!isVerified.value) {
          const response = await verifyFundPinAPI(pin);
          if (response) {
            isVerified.value = true;
            oldPin.value = pin;
            openDrawer.value = false;
            toast.success(t("current_fund_pin_verified"));
          } else {
            isVerified.value = false;
            toast.error(t("incorrect_fund_pin"));
          }
          return;
        }   
        const response = await changeFundPinAPI(oldPin.value,pin);
        if (response) {
            isVerified.value = false;
            toast.success(t("fund_pin_changed_successfully"));
            showCredentialAlert.value = true;
        } else {
            toast.error(t("something_went_wrong"));
        }
    }
  } 
    catch (error) {
        openDrawer.value = false;
      toast.error(t("something_went_wrong"));
    }
    finally {
    openDrawer.value = false;
    loading.value = false;
  }
};
watch(
  () => isVerified.value,
  (value) => {
    if (value) {
        setTimeout(() => {
            fundPin.value = "";
            openDrawer.value = true;
        }, 1000);
     
    }
  },
);
</script>

<template>

  <main class=" min-h-screen w-full bg-gray-900 text-white">
      <CustomNavBar title="change_fund_pin" backTo="/user/security-center">
    <template #right>
      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
    <section
      class="rounded-3xl p-5 m-4 bg-linear-to-br from-yellow-500/10 via-white/5 to-yellow-500/5 border border-yellow-500/20"
    >
      <div class="flex items-center gap-4">
        <div
          class="size-14 rounded-xl bg-yellow-500/10 flex items-center justify-center"
        >
          <SquareAsterisk :size="40" class="text-yellow-400" />
        </div>
        <div>
          <h2 class="font-semibold text-lg">
            {{ t("fund_pin") }}
          </h2>
          <p class="text-green-400 text-sm">
            {{ isNew ? t("not_configured") : t("active") }}
          </p>
        </div>
      </div>
      <div class="space-y-4">
        <p class="text-white text-md font-semibold mt-4">
          {{ t("fund_pin_change_warning") }}
        </p>
        <p class="text-xs text-gray-400">
          <span class="inline"
            ><Megaphone class="text-gray-300 w-4 h-4 inline mr-2" />
            {{ t("fund_pin_change_warning_desc") }}</span
          >
        </p>
      </div>
      <div class="mt-5 space-y-3">
        <div class="flex items-center gap-3">
          <CheckCircle2 class="size-4 text-green-400" />
          <span>{{ t("withdrawal_protection") }}</span>
        </div>
        <div class="flex items-center gap-3">
          <CheckCircle2 class="size-4 text-green-400" />
          <span>{{ t("wallet_transfer_protection") }}</span>
        </div>
        <div class="flex items-center gap-3">
          <CheckCircle2 class="size-4 text-green-400" />
          <span>{{ t("security_verification") }}</span>
        </div>
      </div>
    </section>
    <!-- Bottom button -->
    <div class="fixed bottom-0 right-0 left-0 p-4">
      <Button
        @click="openDrawer = true"
        :disabled="loading"
        class="w-full h-12 rounded-xl gold-bg text-glow active:scale-[0.98] transition"
      >
        {{
          loading
            ? t("loading")
            : isNew
            ? t("set_fund_pin")
            : t("change_fund_pin")
        }}
      </Button>
    </div>
    <FundPinDrawer
      v-model:open="openDrawer"
      @confirm="submit"
      :title="isNew ? t('enter_new_fund_pin') : isVerified ? t('enter_new_fund_pin') : t('enter_current_fund_pin')"
      :description="t('fund_pin_must_be_6_digits')"
      :buttonText="isNew ? t('set_fund_pin') :isVerified ? t('change_fund_pin') : t('verify_fund_pin')"
    />
    <CredentialAlert v-model:open="showCredentialAlert" description="fund_pin_alert_description" title="fund_pin_alert_title" :data="fundPin"/>
  </main>

</template>
