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