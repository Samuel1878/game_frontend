import { ref } from "vue";

export function useFakeGameStats() {
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

  const startLive = (games: { id: number }[], intervalMs = 3000) => {
    initStats(games);

    const interval = setInterval(() => {
      games.forEach((g) => {
        const current = stats.value[g.id];
        if (!current) return;

        current.rtp = `${randomRTP()}%`;
        current.users = Math.max(
          10,
          current.users + Math.floor(Math.random() * 21 - 10)
        );
      });
    }, intervalMs);

    return () => clearInterval(interval);
  };

  return {
    stats,
    startLive,
  };
}