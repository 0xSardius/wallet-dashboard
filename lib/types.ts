// lib/types.ts
import { Wallet as CoinbaseWallet } from "@coinbase/coinbase-sdk";

export type WalletInstance = CoinbaseWallet;

export interface Asset {
  id: string;
  symbol: string;
  name: string;
}

export interface Balance {
  asset: Asset;
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
