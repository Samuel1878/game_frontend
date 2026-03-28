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
import { computed, ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,

} from '@/components/ui/input-group'
import { EyeIcon, EyeOff, LockIcon, User, X } from "lucide-vue-next";
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
const errorMessage = ref("");
const form = ref({
  username: "",
  password: "",
  conPassword: "",
});
const { t } = useI18n();
const showPassword = ref(false);

const isValid = computed(() => {
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
        name: form.value.username,
        password: form.value.password,
      });
    } else {
      response = await auth.register({
        name: form.value.username,
        password: form.value.password,
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
// const submit = async () => {
//   errorMessage.value = "";

//   if (!isValid.value) {
//     errorMessage.value = "Please fill all fields correctly";
//     return;
//   }

//   loadingButton.value = true;

//   try {
//     let response;
//     if (isLogin.value) {
//       response = await auth.login({
//         name: form.value.username,
//         password: form.value.password,
//       });
//     } else {
//       response = await auth.register({
//         name: form.value.username,
//         password: form.value.password,
//       });
//     }
//     console.log(response)
//     if (response){
//       ui.closeAuthModal();
//       if (redirectAfterAuth.value) {
//         router.push(redirectAfterAuth.value);
//       }
//     }
//   } catch (err: any) {
//     errorMessage.value = err?.message || "Something went wrong";
//   } finally {
 
//     loadingButton.value = false;
//   }
// };
// const submit = async () => {
//   loadingButton.value = true ;
//   if (isLogin.value) {
//     const response = await auth.login({
//       name: form.value.username,
//       password: form.value.password,
//     });
//     loadingButton.value = false;
//     console.log(response)
//   } else {
//     const response = await auth.register({
//       name: form.value.username,
//       password: form.value.password,
//     });
//     loadingButton.value = false
//      console.log(response)
//   }
//   ui.closeAuthModal();
//   if (redirectAfterAuth.value) {
//     router.push(redirectAfterAuth.value);
//   }
// };
</script>

<template>
  <Dialog v-model:open="authModalOpen">
    <DialogContent :show-close-button="false" class="to-gray-900 from-gray-800 bg-linear-to-br border-gray-700 text-gray-100 rounded-2xl">
      <DialogHeader>
        <DialogTitle class="text-gray-100 my-4 font-bold">
          {{ isLogin ? t("login") : t("register") }}
        </DialogTitle>
        <button class="absolute right-5 top-5 cursor-pointer" @click="ui.closeAuthModal()">
          <X />
        </button>
      </DialogHeader>
      <form class="space-y-4 border border-gray-800/50 p-2 rounded-xl shadow-xs shadow-gray-600"
        @submit.prevent="submit">
        <InputGroup class="h-12 rounded-lg w-full font-bold border-0 ring-gray-700 ring-1 bg-gray-800">
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.username" type="text" :placeholder="t('name')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup class="h-12 rounded-lg w-full font-bold border-0 ring-gray-700 ring-1 bg-gray-800">
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
          class="h-12 rounded-lg w-full font-bold border-0 ring-gray-700 ring-1 bg-gray-800">
          <InputGroupAddon>
            <LockIcon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.conPassword" :type="showPassword ? 'text' : 'password'"
            :placeholder="t('confirm_password')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <div class=" mt-10">
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