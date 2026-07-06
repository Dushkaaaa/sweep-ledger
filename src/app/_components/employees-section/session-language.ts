import type { Session } from "@supabase/supabase-js";

import { isLanguageCode } from "../../_i18n/language-provider";
import type { LanguageCode } from "../../_i18n/translations";

export function getSessionLanguage(session: Session | null): LanguageCode | null {
  const language = session?.user.user_metadata.preferred_language;

  return typeof language === "string" && isLanguageCode(language)
    ? language
    : null;
}

export function getPreferredLanguage(
  profileLanguage: string | null | undefined,
  session: Session | null,
): LanguageCode | null {
  const sessionLanguage = getSessionLanguage(session);

  if (sessionLanguage) {
    return sessionLanguage;
  }

  const language = profileLanguage ?? null;

  return isLanguageCode(language) ? language : null;
}

export function getSessionCompanyName(session: Session | null) {
  const companyName = session?.user.user_metadata.company_name;

  return typeof companyName === "string" ? companyName : null;
}
