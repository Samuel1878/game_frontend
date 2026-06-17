<script setup lang="ts">
import LanguageBtn from "@/components/languageBtn.vue";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import {  hideTawk, openChat, showTawk } from "@/utils";
import { Headset } from "lucide-vue-next";
import { computed, onActivated, onDeactivated } from "vue";
import { useRoute } from "vue-router";

import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {  ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useReferralStore } from "@/stores/referralStore";
import {
  Eye,
  EyeClosed,
  LockIcon,
  PhoneIcon,
  Share2Icon,
  User
} from "lucide-vue-next";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { decryptPassword, encryptPassword } from "@/utils/help";
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const checked = ref(false);
const loadingButton = ref(false);
const regex = /^[A-Za-z0-9_]{4,40}$/;
const mmRegex = /^09\d{7,13}$/; // Myanmar
const thRegex = /^(0|\+66)\d{8,9}$/; // Thailand
const cnRegex = /^(1[3-9]\d{9}|\+861[3-9]\d{9})$/; // China
const form = ref({
  username: "",
  phone: "",
  password: "",
  conPassword: "",
});
const loginName = ref("");
const { t } = useI18n();
const showPassword = ref(false);
const isError = ref(false);
const referralStore = useReferralStore();
const { referralCode, fromRid } = storeToRefs(referralStore);
const isLogin = computed(() => route.query.mode !== "register");
onActivated(() => {
    hideTawk();
  if (auth.user) {
    router.push("/");
  }
});
onDeactivated(()=>{
  showTawk();
})
const switchMode = () => {
  router.replace({
    path: "/auth",
    query: {
      mode: isLogin.value ? "register" : "login",
    },
  });
};
const validatePhone = (phone: string) => {
  const normalized = phone.replace(/\s+/g, "");
  return (
    mmRegex.test(normalized) ||
    thRegex.test(normalized) ||
    cnRegex.test(normalized)
  );
};

const validateForm = () => {
  if (isLogin.value) {
    if (!loginName.value) return "required_name_phone";
    if (!regex.test(loginName.value)) {
      return "invalid_username_format";
    }
    if (!form.value.password) return "required_password";
    if (form.value.password.length < 6) {
      return "password_too_short";
    }
    return null;
  }
  if (!form.value.username) return "required_username";
  if (!regex.test(form.value.username)) {
    return "invalid_username_format";
  }
  if (!form.value.phone) return "required_phone";
  if (!validatePhone(form.value.phone)) {
    return "invalid_phone";
  }
  if (!form.value.password) return "required_password";
  if (form.value.password.length < 6) {
    return "password_too_short";
  }
  if (form.value.password !== form.value.conPassword) {
    return "password_not_match";
  }
};
const submit = async () => {
    isError.value = false;
  const validationError = validateForm();
  if (validationError) {
    toast.warning(t(validationError));
    return;
  }
  loadingButton.value = true;
  try {
    let response;
    if (isLogin.value) {
      response = await auth.login({
        name: loginName.value,
        password: form.value.password,
        isPhoneNumber: validatePhone(loginName.value),
      });
      
    } else {
      response = await auth.register({
        name: form.value.username,
        phone: form.value.phone,
        password: form.value.password,
        referral_code: referralCode.value,
      });
    }
    if (response?.status === 200) {
      toast.success(t(response.message));
      router.push("/");
      if (checked.value) {
        localStorage.setItem("remember_username", loginName.value);
        localStorage.setItem(
          "remember_password",
          encryptPassword(form.value.password),
        );
      }
    } else {
        isError.value = true;
        toast.error(t(response?.message || "invalid_username_password"));
    }
  } catch (err: any) {
    isError.value = true;
    toast.error(t(err?.message || "something_went_wrong"));
  } finally {
    loadingButton.value = false;
  }
};
onActivated(() => {
  const savedUsername = localStorage.getItem("remember_username");
  const savedPassword = localStorage.getItem("remember_password");
  if (savedUsername) {
    loginName.value = savedUsername;
  }
  if (savedPassword) {
    form.value.password = decryptPassword(savedPassword);
  }
});

