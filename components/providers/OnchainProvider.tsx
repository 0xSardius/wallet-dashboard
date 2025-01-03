"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function OnchainProvider({ children }: Props) {
  return <OnchainKitProvider chain={base}>{children}</OnchainKitProvider>;
}
