import kbzLogo from "@/assets/kbzPay.jpeg";
import wavePayLogo from "@/assets/wavePay.jpeg";
import ayaPayLogo from "@/assets/ayaPay.jpeg"
import usdtLogo from "@/assets/usdt.png";
import VA_Gaming from "@/assets/va_gaming.png";
import PG_Soft from "@/assets/pg_soft.png";
import Fast_Spin from "@/assets/fast_spin.png";
import Jili from "@/assets/jili.png";
import FaChai from "@/assets/fachai.png";
import KA_Gaming from "@/assets/ka_gaming.png";
import Pragmatic_Play from "@/assets/pragmatic_play.png";
import Advantplay from "@/assets/advant_play.png";
import African_Buffalo from "@/assets/african_buffalo.png";

import banner_1 from "@/assets/banner_1.png";
import banner_2 from "@/assets/banner_2.png";
import banner_3 from "@/assets/banner_3.png";
export {
    kbzLogo,
    ayaPayLogo,
    wavePayLogo,
    usdtLogo,
    VA_Gaming,
    PG_Soft,
    FaChai,
    Fast_Spin,
    Jili,
    KA_Gaming,
    Pragmatic_Play,
    Advantplay,
    African_Buffalo,
    banner_1,
    banner_2,
    banner_3
}
export const isAuthenticated = () => {
  return !!localStorage.getItem("token")
}
