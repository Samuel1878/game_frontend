<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount, watch } from "vue";
import { toast } from "vue-sonner";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import { Headset, X } from "lucide-vue-next";
import LanguageBtn from "@/components/languageBtn.vue";
import { openChat } from "@/utils";
import { useI18n } from "vue-i18n";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
//  const { BrowserMultiFormatReader } = await import("@zxing/library");
// const {BrowserMultiFormatReader} = await import("@zxing/library")
import api from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";
// const {BrowserMultiFormatReader, NotFoundException,  } = defineAsyncComponent(()=>import("@zxing/library"))
const scannerOpen = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);

let codeReader: BrowserMultiFormatReader | null = null;
let stream: MediaStream | null = null;
const auth= useAuthStore();
const isScanning = ref(false);
const scanResult = ref<string | null>(null);
const statusMessage = ref("Ready");
const { t } = useI18n();
const phone = ref("");
const amount = ref<number | null>(null);
const note = ref("");

const loading = ref(false);
const withdrawLoading = ref(false);
const searched = ref(false);

const reseller = ref<{ phone: string; username: string ,id:string} | null>(null);

const fetchReseller = async (
  result: string | null
) => {
  const phoneNumber =
    result || phone.value;

  if (!phoneNumber) {
    return toast.warning(
      t("enter_phone_number")
    );
  }

  try {
    loading.value = true;

    searched.value = true;

    const response = await api.get(
      "/user/reseller/" + phoneNumber
    );

    if (response.status === 200) {
      reseller.value = response.data;
      return;
    }

    reseller.value = null;

  } catch (error: any) {
    reseller.value = null;

    toast.error(
      t(
        error?.response?.data?.message ||
        "something_went_wrong"
      )
    );

  } finally {
    loading.value = false;
  }
};
const confirmWithdraw = async() => {
  loading.value = true;
  if (!reseller.value){
    return toast.warning(t("reseller_not_found"))
  }
  try {
      const response = await api.post("/user/reseller/withdraw", {
          amount:amount.value,
          reseller_id:reseller.value.id,
          user_name:auth.user?.name,
          remark:note.value
      });
      if (response.status===200){
        toast.success(t('success'));
        return router.push("/user/profile")
      }
      return toast.success(t('something_went_wrong'));
  } catch (error) {
   return toast.success(t('something_went_wrong'));
  } finally{
    loading.value = true;
  }
};

