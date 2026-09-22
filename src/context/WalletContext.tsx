"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
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

import { readLocalStorage, writeLocalStorage } from "@/hooks/use-local-storage";

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

// The registry is an external store. Snapshots are cached so that
// useSyncExternalStore sees a stable value between registrations.
const NO_WALLETS: readonly Wallet[] = [];
let walletsSnapshot: readonly Wallet[] = NO_WALLETS;

function subscribeToWallets(onChange: () => void) {
  const { get, on } = getWallets();
  const refresh = () => {
    walletsSnapshot = get().filter(isSolanaWallet);
    onChange();
  };
  refresh();
  const offRegister = on("register", refresh);
  const offUnregister = on("unregister", refresh);
  return () => {
    offRegister();
    offUnregister();
  };
}

function getWalletsSnapshot(): readonly Wallet[] {
  return walletsSnapshot;
}

function getServerWalletsSnapshot(): readonly Wallet[] {
  return NO_WALLETS;
}

export interface WalletContextValue {
  /** Wallets the browser currently exposes that can sign for Solana. */
  wallets: readonly Wallet[];
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
  const wallets = useSyncExternalStore(
    subscribeToWallets,
    getWalletsSnapshot,
    getServerWalletsSnapshot,
  );

  // Set when this session connects explicitly; null means fall back to the
  // wallet remembered from a previous visit.
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const wallet = useMemo(() => {
    const explicit = selectedName
      ? (wallets.find((w) => w.name === selectedName) ?? null)
      : null;
    if (explicit) return explicit;
    if (selectedName) return null;

    // Adopt the remembered wallet only when it has already authorised us, so
    // reconnecting never triggers a prompt the visitor did not ask for.
    const remembered = readLocalStorage(LAST_WALLET_KEY);
    if (!remembered) return null;
    const previous = wallets.find((w) => w.name === remembered);
    return previous?.accounts.length ? previous : null;
  }, [wallets, selectedName]);

  // The wallet mutates its own accounts, so the account is read from it
  // through its change event rather than mirrored into state.
  const subscribeToAccounts = useCallback(
    (onChange: () => void) => {
      if (!wallet) return () => {};
      const events = wallet.features[StandardEvents] as
        | StandardEventsFeature[typeof StandardEvents]
        | undefined;
      return events ? events.on("change", onChange) : () => {};
    },
    [wallet],
  );

  const account = useSyncExternalStore(
    subscribeToAccounts,
    () => wallet?.accounts[0] ?? null,
    () => null,
  );

  const select = useCallback(async (next: Wallet) => {
    setConnecting(true);
    try {
      const feature = next.features[StandardConnect] as
        | StandardConnectFeature[typeof StandardConnect]
        | undefined;
      if (!feature) throw new Error(`${next.name} cannot connect`);
      const { accounts } = await feature.connect();
      if (!accounts[0]) throw new Error(`${next.name} returned no account`);
      writeLocalStorage(LAST_WALLET_KEY, next.name);
      setSelectedName(next.name);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const current = wallet;
    writeLocalStorage(LAST_WALLET_KEY, null);
    setSelectedName(null);
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
