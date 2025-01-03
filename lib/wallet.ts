// lib/wallet.ts
import { Wallet, Coinbase } from "@coinbase/coinbase-sdk";
import type { WalletInstance } from "./types";

// Initialize Coinbase SDK
if (typeof window !== "undefined") {
  // Check if we're on the client side
  Coinbase.configureFromJson({
    filePath: process.env.NEXT_PUBLIC_CDP_API_KEY_PATH,
  });
}

export async function createWallet(): Promise<WalletInstance> {
  try {
    return await Wallet.create({ networkId: Coinbase.networks.BaseMainnet });
  } catch (error: unknown) {
    console.error("Error creating wallet:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create wallet"
    );
  }
}

export async function importWallet(
  data: ReturnType<WalletInstance["export"]>
): Promise<WalletInstance> {
  try {
    return await Wallet.import(data);
  } catch (error) {
    console.error("Error importing wallet:", error);
    throw error;
  }
}

export async function getWalletBalances(wallet: WalletInstance) {
  try {
    return await wallet.listBalances();
  } catch (error) {
    console.error("Error fetching balances:", error);
    throw error;
  }
}

export async function getWalletTransactions(wallet: WalletInstance) {
  try {
    const address = await wallet.getDefaultAddress();
    return await address.listTransactions({ limit: 10 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function createNewAddress(wallet: WalletInstance) {
  try {
    return await wallet.createAddress();
  } catch (error) {
    console.error("Error creating new address:", error);
    throw error;
  }
}

export async function exportWallet(
  wallet: WalletInstance
): Promise<ReturnType<WalletInstance["export"]>> {
  try {
    return wallet.export();
  } catch (error) {
    console.error("Error exporting wallet:", error);
    throw error;
  }
}
