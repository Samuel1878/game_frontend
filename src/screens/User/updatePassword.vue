<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, Headset, LockIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import { changePassword } from "@/services/authAPI";
import { getApiErrorMessage } from "@/services/api";

const CredentialAlert = defineAsyncComponent(
  () => import("@/components/credentialAlert.vue"),
);

const { t } = useI18n();
const showCredentialAlert = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const showPassword = ref(false);
const submit = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    toast.error(t("please_fill_all_fields"));
    return;
  }

  if (newPassword.value.length < 6) {
    toast.error(t("password_too_short"));
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error(t("passwords_do_not_match"));
    return;
  }

  loading.value = true;
  try {
    const res = await changePassword({
      current_password: oldPassword.value,
      new_password: newPassword.value,
      confirm_password: confirmPassword.value,
    });
    if (res) {
      toast.success(t("password_changed_successfully"));
      oldPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
      showCredentialAlert.value = true;
    } else {
      toast.error(t("something_went_wrong"));
    }
  } catch (error) {
    toast.error(getApiErrorMessage(error, t("backend_api_not_available")));
  } finally {
    loading.value = false;
  }
};
</script>

<template>

  <main class=" min-h-screen w-full bg-gray-900 text-white">
      <CustomNavBar title="change_password" backTo="/user/security-center">
    <template #right>
      <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
    <section
      class="m-4 p-4 flex flex-col gap-4 rounded-2xl bg-gray-800/20 backdrop-blur-2xl border border-gray-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
    >
      <!-- Icon -->
      <div
        class="flex justify-center items-center shadow-xs flex-col h-20 border border-yellow-400/10 rounded-2xl"
      >
        <LockIcon :size="40" class="text-yellow-400" />
      </div>

      <!-- Old password -->
      <div class="space-y-2">
        <Label>{{ t("old_password") }}</Label>
        <InputGroup
          class="h-12 rounded-lg w-full border border-gray-700 bg-gray-800/50"
        >
          <InputGroupAddon>
            <LockIcon class="w-4 h-4" />
          </InputGroupAddon>
          <InputGroupInput
            v-model="oldPassword"
            :type="showPassword ? 'text' : 'password'"
            class="text-white"
            :placeholder="t('enter_old_password')"
          />
          <InputGroupAddon align="inline-end">
            <button type="button" @click="showPassword = !showPassword">
              <EyeClosed v-if="showPassword" />
              <Eye v-else />
            </button>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <!-- New password -->
      <div class="space-y-2">
        <Label>{{ t("new_password") }}</Label>
        <InputGroup
          class="h-12 rounded-lg w-full border border-gray-700 bg-gray-800/50"
        >
          <InputGroupAddon>
            <LockIcon class="w-4 h-4" />
          </InputGroupAddon>
          <InputGroupInput
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            class="text-white"
            :placeholder="t('enter_new_password')"
          />
          <InputGroupAddon align="inline-end">
            <button type="button" @click="showPassword = !showPassword">
              <EyeClosed v-if="showPassword" />
              <Eye v-else />
            </button>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <!-- Confirm password -->
      <div class="space-y-2">
        <Label>{{ t("confirm_password") }}</Label>
        <InputGroup
          class="h-12 rounded-lg w-full border border-gray-700 bg-gray-800/50"
        >
          <InputGroupAddon>
            <LockIcon class="w-4 h-4" />
          </InputGroupAddon>
          <InputGroupInput
            class="text-white"
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('confirm_new_password')"
          />
          <InputGroupAddon align="inline-end">
            <button type="button" @click="showPassword = !showPassword">
              <EyeClosed v-if="showPassword" />
              <Eye v-else />
            </button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </section>

    <!-- Bottom button -->
    <div class="fixed bottom-0 right-0 left-0 p-4">
      <Button
        @click="submit"
        :disabled="loading"
        class="w-full h-12 rounded-xl gold-bg text-glow active:scale-[0.98] transition"
      >
        {{ loading ? t("loading") : t("change_password") }}
      </Button>
    </div>
    <CredentialAlert
      v-model:open="showCredentialAlert"
      description="password_alert_description"
      title="password_alert_title"
      :data="newPassword"
    />
  </main>
</template>
