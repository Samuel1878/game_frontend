// import { defineStore } from "pinia";

// export const usePopupStore = defineStore("popup", {
//   state: () => ({
//     show: false,
//     popupData: null as null | {
//       image: string;
//       title?: string;
//       description?: string;
//       actionText?: string;
//       actionLink?: string;
//     },
//   }),

//   actions: {
//     init(popupData: any) {
//       const hidden = localStorage.getItem("hide_global_popup");

//       if (hidden === "true") {
//         this.show = false;
//         return;
//       }

//       this.popupData = popupData;
//       this.show = true;
//     },

//     close() {
//       this.show = false;
//     },

//     dontShowAgain() {
//       localStorage.setItem("hide_global_popup", "true");
//       this.show = false;
//     },

//     reset() {
//       localStorage.removeItem("hide_global_popup");
//     },
//   },
// });