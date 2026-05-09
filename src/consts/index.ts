import { 
    
     slot, buffalo, fish, casino, chess, home, 
  
     wallet_icon,
     in_icon,
     bank_ico,
     accountCenter,
     depositHistoryIcon,
     withdrawHistoryIcon,
     transaction,
     share,
  
     helpCenter,

     services,
     openChat,
} from "@/utils";

import type { Game } from "@/utils/types";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { CircleQuestionMark, Handshake, HatGlasses, HeartHandshake, MonitorDown, Share2, ShieldAlert, Spade, SquareArrowRight, type LucideIcon } from "lucide-vue-next";
import type { Component } from "vue";
export const usdtRateToMMK = 4000;
export const footer_images = [
    '/providers/PG-WHITE.png',
    '/providers/PP-WHITE.png',
    '/providers/JL-WHITE.png',
    '/providers/fast_spin.png',
    '/providers/KA-WHITE.png',
    '/partners/bank_transfer.svg',
    "/providers/FC-WHITE.png",
   "/providers/advant_play.png",
   "/providers/va-white.webp",
   "/providers/sbo.png",
   "/providers/568.png",
   "/providers/advant_play.png",
   "/partners/softswiss.svg",
    "/partners/paysafe.svg",


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
// export const gameProviders:providersType[] = [
//     {
//         id:1,
//         GpId:1094,
//         providerName:"AfricanBuffalo",
//         game:africanBuffaloSlots
//     },
//     {
//         id:2,
//         GpId:3,
//         providerName:"PragmaticPlay",
//         game:pragmaticPlayGames
//     },
//         {
//         id:3,
//         GpId:1020,
//         providerName:"JiLiGaming",
//         game:jiliGames
//     },
//         {
//         id:4,
//         GpId:35,
//         providerName:"PGSoft",
//         game:pgSoftGames
//     },    {
//         id:5,
//         GpId:1085,
//         providerName:"VAGaming",
//         game:vaSlots
//     },    {
//         id:6,
//         GpId:14,
//         providerName:"SBOSlot",
//         game:sboGames
//     },    
//     {
//         id:7,
//         GpId:1042,
//         providerName:"KAGaming",
//         game:kaGames
//     },    {
//         id:8,
//         GpId:1079,
//         providerName:"Fastspin",
//         game:fastSpinGames
//     },    {
//         id:9,
//         GpId:1046,
//         providerName:"FaChai",
//         game:fachaiGames
//     },
//       {
//         id:10,
//         GpId:1034,
//         providerName:"AdvantPlay",
//         game:advantPlayGames
//     },
//       {
//         id:11,
//         GpId:1029,
//         providerName:"568winGames",
//         game:winGames
//     },
//     {
//         id:12,
//         GpId:0,
//         providerName:"All Providers",
//         game:[...winGames, 
//             ...fachaiGames,...advantPlayGames,
//             ...fastSpinGames,...kaGames,...sboGames,
//             ...vaSlots,...pgSoftGames,...jiliGames,
//             ...pragmaticPlayGames,...africanBuffaloSlots]
//     }
// ];

export const paymentMethod:paymentTypes[] = [
    {
        id:1,
        label:"KBZ Pay",
        value:"kbzPay",
        icon:"/payments/kbzpay.svg"

    },
    {
        id:2,
        label:"Wave Pay",
        value:"wavePay",
        icon:"/payments/wavepay.jpeg"
    },
    {
        id:3,
        label:"AYA Pay",
        value:"ayaPay",
        icon:"/payments/ayabanking.png"
    },
            {
        id:4,
        label:"KBZ Bank",
        value:"kbzBank",
        icon:"/payments/kbzbanking-new.png"
    },
    {
        id:5,
        label:"USDT",
        value:"usdt",
        icon:'/payments/USDT.png'
    },


];
export const paymentMethodOption = [
    {
        id:1,
        label:"all",
        value:"all",
        
    },
    {
        id:2,
        label:"KBZ Pay",
        value:"kbzPay",
    

    },
    {
        id:3,
        label:"Wave Pay",
        value:"wavePay",
   
    },
    {
        id:4,
        label:"AYA Pay",
        value:"ayaPay",
   
    },
    {
        id:5,
        label:"USDT",
        value:"usdt",
    
    },
    {
        id:6,
        label:"KBZ Bank",
        value:"kbzBank",
    
    }
];
export const paymentMethodDeposit:paymentTypes[] = [
    {
        id:1,
        label:"KBZ Pay",
        value:"kbzPay",
        icon:"/payments/kbzpay.svg"

    },
    {
        id:2,
        label:"Wave Pay",
        value:"wavePay",
        icon:"/payments/wavepay.jpeg"
    },
    {
        id:3,
        label:"AYA Pay",
        value:"ayaPay",
        icon:"/payments/ayabanking.png"
    },
    {
        id:4,
        label:"USDT",
        value:"usdt",
        icon:'/payments/USDT.png'
    },


];
export const homeSlide = [

    {   id:1,
        image:"/images/slider_1.jpg",
        cn_image:"/images/slider_1_cn.jpg",
        title:"title_one",
        description:"description_one",
        button:"button_one",
        action:""
    },
    {
        id:2,
        image:"/images/slider_2.jpg",
        cn_image:"/images/slider_2_cn.jpg",
        title:"title_two",
        description:"description_two",
        button:"button_two",
        action:""
    }
    ,    {
        id:3,
        image:"/images/slider_3.jpg",
        cn_image:"/images/slider_3_cn.jpg",
        title:"title_three",
        description:"description_three",
        button:"button_three",
        action:""
    },
     {   id:4,
        image:"/images/slider_4.jpg",
        cn_image:"/images/slider_4_cn.jpg",
        title:"title_one",
        description:"description_one",
        button:"button_one",
        action:""
    },
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
        icon:"/providers/PP-WHITE.png",
        
        
    },
    {
        id:2,
        name: "PG Soft",
        GpId:35,
        icon:"/providers/PG-WHITE.png",
        
        
    },
        {
        id:3,
        name: "JILI",
        GpId:1020,
        icon:"/providers/JL-WHITE.png",
        
    },

        {
        id:4,
        name: "FaChoi",
        GpId:1046,
        icon:  "/providers/FC-WHITE.png",
        
        
    } ,
    {
        id:5,
        name: "Fastspin",
        GpId:1079,
        icon:"/providers/fast_spin.png",
        
        
    },
 
    {
        id:6,
        name: "KA Gaming",
        GpId:1042,
        icon:"/providers/KA-WHITE.png",
        
        
    }  ,
     {
        id:7,
        name: "Advantplay",
        GpId:1034,
        icon:"/providers/advant_play.png",
        
        
    },
     {
        id:8,
        name: "VA Gaming",
        GpId:1085,
        icon:"/providers/va-white.webp",    
    },
     
    {
        id:10,
        name:"SBO games",
        GpId:14,
        icon:"/providers/sbo.png",
    },
    {
        id:11,
        name:"568Win Games",
        GpId:1029,
        icon:"/providers/568.png",
    }
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

interface MembershipType {
  id: number;
  label: string;
  action: () => void;

  image?: string;        // image URL or asset path
  icon?: LucideIcon | Component; // Lucide icon component

  isComingSoon?: boolean;
}
export const MembershipCenter:MembershipType[] = [
    {
        id:1,
        label:"update_password",
        action:()=>{
            router.push("/user/update-password")
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
        id:4,
        label:"transaction",
               action:()=>{
                router.push("/user/transactions")
        },
        image:transaction
    },
    {
        id:5,
        label:"agent_center",
        action:()=>{
            router.push("/user/agent-center/overview")
        },
        image:share
    },

    {
        id:6,
        label:"partnership",
        action:()=>{
            openChat()
        },
        isComingSoon:true,
        icon:HeartHandshake
    },
    
    {
        id:7,
        label:"bet_list",
        action:()=>{
           router.push("/user/betlist")
        },
        isComingSoon:true,
        icon:Spade
    },
        {
        id:8,
        label:"customer_service",
               action:()=>{
                openChat()
        },
        image:services
    },
         {
        id:9,
        label:"share",
        action:()=>{
            openChat()
        },
        isComingSoon:true,
        icon:Share2
    },

    {
        id:10,
        label:"download_app",
               action:()=>{
                router.push("/download")
        },
        icon:MonitorDown
        // image:download
    },
    {
        id:11,
        label:"help_center",
               action:()=>{
                router.push("/help")
        },
        image:helpCenter
    },

    {
        id:12,
        label:"terms_and_conditions",
               action:()=>{
                router.push("/terms")
        },
        icon:Handshake
    },
        {
        id:13,
        label:  "policy_and_privacy",
               action:()=>{
                router.push("/privacy")
        },
        icon:HatGlasses
    },
        {
        id:14,
        label:"responsible_gaming",
               action:()=>{
                router.push("/responsible")
        },
        icon:ShieldAlert
    },
    {
        id:15,
        label:"faq",
               action:()=>{
                router.push("/faq")
        },
        icon:CircleQuestionMark
    },
        {
        id:16,
        label:"logout",
               action:()=>{
                const auth = useAuthStore();
                auth.logout()
        },
       icon:SquareArrowRight
    },
]



export const mockBetList = [
  {
    mainBetRef: "MBR10001",
    gamePeriodId: "GP20260101",
    gameRoundId: "GR1001",
    gameType: "SLOT",
    turnoverStake: 1200,
    orderDetail: "Spin 1",
    gameResult: "WIN",
    gameId: 1,
    gpId: 101,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T10:10:00.000Z",
    modifyDate: "2026-05-08T10:11:00.000Z",
    settleTime: "2026-05-08T10:12:00.000Z",
    winLostDate: "2026-05-08T10:12:00.000Z",
    refNo: "REF10001",
    username: "player001",
    currency: "USD",
    stake: 100,
    winLost: 250,
    status: "win",
    topDownline: null,
    newGameType: 1,
  },
  {
    mainBetRef: "MBR10002",
    gamePeriodId: "GP20260102",
    gameRoundId: "GR1002",
    gameType: "LIVE",
    turnoverStake: 500,
    orderDetail: "Round A",
    gameResult: "LOSE",
    gameId: 2,
    gpId: 102,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T10:20:00.000Z",
    modifyDate: "2026-05-08T10:21:00.000Z",
    settleTime: "2026-05-08T10:22:00.000Z",
    winLostDate: "2026-05-08T10:22:00.000Z",
    refNo: "REF10002",
    username: "player002",
    currency: "USD",
    stake: 50,
    winLost: -50,
    status: "lose",
    topDownline: null,
    newGameType: 2,
  },
  {
    mainBetRef: "MBR10003",
    gamePeriodId: "GP20260103",
    gameRoundId: "GR1003",
    gameType: "SPORT",
    turnoverStake: 800,
    orderDetail: "Match 1",
    gameResult: "WIN",
    gameId: 3,
    gpId: 103,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T10:30:00.000Z",
    modifyDate: "2026-05-08T10:31:00.000Z",
    settleTime: "2026-05-08T10:32:00.000Z",
    winLostDate: "2026-05-08T10:32:00.000Z",
    refNo: "REF10003",
    username: "player003",
    currency: "USD",
    stake: 200,
    winLost: 180,
    status: "win",
    topDownline: null,
    newGameType: 3,
  },
  {
    mainBetRef: "MBR10004",
    gamePeriodId: "GP20260104",
    gameRoundId: "GR1004",
    gameType: "SLOT",
    turnoverStake: 300,
    orderDetail: "Spin 2",
    gameResult: "DRAW",
    gameId: 4,
    gpId: 104,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T10:40:00.000Z",
    modifyDate: "2026-05-08T10:41:00.000Z",
    settleTime: "2026-05-08T10:42:00.000Z",
    winLostDate: "2026-05-08T10:42:00.000Z",
    refNo: "REF10004",
    username: "player004",
    currency: "USD",
    stake: 80,
    winLost: 0,
    status: "draw",
    topDownline: null,
    newGameType: 1,
  },
  {
    mainBetRef: "MBR10005",
    gamePeriodId: "GP20260105",
    gameRoundId: "GR1005",
    gameType: "CASINO",
    turnoverStake: 1500,
    orderDetail: "Blackjack",
    gameResult: "WIN",
    gameId: 5,
    gpId: 105,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T10:50:00.000Z",
    modifyDate: "2026-05-08T10:51:00.000Z",
    settleTime: "2026-05-08T10:52:00.000Z",
    winLostDate: "2026-05-08T10:52:00.000Z",
    refNo: "REF10005",
    username: "player005",
    currency: "USD",
    stake: 300,
    winLost: 450,
    status: "win",
    topDownline: null,
    newGameType: 4,
  },
  {
    mainBetRef: "MBR10006",
    gamePeriodId: "GP20260106",
    gameRoundId: "GR1006",
    gameType: "SPORT",
    turnoverStake: 600,
    orderDetail: "Match 2",
    gameResult: "LOSE",
    gameId: 6,
    gpId: 106,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T11:00:00.000Z",
    modifyDate: "2026-05-08T11:01:00.000Z",
    settleTime: "2026-05-08T11:02:00.000Z",
    winLostDate: "2026-05-08T11:02:00.000Z",
    refNo: "REF10006",
    username: "player006",
    currency: "USD",
    stake: 120,
    winLost: -120,
    status: "lose",
    topDownline: null,
    newGameType: 3,
  },
  {
    mainBetRef: "MBR10007",
    gamePeriodId: "GP20260107",
    gameRoundId: "GR1007",
    gameType: "SLOT",
    turnoverStake: 900,
    orderDetail: "Spin 3",
    gameResult: "WIN",
    gameId: 7,
    gpId: 107,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T11:10:00.000Z",
    modifyDate: "2026-05-08T11:11:00.000Z",
    settleTime: "2026-05-08T11:12:00.000Z",
    winLostDate: "2026-05-08T11:12:00.000Z",
    refNo: "REF10007",
    username: "player007",
    currency: "USD",
    stake: 150,
    winLost: 300,
    status: "win",
    topDownline: null,
    newGameType: 1,
  },
  {
    mainBetRef: "MBR10008",
    gamePeriodId: "GP20260108",
    gameRoundId: "GR1008",
    gameType: "CASINO",
    turnoverStake: 400,
    orderDetail: "Roulette",
    gameResult: "LOSE",
    gameId: 8,
    gpId: 108,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T11:20:00.000Z",
    modifyDate: "2026-05-08T11:21:00.000Z",
    settleTime: "2026-05-08T11:22:00.000Z",
    winLostDate: "2026-05-08T11:22:00.000Z",
    refNo: "REF10008",
    username: "player008",
    currency: "USD",
    stake: 60,
    winLost: -60,
    status: "lose",
    topDownline: null,
    newGameType: 4,
  },
  {
    mainBetRef: "MBR10009",
    gamePeriodId: "GP20260109",
    gameRoundId: "GR1009",
    gameType: "SPORT",
    turnoverStake: 1100,
    orderDetail: "Match 3",
    gameResult: "WIN",
    gameId: 9,
    gpId: 109,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T11:30:00.000Z",
    modifyDate: "2026-05-08T11:31:00.000Z",
    settleTime: "2026-05-08T11:32:00.000Z",
    winLostDate: "2026-05-08T11:32:00.000Z",
    refNo: "REF10009",
    username: "player009",
    currency: "USD",
    stake: 220,
    winLost: 500,
    status: "win",
    topDownline: null,
    newGameType: 3,
  },
  {
    mainBetRef: "MBR10010",
    gamePeriodId: "GP20260110",
    gameRoundId: "GR1010",
    gameType: "SLOT",
    turnoverStake: 700,
    orderDetail: "Spin 4",
    gameResult: "DRAW",
    gameId: 10,
    gpId: 110,
    isGameProviderPromotion: false,
    orderTime: "2026-05-08T11:40:00.000Z",
    modifyDate: "2026-05-08T11:41:00.000Z",
    settleTime: "2026-05-08T11:42:00.000Z",
    winLostDate: "2026-05-08T11:42:00.000Z",
    refNo: "REF10010",
    username: "player010",
    currency: "USD",
    stake: 90,
    winLost: 0,
    status: "draw",
    topDownline: null,
    newGameType: 1,
  },
];