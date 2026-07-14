import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LanguageProvider } from "./_i18n/language-provider";
import { ConsentProvider } from "./providers/consent-provider";
import { AnalyticsWrapper } from "./analytics/analytics-wrapper";
import { CookieBanner } from "./_components/cookie-baner";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trackora",
  description:
    "Team hours, payouts, advances, and weekly reporting for service businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
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
