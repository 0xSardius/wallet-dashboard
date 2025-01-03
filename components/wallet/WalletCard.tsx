// components/wallet/WalletCard.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createWallet, importWallet, exportWallet } from "../../lib/wallet";
import { Avatar, Name, Address } from "@coinbase/onchainkit/identity";
import { WalletInstance, WalletData } from "@/lib/types";

interface WalletCardProps {
  onWalletUpdate?: (wallet: WalletInstance | null) => void;
}

export function WalletCard() {
  const [wallet, setWallet] = useState<WalletInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateWallet = async () => {
    setIsLoading(true);
    try {
      const newWallet = await createWallet();
      setWallet(newWallet);
      toast({
        title: "Wallet Created",
        description: "Your new wallet has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create wallet: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportWallet = async (walletData: string) => {
    setIsLoading(true);
    try {
      const importedWallet = await importWallet(JSON.parse(walletData));
      setWallet(importedWallet);
      toast({
        title: "Wallet Imported",
        description: "Your wallet has been imported successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to import wallet: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportWallet = async () => {
    if (!wallet) return;
    try {
      const exportedData = await exportWallet(wallet);
      // Create a blob and download the wallet data
      const blob = new Blob([JSON.stringify(exportedData)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wallet-backup.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Wallet Exported",
        description: "Your wallet data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to export wallet: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Management</CardTitle>
        <CardDescription>Create, import, or manage your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {!wallet ? (
          <div className="flex gap-4">
            <Button onClick={handleCreateWallet} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create New Wallet"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={isLoading}>
                  Import Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Wallet</DialogTitle>
                  <DialogDescription>
                    Paste your wallet backup data here
                  </DialogDescription>
                </DialogHeader>
                <textarea
                  className="w-full h-32 p-2 border rounded"
                  placeholder="Paste wallet data here..."
                  onChange={(e) => handleImportWallet(e.target.value)}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar
                address={wallet.getDefaultAddress()}
                className="h-12 w-12"
              />
              <div>
                <Name
                  address={wallet.getDefaultAddress()}
                  className="text-lg font-semibold"
                />
                <Address address={wallet.getDefaultAddress()} />
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleExportWallet}>
                Export Wallet
              </Button>
              <Button variant="destructive" onClick={() => setWallet(null)}>
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
