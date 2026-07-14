import Link from "next/link";
import { CookiePolicy } from "../_components/cookie-policy";

export const metadata = {
  title: "Cookie Policy",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <Link
            href="/"
            className="font-medium text-sky-700 transition hover:text-sky-800"
          >
            ← Back to home
          </Link>
          <span>•</span>
          <Link
            href="/privacy-policy"
            className="transition hover:text-sky-700"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            href="/terms-of-service"
            className="transition hover:text-sky-700"
          >
            Terms of Service
          </Link>
        </div>
        <CookiePolicy />
      </div>
    </main>
  );
}
