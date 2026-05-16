import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import dr from "../translations/dr.json";
import en from "../translations/en.json";
import ps from "../translations/ps.json";

const resources = {
  en: { translation: en },
  ps: { translation: ps },
  dr: { translation: dr },
};

//  Detect platform safely
const isWeb = typeof window !== "undefined";

//  Proper async language detector
const languageDetector = {
  type: "languageDetector",
  async: true,

  detect: async (callback) => {
    try {
      if (isWeb) {
        callback("en");
        return;
      }

      const savedLanguage = await AsyncStorage.getItem("language");
      callback(savedLanguage || "en");
    } catch (e) {
      callback("en");
    }
  },

  init: () => {},

  cacheUserLanguage: async (lng) => {
    try {
      if (!isWeb) {
        await AsyncStorage.setItem("language", lng);
      }
    } catch (e) {
      console.log("language save error", e);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",

    // 🔥 safer for Android + JSON parsing issues
    compatibilityJSON: "v3",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;