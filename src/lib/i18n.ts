import { createI18n } from "vue-i18n";
import { en, mm,cn } from "@/utils";
const messages = {
  en: en,
  mm:mm,
  cn:cn
};
const getDefaultLang = () => {
  const saved = localStorage.getItem("lang");

  if (saved) return saved;
  const browser = navigator.language.startsWith("mm") ? "mm" : "cn";
  return browser;
};

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLang(),
  fallbackLocale: "cn",
  messages,
});