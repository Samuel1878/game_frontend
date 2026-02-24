import type { gameListRespone } from "@/utils/types";
import api from "./api";


export async function getGameListAPI(): Promise<gameListRespone | null> {
  const response = await api.get("/game/game_list");
  console.log("response", response)
  if (response.status === 200) return response.data;
  return null;
}
export async function getGameByGpId (gpid:number) {
  try {
    console.log("gpid", gpid)
    const response = await api.get("/game/get_game_gpid",{
      params:{
        gpid
      }
    });
    if (response.status ===200)return response.data;
    return null
  } catch (error) {
    console.error(error)
    return null;

  }
}