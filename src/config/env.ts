const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const readEnv = (key: string, fallback: string) => {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

export const API_BASE_URL = stripTrailingSlash(
  readEnv("VITE_API_BASE_URL", "http://localhost:3000"),
);

export const SOCKET_URL = stripTrailingSlash(
  readEnv("VITE_SOCKET_URL", API_BASE_URL),
);

export const DEFAULT_CURRENCY = readEnv("VITE_DEFAULT_CURRENCY", "MMK").toUpperCase();
export const DEFAULT_COUNTRY = readEnv("VITE_DEFAULT_COUNTRY", "MM").toUpperCase();

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
