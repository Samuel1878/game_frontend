<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import DatePicker from "@/components/CalenderView.vue";
import { baseURL, formatPrice, openChat } from "@/utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  ChartLine,
  Copy,
  Gift,
  Headset,
  Share2Icon,
  TrendingDown,
  Trophy,
  Users,
  Wallet,
} from "lucide-vue-next";
import { useAgentStore } from "@/stores/agentStore";
import { storeToRefs } from "pinia";
import { useClipboard } from "@vueuse/core";
import { toast } from "vue-sonner";
import CustomNavBar from "@/components/layout/customNavBar.vue";
import LanguageBtn from "@/components/languageBtn.vue";
import { useRouter } from "vue-router";
import { useAgentDashboardStore } from "@/stores/agentDashboardStore";
import QrcodeVue from "qrcode.vue";
import Button from "@/components/ui/button/Button.vue";
import AgentOptions from "@/components/layout/agentOptions.vue";
const { t } = useI18n();
const agentStore = useAgentStore();
const agentData = storeToRefs(agentStore).agentData;
const store = useAgentDashboardStore();
const {
  loading,
  mode,
  startDate,
  endDate,
  total_players,
  transactionReport,
  betReport,
} = storeToRefs(store);
const { copy } = useClipboard({ source: "" });
const router = useRouter();
const qrWrapper = ref<HTMLElement | null>(null);
const websiteURL = computed(
  () =>agentData.value? baseURL + `/?rid=${agentData.value?.referral_code}`:baseURL,
);
// Get canvas from qrcode.vue
const getCanvas = (): HTMLCanvasElement | null => {
  return qrWrapper.value?.querySelector("canvas") || null;
};
const createQRImage = async (): Promise<Blob | null> => {
  const canvas = getCanvas();
  if (!canvas) return null;

  const padding = 50;

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width + padding * 2;
  exportCanvas.height = canvas.height + padding * 2;

  const ctx = exportCanvas.getContext("2d");
  if (!ctx) return null;

  // ✅ WHITE BACKGROUND (important for iPhone preview)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  // Optional soft border/card feel
  ctx.fillStyle = "#f5f5f5";
  roundRect(
    ctx,
    10,
    10,
    exportCanvas.width - 20,
    exportCanvas.height - 20,
    20
  );

  // Draw QR centered with padding
  ctx.drawImage(canvas, padding, padding);

  return await new Promise((resolve) =>
    exportCanvas.toBlob((blob) => resolve(blob), "image/png")
  );
};
const downloadQR = async () => {
  const blob = await createQRImage();
  if (!blob) return;
    const file = new File([blob], "tz99-qr.png", {
    type: "image/png",
  });

   if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: "Website QR Code",
      text: websiteURL.value,
      files: [file],
    });
  } else{
    const link = document.createElement("a");
    link.download = "tz99-qr.png";
    link.href = URL.createObjectURL(blob);
    link.click();
  }
};
// Rounded rectangle helper
const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();

  ctx.moveTo(x + radius, y);

  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height,
  );

  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);

  ctx.closePath();

  ctx.fill();
};

// Share QR
const shareQR = async () => {
  const blob = await createQRImage();
  if (!blob) return;

  const file = new File([blob], "tz99-qr.png", {
    type: "image/png",
  });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: "Website QR Code",
      text: websiteURL.value,
      files: [file],
    });
  } else {
    // fallback download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tz99-qr.png";
    link.click();
  }
};
const copyHandler = (value: any) => {
  if (!value) return;
  copy(value);

  toast.success(`${t("copied")}: ${value}`);
};
onMounted(() => {
  store.fetchSummary();
});
console.log(transactionReport);
</script>

