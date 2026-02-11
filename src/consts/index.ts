import { kbzLogo, usdtLogo, wavePayLogo } from "@/utils";
import { ConciergeBell, Gamepad2Icon, HeartIcon, StarIcon, type LucideIcon } from "lucide-vue-next";
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
];
export const homeOptions = [
    {
        value:"hotGames",
        label:"Hot Games",
        icon:StarIcon
    },
    {
        value:"favGames",
        label:"Favorite Games",
        icon:HeartIcon
    },
    {
        value:"newGames",
        label:"New Games",
        icon:Gamepad2Icon
    }
]