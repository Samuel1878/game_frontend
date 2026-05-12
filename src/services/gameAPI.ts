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
};
export const enterGameAPI = async (data:{userName:string, gpId:number, gameId:number}) => {
  try {
    const response = await api.post("/game/enter_game", data);
    if (response.status===200) return response.data;
    return null
  } catch (error) {
    return null
  }
}



export const getGamesByProviderAPI = async ({
  providerId,
  limit = 20,
  offset = 0,
  lang = "en",
  newGameType = 201,
  search = '',
  sortBy="rank",
  top = false
}: {
  providerId: number;
  limit?: number;
  offset?: number;
  lang?: string;
  newGameType?: string | number;
  search?:string;
  sortBy?: string,   // 🔥 NEW
  top?:boolean, 
}) => {
  try {
     const res = await api.get(
    `/game/get-games-provider/${providerId}`,
    {
      params: {
        limit,
        offset,
        lang,
        newGameType,
        search,
        sortBy,
        top
      },
    }
  );

  return res.data;
  } catch (error) {
    return null
  }
 
};