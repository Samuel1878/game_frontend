import { defineStore } from "pinia";
import { i18n } from "@/lib/i18n";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  toNotificationLanguage,
  type NotificationLanguage,
  type NotificationListParams,
  type NotificationListResponse,
  type NotificationPagination,
  type UserNotificationItem,
  type UserNotificationType,
} from "@/services/notifications";
import { getApiErrorMessage } from "@/services/api";
import { useAuthStore } from "./auth";

const DEFAULT_LIMIT = 20;
const MAX_BACKEND_LIMIT = 100;

export const TRANSACTION_REWARD_NOTIFICATION_TYPES: UserNotificationType[] = [
  "DEPOSIT_APPROVED",
  "WITHDRAWAL_PAID",
  "REBATE_RECEIVED",
  "BONUS_RECEIVED",
  "DIVIDEND_RECEIVED",
  "LEVEL_UP",
];

export type NotificationFetchParams = Omit<
  NotificationListParams,
  "page" | "limit" | "lang" | "type"
> & {
  page?: number;
  limit?: number;
  type?: UserNotificationType;
  types?: UserNotificationType[];
};

type ActiveNotificationFilters = Omit<
  NotificationFetchParams,
  "page" | "limit"
>;

const emptyPagination = (): NotificationPagination => ({
  page: 1,
  limit: DEFAULT_LIMIT,
  total: 0,
  total_pages: 0,
});

const notificationTimestamp = (notification: UserNotificationItem) =>
  Date.parse(notification.published_at ?? notification.created_at) || 0;

const sortNotifications = (items: UserNotificationItem[]) =>
  [...items].sort((left, right) => {
    const timeDifference = notificationTimestamp(right) - notificationTimestamp(left);
    if (timeDifference) return timeDifference;
    return right.id.localeCompare(left.id);
  });

const dedupeNotifications = (items: UserNotificationItem[]) => {
  const byId = new Map<string, UserNotificationItem>();
  items.forEach((item) => byId.set(item.id, item));
  return [...byId.values()];
};

const currentLanguage = (): NotificationLanguage =>
  toNotificationLanguage(String(i18n.global.locale.value));

