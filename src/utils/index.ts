import kbzLogo from "@/assets/kbzPayLogo.png";
import wavePayLogo from "@/assets/wave-logo-small.svg";
import usdtLogo from "@/assets/usdt.png";
export {
    kbzLogo,
    wavePayLogo,
    usdtLogo
}
export const isAuthenticated = () => {
  return !!localStorage.getItem("token")
}
