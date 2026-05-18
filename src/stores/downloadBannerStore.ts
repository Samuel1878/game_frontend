import { defineStore } from "pinia";

export const useDownloadBannerStore = defineStore("downloadBanner", {
  state: () => ({
    showAppBanner: false,
    bannerHidden: false,
  }),

  actions: {
    showBanner() {
      if (!this.bannerHidden) {
        this.showAppBanner = true;
      }
    },

    hideBanner() {
      this.showAppBanner = false;
    },

    permanentlyHideBanner() {
      this.showAppBanner = false;
      this.bannerHidden = true;
    },
  },
});