import { onMounted, onUnmounted } from "vue";

export function useReturnRefresh(callback?: () => void) {
  const handleReturn = () => {
    console.log("User returned to app");

    if (callback) {
      callback(); // re-fetch data instead of full reload
    } else {
      window.location.reload(); // fallback
    }
  };

  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) {
      handleReturn();
    }
  };

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      handleReturn();
    }
  };

  const onFocus = () => {
    handleReturn();
  };

  onMounted(() => {
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onFocus);
  });

  onUnmounted(() => {
    window.removeEventListener("pageshow", onPageShow);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("focus", onFocus);
  });
}