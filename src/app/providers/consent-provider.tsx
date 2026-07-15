"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Consent = "accepted" | "rejected" | "custom" | null;

interface ConsentContextType {
  consent: Consent;
  analyticsConsent: boolean;
  mounted: boolean;
  acceptCookies: () => void;
  rejectCookies: () => void;
  updateAnalyticsConsent: (value: boolean) => void;
  savePreferences: () => void;
  resetCookies: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const saved = window.localStorage.getItem("cookie-consent") as Consent;

    return saved === "accepted" || saved === "rejected" || saved === "custom"
      ? saved
      : null;
  });
  const [analyticsConsent, setAnalyticsConsent] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedAnalytics = window.localStorage.getItem("cookie-analytics");

    return savedAnalytics === "true";
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-analytics", "true");

    setAnalyticsConsent(true);
    setConsent("accepted");
  };

  const rejectCookies = () => {
    localStorage.setItem("cookie-consent", "rejected");
    localStorage.setItem("cookie-analytics", "false");

    setAnalyticsConsent(false);
    setConsent("rejected");
  };

  const updateAnalyticsConsent = (value: boolean) => {
    setAnalyticsConsent(value);
  };

  const savePreferences = () => {
    localStorage.setItem(
      "cookie-consent",
      analyticsConsent ? "accepted" : "custom",
    );
    localStorage.setItem("cookie-analytics", String(analyticsConsent));
    setConsent(analyticsConsent ? "accepted" : "custom");
  };

  const resetCookies = () => {
    localStorage.removeItem("cookie-consent");
    localStorage.removeItem("cookie-analytics");

    setAnalyticsConsent(false);
    setConsent(null);
  };

  return (
    <ConsentContext.Provider
      value={{
        consent,
        analyticsConsent,
        mounted,
        acceptCookies,
        rejectCookies,
        updateAnalyticsConsent,
        savePreferences,
        resetCookies,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error("useConsent must be used inside ConsentProvider");
  }

  return context;
}
