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
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  let controller: AbortController | null = null;
  const checkUpdate = async () => {
    if (!isMobile) return;
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
