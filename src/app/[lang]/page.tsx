// import { LandingSessionCheck } from "../_components/landing-session-check";
// import { ProductLanding } from "../_components/product-landing";
// import { LanguageProvider } from "../_i18n/language-provider";

// const supportedLanguages = ["uk", "en", "pl", "de"] as const;
// type SupportedLanguage = (typeof supportedLanguages)[number];

// export async function generateStaticParams() {
//   return supportedLanguages.map((lang) => ({ lang }));
// }

// export default async function LanguageHomePage({
//   params,
// }: {
//   params: Promise<{ lang: SupportedLanguage }>;
// }) {
//   const { lang } = await params;

//   return (
//     <LanguageProvider initialLanguage={lang}>
//       <LandingSessionCheck>
//         <ProductLanding />
//       </LandingSessionCheck>
//     </LanguageProvider>
//   );
// }

import { notFound } from "next/navigation";
import { ProductLanding } from "../_components/product-landing";
import { LanguageProvider } from "../_i18n/language-provider";
import { LandingSessionCheck } from "../_components/landing-session-check";

const supportedLanguages = ["uk", "en", "pl", "de"] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

export async function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function LanguageHomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  return (
    <LanguageProvider initialLanguage={lang}>
      <LandingSessionCheck>
        <ProductLanding />
      </LandingSessionCheck>
    </LanguageProvider>
  );
}