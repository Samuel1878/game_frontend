import { ref, onMounted } from "vue";
import { Capacitor } from "@capacitor/core";
import { BASE_API_URL } from "@/utils";

export function useAppUpdate() {
  const showUpdate = ref(false);
  const updateData = ref<any>(null);

  const currentVersion = "1.0.0";

  async function checkUpdate() {
    try {
      const res = await fetch(`${BASE_API_URL}/app-version.json`);
      const data = await res.json();

      updateData.value = data;

      if (data.version !== currentVersion) {
        showUpdate.value = true;
      }
    } catch (err) {
      console.log("Update check failed", err);
    }
  }

  onMounted(() => {
    // ✅ ONLY RUN INSIDE MOBILE APP
    if (Capacitor.isNativePlatform()) {
      checkUpdate();
    }
  });

  function downloadUpdate() {
    window.location.href = updateData.value.apkUrl;
  }

  return {
    showUpdate,
    updateData,
    downloadUpdate
  };
}