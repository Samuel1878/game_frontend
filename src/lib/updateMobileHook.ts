import { versionNo } from "@/utils";
import { ref, onMounted, onUnmounted } from "vue";
function isNewer(latest: string, current: string): boolean {
  if (!latest || !current) return false;
  const l = latest.split(".").map(Number);
  const c = current.split(".").map(Number);
  const maxLength = Math.max(l.length, c.length);
  for (let i = 0; i < maxLength; i++) {
    const latestVal = l[i] || 0;
    const currentVal = c[i] || 0;
    if (latestVal > currentVal) {
      return true;
    }
    if (latestVal < currentVal) {
      return false;
    }
  }
  return false;
}
export function useAppUpdate() {
  const showUpdate = ref(false);
  const checking = ref(false);
  const updateData = ref<any>(null);
/**
 * Detects if the code is running inside the Native App (WebView)
 * versus a standard mobile browser.
 */
const isApp = () => {
  // 1. Check for Capacitor (most common in modern Vue/Ionic apps)
  const isCapacitor = (window as any).Capacitor?.isNative;

  // 2. Check for Cordova/PhoneGap
  const isCordova = !!(window as any).cordova;

  // 3. Protocol Check (Apps often run on capacitor://, ionic://, or file://)
  const isAppProtocol = ['capacitor:', 'http://localhost', 'file:', 'ionic:'].includes(window.location.protocol);

  // 4. Custom User Agent (If you injected a unique string into your App's WebView)
  // Most professional apps add something like "TZ99-APP" to the UA in native settings.
  const isCustomUA = navigator.userAgent.includes("TZ99-APP");

  return isCapacitor || isCordova || isAppProtocol || isCustomUA;
};
  let controller: AbortController | null = null;
  const checkUpdate = async () => {
    if (!isApp()) {
      console.log("[UPDATE] Running on Web - skipping app version check.");
      return;
    }
    try {
      checking.value = true;
      controller?.abort();
      controller = new AbortController();
      const targetUrl =
        "https://vptocypywfkpepmggrym.supabase.co/storage/v1/object/public/version-check/version.json";

      const res = await fetch(targetUrl, {
        cache: "no-store",
        signal: controller.signal,
      });
          console.log("RES", res);

      const text = await res.text();
        const data = JSON.parse(text);
      console.log("RAW RESPONSE:", text);

  
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
  
      console.log("[UPDATE] current:", versionNo);
      console.log("[UPDATE] latest:", data.version);
      updateData.value = data;
      if (
        data.force_update &&
        data.version &&
        isNewer(data.version, versionNo)
      ) {
        showUpdate.value = true;
        document.body.style.overflow = "hidden";
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.warn("[UPDATE] failed:", err);
      }
    } finally {
      checking.value = false;
    }
  };
  const downloadUpdate = () => {
    if (!updateData.value) return;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const url = isAndroid
      ? updateData.value.android_url
      : updateData.value.ios_url;
    if (!url) return;
    window.location.assign(url);
  };
  onMounted(() => {
    console.log("MOUNTED");
    checkUpdate();
  });
  onUnmounted(() => {
    controller?.abort();
    document.body.style.overflow = "";
  });
  return {
    showUpdate,
    updateData,
    checking,
    checkUpdate,
    downloadUpdate,
  };
}
