import type { depositFormData } from "@/utils/types";
import api from "./api";

export const depositHandlerAPI = async(data:depositFormData) => {
    try {
         const response = await api.post("/api/v1/user/transaction/deposit", data);
    console.log("response", response)
    if (response.status === 200 || response.status === 201) return response.data;
    return null;    
    } catch (error) {
        console.log("error", error)
        return null;
    }
   
}    

export const getUserBalance =async(name:string)=>{
    try {
        const response = await api.get("/api/v1/user/balance", {
    params:{
        name:name
    }
});
if (response.status===200)return response.data;

return null
    } catch (error) {

        console.log(error)
                return null
    }



} 