import type { depositFormData, paramType, withdrawalInfo, withdrawParamType } from "@/utils/types";
import api from "./api";

export const depositHandlerAPI = async(data:depositFormData, param:paramType) => {
    try {
         const response = await api.post("/user/transaction/deposit",data , {
            params:param
         });
    console.log("response", response)
    if (response.status === 200 || response.status === 201) return response.data;
    return null;    
    } catch (error) {
        console.log("error", error)
        return null;
    }
   
}    

export const withdrawalHandlerAPI = async (data:withdrawalInfo, param:withdrawParamType) => {
    try {
        const response = await api.post("/user/transaction/withdraw", data, {
            params:param
        });
        if (response.status===200)return response.data;
        return null
    } catch (error) {
        console.log(error);
        return null
    }
}

export const getUserBalance =async(name:string)=>{
    try {
        const response = await api.get("/user/balance", {
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



} ;

export const getDepositById = async (user_id:number) => {
    try {
         const response = await api.get("/user/get_deposits", {
        params:{
            user_id:user_id
        }
    });
    if (response.status===200)return response.data;
    return null
    } catch (error) {
        return null
    }
   

};
export const getWithdrawalsById = async (user_id:number)=>{
        try {
         const response = await api.get("/user/get_withdrawals", {
        params:{
            user_id:user_id
        }
    });
    if (response.status===200)return response.data;
    return null
    } catch (error) {
        return null
    }
}
