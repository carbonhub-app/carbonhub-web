'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { StagewiseToolbar } from "@stagewise/toolbar-next";
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import '@solana/wallet-adapter-react-ui/styles.css';

const stagewiseConfig = {
  plugins: [],
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
          {process.env.NODE_ENV === "development" && (
            <StagewiseToolbar config={stagewiseConfig} />
          )}
        </WalletModalProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}