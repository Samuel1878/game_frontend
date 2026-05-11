import { ref } from "vue";

export function useGameStat() {
  const stats = ref<Record<number, { rtp: string; users: number }>>({});

  const randomRTP = () => (96 + Math.random() * 6).toFixed(2);

  const randomUsers = () => Math.floor(20 + Math.random() * 500);

  const initStats = (games: { id: number }[]) => {
    games.forEach((g) => {
      stats.value[g.id] = {
        rtp: `${randomRTP()}%`,
        users: randomUsers(),
      };
    });
  };

const startLive = (games:any, intervalMs = 3000) => {
  initStats(games);

  setInterval(() => {
    const newStats: Record<number, any> = {};

    games.forEach((g:any) => {
      newStats[g.id] = {
        rtp: `${randomRTP()}%`,
        users: Math.max(
          10,
          (stats.value[g.id]?.users ?? 0) +
            Math.floor(Math.random() * 21 - 10)
        ),
      };
    });

    stats.value = newStats; // 👈 single reactive swap
  }, intervalMs);
};

  return {
    stats,
    startLive,
  };
}