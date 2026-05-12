import type { ReportItem } from "./types";

type Summary = {
  betCount: {
    bonus: number;
    draw: number;
    lose: number;
    won: number;
  };
  turnover: {
    bonus: number;
    draw: number;
    lose: number;
    won: number;
  };
  winlose: number;
  commission: number;
  totalDeposit: number;
  totalWithdrawal: number;
};

export const getSummary = (data: ReportItem[] | null | undefined): Summary => {
    console.log("getSummary", data)
    if (!data) {
        return {
            betCount: { bonus: 0, draw: 0, lose: 0, won: 0 },
            turnover: { bonus: 0, draw: 0, lose: 0, won: 0 },
            winlose: 0,
            commission: 0,
            totalDeposit: 0,
            totalWithdrawal: 0,
        };
    }
  return data.reduce(
    (acc, item) => {
      acc.betCount.bonus += item?.betCount?.bonus || 0;
      acc.betCount.draw += item?.betCount?.draw || 0;
      acc.betCount.lose += item?.betCount?.lose || 0;
      acc.betCount.won += item?.betCount?.won || 0;

      acc.turnover.bonus += item?.turnover?.bonus || 0;
      acc.turnover.draw += item?.turnover?.draw || 0;
      acc.turnover.lose += item?.turnover?.lose || 0;
      acc.turnover.won += item?.turnover?.won || 0;

      acc.winlose += item?.winlose || 0;
      acc.commission += item?.commission || 0;
      acc.totalDeposit += item?.totalDeposit || 0;
      acc.totalWithdrawal += item?.totalWithdrawal || 0;

      return acc;
    },
    {
      betCount: { bonus: 0, draw: 0, lose: 0, won: 0 },
      turnover: { bonus: 0, draw: 0, lose: 0, won: 0 },
      winlose: 0,
      commission: 0,
      totalDeposit: 0,
      totalWithdrawal: 0,
    }
  );
};

export const toISODate = (d: any) => {
  return new Date(d.year, d.month - 1, d.day).toISOString();
};
export const isPWA = () => window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone === true;

export const isApp = () => {
  // 1. Check for Capacitor (most common in modern Vue/Ionic apps)
  const isCapacitor = (window as any).Capacitor?.isNative;

  // 2. Check for Cordova/PhoneGap
  const isCordova = !!(window as any).cordova;

  // 3. Protocol Check (Apps often run on capacitor://, ionic://, or file://)
  const isAppProtocol = ['capacitor:', 'http://localhost', 'file:', 'ionic:'].includes(window.location.protocol);

  // 4. Custom User Agent (If you injected a unique string into your App's WebView)
  // Most professional apps add something like "TZ99-APP" to the UA in native settings.
  const isCustomUA = navigator.userAgent.includes("TZ99-APP");

  return isCapacitor || isCordova || isAppProtocol || isCustomUA;
};