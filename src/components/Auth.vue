<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { onMounted, ref } from "vue";
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
  User,
  X,
} from "lucide-vue-next";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import {DialogDescription} from "./ui/dialog";
import LanguageBtn from "./languageBtn.vue";
const auth = useAuthStore();
const ui = useUIStore();
const router = useRouter();
const checked = ref(true);
const loadingButton = ref(false);
const { authModalOpen, isLogin } = storeToRefs(ui);
// const isLogin = ref(true);
const errorMessage = ref("");
const regex = /^[A-Za-z0-9_]{6,40}$/;
const mmRegex = /^09\d{7,13}$/; // Myanmar
const thRegex = /^(0|\+66)\d{8,9}$/; // Thailand
const cnRegex = /^(1[3-9]\d{9}|\+861[3-9]\d{9})$/; // China

const validatePhone = (phone: string) => {
  const normalized = phone.replace(/\s+/g, "");

  return (
    mmRegex.test(normalized) ||
    thRegex.test(normalized) ||
    cnRegex.test(normalized)
  );
};
const form = ref({
  username: "",
  phone: "",
  password: "",
  conPassword: "",
});
const loginName = ref("");
const { t } = useI18n();
const showPassword = ref(false);
const referralStore = useReferralStore();
const { referralCode, fromRid } = storeToRefs(referralStore);
onMounted(() => {
  if (auth.accessToken) {
    ui.closeAuthModal();
  }
});
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
  if (!checked.value) return "must_accept_terms";
  return null;
};
const submit = async () => {
  // console.log(referralCode.value);
  errorMessage.value = "";
  const validationError = validateForm();
  if (validationError) {
    errorMessage.value = validationError;
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
      ui.closeAuthModal();
          if (ui.redirectAfterAuth) {
          const path = ui.redirectAfterAuth;
          ui.redirectAfterAuth = null; // Clear it after using it
          router.push(path);
        }
    } else {
      errorMessage.value = response?.message || "invalid_username_password";
      // console.warn("[AUTH FAILED]:", {
      //   message: t(errorMessage.value),
      //   raw: response,
      // });
      toast.error(t(errorMessage.value));
    }
  } catch (err: any) {
    errorMessage.value = err?.message || "something_went_wrong";
    // console.error("[AUTH ERROR]:", {
    //   message: t(errorMessage.value),
    //   error: err,
    // });
    toast.error(t(errorMessage.value));
  } finally {
    loadingButton.value = false;
  }
};
</script>

<template>
  <Dialog v-model:open="authModalOpen">
    <DialogContent
      :dismissible="false"
      @interact-outside.prevent
      :show-close-button="false"
      class="bg-gray-900 bg-linear-to-br from-white/15 via-white/10 to-white/10 backdrop-blur-2xl border-2 border-gray-700/60 shadow-[0_10px_40px_rgba(0,0,0,2)] text-gray-100 rounded-2xl p-0.5 pb-4 w-full"
    >
      <DialogHeader
        class="relative mb-2 rounded-t-xl border border-gray-600/10 p-4 overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black shadow-[0_5px_40px_rgba(0,0,0,1)]"
      >
        <div class="glass absolute inset-0"></div>

        <div class="shine absolute inset-0"></div>
        <div class="absolute inset-0 bg-black/10 rounded-lg"></div>
        <div class="flex gap-4 items-center">
          <!-- <div
            class="animate-pulse relative p-0.5 rounded-3xl bg-linear-to-br from-yellow-400/60 via-yellow-200/70 to-yellow-500/70 shadow-[0_0_15px_rgba(255,215,0,.4)]"
          >
            <div class="bg-black/70 rounded-3xl p-1"> -->
          <img src="/favicon.webp" class="w-14 h-14" alt="Logo"/>
          <!-- </div>
          </div> -->

          <div class="h-full gap-2 flex flex-col justify-center">
            <DialogTitle
              class="text-linear-gold font-bold text-start text-xl tracking-wide"
            >
              {{ isLogin ? t("login") : t("register") }}
            </DialogTitle>

            <DialogDescription class="text-start text-gray-400 text-xs">
              {{
                isLogin ? t("login_to_your_account") : t("register_new_account")
              }}
            </DialogDescription>
          </div>
        </div>

        <button
          class="absolute right-5 top-5 cursor-pointer"
          @click="ui.closeAuthModal()"
        >
          <X />
        </button>
      </DialogHeader>
      <form
        :class="{ 'error-shake': errorMessage }"
        @submit.prevent="submit"
        class="space-y-2 px-4"
      >
        <div class="space-y-1 form-item" v-if="isLogin">
          <Label class="text-xs text-gray-400 pl-1">
            {{ t("name_phone") }}
          </Label>

          <InputGroup
            class="h-12 w-full rounded-lg font-medium glass-bg transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30"
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
          <Label class="text-xs text-gray-400 pl-1">
            {{ t("name") }}
          </Label>
          <InputGroup
            class="h-12 w-full rounded-lg font-medium glass-bg transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30"
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
          <Label class="text-xs text-gray-400 pl-1">
            {{ t("phone_number") }}
          </Label>
          <InputGroup
            class="h-12 w-full rounded-lg font-medium glass-bg transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30"
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
          <Label class="text-xs text-gray-400 pl-1">
            {{ t("password") }}
          </Label>
          <InputGroup
            class="h-12 w-full rounded-lg font-medium glass-bg transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30"
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
          <Label class="text-xs text-gray-400 pl-1">
            {{ t("confirm_password") }}
          </Label>
          <InputGroup
            class="h-12 w-full rounded-lg font-medium glass-bg transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30"
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
            class="h-12 w-full rounded-lg font-medium glass-bg transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/30"
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

        <div class="mt-8">
          <!-- <div class="h-8">
            <p v-if="errorMessage" class="text-red-500 text-sm px-1">
              {{ t(errorMessage) }}
            </p>
          </div> -->
          <div class="flex items-center text-xs gap-2 mb-2 px-1">
            <Checkbox
             
              id="terms"
              :model-value="checked"
              v-on:update:model-value="checked = !checked"
            />
            <Label for="terms" class="text-gray-400 underline text-xs">{{
              t("accept_terms")
            }}</Label>
          </div>
          <Button
            :disabled="loadingButton"
            class="w-full h-12 rounded-lg flex items-center justify-center gap-2 gold-bg active-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Spinner v-if="loadingButton" />
            <span class="text-glow">
              {{ isLogin ? t("login") : t("register") }}
            </span>
          </Button>
        </div>
      </form>
      <div class="w-full px-4 border-t border-gray-600">
        <div class="flex items-center justify-between gap-2">
          <LanguageBtn />

          <div class="text-center text-sm text-gray-400 flex-1">
            {{ isLogin ? t("do_not_have") : t("already_have_one") }}

            <button
              class="ml-1 text-yellow-400 text-shadow-2xs font-bold cursor-pointer underline"
              @click="isLogin = !isLogin"
            >
              {{ isLogin ? t("register") : t("login") }}
            </button>
          </div>

          <!-- spacer for center alignment -->
          <div class="w-10"></div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
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
