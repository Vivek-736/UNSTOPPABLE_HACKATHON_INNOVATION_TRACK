"use client";

import { defineChain } from "viem";
import { PrivyProvider } from '@privy-io/react-auth';

/* eslint-disable @typescript-eslint/no-explicit-any */

const Sepolia = defineChain({
  id: 11155111,
  name: "Sepolia",
  network: "sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Sepolia",
    symbol: "SepoliaETH",
  },
  rpcUrls: {
    default: {
      http: ["https://ethereum-sepolia-rpc.publicnode.com"],
    },
  } as any,
  blockExplorers: {
    default: { name: "Explorer", url: "https://sepolia.etherscan.io" },
  },
}) as any;

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF"
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: Sepolia,
        supportedChains: [Sepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}