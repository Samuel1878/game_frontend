<!-- FundPinDrawer.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, Delete, X } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { formatPrice } from "@/utils";
const props = defineProps<{
  open: boolean;
  loading?: boolean;
  title?: string;
  description?: string;
  amount?: number;
  isNewPin?: boolean;
    buttonText?:string;
}>();
const emit = defineEmits(["update:open", "confirm"]);
const fundPin = ref("");
watch(
  () => props.open,
  (value) => {
    if (!value) {
      fundPin.value = "";
    }
  },
);

const { t } = useI18n();
const keypad = [
  "1","2","3",
  "4","5","6",
  "7","8","9",
  "cancel","0","delete"
];
const pressKey = (key: string) => {
  switch (key) {
    case "delete":
      fundPin.value = fundPin.value.slice(0, -1);
      return;
    case "cancel":
      fundPin.value = "";
      emit("update:open", false);
      return;
    default:
      if (!/^\d$/.test(key)) return;
      if (fundPin.value.length >= 6) return;
      fundPin.value += key;
  }
};
const submit = () => {
  if (fundPin.value.length !== 6) return;
  emit("confirm", fundPin.value);
};
</script>
<template>
  <Drawer :open="open" @update:open="emit('update:open', $event)">
    <DrawerContent class="rounded-t-4xl bg-gray-800">
      <div class="mx-auto w-full max-w-md bg-gray-800">
        <DrawerHeader>
          <DrawerTitle
            class="flex items-center justify-center gap-2 text-yellow-400 text-center"
          >
            <ShieldCheck class="w-5 h-5 text-yellow-400" />
            {{ title || t("confirm_withdraw")}}
          </DrawerTitle>
          <DrawerDescription class="text-center text-sm text-gray-400">
            {{ description || t("enter_your_fund_pin") }}
          </DrawerDescription>
        </DrawerHeader> 
        <div class="p-4 space-y-6">
          <!-- SUMMARY -->
          <div class="rounded-2xl bg-gray-700/50 shadow-inner p-4 space-y-2">
            <div class="flex items-center justify-between text-sm">

            </div>

            <div class="flex items-center justify-between text-sm" v-if="amount !== undefined">
              <span class="text-gray-400">
                {{ t("amount") }}
              </span>

              <span class="font-bold text-yellow-400">
                {{ formatPrice(amount) }}
              </span>
            </div>
          </div>

          <!-- PIN DISPLAY -->
          <div class="flex items-center justify-center gap-3">
            <div
              v-for="(_, index) in 6"
              :key="index"
              class="w-1/6 h-14 text-white rounded-2xl border shadow-inner border-gray-500 bg-gray-700/50 flex items-center justify-center text-2xl font-bold"
            >
              {{ fundPin[index] ? "•" : "" }}
            </div>
          </div>

          <!-- NUMBER PAD -->
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="key in keypad"
              :key="key"
              :disabled="!key"
              class="h-16 shadow-inner border border-gray-500 text-white rounded-2xl bg-gray-700/50 hover:bg-gray-600 active:scale-95 transition-all text-xl font-semibold flex items-center justify-center disabled:opacity-0"
              @click="pressKey(key)"
            >
              <Delete v-if="key === 'delete'" class="w-6 h-6" />
                <X v-else-if="key === 'cancel'" class="w-6 h-6" />
              <span v-else>
                {{ key }}
              </span>
            </button>
          </div>
        </div>

        <DrawerFooter class="pb-8">
         
          <Button
            :disabled="loading || fundPin.length !== 6"
            class="h-12 rounded-xl w-full gold-bg font-bold text-black active-button flex items-center justify-center"
            @click="submit"
          >
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />

            {{ t(buttonText || "confirm") }}
          </Button>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
<style>
    [data-vaul-drawer-direction="bottom"] > div:first-child {
  background: linear-gradient(
    90deg,
    #f59e0b,
    #facc15
  );
}
</style>
