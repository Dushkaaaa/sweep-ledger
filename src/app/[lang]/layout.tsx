import type { Metadata } from "next";
import { notFound } from "next/navigation";

const supportedLanguages = ["uk", "en", "pl"] as const;

type SupportedLanguage = (typeof supportedLanguages)[number];

function isSupportedLanguage(value: string): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  const metadataByLang = {
    uk: {
      title: "Trackora — CRM для клінінгових компаній",
      description:
        "Trackora допомагає керувати працівниками, годинами, оплатами, авансами та звітами для клінінгових компаній.",
      locale: "uk_UA",
    },
    en: {
      title: "Trackora — CRM for cleaning companies",
      description:
        "Trackora helps cleaning businesses manage employees, hours, payouts, advances, and reports.",
      locale: "en_US",
    },
    pl: {
      title: "Trackora — CRM dla firm sprzątania",
      description:
        "Trackora pomaga zarządzać pracownikami, godzinami, wypłatami, zaliczkami i raportami dla firm sprzątania.",
      locale: "pl_PL",
    },
  } as const;

  const content = metadataByLang[lang];

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        "uk-UA": "/uk",
        "en-US": "/en",
        "pl-PL": "/pl",
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      locale: content.locale,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function LanguageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
