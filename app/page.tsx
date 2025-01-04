"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OnchainProvider } from "@/components/providers/OnchainProvider";
import { WalletCard } from "@/components/wallet/WalletCard";
import { BalancesList } from "@/components/wallet/BalancesList";
import type { WalletInstance } from "@/lib/types";

export default function DashboardPage() {
  const [wallet, setWallet] = useState<WalletInstance | null>(null);

  return (
    <OnchainProvider>
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Dashboard</CardTitle>
              <CardDescription>
                Manage your wallet, view balances, and track transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WalletCard wallet={wallet} onWalletUpdated={setWallet} />
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs defaultValue="balances" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="balances">Balances</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="balances">
              <Card>
                <CardHeader>
                  <CardTitle>Token Balances</CardTitle>
                </CardHeader>
                <CardContent>
                  <BalancesList wallet={wallet} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* TransactionList component will go here */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <CardTitle>Address Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* AddressManager component will go here */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </OnchainProvider>
  );
}
