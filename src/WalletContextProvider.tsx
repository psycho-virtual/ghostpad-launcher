import React from 'react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Chain } from 'wagmi/chains';

// Define Local network as a custom chain
const localNetwork: Chain = {
  id: 31337,
  name: 'Local',
  network: 'local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://127.0.0.1:8545'] },
    default: { http: ['http://127.0.0.1:8545'] },
  },
  blockExplorers: {
    default: { name: 'Local Explorer', url: 'http://localhost:8545' },
  },
  testnet: true,
};

// Check if local network is available on initial load
const isLocalNetworkAvailable = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: [],
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Configure chains - local first, then public networks
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [localNetwork, sepolia, mainnet],
  [
    // Use local provider first when available
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === localNetwork.id)
          return { http: 'http://127.0.0.1:8545' };
        return null;
      },
    }),
    publicProvider(), // Fallback for other networks
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ 
      chains,
      options: {
        shimDisconnect: true,
      }
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  );
}
