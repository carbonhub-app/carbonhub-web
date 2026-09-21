'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/context/WalletContext";
import { WalletModalProvider } from "@/context/WalletModalContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WalletProvider>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}
