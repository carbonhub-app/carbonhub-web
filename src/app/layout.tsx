import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CarbonHub",
  description: "CarbonHub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://stat.faizath.com/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          data-domains={process.env.NEXT_PUBLIC_UMAMI_DOMAINS}
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}