</script>
<template>
  <main class="min-h-screen bg-gray-900 w-full antialiased text-gray-100">
    <CustomNavBar :title="isLogin?'login':'register'" backTo="/" class="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
      <template #right>
        <div class="flex items-center gap-3">
          <button @click="openChat">
        <Headset class="w-6 h-6" />
      </button>
          <LanguageBtn class="hover:bg-gray-800 rounded-lg transition-colors" />
        </div>
      </template>
    </CustomNavBar>

    <div class="flex-1 flex justify-center p-4 sm:p-6">
      <section class="max-w-md w-full info-bg rounded-3xl overflow-hidden">
        
        <header class="relative p-4 border-b border-amber-400/20 overflow-hidden bg-gray-900/20 bg-linear-to-br from-gray-800/20 via-gray-800/10 to-gray-800/20">
          <div class="glass absolute inset-0 opacity-40"></div>
          <div class="shine absolute inset-0 opacity-10"></div>
          <div class="absolute inset-0 bg-black/20"></div>
          
          <div class="relative z-10 flex gap-4 items-center">
            <div class="p-2 bg-gray-900/50 rounded-2xl border border-amber-400/20 shadow-inner">
              <img src="/favicon.webp" class="w-12 h-12 object-contain" alt="Logo"/>
            </div>
            <div class="flex flex-col justify-center">
              <p class="text-linear-gold font-bold text-xl tracking-wide">
                {{ isLogin ? t("login") : t("register") }}
              </p>
              <p class="text-gray-400 text-xs mt-0.5">
                {{ isLogin ? t("login_to_your_account") : t("register_new_account") }}
              </p>
            </div>
          </div>
        </header>

        <div class="p-6 flex flex-col gap-6">
            
          <div class="bg-gray-900/70 p-1 rounded-lg border border-gray-500/20 flex relative w-full">
            <button 
              type="button"
              @click="switchMode"
              class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative z-10"
              :class="isLogin ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-200'"
            >
              {{ t("login") }}
            </button>
            <button 
              type="button"
              @click="switchMode"
              class="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative z-10"
              :class="!isLogin ? 'text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-200'"
            >
              {{ t("register") }}
            </button>
            
            <div 
              class="absolute top-1 bottom-1 left-1 gold-bg rounded-lg shadow-sm transition-transform duration-300 ease-out"
              :class="isLogin ? 'w-[calc(50%-4px)] translate-x-0' : 'w-[calc(50%-4px)] translate-x-[calc(100%+4px)]'"
            ></div>
          </div>

          <div
            :class="{ 'error-shake': isError }"
          
            class="space-y-4 w-full"
          >
            <div class="space-y-1 form-item" v-if="isLogin">
              <Label class="text-xs text-gray-100 pl-1">
                {{ t("name_phone") }}
              </Label>

              <InputGroup
                class="h-12 w-full rounded-lg font-medium border-gray-500/20 shadow-inner bg-gray-800/20"
              >
                <InputGroupAddon>
                  <User class="text-gray-400" />
                </InputGroupAddon>

                <InputGroupInput
                  v-model="loginName"
                  class="w-full bg-transparent outline-none text-white placeholder:text-sm"
                  type="text"
                  autocomplete="username"
                  :placeholder="t('enter_name_phone')"
                />
              </InputGroup>
            </div>
            <div v-else class="space-y-1 form-item">
              <Label class="text-xs text-gray-100 pl-1">
                {{ t("name") }}
              </Label>
              <InputGroup
                class="h-12 w-full rounded-lg font-medium border-gray-500/20 shadow-inner bg-gray-800/20"
              >
                <InputGroupAddon>
                  <User />
                </InputGroupAddon>
                <InputGroupInput
                  class="w-full bg-transparent outline-none text-white placeholder:text-sm"
                  v-model="form.username"
                  type="text"
                  name="username"
                  :placeholder="t('enter_name')"
                  autocomplete="username"
                  autocapitalize="off"
                  autocorrect="off"
                  spellcheck="false"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText class="text-gray-100"></InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div class="space-y-1 form-item" v-show="!isLogin">
              <Label class="text-xs text-gray-100 pl-1">
                {{ t("phone_number") }}
              </Label>
              <InputGroup
                class="h-12 w-full rounded-lg font-medium border-gray-500/20 shadow-inner bg-gray-800/20"
              >
                <InputGroupAddon>
                  <PhoneIcon />
                </InputGroupAddon>
                <InputGroupInput
                  class="w-full bg-transparent outline-none text-white placeholder:text-sm"
                  v-model="form.phone"
                  type="text"
                  name="phone"
                  autocomplete="tel"
                  inputmode="numeric"
                  :placeholder="t('enter_phone_number')"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText class="text-gray-100"></InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div class="space-y-1 form-item">
              <Label class="text-xs text-gray-100 pl-1">
                {{ t("password") }}
              </Label>
              <InputGroup
                class="h-12 w-full rounded-lg font-medium border-gray-500/20 shadow-inner bg-gray-800/20"
              >
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupInput
                  class="w-full bg-transparent outline-none text-white placeholder:text-sm"
                  v-model="form.password"
                  name="password"
                  :autocomplete="isLogin ? 'current-password' : 'new-password'"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('enter_password')"
                />
                <InputGroupAddon align="inline-end">
                  <button type="button" @click="showPassword = !showPassword">
                    <EyeClosed v-if="showPassword" />
                    <Eye v-else />
                  </button>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div class="space-y-1 form-item" v-show="!isLogin">
              <Label class="text-xs text-gray-100 pl-1">
                {{ t("confirm_password") }}
              </label>
              <InputGroup
                class="h-12 w-full rounded-lg font-medium border-gray-500/20 shadow-inner bg-gray-800/20"
              >
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupInput
                  class="w-full bg-transparent outline-none text-white placeholder:text-sm"
                  v-model="form.conPassword"
                  :type="showPassword ? 'text' : 'password'"
                  name="confirm-password"
                  autocomplete="new-password"
                  :placeholder="t('confirm_password')"
                />
                <InputGroupAddon align="inline-end">
                  <button type="button" @click="showPassword = !showPassword">
                    <EyeClosed v-if="showPassword" />
                    <Eye v-else />
                  </button>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div class="space-y-1 form-item" v-show="!isLogin">
              <Label class="text-xs text-gray-400 pl-1">
                {{ t("referral_placeholder") }}
              </Label>

              <InputGroup
                class="h-12 w-full rounded-lg font-medium border-gray-500/20 shadow-inner bg-gray-800/20"
              >
                <InputGroupAddon>
                  <Share2Icon />
                </InputGroupAddon>
                <InputGroupInput
                  class="w-full bg-transparent outline-none text-white placeholder:text-sm"
                  :disabled="fromRid"
                  v-model="referralCode"
                  :placeholder="t('enter_referral_code_optional')"
                />
              </InputGroup>
            </div>

            <div class="pt-2">
              <div class="flex items-center text-xs gap-2 mb-3 px-1">
                <Checkbox
                  id="terms"
                  :model-value="checked"
                  v-on:update:model-value="checked = !checked"
                />
                <Label for="terms" class="text-gray-400 hover:text-gray-300 cursor-pointer text-xs select-none">
                  {{ t("remember_me") }}
                </Label>
              </div>
              
              <Button
                @click="submit"
                :disabled="loadingButton"
                class="w-full h-12 rounded-lg flex items-center justify-center gap-2 gold-bg active-button disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Spinner v-if="loadingButton" />
                <span class="text-glow font-semibold tracking-wide">
                  {{ isLogin ? t("login") : t("register") }}
                </span>
              </Button>
            </div>
            </div>

          <div class="pt-4 border-t border-gray-500/20 text-center text-sm text-gray-400">
            {{ isLogin ? t("do_not_have") : t("already_have_one") }}
            <button
              type="button"
              class="ml-1 text-yellow-400 hover:text-yellow-300 font-bold cursor-pointer transition-colors"
              @click="switchMode"
            >
              {{ isLogin ? t("register") : t("login") }}
            </button>
          </div>
            
        </div>
      </section>
    </div>
  </main>
</template>
<style>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(4px);
  }
}

.error-shake {
  animation: shake 0.2s ease-in-out;
}

.form-item {
  animation: fadeUp 0.5s ease forwards;
  opacity: 0;
}

.form-item:nth-child(1) {
  animation-delay: 0.05s;
}

.form-item:nth-child(2) {
  animation-delay: 0.1s;
}

.form-item:nth-child(3) {
  animation-delay: 0.15s;
}

.form-item:nth-child(4) {
  animation-delay: 0.2s;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
