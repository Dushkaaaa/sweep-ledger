"use client";

import Script from "next/script";

const GA_ID = "G-JRGWT1LDN9";

export function GoogleAnalytics() {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />

      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];

          function gtag(){
            window.dataLayer.push(arguments);
          }

          window.gtag = gtag;

          gtag('js', new Date());

          gtag('config', '${GA_ID}', {
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}