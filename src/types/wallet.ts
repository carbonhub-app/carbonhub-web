export interface UserData {
  publicKey: string;
  blockchain: "solana";
  connectedAt: string;
  carbonCredits: number;
  totalTransactions: number;
  lastLoginAt: string;
}

export interface PhantomWalletState {
  phantom: PhantomWallet | null;
  isConnected: boolean;
  publicKey: string | null;
  connecting: boolean;
  error: string | null;
  userData: UserData | null;
}

export interface PhantomWallet {
  solana: {
    connect: () => Promise<string>;
    isConnected: boolean;
    signMessage: (message: Uint8Array) => Promise<void>;
  };
}

export interface WalletConnection {
  address: string;
  blockchain: "solana" | "ethereum" | "sui" | "bitcoin";
  connectedAt: Date;
}

export interface CarbonCreditTransaction {
  id: string;
  type: "purchase" | "sale" | "offset" | "earn";
  amount: number;
  price?: number;
  timestamp: Date;
  transactionHash?: string;
  status: "pending" | "confirmed" | "failed";
}

// ===========================================

export type accountTypes = "user" | "company";

export interface ChallengeResponses {
  status: string;
  message: string;
  data: {
    challenge: string;
  };
}

export interface VerifyResponses {
  status: string;
  message: string;
  data: {
    publicKey: string;
    token: string;
    type: string;
    company_id: string;
    apiKey: string;
  }
}

export interface userDatas {
  carbonCredits: number;
  connectedAt: Date;
  totalTransactions: number;
}