const getNotificationsByTypes = async ({
  page,
  limit,
  types,
  isRead,
  lang,
}: {
  page: number;
  limit: number;
  types: UserNotificationType[];
  isRead?: boolean;
  lang: NotificationLanguage;
}): Promise<NotificationListResponse> => {
  const targetItemCount = page * limit;
  const requestLimit = Math.min(MAX_BACKEND_LIMIT, targetItemCount);

  const byType = await Promise.all(
    types.map(async (type) => {
      const items: UserNotificationItem[] = [];
      let total = 0;
      let sourcePage = 1;
      let totalPages = 0;

      while (items.length < targetItemCount) {
        const response = await getNotifications({
          page: sourcePage,
          limit: requestLimit,
          type,
          ...(isRead !== undefined ? { is_read: isRead } : {}),
          lang,
        });

        items.push(...response.items);
        total = response.pagination.total;
        totalPages = response.pagination.total_pages;

        if (sourcePage >= totalPages || !response.items.length) break;
        sourcePage += 1;
      }

      return { items, total };
    }),
  );

  const allItems = sortNotifications(
    dedupeNotifications(byType.flatMap((response) => response.items)),
  );
  const total = byType.reduce((sum, response) => sum + response.total, 0);
  const offset = (page - 1) * limit;

  return {
    items: allItems.slice(offset, offset + limit),
    pagination: {
      page,
      limit,
      total,
      total_pages: total ? Math.ceil(total / limit) : 0,
    },
  };
};

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    items: [] as UserNotificationItem[],
    unreadCount: 0,
    pagination: emptyPagination(),
    loading: false,
    loadingMore: false,
    error: null as string | null,
    activeFilters: {} as ActiveNotificationFilters,
    hasLoaded: false,
    requestVersion: 0,
  }),
  getters: {
    hasMore: (state) =>
      state.pagination.page < state.pagination.total_pages,
  },
  actions: {
    async fetchNotifications(params: NotificationFetchParams = {}) {
      const auth = useAuthStore();
      if (!auth.isLoggedIn) {
        this.reset();
        return false;
      }

      const { page: _page, limit: _limit, ...filters } = params;
      this.activeFilters = filters;

      return this.requestNotifications(
        {
          page: params.page ?? 1,
          limit: params.limit ?? DEFAULT_LIMIT,
          ...filters,
        },
        false,
      );
    },
    async loadMore() {
      if (!this.hasLoaded || this.loading || this.loadingMore || !this.hasMore) {
        return false;
      }

      return this.requestNotifications(
        {
          ...this.activeFilters,
          page: this.pagination.page + 1,
          limit: this.pagination.limit,
        },
        true,
      );
    },
    async requestNotifications(
      params: Required<Pick<NotificationFetchParams, "page" | "limit">> &
        ActiveNotificationFilters,
      append: boolean,
    ) {
      const auth = useAuthStore();
      if (!auth.isLoggedIn) {
        this.reset();
        return false;
      }

      const requestVersion = ++this.requestVersion;
      const page = Math.max(1, params.page);
      const limit = Math.min(MAX_BACKEND_LIMIT, Math.max(1, params.limit));
      const lang = currentLanguage();

      if (append) {
        this.loadingMore = true;
      } else {
        this.loading = true;
      }
      this.error = null;

      try {
        const response = params.types?.length
          ? await getNotificationsByTypes({
              page,
              limit,
              types: params.types,
              ...(params.is_read !== undefined ? { isRead: params.is_read } : {}),
              lang,
            })
          : await getNotifications({
              page,
              limit,
              ...(params.type ? { type: params.type } : {}),
              ...(params.is_read !== undefined ? { is_read: params.is_read } : {}),
              lang,
            });

        if (requestVersion !== this.requestVersion) return false;

        this.items = append
          ? dedupeNotifications([...this.items, ...response.items])
          : response.items;
        this.pagination = response.pagination;
        this.hasLoaded = true;
        return true;
      } catch (error) {
        if (requestVersion === this.requestVersion) {
          this.error = getApiErrorMessage(error);
        }
        return false;
      } finally {
        if (requestVersion === this.requestVersion) {
          this.loading = false;
          this.loadingMore = false;
        }
      }
    },
    async fetchUnreadCount() {
      const auth = useAuthStore();
      if (!auth.isLoggedIn) {
        this.unreadCount = 0;
        return false;
      }

      try {
        const { unread_count } = await getUnreadNotificationCount();
        this.unreadCount = Math.max(0, unread_count);
        return true;
      } catch {
        return false;
      }
    },
    async markAsRead(notificationId: string) {
      const notification = this.items.find((item) => item.id === notificationId);
      if (!notification || notification.is_read) return true;

      const previousReadAt = notification.read_at;
      const previousUnreadCount = this.unreadCount;
      notification.is_read = true;
      notification.read_at = new Date().toISOString();
      this.unreadCount = Math.max(0, this.unreadCount - 1);

      try {
        const response = await markNotificationRead(notificationId);
        const current = this.items.find((item) => item.id === notificationId);
        if (current) {
          current.is_read = response.notification.is_read;
          current.read_at = response.notification.read_at;
        }
        return true;
      } catch {
        const current = this.items.find((item) => item.id === notificationId);
        if (current) {
          current.is_read = false;
          current.read_at = previousReadAt;
        }
        this.unreadCount = previousUnreadCount;
        return false;
      }
    },
    async markAllAsRead() {
      if (!this.unreadCount) return true;

      const previousItems = this.items.map((item) => ({ ...item }));
      const previousUnreadCount = this.unreadCount;
      const readAt = new Date().toISOString();
      this.items = this.items.map((item) => ({
        ...item,
        is_read: true,
        read_at: item.read_at ?? readAt,
      }));
      this.unreadCount = 0;

      try {
        await markAllNotificationsRead();
        return true;
      } catch {
        this.items = previousItems;
        this.unreadCount = previousUnreadCount;
        return false;
      }
    },
    async refreshForCurrentLanguage() {
      if (!this.hasLoaded) return false;
      return this.fetchNotifications({
        ...this.activeFilters,
        limit: this.pagination.limit,
      });
    },
    reset() {
      this.requestVersion += 1;
      this.items = [];
      this.unreadCount = 0;
      this.pagination = emptyPagination();
      this.loading = false;
      this.loadingMore = false;
      this.error = null;
      this.activeFilters = {};
      this.hasLoaded = false;
    },
  },
});
