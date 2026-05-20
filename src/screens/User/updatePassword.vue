<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {InputGroup, InputGroupAddon,InputGroupInput} from "@/components/ui/input-group";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import { Headset, LockIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { openChat } from "@/utils";
import LanguageBtn from "@/components/languageBtn.vue";
import { changePassword } from "@/services/authAPI";

const { t } = useI18n();

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);

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
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    if (res) {
      toast.success(t("password_changed_successfully"));
      oldPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    } else {
      toast.error(t("something_went_wrong"));
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
    <CustomNavBar title="change_password" backTo="/user/profile">
            <template #right>

                <button @click="openChat">
                    <Headset class="w-6 h-6" />
                </button>
                <LanguageBtn/>
            </template>
    </CustomNavBar>
  <main class="p-4 min-h-screen w-full bg-gray-950 text-white">
    
    

    <section
      class="mt-4 p-4 w-full flex flex-col gap-4 rounded-2xl
      bg-gray-900 bg-linear-to-br from-white/5 via-white/10 to-white/5
      backdrop-blur-2xl border border-white/10
      shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
    >
      <!-- Icon -->
      <div class="flex justify-center items-center flex-col h-20 border border-sky-400/10 rounded-2xl">
        <LockIcon :size="40" />
      </div>

      <!-- Old password -->
      <div class="space-y-2">
        <Label>{{ t("old_password") }}</Label>
        <InputGroup class="h-12 rounded-lg w-full border border-gray-700 bg-gray-700/50">
          <InputGroupAddon>
            <LockIcon class="w-4 h-4" />
          </InputGroupAddon>
          <InputGroupInput
            v-model="oldPassword"
            type="password"
            class="text-white"
            :placeholder="t('enter_old_password')"
          />
        </InputGroup>
      </div>

      <!-- New password -->
      <div class="space-y-2">
        <Label>{{ t("new_password") }}</Label>
        <InputGroup class="h-12 rounded-lg w-full border border-gray-700 bg-gray-700/50">
          <InputGroupAddon>
            <LockIcon class="w-4 h-4" />
          </InputGroupAddon>
          <InputGroupInput
            v-model="newPassword"
            type="password"
            class="text-white"
            :placeholder="t('enter_new_password')"
          />
        </InputGroup>
      </div>

      <!-- Confirm password -->
      <div class="space-y-2">
        <Label>{{ t("confirm_password") }}</Label>
        <InputGroup class="h-12 rounded-lg w-full border border-gray-700 bg-gray-700/50">
          <InputGroupAddon>
            <LockIcon class="w-4 h-4" />
          </InputGroupAddon>
          <InputGroupInput
            class="text-white"
            v-model="confirmPassword"
            type="password"
            :placeholder="t('confirm_new_password')"
          />
        </InputGroup>
      </div>
    </section>

    <!-- Bottom button -->
    <div class="fixed bottom-0 right-0 left-0 p-4">
      <Button
        @click="submit"
        :disabled="loading"
        class="w-full h-12 rounded-xl
        gold-bg text-glow
        active:scale-[0.98] transition"
      >
        {{ loading ? t("loading") : t("change_password") }}
      </Button>
    </div>

  </main>
</template>