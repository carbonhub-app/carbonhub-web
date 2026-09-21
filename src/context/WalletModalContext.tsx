"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import Image from "next/image";
import type { Wallet } from "@wallet-standard/base";

import { useWallet } from "@/context/WalletContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WalletModalContextValue {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const WalletModalContext = createContext<WalletModalContextValue | null>(null);

export function useWalletModal(): WalletModalContextValue {
  const ctx = useContext(WalletModalContext);
  if (!ctx) throw new Error("useWalletModal must be used within <WalletModalProvider>");
  return ctx;
}

export function WalletModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const { wallets, select, connecting } = useWallet();

  const onSelect = useCallback(
    async (wallet: Wallet) => {
      try {
        await select(wallet);
        setVisible(false);
      } catch (e) {
        // The wallet surfaces its own rejection UI; keep the picker open so the
        // person can try a different one.
        console.error("Failed to connect wallet", e);
      }
    },
    [select],
  );

  const value = useMemo(() => ({ visible, setVisible }), [visible]);

  return (
    <WalletModalContext.Provider value={value}>
      {children}
      <Dialog open={visible} onOpenChange={setVisible}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Connect a wallet</DialogTitle>
            <DialogDescription>
              {wallets.length > 0
                ? "Choose a wallet to continue."
                : "No Solana wallet was detected in this browser."}
            </DialogDescription>
          </DialogHeader>

          {wallets.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {wallets.map((wallet) => (
                <li key={wallet.name}>
                  <button
                    type="button"
                    disabled={connecting}
                    onClick={() => onSelect(wallet)}
                    className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:hover:bg-slate-800"
                  >
                    {wallet.icon && (
                      <Image
                        src={wallet.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="rounded"
                        unoptimized
                      />
                    )}
                    <span className="font-medium">{wallet.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <a
              href="https://phantom.app/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-200 px-4 py-3 text-center font-medium transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
            >
              Install Phantom
            </a>
          )}
        </DialogContent>
      </Dialog>
    </WalletModalContext.Provider>
  );
}
