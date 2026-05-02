import { BASE_API_URL } from "@/utils";
import axios from "axios";

const refreshClient = axios.create({
  baseURL: `${BASE_API_URL}/api/v1`,
  withCredentials: true,
});

export const refreshAPI = async () => {
    // try {
    const res = await refreshClient.post("/auth/refresh");
    return res.data;
    // } catch (error) {
    //     return null
    // }
 
};