import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { isAnvilRunning } from "../utils/networkUtils";

// Type definitions for the Ethereum window object
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const ConnectWallet = () => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocalAvailable, setIsLocalAvailable] = useState<boolean | null>(null);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, isLoading: isConnecting } = useConnect({
    connector: new InjectedConnector(),
    onError: (err) => {
      setError(err.message);
    }
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { chains, switchNetwork, isLoading: isSwitchingNetwork } = useSwitchNetwork({
    onError: (err) => setError(err.message)
  });

  // Check if local network is available
  useEffect(() => {
    const checkAnvil = async () => {
      const running = await isAnvilRunning();
      setIsLocalAvailable(running);
    };
    
    checkAnvil();
  }, []);

  // Add local network to MetaMask if it's not there already
  const addLocalNetworkToWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed");
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x7A69', // 31337 in hex
          chainName: 'Local Anvil',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['http://127.0.0.1:8545'],
          blockExplorerUrls: ['http://localhost:8545']
        }]
      });
      
      // Then switch to that network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }]
      });
      
    } catch (err) {
      console.error("Failed to add local network:", err);
      setError("Failed to add local network to wallet");
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Connect wallet using wagmi
  const connectWallet = async () => {
    setError(null);
    connect();
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    disconnect();
  };

  // Show network selector dropdown
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);

  const toggleNetworkSelector = () => {
    setShowNetworkSelector(!showNetworkSelector);
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        {isConnected ? (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Button 
                onClick={toggleNetworkSelector} 
                variant="outline"
                className="bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10 w-full"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                {chain?.name || "Unknown Network"}
                <span className="ml-2">▼</span>
              </Button>
              
              {showNetworkSelector && (
                <div className="absolute top-full mt-1 right-0 w-full bg-ghost-dark border border-ghost-primary/20 rounded-md shadow-lg overflow-hidden z-50">
                  {chains.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        switchNetwork?.(c.id);
                        setShowNetworkSelector(false);
                      }}
                      disabled={isSwitchingNetwork || c.id === chain?.id}
                      className={`w-full px-4 py-2 text-left hover:bg-ghost-primary/10 transition-colors ${
                        c.id === chain?.id ? 'bg-ghost-primary/20 font-bold' : ''
                      }`}
                    >
                      {c.name}
                      {c.id === 31337 && <span className="ml-2 text-xs">(Local)</span>}
                    </button>
                  ))}
                  
                  {/* Add option to connect to local network if it's not in the list */}
                  {isLocalAvailable && !chains.some(c => c.id === 31337) && (
                    <button
                      onClick={() => {
                        addLocalNetworkToWallet();
                        setShowNetworkSelector(false);
                      }}
                      className="w-full px-4 py-2 text-left text-yellow-400 hover:bg-ghost-primary/10 transition-colors border-t border-ghost-primary/20"
                    >
                      Add Local Network
                      <span className="ml-2 text-xs">(Development)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <Button
              onClick={disconnectWallet}
              variant="outline"
              className="bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10"
            >
              {address ? formatAddress(address) : "Connected"}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              onClick={connectWallet}
              variant="outline"
              className="bg-ghost-dark border border-ghost-primary/20 text-white hover:bg-ghost-primary/10"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
            
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
