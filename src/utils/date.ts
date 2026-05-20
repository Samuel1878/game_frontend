import moment from "moment-timezone"
export const toISOStringSafe = (
  value?: string | Date
) => {

  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};

export const formatMyanmarTime =(date?: string) => {
  if (!date) return "-";

  return moment.tz(date, "America/New_York")
    .tz("Asia/Yangon")
    .format("YYYY-MM-DD HH:mm:ss");
};

export const toISODate = (d: any) => {
  return new Date(d.year, d.month - 1, d.day).toISOString();
};