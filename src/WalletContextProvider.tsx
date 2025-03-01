import React, { useEffect, useState } from 'react';
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

// Determine chains order based on preferred network
export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const [preferLocal, setPreferLocal] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      // Check if local network is available
      const localAvailable = await isLocalNetworkAvailable();
      
      // Configure chains - Sepolia first by default, local first if preferred
      const { chains, publicClient, webSocketPublicClient } = configureChains(
        // If local is available and preferred, put it first
        localAvailable 
          ? (preferLocal ? [localNetwork, sepolia, mainnet] : [sepolia, mainnet, localNetwork])
          : [sepolia, mainnet],
        [
          // Use local provider when needed
          jsonRpcProvider({
            rpc: (chain) => {
              if (chain.id === localNetwork.id)
                return { http: 'http://127.0.0.1:8545' };
              return null;
            },
          }),
          publicProvider(), // Fallback for public networks
        ]
      );

      // Create the configuration
      const wagmiConfig = createConfig({
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

      setConfig(wagmiConfig);
    };

    init();
  }, [preferLocal]);

  // Show loading state while config is being initialized
  if (!config) {
    return <div>Loading wallet configuration...</div>;
  }

  return (
    <WagmiConfig config={config}>
      {/* Optional UI to toggle network preference */}
      <div className="fixed top-2 left-2 z-50 text-xs bg-ghost-dark/80 p-1 rounded">
        <label className="flex items-center gap-1">
          <input 
            type="checkbox" 
            checked={preferLocal}
            onChange={() => setPreferLocal(!preferLocal)}
          />
          Prefer local network
        </label>
      </div>
      {children}
    </WagmiConfig>
  );
}
