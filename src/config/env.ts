const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getRuntimeEnvObject = (): Record<string, unknown> => {
  // Support several common injection patterns: window.__ENV__, globalThis.__ENV__, or plain window globals
  const g: any = (globalThis as any).__ENV__ || (globalThis as any).ENV || (window as any).__ENV__ || {};
  return typeof g === "object" && g !== null ? g : {};
};

const readEnv = (key: string, fallback: string) => {
  const runtime = getRuntimeEnvObject();

  // Try runtime-provided values first (support both VITE_ prefixed and unprefixed keys)
  const tryKeys = [key, key.replace(/^VITE_/, "")];
  for (const k of tryKeys) {
    const v = (runtime as any)[k] ?? (globalThis as any)[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }

  // Then fall back to import.meta.env (Vite)
  for (const k of tryKeys) {
    const v = (import.meta.env as any)[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }

  return fallback;
};

export const API_BASE_URL = stripTrailingSlash(
  readEnv("VITE_API_BASE_URL", "https://uat-api.tz99x.com"),
);

export const SOCKET_URL = stripTrailingSlash(
  readEnv("VITE_SOCKET_URL", API_BASE_URL),
);

export const DEFAULT_CURRENCY = readEnv("VITE_DEFAULT_CURRENCY", "MMK").toUpperCase();
export const DEFAULT_COUNTRY = readEnv("VITE_DEFAULT_COUNTRY", "MM").toUpperCase();

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