<template>
  <CustomNavBar title="agent_center" backTo="/user/profile">
    <template #right>
      <button v-on:click="openChat">
        <Headset class="w-6 h-6" />
      </button>
      <LanguageBtn />
    </template>
  </CustomNavBar>
  <AgentOptions current_page="overview"/>
  <div class="space-y-5 p-4 w-full">
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold">{{ t("overview") }}</h1>
        <p class="text-sm text-gray-400">{{ t("my_team_performance") }}</p>
      </div>
      <button
        class="rounded-full flex gap-4 px-4 bg-gray-800/50 border active-button border-gray-500/50 h-12 items-center"
        v-on:click="copyHandler(agentData?.referral_code)"
      >
        <p class="text-md font-bold text-green">
          {{ agentData?.referral_code }}
        </p>
        <Copy class="w-5 h-5 text-green-400" />
      </button>
    </div>

    <!-- MODE SWITCH -->
    <div class="flex gap-2">
      <button
        class="filter-btn"
        :class="mode === 'today' && 'active'"
        @click="store.setMode('today')"
      >
        {{ t("today") }}
      </button>
      <button
        class="filter-btn"
        :class="mode === 'this_month' && 'active'"
        @click="store.setMode('this_month')"
      >
        {{ t("this_month") }}
      </button>

      <button
        class="filter-btn"
        :class="mode === 'custom' && 'active'"
        @click="store.setMode('custom')"
      >
        {{ t("custom") }}
      </button>
    </div>

    <!-- DATE FILTER -->
    <div
      v-if="mode === 'custom'"
      class="bg-[#0f172a] p-4 rounded-2xl border border-white/5"
    >
      <div class="flex justify-center items-center gap-2">
        <DatePicker v-model="startDate" :placeholder="t('start_date')" />
        <DatePicker v-model="endDate" :placeholder="t('end_date')" />
      </div>

      <button
        class="mt-3 w-full gold-bg py-2 rounded-lg text-sm"
        @click="store.fetchSummary"
      >
        {{ t("search") }}
      </button>
    </div>

    <!-- LOADING -->
    <!-- SKELETON -->
    <div v-if="loading" class="grid grid-cols-2 gap-3">
      <div
        v-for="i in 8"
        :key="i"
        class="rounded-2xl p-4 bg-[#0f172a] border border-white/5 animate-pulse"
      >
        <div class="flex items-center justify-between">
          <!-- ICON SKELETON -->
          <div class="w-10 h-10 rounded-xl bg-white/5"></div>

          <!-- TEXT SKELETON -->
          <div class="flex flex-col items-end gap-2">
            <div class="h-3 w-16 bg-white/5 rounded"></div>
            <div class="h-5 w-10 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- CARDS -->
    <div v-else class="grid grid-cols-2 gap-3">
      <!-- TEAM -->
      <div
        class="card col-span-2"
        @click="router.push('/user/agent-center/users')"
      >
        <div class="flex items-center justify-between w-full pr-5">
          <div class="flex items-center gap-2">
            <div class="icon-box bg-emerald-500/15 text-emerald-400">
              <Users class="w-4 h-4" />
            </div>

            <span class="label">
              {{ t("my_team") }}
            </span>
          </div>

          <b class="value text-gray-100 text-3xl">
            {{ total_players || 0 }}
          </b>
        </div>
      </div>

      <!-- DEPOSIT -->
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-green-500/15 text-green-400">
            <ArrowDownCircle class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("total_deposit") }}
            </span>

            <b class="value text-green-400">
              {{ formatPrice(transactionReport?.deposits || 0) }}
            </b>
          </div>
        </div>
      </div>

      <!-- WITHDRAW -->
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-red-500/15 text-red-400">
            <ArrowUpCircle class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("total_withdraw") }}
            </span>

            <b class="value text-red-400">
              {{ formatPrice(transactionReport?.withdraws || 0) }}
            </b>
          </div>
        </div>
      </div>

      <!-- WIN -->
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-blue-500/15 text-blue-400">
            <BarChart3 class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("turnover") }}
            </span>

            <b class="value text-blue-400">
              {{
                formatPrice(
                  (betReport?.turnover?.won || 0) +
                    (betReport?.turnover?.bonus || 0) +
                    (betReport?.turnover?.lose || 0) +
                    (betReport?.turnover?.draw || 0) || 0,
                )
              }}
            </b>
          </div>
        </div>
      </div>

      <!-- LOSS -->
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-orange-500/15 text-orange-400">
            <ChartLine class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("win_loss") }}
            </span>

            <b class="value text-orange-400">
              {{
                formatPrice(
                  (transactionReport?.deposits || 0) -
                    (transactionReport?.withdraws || 0),
                ) || 0
              }}
            </b>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-yellow-500/15 text-yellow-400">
            <Trophy class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("ggr") }}
            </span>

            <b class="value text-yellow-400">
              {{ formatPrice(betReport?.winlose ?? 0) }}
            </b>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-purple-500/15 text-purple-400">
            <Gift class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("total_rebate") }}
            </span>

            <b class="value text-purple-400">
              {{ formatPrice(transactionReport?.rebate || 0) }}
            </b>
          </div>
        </div>
      </div>
      <!-- COMMISSION -->
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-cyan-500/15 text-cyan-400">
            <Wallet class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("bonus") }}
            </span>

            <b class="value text-cyan-400">
              {{ formatPrice(transactionReport?.bonus || 0) }}
            </b>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-gray-500/15 text-gray-300">
            <Trophy class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("won_count") }}
            </span>

            <b class="value text-gray-300">
              {{ formatPrice(betReport?.betCount.won || 0) }}
            </b>
          </div>
        </div>
      </div>

      <!-- LOSE COUNT -->
      <div class="card">
        <div class="flex items-center gap-3">
          <div class="icon-box bg-gray-500/15 text-gray-400">
            <TrendingDown class="w-5 h-5" />
          </div>

          <div class="flex flex-col">
            <span class="label">
              {{ t("lose_count") }}
            </span>

            <b class="value text-gray-400">
              {{ formatPrice(betReport?.betCount.lose ?? 0) }}
            </b>
          </div>
        </div>
      </div>
    </div>
    <div
      class="glass-bg active-button w-full flex justify-around items-center h-12 rounded-full"
      @click="copyHandler(websiteURL)"
    >
      <p class="text-green-400 font-bold text-lg">
        {{ t("share_link") }}
      </p>
      <Share2Icon class="w-5 h-5 text-green-400" />
    </div>
    <div class="p-2 flex flex-col gap-2 items-center w-full">
     <!-- QR Wrapper -->
        <div
          ref="qrWrapper"
          class="bg-white rounded-2xl p-5 flex justify-center mb-6 w-fit"
        >
          <qrcode-vue
            :value="websiteURL"
            :size="200"
            level="H"
            render-as="canvas"
          />
        </div>
      <!-- Buttons -->
      <div class="flex gap-2 items-center justify-between">
        <Button
          @click="downloadQR"
           class="bg-zinc-800 w-1/2 hover:bg-zinc-700 border border-zinc-700 py-3 rounded-xl"
        >
         {{ t('download') }}
        </Button>

        <Button
          @click="shareQR"
                    class="bg-yellow-500 w-1/2 hover:bg-yellow-400 text-black font-semibold py-3 rounded-xl"
        
        >
          {{ t("share") }}
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: linear-gradient(to bottom right, #111827, #1e293b);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px;
  min-height: 92px;
  display: flex;
  align-items: center;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  background: linear-gradient(to bottom right, #172033, #243041);
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.label {
  font-size: 12px;
  color: #9ca3af;
}

.value {
  font-size: 14px;
  font-weight: 700;
}
</style>
