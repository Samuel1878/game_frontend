<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CheckCheck } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import NotificationList from "./NotificationList.vue";
import {
  TRANSACTION_REWARD_NOTIFICATION_TYPES,
  useNotificationStore,
  type NotificationFetchParams,
} from "@/stores/notification";

type NotificationFilter = "all" | "unread" | "announcements" | "transactions";

const notificationStore = useNotificationStore();
const { t } = useI18n();
const activeFilter = ref<NotificationFilter>("all");

const filters: Array<{ key: NotificationFilter; label: string }> = [
  { key: "all", label: "notifications.all" },
  { key: "unread", label: "notifications.unreadOnly" },
  { key: "announcements", label: "notifications.announcements" },
  { key: "transactions", label: "notifications.transactionsRewards" },
];

const paramsFor = (filter: NotificationFilter): NotificationFetchParams => {
  if (filter === "unread") return { is_read: false };
  if (filter === "announcements") return { type: "ANNOUNCEMENT" };
  if (filter === "transactions") {
    return { types: [...TRANSACTION_REWARD_NOTIFICATION_TYPES] };
  }
  return {};
};

const selectFilter = (filter: NotificationFilter) => {
  if (filter === activeFilter.value && notificationStore.hasLoaded) return;
  activeFilter.value = filter;
  void notificationStore.fetchNotifications(paramsFor(filter));
};

const unreadLabel = computed(
  () => `${notificationStore.unreadCount} ${t("notifications.unread")}`,
);

const markAllAsRead = async () => {
  const success = await notificationStore.markAllAsRead();
  if (!success) toast.error(t("notifications.toast.markReadFailed"));
};

onMounted(() => {
  void notificationStore.fetchNotifications(paramsFor(activeFilter.value));
});
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col text-white">
    <header class="flex shrink-0 items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
      <div>
        <h2 class="text-lg font-black tracking-tight text-white">
          {{ t("notifications.title") }}
        </h2>
        <p class="mt-0.5 text-xs text-gray-400">{{ unreadLabel }}</p>
      </div>
      <button
        type="button"
        class="flex shrink-0 items-center gap-1.5 rounded-lg border border-yellow-400/30 px-2.5 py-2 text-xs font-bold text-yellow-300 transition hover:bg-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-45"
        :disabled="!notificationStore.unreadCount"
        @click="markAllAsRead"
      >
        <CheckCheck class="h-4 w-4" />
        {{ t("notifications.markAllRead") }}
      </button>
    </header>

    <div class="scrollbar-none shrink-0 overflow-x-auto px-4 pb-3 sm:px-5">
      <div class="flex min-w-max gap-2">
        <button
          v-for="filter in filters"
          :key="filter.key"
          type="button"
          class="rounded-full border px-3 py-1.5 text-xs font-bold transition"
          :class="
            activeFilter === filter.key
              ? 'border-yellow-300 bg-yellow-400 text-gray-950 shadow-[0_0_16px_rgba(250,204,21,0.22)]'
              : 'border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08]'
          "
          @click="selectFilter(filter.key)"
        >
          {{ t(filter.label) }}
        </button>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-5 sm:px-5">
      <NotificationList :empty-state="activeFilter" />
    </div>
  </section>
</template>
