import { Advantplay, African_Buffalo, ayaPayLogo, FaChai, Fast_Spin, Jili, KA_Gaming, kbzLogo, PG_Soft, Pragmatic_Play, usdtLogo, VA_Gaming, wavePayLogo } from "@/utils";
import { ConciergeBell, Gamepad2Icon, HeartIcon, StarIcon, type LucideIcon } from "lucide-vue-next";
export interface paymentTypes {
    id:number,
    label:string,
    value:string,
    icon:string
}
export const amounts = [
    2000,
    5000,
    10000,
    30000,
    50000,
    100000,
    200000,
    500000

]
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
        label:"Aya Pay",
        value:"ayaPay",
        icon:ayaPayLogo
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
        value:"slot",
        label:"Slots",
        icon:Gamepad2Icon
    }
];
export const gameOption = [
{
    label:"Slots",
    value:"slots",
    icon:null,
    type:"Games",

},
{
    label:"Live Casino",
    value:"liveCasino",
    icon:null,
    type:"Live Casino",

},
{
    label:"Chess",
    value:"chess",
    icon:null,
    type:"Games",

},
]
export const slotGameProviders = [
    {
        id:1,
        name: "African Buffalo",
        GpId:1094,
       
        icon:African_Buffalo,
        
        
    },
        {
        id:2,
        name: "PG Soft",
        GpId:35,
        icon:PG_Soft,
        
        
    },
        {
        id:3,
        name: "Fastspin",
        GpId:1079,
        icon:Fast_Spin,
        
        
    },
        {
        id:4,
        name: "JILI",
        GpId:1020,
        icon:Jili,
        
        
    },
        {
        id:5,
        name: "FaChoi",
        GpId:1046,
        icon:FaChai,
        
        
    }   , {
        id:6,
        name: "KA Gaming",
        GpId:1042,
        icon:KA_Gaming,
        
        
    }  ,  {
        id:7,
        name: "Pragmatic Play",
        GpId:3,
        icon:Pragmatic_Play,
        
        
    },
     {
        id:8,
        name: "Advantplay",
        GpId:1034,
        icon:Advantplay,
        
        
    },
     {
        id:9,
 name: "VA Gaming",
        GpId:1085,
        icon:VA_Gaming,
        
        
    }
]