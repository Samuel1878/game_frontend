import { ref } from "vue";
type Stat = {
  rtp: string;
  users: number;
};
const stats = ref<Record<string, Stat>>({});
let interval: ReturnType<typeof setInterval> | null = null;
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
    if (keys.length === 0) return;
    const batchSize = Math.ceil(keys.length * 0.2); 
    for (let i = 0; i < batchSize; i++) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)] ||0;
      const item = stats.value[randomKey];
      if (item) {
        item.rtp = `${randomRTP()}%`;
        item.users = Math.max(
          10,
          item.users + Math.floor(Math.random() * 21 - 10)
        );
      }
    }
  }, 1000);
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