const startScanner = async () => {
// const { BrowserMultiFormatReader, NotFoundException } = await import("@zxing/library");
  scannerOpen.value = true;

  await nextTick();

  try {
    isScanning.value = true;
    scanResult.value = null;
    statusMessage.value = "Starting camera...";

    codeReader = new BrowserMultiFormatReader();

    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });

    if (!videoRef.value) return;

    videoRef.value.srcObject = stream;
    await videoRef.value.play();

    statusMessage.value = "Scanning...";

    // ✅ CONTINUOUS SCAN (REAL-TIME)
    codeReader.decodeFromVideoDevice(null, videoRef.value, (result, err) => {
      // ignore normal "not found" frames
      if (err && !(err instanceof NotFoundException)) {
        console.warn(err);
      }

      if (result) {
        scanResult.value = result.getText();
        fetchReseller(result.getText());
        stopScanner();
      }
    });
  } catch (err: any) {
    console.error(err);
    toast.warning(t(err?.message || "camera_error"));
    isScanning.value = false;
    scannerOpen.value = false;
  }
};
const stopScanner = () => {
  if (codeReader) {
    codeReader.reset();
    codeReader = null;
  }
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    stream = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
  isScanning.value = false;
  scannerOpen.value = false;
};
onBeforeUnmount(() => {
  stopScanner();
});
watch(scannerOpen, (open) => {
  if (!open) {
    stopScanner();
  }
});
const clearData = ()=>{
  reseller.value = null;
  phone.value = "";
  scanResult.value = ""
}
</script>
<template>
  <main class="w-full bg-gray-950 min-h-screen text-white overflow-x-hidden">
    <CustomNavBar title="store">
      <template #right>
        <button @click="openChat">
          <Headset class="w-6 h-6" />
        </button>
        <LanguageBtn />
      </template>
    </CustomNavBar>
    <div class="min-h-screen bg-gray-950 text-white p-4 md:p-6 w-full">
      <div class="w-full">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold">{{ t("withdraw_request") }}</h1>
          <p class="text-gray-400 text-sm mt-1">
            {{ t("scan_qr_or_enter_phone_number_manually") }}
          </p>
        </div>

        <!-- Search Card -->

        <div
          v-if="reseller && !loading"
          class="bg-gray-900 border border-gray-800 rounded-2xl p-5 mt-5"
        >
          <div class="flex items-center gap-4 relative">
            <div
              class="w-14 h-14 rounded-full flex gold-bg items-center justify-center text-xl font-bold"
            >
              {{ reseller?.username.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h2 class="font-semibold text-lg">{{ reseller.username }}</h2>
              <p class="text-sm text-gray-400">{{ reseller.phone }}</p>
            </div>
            <div class="absolute top-2 right-0" @click="clearData">
              <X class="w-6 h-6"/>
            </div>
          </div>
          <div class="mt-5">
            <label class="text-sm text-gray-400 mb-2 block">
              {{ t("withdraw_amount") }}
            </label>

            <input
              v-model="amount"
              type="number"
              :placeholder="t('enter_amount')"
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
            />
          </div>

          <div class="mt-4">
            <label class="text-sm text-gray-400 mb-2 block">
              {{ t("note_optional") }}
            </label>

            <textarea
              v-model="note"
              rows="3"
              placeholder="Add note..."
              class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 resize-none"
            ></textarea>
          </div>

          <button
            @click="confirmWithdraw"
            :disabled="withdrawLoading || !amount"
            class="w-full mt-5 gold-bg hover:bg-amber-500 disabled:opacity-50 transition-all py-3 rounded-xl font-semibold"
          >
            {{ withdrawLoading ? t('loading') : t('confirm') }}
          </button>
        </div>
        <div
          v-else
          class="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl"
        >
          <!-- Scan Button -->
          <button
            @click="startScanner"
            class="w-full flex items-center text-glow justify-center gap-2 gold-bg active-button transition-all rounded-xl py-3 font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3"
              />
            </svg>
            {{ t("scan_qr_code") }}
          </button>

          <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px bg-gray-800"></div>
            <span class="text-gray-500 text-sm">{{ t("or") }}</span>
            <div class="flex-1 h-px bg-gray-800"></div>
          </div>

          <div>
            <label class="text-sm text-gray-400 mb-2 block">
              {{ t("phone_number") }}
            </label>

            <div class="flex gap-2 w-full">
              <input
                v-model="phone"
                type="text"
                placeholder="09xxxxxxxxx"
                class="w-3/4 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
              />

              <button
                @click="fetchReseller(phone)"
                :disabled="loading || !phone"
                class="gold-bg hover:bg-yellow-600 disabled:opacity-50 w-1/4 rounded-xl font-medium transition-all"
              >
                {{ loading ? t("loading") : t("search") }}
              </button>
            </div>
          </div>
        </div>


        <div
          v-if="!reseller && searched"
          class="text-center text-gray-400 mt-8"
        >
          {{ t("reseller_not_found") }}
        </div>
      </div>
    </div>
    <Dialog
      v-model:open="scannerOpen"
      @escape-key-down="stopScanner"
      @pointer-down-outside="stopScanner"
    >
      <DialogContent
        class="p-0 max-w-md bg-black border border-gray-800 overflow-hidden text-white [&>button]:hidden"
      >
        <div
          v-show="isScanning"
          class="w-full aspect-square bg-black rounded-2xl overflow-hidden relative border-2 border-white/10 shadow-lg"
        >
          <!-- ❌ Manual Close Button -->
          <button
            class="absolute top-3 right-3 z-50 w-9 h-9 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black"
            @click="
              () => {
                scannerOpen = false;
                stopScanner();
              }
            "
          >
            ✕
          </button>

          <!-- Camera -->
          <video
            ref="videoRef"
            autoplay
            playsinline
            webkit-playsinline
            muted
            class="w-full h-full object-cover bg-black"
          ></video>

          <!-- Overlay Frame -->
          <!-- Scanner Frame Overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <!-- dark mask already handled by shadow, this is the frame -->
            <div class="relative w-64 h-64">
              <!-- OUTER MASK (dark area around scan box) -->
              <div
                class="absolute inset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] rounded-2xl"
              ></div>

              <!-- SCAN WINDOW BORDER (corner style like real apps) -->
              <div class="absolute inset-0">
                <!-- top-left -->
                <div class="scanner-corner top-0 left-0"></div>
                <!-- top-right -->
                <div class="scanner-corner top-0 right-0 rotate-90"></div>
                <!-- bottom-right -->
                <div class="scanner-corner bottom-0 right-0 rotate-180"></div>
                <!-- bottom-left -->
                <div class="scanner-corner bottom-0 left-0 -rotate-90"></div>
              </div>

              <!-- MOVING SCAN LINE -->
              <div class="scan-line"></div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </main>
</template>
<style scoped>
/* glowing scan corners */
.scanner-corner {
  position: absolute;
  width: 28px;
  height: 28px;
  border-left: 3px solid #facc15;
  border-top: 3px solid #facc15;
  filter: drop-shadow(0 0 6px #facc15);
}

/* moving scan line */
.scan-line {
  position: absolute;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #facc15;
  box-shadow: 0 0 12px #facc15;
  animation: scanMove 2s linear infinite;
}

@keyframes scanMove {
  0% {
    top: 10%;
    opacity: 0.3;
  }
  50% {
    top: 50%;
    opacity: 1;
  }
  100% {
    top: 90%;
    opacity: 0.3;
  }
}
</style>
