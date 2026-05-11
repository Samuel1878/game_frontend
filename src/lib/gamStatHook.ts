
import { shallowRef, ref } from "vue";

type GameStat = {
  rtp: string;
  users: number;
};

type Game = { id: number };

export function useCasinoLiveStats() {
  const stats = shallowRef<Record<number, GameStat>>({});

  const isPaused = ref(false);
  const isVisibleMode = ref(false);
  const visibleIds = ref<Set<number>>(new Set());

  const randomRTP = () => (96 + Math.random() * 6).toFixed(2);
  const randomUsers = () => Math.floor(20 + Math.random() * 500);

  // ⚡ init once
  const init = (games: Game[]) => {
    const base: Record<number, GameStat> = {};

    for (const g of games) {
      base[g.id] = {
        rtp: `${randomRTP()}%`,
        users: randomUsers(),
      };
    }

    stats.value = base;
  };

  // ⚡ batch update (NO per-field mutation)
  const update = (games: Game[]) => {
    if (isPaused.value) return;

    const next: Record<number, GameStat> = { ...stats.value };

    for (const g of games) {
      if (isVisibleMode.value && !visibleIds.value.has(g.id)) continue;

      const prev = next[g.id];

      next[g.id] = {
        rtp: `${randomRTP()}%`,
        users: Math.max(
          10,
          (prev?.users ?? 50) + Math.floor(Math.random() * 21 - 10)
        ),
      };
    }

    stats.value = next;
  };

  // ⚡ interval + RAF safety layer
  let timer: any;
  let raf: number | null = null;

  const start = (games: Game[], interval = 2500) => {
    init(games);

    const tick = () => {
      raf = requestAnimationFrame(() => {
        update(games);
      });
    };

    timer = setInterval(tick, interval);

    return stop;
  };

  const stop = () => {
    clearInterval(timer);
    if (raf) cancelAnimationFrame(raf);
  };

  // ⚡ UI interaction control
  const setPaused = (v: boolean) => {
    isPaused.value = v;
  };

  // ⚡ visibility optimization (optional but powerful)
  const setVisible = (ids: number[]) => {
    isVisibleMode.value = true;
    visibleIds.value = new Set(ids);
  };

  return {
    stats,
    start,
    stop,
    setPaused,
    setVisible,
  };
}