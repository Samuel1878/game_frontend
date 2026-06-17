import { providerNames } from "@/consts";
import type { gameType } from "@/utils/types";

export const GAME_IMAGE_FALLBACK = "/logo.webp";

export const gameKey = (game: gameType) =>
  `${game.provider_code || game.provider_id}-${game.game_code || game.game_id}`;

export const gameProviderName = (game: gameType) => {
  const key = game.provider_code || game.provider_id;
  return game.provider_name || providerNames[key] || String(key || "");
};

export const localizedGameName = (game: gameType, locale: string) => {
  if (locale === "cn") return game.cn_name || game.display_name || game.name;
  if (locale === "mm") return game.name_mm || game.display_name || game.name;
  return game.name || game.display_name || game.cn_name || String(game.game_code || game.game_id);
};

export const localizedGameImage = (game: gameType, locale: string) => {
  if (locale === "cn") return game.cn_icon_url || game.icon_url || GAME_IMAGE_FALLBACK;
  return game.icon_url || game.cn_icon_url || GAME_IMAGE_FALLBACK;
};
