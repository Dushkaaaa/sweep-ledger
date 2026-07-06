"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
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

const storageKey = "trackora-language";
const languageChangeEvent = "trackora-language-change";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "uk" || value === "en" || value === "de" || value === "pl";
}

function getBrowserLanguage() {
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

function getLanguageSnapshot(): LanguageCode {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const savedLanguage = window.localStorage.getItem(storageKey);

  return isLanguageCode(savedLanguage) ? savedLanguage : getBrowserLanguage();
}

function getServerLanguageSnapshot(): LanguageCode {
  return defaultLanguage;
}

function subscribeToLanguageChanges(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(languageChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(languageChangeEvent, onStoreChange);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguageChanges,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  function setLanguageState(nextLanguage: LanguageCode) {
    window.localStorage.setItem(storageKey, nextLanguage);
    window.dispatchEvent(new Event(languageChangeEvent));
  }

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
