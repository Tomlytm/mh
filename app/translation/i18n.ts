import i18n, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr } from "./languages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import constants from "../config/constants";

const languageDetectorPlugin = {
  type: "languageDetector" as ModuleType,
  async: true,
  init: () => {},
  detect: function (callback: (lang: string) => void) {
    console.log("Language detector: Starting detection...");
    // Immediately return default language to avoid blocking
    callback("fr");
    
    // Try to get stored language in background
    AsyncStorage.getItem(constants.STORE_LANGUAGE_KEY)
      .then((language) => {
        if (language && language !== "fr") {
          console.log("Language detector: Found stored language:", language);
          // Update language after initial load
          import("i18next").then(({ default: i18n }) => {
            i18n.changeLanguage(language);
          });
        }
      })
      .catch((error) => {
        console.warn("Language detection error:", error);
      });
  },
  cacheUserLanguage: async function (language: string) {
    try {
      await AsyncStorage.setItem(constants.STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.warn("Language saving error:", error);
    }
  },
};

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
    .use(languageDetectorPlugin)
    .init({
      resources,
      compatibilityJSON: "v4",
      fallbackLng: "fr",
      interpolation: {
        escapeValue: false,
      },
    })
    .then(() => {
      console.log("i18n: Initialization completed successfully");
    })
    .catch((error) => {
      console.error("i18n: Initialization failed:", error);
      // Don't re-throw, just log the error
      return Promise.resolve();
    });
};

export default i18n;
