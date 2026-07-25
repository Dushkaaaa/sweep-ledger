import { redirect } from "next/navigation";
import { headers } from "next/headers";

const supportedLanguages = ["uk", "en", "pl", "de"] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

function detectLanguage(acceptLanguage: string | null): SupportedLanguage {
  if (!acceptLanguage) return "en";

  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase());

  for (const lang of preferred) {
    if (supportedLanguages.includes(lang as SupportedLanguage)) {
      return lang as SupportedLanguage;
    }
  }

  return "uk"; // дефолт, якщо мова браузера не підтримується
}

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  const lang = detectLanguage(acceptLanguage);

  redirect(`/${lang}`);
}