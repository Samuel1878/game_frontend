import { ref } from "vue";

type Stat = {
  rtp: string;
  users: number;
};

const stats = ref<Record<string, Stat>>({});

// single global timer (IMPORTANT)
let interval: ReturnType<typeof setInterval> | null = null;

// config
const INTERVAL_MS = 4000;

const randomRTP = () => (96 + Math.random() * 6).toFixed(2);

const randomUsers = () =>
  Math.floor(20 + Math.random() * 500);

function ensureKey(key: string) {
  if (!stats.value[key]) {
    stats.value[key] = {
      rtp: `${randomRTP()}%`,
      users: randomUsers(),
    };
  }
}

function startEngine() {
  if (interval) return;

  interval = setInterval(() => {
    const keys = Object.keys(stats.value);
    for (const key of keys) {
      const item = stats.value[key];
      if (!item) continue;

      item.rtp = `${randomRTP()}%`;

      item.users = Math.max(
        10,
        item.users + Math.floor(Math.random() * 21 - 10)
      );
    }
  }, INTERVAL_MS);
}

function stopEngine() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

function getStat(key: string) {
  ensureKey(key);
  return stats.value[key];
}

function registerKeys(keys: string[]) {
  keys.forEach(ensureKey);
  startEngine();
}

export function useFakeGameStatsWithId() {
  return {
    stats,
    getStat,
    registerKeys,
    startEngine,
    stopEngine,
  };
}