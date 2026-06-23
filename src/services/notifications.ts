import api from "./api";

export type NotificationLanguage = "en" | "cn" | "mm";

export type UserNotificationType =
  | "ANNOUNCEMENT"
  | "DEPOSIT_APPROVED"
  | "WITHDRAWAL_PAID"
  | "REBATE_RECEIVED"
  | "BONUS_RECEIVED"
  | "DIVIDEND_RECEIVED"
  | "LEVEL_UP";

export type UserNotificationItem = {
  id: string;
  scope: "GLOBAL" | "USER";
  type: UserNotificationType;
  title: string;
  message: string;
  title_i18n?: Partial<Record<NotificationLanguage, string>>;
  message_i18n?: Partial<Record<NotificationLanguage, string>>;
  metadata: Record<string, unknown>;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  is_read: boolean;
  read_at: string | null;
};

export type NotificationPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type NotificationListParams = {
  page?: number;
  limit?: number;
  type?: UserNotificationType;
  is_read?: boolean;
  lang?: NotificationLanguage;
};

export type NotificationListResponse = {
  items: UserNotificationItem[];
  pagination: NotificationPagination;
};

export type MarkNotificationReadResponse = {
  notification: Pick<UserNotificationItem, "id" | "is_read" | "read_at">;
};

export type MarkAllNotificationsReadResponse = {
  marked_read_count: number;
};

export const toNotificationLanguage = (
  locale: string | null | undefined,
): NotificationLanguage => {
  const normalized = locale?.trim().toLowerCase();

  if (["cn", "zh", "zh-cn"].includes(normalized ?? "")) return "cn";
  if (["mm", "my", "my-mm"].includes(normalized ?? "")) return "mm";
  return "en";
};

export const getNotifications = async (params: NotificationListParams = {}) => {
  const response = await api.get<NotificationListResponse>("/api/notifications", {
    params,
  });
  return response.data;
};

export const getUnreadNotificationCount = async () => {
  const response = await api.get<{ unread_count: number }>(
    "/api/notifications/unread-count",
  );
  return response.data;
};

export const markNotificationRead = async (notificationId: string) => {
  const response = await api.patch<MarkNotificationReadResponse>(
    `/api/notifications/${notificationId}/read`,
  );
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch<MarkAllNotificationsReadResponse>(
    "/api/notifications/read-all",
  );
  return response.data;
};
