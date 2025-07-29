import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr } from "./languages";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
};

export const initI18n = () => {
  console.log("i18n: Starting initialization...");
  return i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: "fr", // Default to French
      fallbackLng: "fr",
      compatibilityJSON: "v4",
      interpolation: {
        escapeValue: false,
      },
    })
    .then(() => {
      console.log("i18n: Initialization completed successfully");
    })
    .catch((error) => {
      console.error("i18n: Initialization failed:", error);
      return Promise.resolve();
    });
};

export default i18n;