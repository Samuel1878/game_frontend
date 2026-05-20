<script setup lang="ts">
import { ref, watch } from "vue";
import type { BankAccountPros } from "@/utils/types";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";



import InputGroup from "@/components/ui/input-group/InputGroup.vue";
import InputGroupAddon from "@/components/ui/input-group/InputGroupAddon.vue";
import InputGroupInput from "@/components/ui/input-group/InputGroupInput.vue";

import Button from "@/components/ui/button/Button.vue";

import { CreditCard, UserLockIcon } from "lucide-vue-next";
import { paymentMethod, type paymentTypes } from "@/consts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/* ---------------- props ---------------- */
const props = defineProps<{
  open: boolean;
  modelValue: BankAccountPros;
  isEdit?: boolean;
}>();

/* ---------------- emits ---------------- */
const emit = defineEmits([
  "update:open",
  "update:modelValue",
  "save",
]);

/* ---------------- local state ---------------- */
const form = ref({ ...props.modelValue });
watch(form, (val) => {
  emit("update:modelValue", val);
}, { deep: true });

const choosePayment = (data:paymentTypes) => {
    form.value.value = data.value;
    form.value.label = data.label
}

const handleSave = () => {
  emit("save", form.value);
};
</script>

<template>
  <Drawer :open="open" @update:open="(v) => emit('update:open', v)">
    <DrawerContent
      class="bg-gray-900
      bg-linear-to-br from-white/5 via-white/10 to-white/5
      backdrop-blur-2xl border-t border-white/10
      shadow-[0_-10px_40px_rgba(0,0,0,0.6)]
      text-white rounded-t-4xl pb-10"
    >
      <!-- Header -->
      <DrawerHeader>
        <DrawerTitle class="text-center text-gray-100">
          {{ isEdit ? t('edit_bank_account') : t('add_bank_account') }}
        </DrawerTitle>
      </DrawerHeader>

      <!-- Body -->
      <div class="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
        <div>
            <p>{{  }}</p>
        </div>
        <div class="grid grid-cols-3 gap-2 mb-4">
            <div class="" v-for="item in paymentMethod" v-on:click="choosePayment(item)">
                <div class="flex flex-col items-center gap-2 p-2 border-2 rounded-lg" 
                    :class="form.value===item.value?'border-yellow-400 text-yellow-400 animate-pulse':'border-gray-400/30 text-white'">
                  <img :src="item.icon" class="w-8 h-8 rounded-md" />
                  <span>{{ item.label }}</span>
                </div>
            </div>
        </div>
   

        <!-- Account Name -->
        <InputGroup class="h-12 rounded-lg border border-gray-700 bg-gray-700/50">
          <InputGroupAddon>
            <UserLockIcon />
          </InputGroupAddon>
          <InputGroupInput
            v-model="form.account_name"
            :placeholder="t('account_name')"
          />
        </InputGroup>
     <!-- Account Number -->
        <InputGroup class="h-12 rounded-lg border border-gray-700 bg-gray-700/50">
          <InputGroupAddon>
            <CreditCard />
          </InputGroupAddon>
          <InputGroupInput
            v-model="form.account_number"
            :placeholder="t('account_number')"
          />
        </InputGroup>
        <!-- Status -->
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-300">
            {{ t("status") }}
          </span>

          <button
            @click="form.is_available = !form.is_available"
            class="w-12 h-6 rounded-full relative"
            :class="form.is_available ? 'bg-yellow-500' : 'bg-gray-600'"
          >
            <span
              class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition"
              :class="form.is_available ? 'translate-x-6' : ''"
            />
          </button>
        </div>
      </div>

      <!-- Footer -->
      <DrawerFooter class="p-4">
        <div class="flex gap-2">
          <button class="flex-1 h-12 border-gray-400 border rounded-lg" ant="outline" @click="emit('update:open', false)">
            {{ t("cancel") }}
          </button>
          <Button
            class="flex-1 gold-bg h-12 rounded-lg font-bold"
            @click="handleSave"
          >
            {{ t("save") }}
          </Button>
        </div>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>