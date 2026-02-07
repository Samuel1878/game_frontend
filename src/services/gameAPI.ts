import type { gameListRespone } from "@/utils/types";
import api from "./api";


export async function getGameListAPI(): Promise<gameListRespone | null> {
  const response = await api.get("/api/v1/game/game_list");
  console.log("response", response)
  if (response.status === 200) return response.data;
  return null;
}
