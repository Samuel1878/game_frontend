
import api from "./api";

export const setFundPinAPI = async (pin: string) => {
  try {
    const res = await api.post("/user/fundpin/setup", { fundPin: pin });
    if (res.status === 200) return res.data;
    return null;
  } catch (error) {
    return null;
  }
};
export const verifyFundPinAPI = async (pin: string) => {
  try {
    const res = await api.post("/user/fundpin/verify", { fundPin:pin });
    if (res.status === 200) return res.data;
    return null;
  } catch (error) {
    return null;
  }
};

export const changeFundPinAPI = async (oldPin: string, newPin: string) => {
  try {
    const res = await api.put("/user/fundpin/change", { oldPin, newPin });
    if (res.status === 200) return res.data;
    return null;
  } catch (error) {
    return null;
  }
};

