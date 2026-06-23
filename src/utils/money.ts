const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "MMK",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

type MoneyValue = string | number | bigint;

const normalizeCurrency = (currency = "MMK") => currency.trim().toUpperCase();

export const currencyScale = (currency = "MMK") =>
  ZERO_DECIMAL_CURRENCIES.has(normalizeCurrency(currency)) ? 1n : 100n;

export const parseMoneyToMinorUnits = (
  input: MoneyValue,
  currency = "MMK",
): bigint => {
  const value = String(input).replace(/,/g, "").trim();
  const scale = currencyScale(currency);

  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    throw new Error("Amount must be a positive decimal with up to 2 digits");
  }

  const [whole = "0", fraction = ""] = value.split(".");

  if (scale === 1n) {
    if (fraction && BigInt(fraction.padEnd(2, "0")) !== 0n) {
      throw new Error("Amount must be a whole number for this currency");
    }

    return BigInt(whole);
  }

  return BigInt(whole) * scale + BigInt(fraction.padEnd(2, "0"));
};

export const formatMinorMoney = (
  amount: MoneyValue,
  currency = "MMK",
  options: { group?: boolean; fixedDecimals?: boolean } = {},
): string => {
  const scale = currencyScale(currency);
  const minor = BigInt(amount);
  const whole = minor / scale;
  const fraction = (minor % scale).toString().padStart(2, "0");
  const wholeText = options.group === false
    ? whole.toString()
    : new Intl.NumberFormat("en-US").format(Number(whole));

  if (scale === 1n) {
    return options.fixedDecimals ? `${wholeText}.00` : wholeText;
  }

  return `${wholeText}.${fraction}`;
};

export const normalizeMoneyForApi = (
  input: MoneyValue,
  currency = "MMK",
): string =>
  formatMinorMoney(parseMoneyToMinorUnits(input, currency), currency, {
    group: false,
    fixedDecimals: false,
  });

export const moneyToNumber = (input: unknown): number => {
  const value = Number(String(input ?? "0").replace(/,/g, ""));
  return Number.isFinite(value) ? value : 0;
};

/** Formats a backend decimal string without converting it into a JS number. */
export const formatDecimalMoney = (input: unknown): string => {
  const value = String(input ?? "0").trim();
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value);
  if (!match) return value || "0";

  const sign = match[1] ?? "";
  const whole = match[2] ?? "0";
  const fraction = match[3];
  const normalizedWhole = whole.replace(/^0+(?=\d)/, "");
  const groupedWhole = normalizedWhole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}${groupedWhole}${fraction ? `.${fraction}` : ""}`;
};

export const formatBackendMoney = (
  input: unknown,
  currency = "MMK",
  options: { withCurrency?: boolean } = {},
): string => {
  try {
    const minor = parseMoneyToMinorUnits(String(input ?? "0"), currency);
    const amount = formatMinorMoney(minor, currency);
    return options.withCurrency ? `${amount} ${normalizeCurrency(currency)}` : amount;
  } catch {
    const amount = String(input ?? "0");
    return options.withCurrency ? `${amount} ${normalizeCurrency(currency)}` : amount;
  }
};
