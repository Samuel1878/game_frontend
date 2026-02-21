import { Advantplay, African_Buffalo, ayaPayLogo, FaChai, Fast_Spin, Jili, KA_Gaming, kbzLogo, PG_Soft, Pragmatic_Play, usdtLogo, VA_Gaming, wavePayLogo } from "@/utils";
import { Gamepad2Icon, HeartIcon, StarIcon } from "lucide-vue-next";
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
    label:"Lobby",
    value:"lobby",
    icon:null,
    type:"Games",

},
{
    label:"Slots",
    value:"slots",
    icon:null,
    type:"Games"
},
{
    label:"Live Casino",
    value:"liveCasino",
    icon:null,
    type:"Live Casino",

},
{
    label:"Table Games",
    value:"tableGames",
    icon:null,
    type:"Games"
},
{
    label:"Arcade Games",
    value:"arcadeGames",
    icon:null,
    type:"Games"
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
        data:africanBuffaloSlots,
        icon:African_Buffalo,
        
        
    },
        {
        id:2,
        name: "PG Soft",
        GpId:35,
        icon:PG_Soft,
        data:pgSoftGames
        
        
    },
        {
        id:3,
        name: "Fastspin",
        GpId:1079,
        icon:Fast_Spin,
        data:fastSpinGames
        
        
    },
        {
        id:4,
        name: "JILI",
        GpId:1020,
        icon:Jili,
        data:jiliGames
        
        
    },
        {
        id:5,
        name: "FaChoi",
        GpId:1046,
        icon:FaChai,
        data:fachaiGames
        
        
    }   , {
        id:6,
        name: "KA Gaming",
        GpId:1042,
        icon:KA_Gaming,
        data:kaGames
        
        
    }  ,  {
        id:7,
        name: "Pragmatic Play",
        GpId:3,
        icon:Pragmatic_Play,
        data:pragmaticPlayGames
        
        
    },
     {
        id:8,
        name: "Advantplay",
        GpId:1034,
        icon:Advantplay,
        data:advantPlayGames
        
        
    },
     {
        id:9,
        name: "VA Gaming",
        GpId:1085,
        icon:VA_Gaming,
        data:vaSlots
        
        
    },
    {
        id:10,
        name:"SBO games",
        GpId:14,
        icon:null,
        data:sboGames
    },
    {
        id:11,
        name:"568Win Games",
        GpId:1029,
        icon:null,
        data:winGames
    }
]

export const topGames = [
    {
            "gameProviderId": 1094,
            "gameID": 16,
            "gameType": 2,
            "newGameType": 201,
            "rank": 16,
            "device": "d/m",
            "platform": "HTML5",
            "provider": "AfricanBuffalo",
            "rtp": 0.950000,
            "rows": 0,
            "reels": 0,
            "lines": 0,
            "gameInfos": [
                {
                    "language": "en",
                    "gameName": "African Buffalo Megaways",
                    "gameIconUrl": "https://cdn-test.cdn568.net/AfricanBuffalo/16/1094_16_AfricanBuffaloMegaways.png"
                },
                {
                    "language": "zh_cn",
                    "gameName": "African Buffalo Megaways",
                    "gameIconUrl": "https://cdn-test.cdn568.net/AfricanBuffalo/16/1094_16_AfricanBuffaloMegaways.png"
                }
            ],
            "supportedCurrencies": [
                "MMK",
                "TMP"
            ],
            "blockCountries": [],
            "isMaintain": false,
            "isEnabled": true,
            "isProvideCommission": false,
            "hasHedgeBet": false,
            "providerStatus": "Online",
            "isProviderOnline": true
        },
                {
            "gameProviderId": 3,
            "gameID": 438,
            "gameType": 2,
            "newGameType": 201,
            "rank": 1,
            "device": "d/m",
            "platform": "HTML5",
            "provider": "PragmaticPlay",
            "rtp": 0.965000,
            "rows": 5,
            "reels": 6,
            "lines": 20,
            "gameInfos": [
                {
                    "language": "en",
                    "gameName": "Gates of Olympus 1000",
                    "gameIconUrl": "https://cdn-test.cdn568.net/PragmaticPlay/438/3_438_GatesofOlympus1000.png?v=6"
                },
                {
                    "language": "zh_cn",
                    "gameName": "奥林匹斯之门 1000™",
                    "gameIconUrl": "https://cdn-test.cdn568.net/images/games/PragmaticPlay/3_438_GatesofOlympus1000_CN.png"
                }
            ],
            "supportedCurrencies": [
                "KZT",
                "IDO",
                "IDR",
                "TMP",
                "VND",
                "VNO",
                "AUD",
                "BDT",
                "BND",
                "BRL",
                "CAD",
                "CHF",
                "CNY",
                "EUR",
                "GBP",
                "HKD",
                "INR",
                "JPY",
                "KHR",
                "KRW",
                "LAK",
                "LKR",
                "MMK",
                "MXN",
                "MYR",
                "NGN",
                "NOK",
                "NPR",
                "NZD",
                "PHP",
                "PKR",
                "THB",
                "TRY",
                "USD",
                "ZAR"
            ],
            "blockCountries": [],
            "isMaintain": false,
            "isEnabled": true,
            "isProvideCommission": false,
            "hasHedgeBet": false,
            "providerStatus": "Online",
            "isProviderOnline": true
        },
        {
            "gameProviderId": 3,
            "gameID": 567,
            "gameType": 2,
            "newGameType": 201,
            "rank": 2,
            "device": "d/m",
            "platform": "HTML5",
            "provider": "PragmaticPlay",
            "rtp": 0.970000,
            "rows": 4,
            "reels": 5,
            "lines": 1999,
            "gameInfos": [
                {
                    "language": "en",
                    "gameName": "Mahjong Wins 2",
                    "gameIconUrl": "https://cdn-test.cdn568.net/PragmaticPlay/567/3_567_MahjongWins2.png?v=1"
                },
                {
                    "language": "zh_cn",
                    "gameName": "麻将大胜2",
                    "gameIconUrl": "https://cdn-test.cdn568.net/PragmaticPlay/567/3_567_MahjongWins2_CN.png"
                }
            ],
            "supportedCurrencies": [
                "KZT",
                "IDO",
                "IDR",
                "TMP",
                "VND",
                "VNO",
                "AUD",
                "BDT",
                "BND",
                "BRL",
                "CAD",
                "CHF",
                "CNY",
                "EUR",
                "GBP",
                "HKD",
                "INR",
                "JPY",
                "KHR",
                "KRW",
                "LAK",
                "LKR",
                "MMK",
                "MXN",
                "MYR",
                "NGN",
                "NOK",
                "NPR",
                "NZD",
                "PHP",
                "PKR",
                "THB",
                "TRY",
                "USD",
                "ZAR"
            ],
            "blockCountries": [],
            "isMaintain": false,
            "isEnabled": true,
            "isProvideCommission": false,
            "hasHedgeBet": false,
            "providerStatus": "Online",
            "isProviderOnline": true
        },
]