import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";
import { ReactNode } from "react";

interface OnchainProviderProps {
  children: ReactNode;
}

export function OnchainProvider({ children }: OnchainProviderProps) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          theme: "default",
          mode: "auto",
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
