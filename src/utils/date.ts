import moment from "moment-timezone";
export const toISOStringSafe = (value?: string | Date) => {
  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
};

export const formatMyanmarTime = (date?: string) => {
  if (!date) return "-";

  return moment
    .tz(date, "America/New_York")
    .tz("Asia/Yangon")
    .format("YYYY-MM-DD HH:mm:ss");
};

export const formatYangonDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const toISODate = (d: any) => {
  return new Date(d.year, d.month - 1, d.day).toISOString();
};
