<script setup lang="ts">
import type { Component } from "vue";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BellRing,
  Coins,
  Gift,
  Megaphone,
  RefreshCw,
  Trophy,
} from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { toast } from "vue-sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { toNotificationLanguage, type UserNotificationItem, type UserNotificationType } from "@/services/notifications";
import { useNotificationStore } from "@/stores/notification";

type EmptyState = "all" | "unread" | "announcements" | "transactions";

const props = withDefaults(
  defineProps<{
    emptyState?: EmptyState;
  }>(),
  { emptyState: "all" },
);

const { t, locale } = useI18n();
const notificationStore = useNotificationStore();

const icons: Record<UserNotificationType, Component> = {
  ANNOUNCEMENT: Megaphone,
  DEPOSIT_APPROVED: ArrowDownToLine,
  WITHDRAWAL_PAID: ArrowUpFromLine,
  REBATE_RECEIVED: RefreshCw,
  BONUS_RECEIVED: Gift,
  DIVIDEND_RECEIVED: Coins,
  LEVEL_UP: Trophy,
};

const accentClasses: Record<UserNotificationType, string> = {
  ANNOUNCEMENT: "bg-sky-400/10 text-sky-300 border-sky-300/20",
  DEPOSIT_APPROVED: "bg-emerald-400/10 text-emerald-300 border-emerald-300/20",
  WITHDRAWAL_PAID: "bg-amber-400/10 text-amber-300 border-amber-300/20",
  REBATE_RECEIVED: "bg-cyan-400/10 text-cyan-300 border-cyan-300/20",
  BONUS_RECEIVED: "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-300/20",
  DIVIDEND_RECEIVED: "bg-violet-400/10 text-violet-300 border-violet-300/20",
  LEVEL_UP: "bg-yellow-400/10 text-yellow-300 border-yellow-300/20",
};

const iconFor = (type: UserNotificationType) => icons[type];
const accentFor = (type: UserNotificationType) => accentClasses[type];

const translatedText = (
  translations: UserNotificationItem["title_i18n"],
  fallback: string,
) => {
  const lang = toNotificationLanguage(String(locale.value));
  return translations?.[lang] || translations?.en || fallback;
};

const titleFor = (notification: UserNotificationItem) =>
  translatedText(notification.title_i18n, notification.title);

const messageFor = (notification: UserNotificationItem) =>
  translatedText(notification.message_i18n, notification.message);

const formattedDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const displayLocale =
    locale.value === "cn" ? "zh-CN" : locale.value === "mm" ? "my-MM" : "en";

  return new Intl.DateTimeFormat(displayLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const emptyCopy = () => {
  if (props.emptyState === "unread") {
    return {
      title: t("notifications.emptyUnread.title"),
      description: t("notifications.emptyUnread.description"),
    };
  }

  if (props.emptyState === "announcements") {
    return {
      title: t("notifications.emptyAnnouncements.title"),
      description: t("notifications.emptyAnnouncements.description"),
    };
  }

  return {
    title: t("notifications.empty.title"),
    description: t("notifications.empty.description"),
  };
};

const markAsRead = async (notification: UserNotificationItem) => {
  if (notification.is_read) return;
  const success = await notificationStore.markAsRead(notification.id);
  if (!success) toast.error(t("notifications.toast.markReadFailed"));
};

const retry = () => {
  if (notificationStore.items.length) {
    void notificationStore.loadMore();
    return;
  }
  void notificationStore.fetchNotifications({
    ...notificationStore.activeFilters,
    limit: notificationStore.pagination.limit,
  });
};
</script>

<template>
  <div class="min-h-0 space-y-3">
    <div v-if="notificationStore.loading && !notificationStore.items.length" class="space-y-3">
      <div
        v-for="index in 5"
        :key="index"
        class="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
      >
        <div class="flex gap-3">
          <Skeleton class="h-10 w-10 shrink-0 rounded-xl" />
          <div class="flex-1 space-y-2">
            <Skeleton class="h-4 w-2/5" />
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-3/5" />
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="notificationStore.error && !notificationStore.items.length"
      class="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/[0.03] px-6 text-center"
    >
      <BellRing class="mb-3 h-9 w-9 text-red-300" />
      <p class="text-sm font-semibold text-white">{{ notificationStore.error }}</p>
      <button
        type="button"
        class="mt-4 rounded-lg border border-yellow-400/50 px-4 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400/10"
        @click="retry"
      >
        {{ t("notifications.retry") }}
      </button>
    </div>

    <div
      v-else-if="!notificationStore.items.length"
      class="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center"
    >
      <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10">
        <BellRing class="h-7 w-7 text-yellow-300" />
      </div>
      <p class="text-base font-semibold text-white">{{ emptyCopy().title }}</p>
      <p class="mt-1 max-w-xs text-sm leading-6 text-gray-400">{{ emptyCopy().description }}</p>
    </div>

    <template v-else>
      <button
        v-for="notification in notificationStore.items"
        :key="notification.id"
        type="button"
        class="relative w-full rounded-2xl border p-4 text-left transition active:scale-[0.99]"
        :class="[
          notification.is_read
            ? 'border-white/5 bg-white/[0.025] hover:bg-white/[0.05]'
            : 'border-yellow-400/25 bg-yellow-400/[0.055] shadow-[0_0_24px_rgba(234,179,8,0.06)] hover:bg-yellow-400/[0.08]',
        ]"
        @click="markAsRead(notification)"
      >
        <span
          v-if="!notification.is_read"
          class="absolute right-3 top-3 h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_9px_rgba(253,224,71,0.9)]"
          :aria-label="t('notifications.unread')"
        />
        <div class="flex items-start gap-3">
          <div
            class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
            :class="accentFor(notification.type)"
          >
            <component :is="iconFor(notification.type)" class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex min-w-0 items-start justify-between gap-3 pr-3">
              <p class="min-w-0 break-words text-sm font-bold leading-5 text-white">
                {{ titleFor(notification) }}
              </p>
              <span
                class="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                :class="accentFor(notification.type)"
              >
                {{ t(`notifications.type.${notification.type}`) }}
              </span>
            </div>
            <p class="mt-1.5 whitespace-pre-wrap break-words text-sm leading-5 text-gray-300">
              {{ messageFor(notification) }}
            </p>
            <p class="mt-3 text-[11px] text-gray-500">
              {{ formattedDate(notification.published_at || notification.created_at) }}
            </p>
          </div>
        </div>
      </button>

      <div v-if="notificationStore.error" class="rounded-xl border border-red-400/20 bg-red-400/[0.03] p-3 text-center">
        <p class="text-xs text-red-200">{{ notificationStore.error }}</p>
        <button type="button" class="mt-2 text-xs font-semibold text-yellow-300" @click="retry">
          {{ t("notifications.retry") }}
        </button>
      </div>

      <button
        v-if="notificationStore.hasMore"
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-yellow-300 transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="notificationStore.loadingMore"
        @click="notificationStore.loadMore()"
      >
        <RefreshCw v-if="notificationStore.loadingMore" class="h-4 w-4 animate-spin" />
        {{ notificationStore.loadingMore ? t("loading") : t("notifications.loadMore") }}
      </button>
    </template>
  </div>
</template>
