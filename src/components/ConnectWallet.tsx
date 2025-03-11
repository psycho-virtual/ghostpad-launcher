import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// Type definitions for window object
declare global {
  interface Window {
    // This would be for any solana-specific window properties
    solana?: any;
  }
}

export const ConnectWallet = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocalAvailable, setIsLocalAvailable] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  // Wallet hooks from Solana wallet adapter
  const { publicKey, connected, disconnect } = useWallet();
  const { connection } = useConnection();

  // Check if local Solana validator is running
  useEffect(() => {
    const checkLocalNode = async () => {
      try {
        const localConnection = new Connection('http://127.0.0.1:8899');
        const version = await localConnection.getVersion();
        setIsLocalAvailable(true);
      } catch (err) {
        setIsLocalAvailable(false);
      }
    };

    checkLocalNode();
  }, []);

  // Fetch wallet balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey && connection) {
        try {
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / 1e9); // Convert lamports to SOL
        } catch (err) {
          console.error("Failed to fetch balance:", err);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };

    if (connected) {
      fetchBalance();
      // Refresh balance every 15 seconds
      const interval = setInterval(fetchBalance, 15000);
      return () => clearInterval(interval);
    }
  }, [publicKey, connection, connected]);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    disconnect();
  };

  // Determine current network
  const [currentNetwork, setCurrentNetwork] = useState('Devnet');

  useEffect(() => {
    if (connection) {
      // Extract network from RPC URL
      const rpcUrl = connection.rpcEndpoint;
      if (rpcUrl.includes('localhost') || rpcUrl.includes('127.0.0.1')) {
        setCurrentNetwork('Local');
      } else if (rpcUrl.includes('devnet')) {
        setCurrentNetwork('Devnet');
      } else if (rpcUrl.includes('testnet')) {
        setCurrentNetwork('Testnet');
      } else if (rpcUrl.includes('mainnet')) {
        setCurrentNetwork('Mainnet');
      }
    }
  }, [connection]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {connected ? (
          <div className="flex flex-col gap-2">
            <Button
              className="bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10 w-full"
              variant="outline"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {currentNetwork}
            </Button>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10"
                variant="outline"
              >
                {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
              </Button>

              <Button
                onClick={disconnectWallet}
                variant="outline"
                className="bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10"
              >
                {publicKey ? formatAddress(publicKey.toString()) : "Connected"}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                  <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Use the WalletMultiButton component from Solana wallet adapter */}
            <WalletMultiButton
              className="py-2 px-4 bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10 rounded-md"
            />
            {/* You can add additional styling and customization as needed */}
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 mt-2 bg-ghost-dark/80 p-2 rounded border border-red-500/20">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Instructions Modal Overlay */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-ghost-dark border border-ghost-primary/30 p-6 rounded-xl max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-ghost-primary">How It Works</h3>
              <button
                onClick={toggleInstructions}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-ghost-primary pl-4">
                <p className="text-white">
                  <span className="text-ghost-primary font-bold">1.</span> Connect your Solana wallet and click "Launch Application"
                </p>
              </div>

              <div className="border-l-4 border-ghost-primary pl-4">
                <p className="text-white">
                  <span className="text-ghost-primary font-bold">2.</span> Configure your token parameters and privacy settings
                </p>
              </div>

              <div className="border-l-4 border-ghost-primary pl-4">
                <p className="text-white">
                  <span className="text-ghost-primary font-bold">3.</span> Deploy your token with complete anonymity
                </p>
              </div>

              <div className="border-l-4 border-ghost-primary pl-4">
                <p className="text-white">
                  <span className="text-ghost-primary font-bold">4.</span> Monitor and manage your token through the dashboard
                </p>
              </div>
            </div>

            <button
              onClick={toggleInstructions}
              className="mt-6 w-full py-2 bg-ghost-primary text-white rounded-lg hover:bg-ghost-primary/80 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
