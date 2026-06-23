<script setup lang="ts">
import { computed } from "vue";
import { Bell } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const { t } = useI18n();
const router = useRouter();

const badgeLabel = computed(() =>
  notificationStore.unreadCount > 99 ? "99+" : String(notificationStore.unreadCount),
);

const openNotifications = () => router.push({ name: "notifications" });
</script>

<template>
  <div v-if="authStore.isLoggedIn">
    <button
      type="button"
      class="relative flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
      :aria-label="t('notifications.title')"
      @click="openNotifications"
    >
      <Bell class="h-5 w-5" />
      <span
        v-if="notificationStore.unreadCount"
        class="absolute -right-1 -top-1 flex min-w-4 h-4 items-center justify-center rounded-full border border-gray-900 bg-yellow-400 px-1 text-[9px] font-black leading-none text-gray-950"
      >
        {{ badgeLabel }}
      </span>
    </button>
  </div>
</template>
