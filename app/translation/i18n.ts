import i18n, { ModuleType } from "i18next";
import { initReactI18next } from "react-i18next";
import { en, fr } from "./languages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import constants from "../config/constants";

const languageDetectorPlugin = {
  type: "languageDetector" as ModuleType,
  async: true,
  init: () => {},
  detect: async function (callback: (lang: string) => void) {
    try {
      // Get stored language from Async storage
      await AsyncStorage.getItem(constants.STORE_LANGUAGE_KEY).then(
        (language) => {
          if (language) {
            // If language was stored before, use this language in the app
            return callback(language);
          } else {
            // If language was not stored yet, use French as default
            return callback("fr");
          }
        }
      );
    } catch (error) {
      console.warn("Language detection error:", error);
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      // Save a user's language choice in Async storage
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
    });
};

export default i18n;
