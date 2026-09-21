"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getWallets } from "@wallet-standard/app";
import type { Wallet, WalletAccount } from "@wallet-standard/base";
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
} from "@wallet-standard/features";
import type {
  StandardConnectFeature,
  StandardDisconnectFeature,
  StandardEventsFeature,
} from "@wallet-standard/features";
import {
  SolanaSignMessage,
  SolanaSignTransaction,
} from "@solana/wallet-standard-features";
import type {
  SolanaSignMessageFeature,
  SolanaSignTransactionFeature,
} from "@solana/wallet-standard-features";

const LAST_WALLET_KEY = "walletName";

/** A wallet is usable here only if it can connect and sign for Solana. */
function isSolanaWallet(wallet: Wallet): boolean {
  return (
    StandardConnect in wallet.features &&
    SolanaSignMessage in wallet.features &&
    SolanaSignTransaction in wallet.features
  );
}

/** Picks the Solana chain this account actually advertises. */
function solanaChain(account: WalletAccount): `solana:${string}` {
  const chain = account.chains.find((c) => c.startsWith("solana:"));
  return (chain ?? "solana:mainnet") as `solana:${string}`;
}

export interface WalletContextValue {
  /** Wallets the browser currently exposes that can sign for Solana. */
  wallets: Wallet[];
  wallet: Wallet | null;
  account: WalletAccount | null;
  /** Base58 address of the connected account, or null. */
  address: string | null;
  connected: boolean;
  connecting: boolean;
  select: (wallet: Wallet) => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | null;
  /** Takes and returns a serialised transaction, exactly as the wallet does. */
  signTransaction: ((transaction: Uint8Array) => Promise<Uint8Array>) | null;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within <WalletProvider>");
  return ctx;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Track wallets as extensions register and unregister themselves.
  useEffect(() => {
    const { get, on } = getWallets();
    const refresh = () => setWallets(get().filter(isSolanaWallet));
    refresh();
    const offRegister = on("register", refresh);
    const offUnregister = on("unregister", refresh);
    return () => {
      offRegister();
      offUnregister();
    };
  }, []);

  // Follow account changes (switching or locking) from the connected wallet.
  useEffect(() => {
    if (!wallet) return;
    const events = wallet.features[StandardEvents] as
      | StandardEventsFeature[typeof StandardEvents]
      | undefined;
    if (!events) return;
    return events.on("change", ({ accounts }) => {
      if (accounts) setAccount(accounts[0] ?? null);
    });
  }, [wallet]);

  // Reconnect silently to the last wallet when it has already authorised us.
  useEffect(() => {
    if (wallet || wallets.length === 0) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LAST_WALLET_KEY);
    } catch {
      return;
    }
    if (!stored) return;
    const previous = wallets.find((w) => w.name === stored);
    if (previous?.accounts.length) {
      setWallet(previous);
      setAccount(previous.accounts[0] ?? null);
    }
  }, [wallets, wallet]);

  const select = useCallback(async (next: Wallet) => {
    setConnecting(true);
    try {
      const feature = next.features[StandardConnect] as
        | StandardConnectFeature[typeof StandardConnect]
        | undefined;
      if (!feature) throw new Error(`${next.name} cannot connect`);
      const { accounts } = await feature.connect();
      const first = accounts[0];
      if (!first) throw new Error(`${next.name} returned no account`);
      setWallet(next);
      setAccount(first);
      try {
        localStorage.setItem(LAST_WALLET_KEY, next.name);
      } catch {
        // a blocked storage write should not fail the connection
      }
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const current = wallet;
    setWallet(null);
    setAccount(null);
    try {
      localStorage.removeItem(LAST_WALLET_KEY);
    } catch {
      // ignore
    }
    const feature = current?.features[StandardDisconnect] as
      | StandardDisconnectFeature[typeof StandardDisconnect]
      | undefined;
    if (feature) await feature.disconnect();
  }, [wallet]);

  const signMessage = useMemo(() => {
    if (!wallet || !account) return null;
    const feature = wallet.features[SolanaSignMessage] as
      | SolanaSignMessageFeature[typeof SolanaSignMessage]
      | undefined;
    if (!feature) return null;
    return async (message: Uint8Array): Promise<Uint8Array> => {
      const [result] = await feature.signMessage({ account, message });
      if (!result) throw new Error("Wallet returned no signature");
      return result.signature;
    };
  }, [wallet, account]);

  const signTransaction = useMemo(() => {
    if (!wallet || !account) return null;
    const feature = wallet.features[SolanaSignTransaction] as
      | SolanaSignTransactionFeature[typeof SolanaSignTransaction]
      | undefined;
    if (!feature) return null;
    return async (transaction: Uint8Array): Promise<Uint8Array> => {
      const [result] = await feature.signTransaction({
        account,
        transaction,
        chain: solanaChain(account),
      });
      if (!result) throw new Error("Wallet returned no signed transaction");
      return result.signedTransaction;
    };
  }, [wallet, account]);

  const value = useMemo<WalletContextValue>(
    () => ({
      wallets,
      wallet,
      account,
      address: account?.address ?? null,
      connected: !!account,
      connecting,
      select,
      disconnect,
      signMessage,
      signTransaction,
    }),
    [wallets, wallet, account, connecting, select, disconnect, signMessage, signTransaction],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
