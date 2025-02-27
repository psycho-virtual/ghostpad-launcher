import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Type definitions for the Ethereum window object
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      selectedAddress: string | null;
    };
  }
}

export const ConnectWallet = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return window.ethereum && window.ethereum.isMetaMask;
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum!.request({
        method: "eth_requestAccounts",
      });
      handleAccountsChanged(accounts);
    } catch (err: any) {
      if (err.code === 4001) {
        // User rejected the request
        setError("Please connect to MetaMask to continue.");
      } else {
        setError("An error occurred while connecting to your wallet.");
        console.error(err);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet (for UI purposes only, can't force disconnect MetaMask)
  const disconnectWallet = () => {
    setAccount(null);
  };

  // Set up event listeners
  useEffect(() => {
    if (window.ethereum) {
      // Check if already connected
      window.ethereum.request({ method: "eth_accounts" })
        .then(handleAccountsChanged)
        .catch(console.error);

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {account ? (
          <div className="flex flex-col gap-2">
            <Button
              onClick={disconnectWallet}
              variant="outline"
              className="bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {formatAddress(account)}
            </Button>
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            variant="outline"
            className="bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10"
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}

        {error && (
          <div className="text-sm text-red-500 mt-2">
            {error}
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
                  <span className="text-ghost-primary font-bold">1.</span> Connect your wallet and click "Launch Application"
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
