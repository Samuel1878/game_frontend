import { Advantplay, ayaPayLogo, banner_1, banner_2, banner_3, FaChai, Fast_Spin, Jili, KA_Gaming, kbzLogo, PG_Soft, Pragmatic_Play, usdtLogo, VA_Gaming, wavePayLogo, bank_transfer, softswiss,
     slot, buffalo, fish, casino, chess, home, 
     paysafe,
     wallet_icon,
     in_icon,
     bank_ico,
     accountCenter,
     depositHistoryIcon,
     withdrawHistoryIcon,
     transaction,
     share,
     download,
     helpCenter,
     logout} from "@/utils";
import {  africanBuffaloSlots } from "./afbGames";
import { jiliGames } from "./jiliGames";
import { pragmaticPlayGames } from "./pragmaticGames";
import { kaGames } from "./kaGames";
import {  vaSlots } from "./vaGames";
import { advantPlayGames } from "./advantPlayGames";
import { pgSoftGames } from "./pgSoftGames";
import { fastSpinGames } from "./fastspinGames";
import { fachaiGames } from "./faChaiGames";
import { sboGames } from "./sboGames";
import { winGames } from "./568winGames";
import type { Game } from "@/utils/types";
import router from "@/router";
export const usdtRateToMMK = 4000;
export const footer_images = [
    PG_Soft,
    Pragmatic_Play,
    Jili,
    Fast_Spin,
    KA_Gaming,
   bank_transfer,
    FaChai,
   softswiss,
   VA_Gaming,
    paysafe


]
export interface paymentTypes {
    id:number,
    label:string,
    value:string,
    icon:string
}
export interface providersType {
    id:number;
    GpId:number;
    providerName:string;
    game:Game[]
}
export const amounts = [
    5000,
    10000,
    30000,
    50000,
    100000,
    200000,
    500000,
    1000000,
];
export const gameProviders:providersType[] = [
    {
        id:1,
        GpId:1094,
        providerName:"AfricanBuffalo",
        game:africanBuffaloSlots
    },
    {
        id:2,
        GpId:3,
        providerName:"PragmaticPlay",
        game:pragmaticPlayGames
    },
        {
        id:3,
        GpId:1020,
        providerName:"JiLiGaming",
        game:jiliGames
    },
        {
        id:4,
        GpId:35,
        providerName:"PGSoft",
        game:pgSoftGames
    },    {
        id:5,
        GpId:1085,
        providerName:"VAGaming",
        game:vaSlots
    },    {
        id:6,
        GpId:14,
        providerName:"SBOSlot",
        game:sboGames
    },    
    {
        id:7,
        GpId:1042,
        providerName:"KAGaming",
        game:kaGames
    },    {
        id:8,
        GpId:1079,
        providerName:"Fastspin",
        game:fastSpinGames
    },    {
        id:9,
        GpId:1046,
        providerName:"FaChai",
        game:fachaiGames
    },
      {
        id:10,
        GpId:1034,
        providerName:"AdvantPlay",
        game:advantPlayGames
    },
      {
        id:11,
        GpId:1029,
        providerName:"568winGames",
        game:winGames
    },
    {
        id:12,
        GpId:0,
        providerName:"All Providers",
        game:[...winGames, 
            ...fachaiGames,...advantPlayGames,
            ...fastSpinGames,...kaGames,...sboGames,
            ...vaSlots,...pgSoftGames,...jiliGames,
            ...pragmaticPlayGames,...africanBuffaloSlots]
    }
];

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
        label:"AYA Pay",
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
export const homeSlide = [
    {   id:1,
        image:banner_1,
        title:"title_one",
        description:"description_one",
        button:"button_one",
        action:""
    },
    {
        id:2,
        image:banner_2,
        title:"title_two",
        description:"description_two",
        button:"button_two",
        action:""
    }
    ,    {
        id:3,
        image:banner_3,
        title:"title_three",
        description:"description_three",
        button:"button_three",
        action:""
    }
]
export const gameOptions = [
    {
        id:1,
        path:"/",
        label:"lobby",
        image:home
    },
      {
        id:2,
        path:"/slots",
        label:"slots",
        image:slot
    },
    {
            id:3,
        path:"/buffalo",
        label:"buffalo",
        image:buffalo
    },
        {
            id:4,
        path:"/fishing",
        label:"fishing",
        image:fish
    },
    {
            id:5,
        path:"/casino",
        label:"casino",
        image:casino
    },
        {
            id:6,
        path:"/arcade-games",
        label:"arcade_games",
        image:chess
    },
  
];

export const slotGameProviders = [
    {
        id:1,
        name: "Pragmatic Play",
        GpId:3,
        icon:Pragmatic_Play,
        
        
    },
    {
        id:2,
        name: "PG Soft",
        GpId:35,
        icon:PG_Soft,
        
        
    },
        {
        id:3,
        name: "JILI",
        GpId:1020,
        icon:Jili,
        
        
    },

        {
        id:4,
        name: "FaChoi",
        GpId:1046,
        icon:FaChai,
        
        
    } ,
    {
        id:5,
        name: "Fastspin",
        GpId:1079,
        icon:Fast_Spin,
        
        
    },
 
    {
        id:6,
        name: "KA Gaming",
        GpId:1042,
        icon:KA_Gaming,
        
        
    }  ,
     {
        id:7,
        name: "Advantplay",
        GpId:1034,
        icon:Advantplay,
        
        
    },
     {
        id:8,
        name: "VA Gaming",
        GpId:1085,
        icon:VA_Gaming,    
    },
     
    // {
    //     id:10,
    //     name:"SBO games",
    //     GpId:14,
    //     icon:null,
    // },
    // {
    //     id:11,
    //     name:"568Win Games",
    //     GpId:1029,
    //     icon:null,
    // }
];
export const UserAction = [
    {
        id:1,
        label:"deposit",
        path:"/deposit",
        image:wallet_icon
    },
        {
            id:2,
        label:"withdraw",
        path:"/withdraw",
        image:in_icon
    },
     {
        id:3,
        label:"bank",
        path:"/user/bank-accounts",
        image:bank_ico
    },

]
export const MembershipCenter = [
    {
        id:1,
        label:"update_password",
        action:()=>{
            router.push("/user/change-password")
        },
        image:accountCenter
    },
    {
        id:2,
        label:"deposit_history",
               action:()=>{
                router.push("/user/deposit-history")
        },
        image:depositHistoryIcon
    },
        {
        id:3,
        label:"withdraw_history",
               action:()=>{
                router.push("/user/withdraw-history")
        },
        image:withdrawHistoryIcon
    },

            {
        id:7,
        label:"transaction",
               action:()=>{
                router.push("/user/transactions")
        },
        image:transaction
    },
      {
        id:4,
        label:"help_center",
               action:()=>{

        },
        image:helpCenter
    },
     {
        id:5,
        label:"invite",
               action:()=>{

        },
        image:share
    },
    {
        id:6,
        label:"download_app",
               action:()=>{
                router.push("/download")
        },
        image:download
    },
    {
        id:8,
        label:"logout",
               action:()=>{
                router.push("/download")
        },
        image:logout
    },
]

