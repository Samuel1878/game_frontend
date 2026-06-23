<script setup lang="ts">
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import NotificationPanel from "./NotificationPanel.vue";

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();
</script>

<template>
  <Drawer :open="open" @update:open="emit('update:open', $event)">
    <DrawerContent
      class="flex max-h-[88dvh] min-h-[52dvh] flex-col rounded-t-4xl border-t border-yellow-400/20 bg-gray-950 text-white shadow-[0_-18px_60px_rgba(0,0,0,0.72)]"
    >
      <NotificationPanel />
    </DrawerContent>
  </Drawer>
</template>
