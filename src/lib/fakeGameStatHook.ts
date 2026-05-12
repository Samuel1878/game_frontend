import { ref } from "vue";

type Stat = {
  rtp: string;
  users: number;
};

const stats = ref<Record<string, Stat>>({});

// single global timer (IMPORTANT)
let interval: ReturnType<typeof setInterval> | null = null;

// config
// const INTERVAL_MS = 4000;

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

  // Run more frequently (every 1s) but do LESS work per tick
  interval = setInterval(() => {
    const keys = Object.keys(stats.value);
    if (keys.length === 0) return;

    // Pick only 10-20% of the games to update this second
    // This spreads the "re-paint" load so it's invisible to the user
    const batchSize = Math.ceil(keys.length * 0.2); 
    
    for (let i = 0; i < batchSize; i++) {
      const randomKey = keys[Math.floor(Math.random() * keys.length)] ||0;
      const item = stats.value[randomKey];
      
      if (item) {
        // Mutate directly - Vue 3 handles this efficiently
        item.rtp = `${randomRTP()}%`;
        item.users = Math.max(
          10,
          item.users + Math.floor(Math.random() * 21 - 10)
        );
      }
    }
  }, 1000); // 1 second intervals with small batches is smoother than 4s with a huge batch
}

// function startEngine() {
//   if (interval) return;

//   interval = setInterval(() => {
//     const keys = Object.keys(stats.value);
//     for (const key of keys) {
//       const item = stats.value[key];
//       if (!item) continue;

//       item.rtp = `${randomRTP()}%`;

//       item.users = Math.max(
//         10,
//         item.users + Math.floor(Math.random() * 21 - 10)
//       );
//     }
//   }, INTERVAL_MS);
// }

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