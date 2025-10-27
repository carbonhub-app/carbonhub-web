import Script from "next/script";

export default function Head() {
  return (
    <>
      <title>CarbonHub - Carbon Trading Dashboard</title>
      <meta
        name="description"
        content="Monitor and trade carbon credits with real-time market data"
      />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/web-app-manifest-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="/web-app-manifest-512x512.png"
      />
      <link rel="icon" type="image/png" href="/icon1.png" />
      <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ffffff" />
      <Script
          src="https://stat.faizath.com/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          data-domains={process.env.NEXT_PUBLIC_UMAMI_DOMAINS}
          strategy="afterInteractive"
      />
      {/* Add more meta tags as needed for PWA or SEO */}
    </>
  );
}
