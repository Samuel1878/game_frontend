import { kbzLogo, usdtLogo, wavePayLogo } from "@/utils";
export interface paymentTypes {
    id:number,
    label:string,
    value:string,
    icon:string
}
export const paymentMethod:paymentTypes[] = [
    {
        id:1,
        label:"KBZ Pay",
        value:"kbzPay",
        icon:kbzLogo

    },
    {
        id:2,
        label:"Wave Pay",
        value:"wavePay",
        icon:wavePayLogo
    },
    {
        id:3,
        label:"USDT",
        value:"usdt",
        icon:usdtLogo
    }
]