// components/wallet/BalancesList.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { WalletInstance, Balance } from "@/lib/types";
import { getWalletBalances } from "@/lib/wallet";
import { Coinbase } from "@coinbase/coinbase-sdk";

interface BalancesListProps {
  wallet: WalletInstance | null;
}

const COMMON_TOKENS = [
  Coinbase.assets.Eth,
  Coinbase.assets.Usdc,
  Coinbase.assets.Weth,
];

export function BalancesList({ wallet }: BalancesListProps) {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchBalances = async () => {
    if (!wallet) return;

    setIsLoading(true);
    try {
      const walletBalances = await getWalletBalances(wallet);

      // Filter out zero balances and sort by amount
      const sortedBalances = walletBalances
        .filter((balance) => parseFloat(balance.amount.toString()) > 0)
        .sort((a, b) => {
          const amountA = parseFloat(a.amount.toString());
          const amountB = parseFloat(b.amount.toString());
          return amountB - amountA;
        });

      setBalances(sortedBalances);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch balances. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchBalances();
    }
  }, [wallet]);

  if (!wallet) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            Please connect or create a wallet to view balances
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Token Balances</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchBalances}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Show common tokens first, even with zero balance */}
          {COMMON_TOKENS.map((tokenId) => {
            const balance = balances.find((b) => b.asset.id === tokenId) || {
              asset: {
                id: tokenId,
                symbol: tokenId.split(".").pop() || tokenId,
              },
              amount: "0",
            };

            return (
              <div
                key={balance.asset.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="font-medium">{balance.asset.symbol}</div>
                </div>
                <div className="font-mono">
                  {typeof balance.amount === "string"
                    ? parseFloat(balance.amount).toFixed(6)
                    : balance.amount.toFixed(6)}
                </div>
              </div>
            );
          })}

          {/* Show other tokens with non-zero balances */}
          {balances
            .filter((balance) => !COMMON_TOKENS.includes(balance.asset.id))
            .map((balance) => (
              <div
                key={balance.asset.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="font-medium">{balance.asset.symbol}</div>
                </div>
                <div className="font-mono">
                  {typeof balance.amount === "string"
                    ? parseFloat(balance.amount).toFixed(6)
                    : balance.amount.toFixed(6)}
                </div>
              </div>
            ))}

          {balances.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-4">
              No token balances found
            </div>
          )}

          {isLoading && (
            <div className="text-center text-gray-500 py-4">
              Loading balances...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
