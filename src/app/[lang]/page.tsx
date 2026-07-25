// import { EmployeesSection } from "../_components/employees-section";
// import { SiteFooter } from "../_components/site-footer";

// export async function generateStaticParams() {
//   return [{ lang: "uk" }, { lang: "en" }, { lang: "pl" }];
// }

// export default function LanguageHomePage() {
//   return (
//     <main className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(34,211,238,0.34)_0%,_rgba(224,247,255,0.74)_32%,_transparent_62%),linear-gradient(135deg,_#effcff_0%,_#dff7fb_42%,_#eef8ff_100%)]">
//       <EmployeesSection />
//       <SiteFooter />
//     </main>
//   );
// }

import { LandingSessionCheck } from "../_components/landing-session-check";
import { ProductLanding } from "../_components/product-landing";
import { LanguageProvider } from "../_i18n/language-provider";

const supportedLanguages = ["uk", "en", "pl", "de"] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

export async function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export default async function LanguageHomePage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;

  return (
    <LanguageProvider initialLanguage={lang}>
      <LandingSessionCheck>
        <ProductLanding />
      </LandingSessionCheck>
    </LanguageProvider>
  );
}