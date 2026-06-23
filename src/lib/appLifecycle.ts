import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { isPWA } from "@/utils/help";
let initialized = false;
let resumeInProgress: Promise<void> | null = null;
async function handleResume() {
  if (resumeInProgress) return resumeInProgress;
  const auth = useAuthStore();
  const notifications = useNotificationStore();
  resumeInProgress = (async () => {
    try {
      console.log("[APP_RESUME]", {
        pwa: isPWA(),
        online: navigator.onLine,
        visibility: document.visibilityState,
      });
      if (isPWA()) {
        await auth.revalidate();
      } else if (auth.isLoggedIn) {
        await notifications.fetchUnreadCount();
      }
    } catch (err) {
      console.error("[APP_RESUME_ERROR]", err);
    } finally {
      resumeInProgress = null;
    }
  })();
  return resumeInProgress;
}
export function initAppLifecycle() {
  if (initialized) return;
  initialized = true;
  const onResume = () => {
    void handleResume();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      onResume();
    }
  });
  window.addEventListener("focus", onResume);
  window.addEventListener("online", onResume);
  // 🔥 important for iOS PWA / Safari restore
  window.addEventListener("pageshow", (event: PageTransitionEvent) => {
    if (event.persisted) {
      onResume();
    }
  });
}
