import { defineStore } from "pinia";
import { ref } from "vue";
import { enterGameAPI } from "@/services/gameAPI"; // adjust path
import { useAuthStore } from "@/stores/auth";
import { toast } from "vue-sonner"; // or your toast lib
import router from "@/router";
import type { gameType } from "@/utils/types";
import { useWallet } from "./wallet";
import { useI18n } from "vue-i18n";

export const useGameStore = defineStore("game", () => {
  const loading = ref(false);
  const drawerOpen = ref(false);
  const launchUrl = ref<string | null>(null);
  const selectedGame = ref<gameType|null>(null);
    const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const authStore = useAuthStore();
  const {locale, t} = useI18n();
  const wallet = useWallet()
  const preLaunchData = ref<any>(null); 
  const openDrawer = () => {
    drawerOpen.value = true;
    if (closeTimer.value) {
      clearTimeout(closeTimer.value);
    }
    closeTimer.value = setTimeout(() => {
      drawerOpen.value = false;
      closeTimer.value = null;
    }, 20000);
  };
  const closeDrawer = () => {
    drawerOpen.value = false;

    if (closeTimer.value) {
      clearTimeout(closeTimer.value);
      closeTimer.value = null;
    }
  };
   const prepareGame = async (game: gameType) => {
    if (!game) return;

    if (!authStore.user) {
      toast.warning(t("please_login"));
      router.push({ path: '/auth', query: { mode: 'login' } });
      return;
    }
    if (authStore.user.level===1 && wallet.balance===0){
      toast.warning(t("insufficient_balance"));
      router.push("/deposit");
      return
    }
    loading.value = true;
    openDrawer();
    try {
      selectedGame.value = game;

      const data = await enterGameAPI({
        lang :locale.value==='cn'?'zh-cn':locale.value==='mm'?'my-mm': 'en',
        gameId: game.game_id,
        gpId: game.provider_id,
      });

      preLaunchData.value = data; // ✅ STORE API RESULT

      // drawerOpen.value = true; // open AFTER API success
    } catch (error) {
      console.error(error);
      closeDrawer()
      toast.error(t("failed_to_prepare_game"));
    } finally {
      loading.value = false;
    }
  };

  // 🟢 STEP 2: ENTER GAME (NO API CALL HERE)
  const enterGame = async () => {
    if (!selectedGame.value || !preLaunchData.value) return;

    loading.value = true;

    try {
      const game = selectedGame.value;
      const data = preLaunchData.value;

      if (!data?.url) {
        toast.error("Failed to launch game");
        return;
      }

      launchUrl.value =
        `${data.url}&gpid=${game.provider_id}&gameid=${game.game_id}&lang=${locale.value==='cn'?'zh-cn':locale.value==='mm'?'my-mm': 'en'}
        &device=m&betCode=`;

     closeDrawer()

      router.push(`/game?` + `gpid=${game.provider_id}&gameid=${game.game_id}&lang=${locale.value==='cn'?'zh-cn':locale.value==='mm'?'my-mm': 'en'}
        &device=m&betCode=`);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      loading.value = false;
    }
  };

  const resetGame = () => {
    launchUrl.value = null;
    selectedGame.value = null;
  };

  return {
    loading,
    drawerOpen,
    launchUrl,
    selectedGame,
    prepareGame,
    enterGame,
    resetGame,
  };
});