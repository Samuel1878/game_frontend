<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Dialog } from "./ui/dialog";
import DialogContent from "./ui/dialog/DialogContent.vue";
import { Button } from "./ui/button";

const props = defineProps<{
  open: boolean;
  title: string;
  description: string;
  data?: string;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const { t } = useI18n();
</script>

<template>
  <Dialog
    :open="props.open"
    @update:open="emit('update:open', $event)"
  >
    <DialogContent
      class="bg-gray-900 info-bg border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] text-white rounded-2xl p-6"
    >
      <h2 class="text-xl font-bold mb-4">
        {{ t(props.title) }}
      </h2>

      <p class="mb-4">
        {{ t(props.description) }}
      </p>

      <div
        v-if="props.data"
        class="bg-white/10 p-4 rounded mb-4 border border-white/10"
      >
        <p class="font-mono text-sm break-all">
          {{ props.data }}
        </p>
      </div>

      <div class="flex justify-end">
        <Button @click="emit('update:open', false)" class="bg-yellow-400 hover:bg-amber-500 text-black">
           
          {{ t("fund_pin_alert_button") }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>