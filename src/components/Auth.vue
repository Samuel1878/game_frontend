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
import { ref } from "vue";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,

} from '@/components/ui/input-group'
import { LockIcon, User, X } from "lucide-vue-next";
import { Checkbox } from "./ui/checkbox";
import { Spinner } from "./ui/spinner";
import { useI18n } from "vue-i18n";
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
const {t} = useI18n();
const submit = async () => {
  loadingButton.value = true ;
  if (isLogin.value) {
    const response = await auth.login({
      name: form.value.username,
      password: form.value.password,
    });
    loadingButton.value = false;
    console.log(response)
  } else {
    const response = await auth.register({
      name: form.value.username,
      password: form.value.password,
    });
    loadingButton.value = false
     console.log(response)
  }
  ui.closeAuthModal();
  if (redirectAfterAuth.value) {
    router.push(redirectAfterAuth.value);
  }
};
</script>

<template>
  <Dialog v-model:open="authModalOpen">
    <DialogContent :show-close-button="false" class="bg-gray-900 border-gray-800 text-gray-100 rounded-2xl">
      <DialogHeader>
        <DialogTitle class="text-gray-100 my-4 font-bold">
          {{ isLogin ? t("login") : t("register") }}
        </DialogTitle>
        <button class="absolute right-5 top-5 cursor-pointer" @click="ui.closeAuthModal()">
          <X />
        </button>
      </DialogHeader>
      <form class="space-y-4" @submit.prevent="submit">
        <InputGroup class="h-12 rounded-lg w-full font-bold border-0 ring-sky-500 ring-1 bg-gray-800">
          <InputGroupAddon>
            <User />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.username" type="text" :placeholder="t('name')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup class="h-12 rounded-lg w-full font-bold border-0 ring-sky-500 ring-1 bg-gray-800">
          <InputGroupAddon>
            <LockIcon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.password" type="text" :placeholder="t('password')" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup v-show="!isLogin" class="h-12 rounded-lg w-full font-bold border-0 ring-sky-500 ring-1 bg-gray-800">
          <InputGroupAddon>
            <LockIcon />
          </InputGroupAddon>
          <InputGroupInput class="w-full" v-model="form.conPassword" type="text" placeholder="Confirm password" />
          <InputGroupAddon align="inline-end">
            <InputGroupText class="text-gray-100"></InputGroupText>
          </InputGroupAddon>
        </InputGroup>

        
        <div class=" mt-10">
          <div class="h-8">
            <p class="text-" v-show="errorMessage!==''">{{ errorMessage }}</p>
          </div>
          <div class="flex items-center text-xs text-gray-400 gap-2 mb-2 px-1">
          <Checkbox class="text-sm" id="terms" :model-value="checked" v-on:update:model-value="checked = !checked" />
          <Label for="terms">{{ t("accept_terms") }}</Label>

        </div>
          <Button class="w-full bg-sky-600 text-gray-100 cursor-pointer flex items-center justify-center gap-2 rounded-lg h-12 hover:bg-sky-600">
            <Spinner v-show="loadingButton" class="text-gray-800"/>
            <p>
{{  isLogin ? t("login") : t("register")  }}
            </p>
            
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
