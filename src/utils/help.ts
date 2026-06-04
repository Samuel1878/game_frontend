import type { ReportItem } from "./types";
import CryptoJs from "crypto-js";
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
    },
  );
};

export const isPWA = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone === true;

export const isApp = () => {
  const isCapacitor = (window as any).Capacitor?.isNative;
  const isCordova = !!(window as any).cordova;
  const isAppProtocol = [
    "capacitor:",
    "http://localhost",
    "file:",
    "ionic:",
  ].includes(window.location.protocol);
  const isCustomUA = navigator.userAgent.includes("TZ99-APP");
  return isCapacitor || isCordova || isAppProtocol || isCustomUA;
};

export const encryptPassword = (password: string) => {
  return CryptoJs.AES.encrypt(
    password,
    "AaMM01-SE9vd8v9daw3h3f9vaml3uva98w34rjv2@F9Cw@KA$!:*c",
  ).toString();
};
export const decryptPassword = (encrypted: string) => {
  try {
    const bytes = CryptoJs.AES.decrypt(
      encrypted,
      "AaMM01-SE9vd8v9daw3h3f9vaml3uva98w34rjv2@F9Cw@KA$!:*c",
    );

    return bytes.toString(CryptoJs.enc.Utf8);
  } catch {
    return "";
  }
};
