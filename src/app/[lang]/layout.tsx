import type { Metadata } from "next";
import { notFound } from "next/navigation";

const supportedLanguages = ["uk", "en", "pl", "de"] as const;

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
    title: "Trackora — Управління персоналом та робочим часом",
    description:
      "Trackora допомагає сервісним компаніям керувати працівниками, робочим часом, зарплатою, авансами, графіками та звітами в одній платформі.",
    locale: "uk_UA",
  },
  en: {
    title: "Trackora — Employee & Workforce Management Software",
    description:
      "Trackora helps service businesses manage employees, work hours, payroll, advances, schedules, and reports in one platform.",
    locale: "en_US",
  },
  pl: {
    title: "Trackora — Zarządzanie pracownikami i czasem pracy",
    description:
      "Trackora pomaga firmom usługowym zarządzać pracownikami, godzinami pracy, wypłatami, zaliczkami, grafikami i raportami w jednej platformie.",
    locale: "pl_PL",
  },
  de: {
    title: "Trackora — Mitarbeiter- und Arbeitszeitverwaltung",
    description:
      "Trackora hilft Dienstleistungsunternehmen, Mitarbeiter, Arbeitsstunden, Gehälter, Vorschüsse, Zeitpläne und Berichte in einer Plattform zu verwalten.",
    locale: "de_DE",
  },
    alternates: {
  canonical: `/${lang}`,
  languages: {
    "uk-UA": "/uk",
    "en-US": "/en",
    "pl-PL": "/pl",
    "de-DE": "/de",
  },
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
