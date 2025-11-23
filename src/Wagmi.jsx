import React from "react";

// wagmi imports
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  mainnet,
  bsc,
  bscTestnet,
  sepolia,
  avalanche,
  avalancheFuji,
} from "wagmi/chains";

import { walletConnect } from "wagmi/connectors";

const addedChains = [
  avalancheFuji,
  sepolia,
  // bscTestnet,
  // mainnet,
  // bsc,
  // avalanche,

  // baseSepolia,
];

// Set up wagmi config
export const config = createConfig({
  chains: addedChains,
  connectors: [
    walletConnect({ projectId: "35c6df36716ecbd04dcc4cedba364876" }),
  ],
  transports: {
    [avalancheFuji.id]: http(
      "https://rpc.ankr.com/avalanche_fuji/8f847212cefcc391509e0aee929c173b83eaf25592bc7f122da333bddb851c79"
    ),
    [sepolia.id]: http(
      "https://rpc.ankr.com/eth_sepolia/8f847212cefcc391509e0aee929c173b83eaf25592bc7f122da333bddb851c79"
    ),
    [mainnet.id]: http(
      "https://rpc.ankr.com/eth/7a27876214d22119ec2a70f6adb115e7eb45ede20a30f49f945cfcd5563e5a3b"
    ),

    // [arbitrumSepolia.id]: http(),
    [bsc.id]: http(
      "https://rpc.ankr.com/bsc/7a27876214d22119ec2a70f6adb115e7eb45ede20a30f49f945cfcd5563e5a3b"
    ),
    // [bscTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

function Wagmi({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Wagmi;
