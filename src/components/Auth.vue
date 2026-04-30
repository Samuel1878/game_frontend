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
import { computed, onMounted, ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,

} from '@/components/ui/input-group'
import { useReferralStore } from "@/stores/referralStore";
import { EyeIcon, EyeOff, LockIcon, PhoneIcon, Share2Icon, User, X } from "lucide-vue-next";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import DialogDescription from "./ui/dialog/DialogDescription.vue";
const auth = useAuthStore();
const ui = useUIStore();
const router = useRouter();
const checked = ref(true);
const loadingButton = ref(false);
const { authModalOpen, redirectAfterAuth} = storeToRefs(ui);
const isLogin = ref(true);
const errorMessage = ref("");
const regex = /^[A-Za-z0-9_]{6,40}$/;
const referral_regex = /^[A-Z][0-9]{3}$/;
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
const { referralCode } = storeToRefs(referralStore);
const validReferral = referral_regex.test(referralCode.value)
  ? referralCode.value
  : null;
onMounted(() => {
  if (auth.accessToken) {
    ui.closeAuthModal();
  }
});
const validateForm = () => {
  // LOGIN
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

  // REGISTER
  if (!form.value.username) return "required_username";

  if (!regex.test(form.value.username)) {
    return "invalid_username_format";
  }

  if (!form.value.phone) return "required_phone";

  if (!/^09\d{7,13}$/.test(form.value.phone)) {
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

  // if (
  //   referralCode.value &&
  //   !referral_regex.test(referralCode.value)
  // ) {
  //   return "invalid_referral_code";
  // }

  return null;
};
const submit = async () => {
  errorMessage.value = "";
  console.log(referralCode.value)
  const validationError = validateForm();

  if (validationError) {
    errorMessage.value = validationError;

    // ✅ translated log
    console.warn("[VALIDATION ERROR]:", {
      key: validationError,
      message: t(validationError),
      form: {
        loginName: loginName.value,
        username: form.value.username,
        phone: form.value.phone,
      },
    });

    // optional UI feedback
    toast.error(t(validationError));

    return;
  }

  loadingButton.value = true;

  try {
    let response;

    if (isLogin.value) {
      response = await auth.login({
        name: loginName.value,
        password: form.value.password,
        isPhoneNumber: loginName.value.startsWith("09"),
      });
    } else {
      response = await auth.register({
        name: form.value.username,
        phone: form.value.phone,
        password: form.value.password,
        referral_code: validReferral,
      });
    }

    console.log("[AUTH RESPONSE]:", response);

    if (response?.status === 200) {
      toast.success(t(response.message));
      ui.closeAuthModal();

      if (redirectAfterAuth.value) {
        router.push(redirectAfterAuth.value);
      }
    } else {
      errorMessage.value =
        response?.message || "invalid_username_password";

      console.warn("[AUTH FAILED]:", {
        message: t(errorMessage.value),
        raw: response,
      });
    }
  } catch (err: any) {
    errorMessage.value = err?.message || "something_went_wrong";

    console.error("[AUTH ERROR]:", {
      message: t(errorMessage.value),
      error: err,
    });
  } finally {
    loadingButton.value = false;
  }
};

</script>

<template>
  <Dialog v-model:open="authModalOpen">
    <DialogContent :dismissible="false" @interact-outside.prevent :show-close-button="false" class="bg-gray-900 
        bg-linear-to-br from-white/15 via-white/10 to-white/10
        backdrop-blur-2xl border-2 border-gray-700/60 
        shadow-[0_10px_40px_rgba(0,0,0,2)] text-gray-100 rounded-2xl p-0.5 pb-4 w-full">

      <DialogHeader class="relative mb-2 rounded-t-2xl border border-gray-600/10 p-4 overflow-hidden
         bg-linear-to-br from-gray-900 via-gray-800 to-black shadow-[0_5px_40px_rgba(0,0,0,1)]
         ">

        <div class="glass absolute inset-0"></div>

        <div class="shine absolute inset-0"></div>
        <div class="absolute inset-0 bg-black/10 rounded-lg"></div>
        <div class="flex gap-4 items-center">
          <div class="animate-pulse relative p-0.5 rounded-2xl bg-linear-to-br from-yellow-400/60 via-yellow-200/70 to-yellow-500/70
            shadow-[0_0_15px_rgba(255,215,0,.4)]">
            <div class="bg-black/70 rounded-2xl p-1">
              <img src="/favicon.png" class="w-20 h-20" />
            </div>
          </div>

          <div class="h-full gap-2 flex flex-col justify-center">
            <DialogTitle class="text-linear-gold font-bold text-start text-2xl tracking-wide">
              {{ isLogin ? t("login") : t("register") }}
            </DialogTitle>

            <DialogDescription class="text-start text-gray-400 text-sm">
              {{ isLogin ? t("login_to_your_account") : t("register_new_account") }}
            </DialogDescription>
          </div>

        </div>

        <button class="absolute right-5 top-5 cursor-pointer" @click="ui.closeAuthModal()">
          <X />
        </button>
      </DialogHeader>
      <form :class="{ 'error-shake': errorMessage }" @submit.prevent="submit" class="space-y-4 px-4">

        <InputGroup v-if="isLogin"
          class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-amber-400 ring-0 glass-bg">
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="loginName" type="text" :placeholder="t('name_phone')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup v-else
          class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-amber-400 ring-0 glass-bg">
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.username" type="text" :placeholder="t('name')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-amber-400 ring-0 glass-bg"
          v-show="!isLogin">
          <InputGroupAddon>
            <PhoneIcon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.phone" type="text" :placeholder="t('phone_number')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>


        <InputGroup class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-yellow-400 ring-0 glass-bg">
          <InputGroupAddon>
            <LockIcon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.password" :type="showPassword ? 'text' : 'password'"
            :placeholder="t('password')" />
          <InputGroupAddon align="inline-end">
            <button type="button" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword" />
              <EyeIcon v-else />
            </button>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup v-show="!isLogin"
          class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-yellow-400 ring-0 glass-bg">
          <InputGroupAddon>
            <LockIcon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.conPassword" :type="showPassword ? 'text' : 'password'"
            :placeholder="t('confirm_password')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup v-show="!isLogin"
          class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-sky-400 ring-0 glass-bg">
          <InputGroupAddon>
            <Share2Icon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="referralCode"  :placeholder="t('referral_placeholder')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <div class=" mt-8">
          <div class="h-8">
            <p v-if="errorMessage" class="text-red-500 text-sm px-1">
              {{ t(errorMessage) }}
            </p>
          </div>
          <div class="flex items-center text-xs text-gray-400 gap-2 mb-2 px-1">
            <Checkbox class="text-sm" id="terms" :model-value="checked" v-on:update:model-value="checked = !checked" />
            <Label for="terms" class="text-gray-400 underline">{{ t("accept_terms") }}</Label>

          </div>
          <Button :disabled="loadingButton" class="w-full h-12 rounded-lg flex items-center justify-center gap-2
         gold-bg active-button disabled:opacity-50 disabled:cursor-not-allowed">
            <Spinner v-if="loadingButton" />
            <span class="text-glow">
              {{ isLogin ? t("login") : t("register") }}
            </span>
          </Button>
        </div>
      </form>
      <div class="w-full px-4">
        <div class="text-center text-sm text-gray-400 border-t pt-2 border-gray-600">
{{ isLogin ? t("do_not_have") : t("already_have_one") }}
        <button class="ml-1 text-yellow-400 text-shadow-2xs font-bold cursor-pointer underline"
          @click="isLogin = !isLogin">
          {{ isLogin ? t("register") : t("login") }}
        </button>
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