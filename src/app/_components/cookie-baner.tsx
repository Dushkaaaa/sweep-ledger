"use client";

import { useState } from "react";
import { useConsent } from "../providers/consent-provider";

export function CookieBanner() {
  const {
    consent,
    mounted,
    analyticsConsent,
    acceptCookies,
    rejectCookies,
    updateAnalyticsConsent,
    savePreferences,
  } = useConsent();
  const [isManaging, setIsManaging] = useState(false);

  if (!mounted || consent) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-40px)] max-w-xl -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
      <h3 className="mb-2 text-lg font-semibold text-slate-900">🍪 Cookies</h3>

      <p className="mb-5 text-sm leading-6 text-slate-600">
        We use cookies to improve your experience and analyze website traffic.
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setIsManaging((value) => !value)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Manage cookies
        </button>

        <button
          onClick={rejectCookies}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Reject
        </button>

        <button
          onClick={acceptCookies}
          className="rounded-xl bg-[#0B1F3B] px-4 py-2 text-sm font-medium text-white"
        >
          Accept All
        </button>
      </div>

      {isManaging ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Necessary cookies
              </p>
              <p className="text-sm text-slate-500">Always active</p>
            </div>
            <span className="text-sm font-medium text-slate-500">
              Always active
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Analytics cookies
              </p>
              <p className="text-sm text-slate-500">Google Analytics</p>
            </div>

            <button
              type="button"
              onClick={() => updateAnalyticsConsent(!analyticsConsent)}
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                analyticsConsent
                  ? "bg-sky-600 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {analyticsConsent ? "ON" : "OFF"}
            </button>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                savePreferences();
                setIsManaging(false);
              }}
              className="rounded-xl bg-[#0B1F3B] px-4 py-2 text-sm font-medium text-white"
            >
              Save preferences
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
