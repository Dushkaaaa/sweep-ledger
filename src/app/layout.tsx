import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LanguageProvider } from "./_i18n/language-provider";
import { ConsentProvider } from "./providers/consent-provider";
import { CookieBanner } from "./_components/cookie-baner";
import "./globals.css";
import { AnalyticsWrapper } from "./analytics/analytics-wrapper";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://trackora.app";

// export const metadata: Metadata = {
//   metadataBase: new URL(siteUrl),
//   title: {
//     default: "Trackora — CRM for cleaning companies",
//     template: "%s | Trackora",
//   },
//   description:
//     "Trackora helps cleaning and service businesses manage employees, hours, payouts, advances, and weekly reports.",
//   keywords: [
//     "cleaning business software",
//     "cleaning company crm",
//     "employee tracking",
//     "service business management",
//     "weekly reports",
//   ],
//   alternates: {
//     canonical: "/",
//     languages: {
//       "uk-UA": "/uk",
//       "en-US": "/en",
//       "pl-PL": "/pl",
//     },
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   openGraph: {
//     title: "Trackora — CRM for cleaning companies",
//     description:
//       "Manage your cleaning team, hours, payouts, and weekly reporting in one place.",
//     url: siteUrl,
//     siteName: "Trackora",
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Trackora — CRM for cleaning companies",
//     description:
//       "Manage your cleaning team, hours, payouts, and weekly reporting in one place.",
//   },
// };

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Trackora — Employee & Workforce Management Software",
    template: "%s | Trackora",
  },

  description:
    "Trackora helps service businesses manage employees, work hours, payroll, advances, schedules, and reports in one simple platform.",

  keywords: [
    "employee management software",
    "workforce management",
    "service business software",
    "field service management",
    "staff scheduling",
    "time tracking",
    "payroll management",
    "team management",
    "employee tracking",
    "business management software",
    "job scheduling",
    "work reports",
    "small business software",
  ],

  alternates: {
    canonical: "/",
    languages: {
      "uk-UA": "/uk",
      "en-US": "/en",
      "pl-PL": "/pl",
      "de-DE": "/de",
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "Trackora — Employee & Workforce Management Software",
    description:
      "Manage employees, work hours, payroll, schedules, and reports in one powerful platform for service businesses.",
    url: siteUrl,
    siteName: "Trackora",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Trackora — Employee & Workforce Management Software",
    description:
      "Manage employees, work hours, payroll, schedules, and reports in one powerful platform for service businesses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full">
        <ConsentProvider>
          <LanguageProvider>
            <Analytics />
            {children}
            <CookieBanner />
            <AnalyticsWrapper />
          </LanguageProvider>
        </ConsentProvider>
      </body>
    </html>
  );
}
