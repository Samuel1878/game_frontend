import {
  changeFundPinApi,
  setFundPinApi,
  verifyFundPinApi,
} from "./securityAPI";

export const setFundPinAPI = async (pin: string) => {
  return setFundPinApi(pin);
};
export const verifyFundPinAPI = async (pin: string) => {
  return verifyFundPinApi(pin);
};

export const changeFundPinAPI = async (oldPin: string, newPin: string) => {
  return changeFundPinApi(oldPin, newPin);
};
