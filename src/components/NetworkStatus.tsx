import React, { useEffect, useState } from 'react';
import { isAnvilRunning } from '../utils/networkUtils';
import { useSafeNetwork } from '../hooks/useSafeNetwork';

export const NetworkStatus: React.FC = () => {
  const { chain, isSupported } = useSafeNetwork();
  const [isLocalAvailable, setIsLocalAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAnvil = async () => {
      const running = await isAnvilRunning();
      setIsLocalAvailable(running);
    };
    
    checkAnvil();
    
    // Check periodically
    const interval = setInterval(checkAnvil, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 bg-ghost-dark/90 border border-ghost-primary/30 p-3 rounded-md text-sm max-w-xs">
      <h4 className="font-bold text-ghost-primary mb-1">Network Status</h4>
      
      <div className="flex items-center mb-1">
        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isSupported && chain ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span>{isSupported && chain ? `Connected to: ${chain.name}` : 'Not connected to network'}</span>
      </div>
      
      {!isSupported && (
        <div className="text-xs text-yellow-400 mt-1">
          ⚠️ Wallet connection unavailable. Some features will be disabled.
        </div>
      )}
      
      {isSupported && chain?.id === 31337 && (
        <div className="text-xs opacity-80 mt-1">
          ✅ Using local development network (recommended for testing)
        </div>
      )}
      
      {isSupported && chain?.id === 11155111 && (
        <div className="text-xs opacity-80 mt-1">
          ✅ Using Sepolia test network
        </div>
      )}
      
      {isSupported && chain?.id !== 31337 && isLocalAvailable && (
        <div className="text-xs text-yellow-400 mt-1">
          ⚠️ Local network is running but you're connected to {chain.name}.
          Local is recommended for development.
        </div>
      )}
      
      {isSupported && chain?.id === 1 && (
        <div className="text-xs text-yellow-400 mt-1">
          ⚠️ Using Mainnet - be careful with real funds!
        </div>
      )}
    </div>
  );
}; 