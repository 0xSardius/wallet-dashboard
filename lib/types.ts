// lib/types.ts
import { Wallet as CoinbaseWallet } from "@coinbase/coinbase-sdk";

export type WalletInstance = CoinbaseWallet;

export interface Balance {
  asset: {
    symbol: string;
    name: string;
  };
  amount: string | number;
}

export interface Transaction {
  type: string;
  to: string;
  value: string | number;
  hash: string;
  timestamp: number;
}

export interface WalletData {
  [key: string]: string | number | boolean | object | null;
}
