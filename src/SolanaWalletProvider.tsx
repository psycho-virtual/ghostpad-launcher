import React, { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import default styles for wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaWalletProviderProps {
  children: ReactNode;
}

const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children }) => {
  // Set default network to 'devnet' for development
  const network = WalletAdapterNetwork.Devnet;
  const preferLocalConnection = localStorage.getItem('preferLocalConnection') === 'true';

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => {
    if (preferLocalConnection) {
      return 'http://127.0.0.1:8899'; // Local Solana validator
    }

    // Otherwise use the public RPC endpoint for the selected network
    return clusterApiUrl(network);
  }, [network, preferLocalConnection]);

  // Only using Phantom wallet adapter for simplicity
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Optional UI to toggle network preference */}
          <div className="fixed top-2 left-2 z-50 text-xs bg-ghost-dark/80 p-1 rounded">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={preferLocalConnection}
                onChange={() => {
                  localStorage.setItem('preferLocalConnection', String(!preferLocalConnection));
                  window.location.reload(); // Reload to apply network change
                }}
              />
              Prefer local network
            </label>
          </div>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
