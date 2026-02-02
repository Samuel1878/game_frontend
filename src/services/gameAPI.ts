import type { gameListRespone } from "@/utils/types";
import api from "./api";
import axios from "axios";

let data = JSON.stringify({
  CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
  ServerId: "test01",
  GpId: 1,
  IsGetAll: true,
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://ex-api-demo-yy.568win.com//web-root/restricted/information/get-game-list.aspx",
  headers: {
    "Content-Type": "application/json",
    Cookie:
      "__cf_bm=A6iCcZDJ.ji1NLcNbe9QSqo.sjGNb_uY68ag_rafzfM-1769854013.880565-1.0.1.1-KaDEkQtThnhtGhUgP.ik9UC5DvetgL22TQXxsLNpfW2y74T.M6dz7eEU_OC.xZFik6evTRqe9C17xyBYEwxGFGTuffpQ0.fouA_kK8CviAp.E2HOvt_7chqS5r44ioE9",
  },
  data: data,
};

export async function getGameListAPI(): Promise<gameListRespone | null> {
  const response = await axios
    .get("https://ex-api-demo-yy.568win.com//web-root/restricted/information/get-game-list.aspx", config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  if (response.status === 200) return response.data;
  return null;
}
