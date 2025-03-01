import React, { useEffect, useState } from 'react';
import { isAnvilRunning, addLocalNetworkToMetaMask } from '../utils/networkUtils';
import { useNetwork } from 'wagmi';

export const LocalNetworkIndicator: React.FC = () => {
  const [isLocalAvailable, setIsLocalAvailable] = useState<boolean | null>(null);
  const { chain } = useNetwork();
  
  useEffect(() => {
    const checkLocal = async () => {
      const running = await isAnvilRunning();
      setIsLocalAvailable(running);
    };
    
    checkLocal();
    const interval = setInterval(checkLocal, 10000);
    return () => clearInterval(interval);
  }, []);
  
  if (!isLocalAvailable || chain?.id === 31337) return null;
  
  return (
    <div className="fixed top-20 right-4 z-40 bg-ghost-dark border border-yellow-500/30 p-2 rounded-md text-xs">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
        <span>Local network running but not connected</span>
      </div>
      <button 
        onClick={async () => {
          const success = await addLocalNetworkToMetaMask();
          if (!success) {
            alert("Failed to add local network. Please try manually in MetaMask.");
          }
        }}
        className="mt-1 text-yellow-400 hover:text-yellow-300 underline text-xs"
      >
        Add local network to wallet
      </button>
    </div>
  );
}; 