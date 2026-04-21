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
import { EyeIcon, EyeOff, LockIcon, PhoneIcon, Share2Icon, User, X } from "lucide-vue-next";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
const auth = useAuthStore();
const ui = useUIStore();
const router = useRouter();
const checked = ref(true);
const loadingButton = ref(false);
const { authModalOpen, redirectAfterAuth } = storeToRefs(ui);
const isLogin = ref(true);
const referral_code = ref(localStorage.getItem("referral_code")||"")
const errorMessage = ref("");
const regex = /^[A-Za-z0-9_]{6,40}$/;
const referral_regex = /^[A-Z][0-9]{3}$/;
const form = ref({
  username: "",
  phone:"",
  password: "",
  conPassword: "",
});
const loginName = ref("");
const { t } = useI18n();
const showPassword = ref(false);
onMounted(() => {
  if (auth.accessToken) {
    ui.closeAuthModal();
  }
}); 
const isValid = computed(() => {
    if (!regex.test(form.value.username)) return false;
  if (!form.value.username || !form.value.password) return false;
  if (!isLogin.value && form.value.password !== form.value.conPassword) return false;
  if (!checked.value) return false;
  return true;
});
const submit = async () => {
  errorMessage.value = "";
  if (!isValid.value) {
    errorMessage.value = "Please fill all fields correctly";
    return;
  }
  loadingButton.value = true;
  try {
    let response;

    if (isLogin.value) {
      
      response = await auth.login({
        name: loginName.value,
        password: form.value.password,
        isPhoneNumber: loginName.value.startsWith("09")?true:false
      });
    } else {
      
      response = await auth.register({
        name: form.value.username,
        phone:form.value.phone,
        password: form.value.password,
        referral_code:referral_regex.test(referral_code.value) ? referral_code.value : null
      });
    }

    console.log(response);
    if (response?.status === 200) {
      toast.success(response.message);
      ui.closeAuthModal();
      if (redirectAfterAuth.value) {
        router.push(redirectAfterAuth.value);
      }
    } else {
      errorMessage.value =
        response?.message || "Invalid username or password";
    }

  } catch (err: any) {
    errorMessage.value =
      err?.message || "Something went wrong";
  } finally {
    loadingButton.value = false;
  }
};

</script>

<template>
  <Dialog v-model:open="authModalOpen">
    <DialogContent :dismissible="false" @interact-outside.prevent :show-close-button="false" class="bg-gray-900 
        bg-linear-to-br from-white/5 via-white/10 to-white/5
        backdrop-blur-2xl border border-white/10
        shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-gray-100 rounded-2xl">
      <DialogHeader>
        <DialogTitle class="text-gray-100 my-4 font-bold">
          {{ isLogin ? t("login") : t("register") }}
        </DialogTitle>
        <button class="absolute right-5 top-5 cursor-pointer" @click="ui.closeAuthModal()">
          <X />
        </button>
      </DialogHeader>
      <form class="space-y-4 "
        @submit.prevent="submit">
        <InputGroup v-if="isLogin" class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="loginName" type="text" :placeholder="t('name_phone')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup v-else class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.username" type="text" :placeholder="t('name')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50"
          v-show="!isLogin">
          <InputGroupAddon>
            <PhoneIcon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.phone" type="text" :placeholder="t('phone_number')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>


        <InputGroup class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">
          <InputGroupAddon>
            <LockIcon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.password" :type="showPassword ? 'text' : 'password'"
            :placeholder="t('password')" />
          <InputGroupAddon align="inline-end">
            <button type="button" @click="showPassword = !showPassword">
              <EyeOff v-if="showPassword"/> 
              <EyeIcon v-else/> 
            </button>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup v-show="!isLogin"
          class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">
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
          class="h-12 rounded-lg w-full font-medium border border-gray-700 ring-sky-400 ring-0 bg-gray-700/50">
          <InputGroupAddon>
            <Share2Icon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="referral_code"
            :placeholder="t('referral_id')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <div class=" mt-18">
          <div class="h-8">
            <p v-if="errorMessage" class="text-red-500 text-sm px-1">
              {{ errorMessage }}
            </p>
          </div>
          <div class="flex items-center text-xs text-gray-400 gap-2 mb-2 px-1">
            <Checkbox class="text-sm" id="terms" :model-value="checked" v-on:update:model-value="checked = !checked" />
            <Label for="terms">{{ t("accept_terms") }}</Label>

          </div>
          <Button :disabled="!isValid || loadingButton" class="w-full h-12 rounded-lg flex items-center justify-center gap-2
         bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <Spinner v-if="loadingButton" />
            <span>
              {{ isLogin ? t("login") : t("register") }}
            </span>
          </Button>
        </div>
      </form>
      <div class="text-center text-sm text-gray-400">
        {{ isLogin ? t("do_not_have") : t("already_have_one") }}
        <button class="ml-1 text-sky-600 font-bold cursor-pointer underline" @click="isLogin = !isLogin">
          {{ isLogin ? t("register") : t("login") }}
        </button>
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
</style>