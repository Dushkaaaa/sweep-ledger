"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  dictionaries,
  defaultLanguage,
  getLanguageMeta,
  type Dictionary,
  type LanguageCode,
} from "./translations";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: Dictionary;
};

const storageKey = "sweepledger-language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "uk" || value === "en" || value === "pl";
}

function getBrowserLanguage() {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const browserLanguages = window.navigator.languages.length
    ? window.navigator.languages
    : [window.navigator.language];

  for (const browserLanguage of browserLanguages) {
    const languageCode = browserLanguage.toLowerCase().split("-")[0] ?? "";

    if (isLanguageCode(languageCode)) {
      return languageCode;
    }
  }

  return defaultLanguage;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") {
      return defaultLanguage;
    }

    const savedLanguage = window.localStorage.getItem(storageKey);
    return isLanguageCode(savedLanguage) ? savedLanguage : getBrowserLanguage();
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: dictionaries[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}

export function useLanguageLocale() {
  const { language } = useLanguage();

  return getLanguageMeta(language).locale;
}
