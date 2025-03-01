import React, { useState } from 'react';
import { fundWalletOnAnvil } from '../utils/anvilUtils';
import { useAccount, useNetwork } from 'wagmi';

export function DevTools() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [amountToFund, setAmountToFund] = useState(100);
  const [isFunding, setIsFunding] = useState(false);
  const [message, setMessage] = useState('');
  
  // Only show in development mode and on local network
  if (process.env.NODE_ENV !== 'development' || chain?.id !== 31337) {
    return null;
  }
  
  const handleFund = async () => {
    if (!address) return;
    
    setIsFunding(true);
    setMessage('');
    
    try {
      const success = await fundWalletOnAnvil(address, amountToFund);
      if (success) {
        setMessage(`Successfully funded ${address} with ${amountToFund} ETH`);
      } else {
        setMessage('Failed to fund wallet');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsFunding(false);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-ghost-dark border border-ghost-primary/30 p-3 rounded-md">
      <h4 className="text-sm font-bold text-ghost-primary mb-2">Developer Tools</h4>
      
      <div className="flex gap-2 mb-2">
        <input
          type="number"
          min="1"
          value={amountToFund}
          onChange={(e) => setAmountToFund(Number(e.target.value))}
          className="w-20 bg-ghost-dark border border-ghost-primary/30 rounded px-2 py-1 text-sm"
        />
        <button
          onClick={handleFund}
          disabled={isFunding || !address}
          className="bg-ghost-primary/20 hover:bg-ghost-primary/30 px-3 py-1 rounded text-sm"
        >
          {isFunding ? 'Funding...' : 'Fund Wallet'}
        </button>
      </div>
      
      {message && (
        <p className="text-xs text-ghost-primary mt-1">{message}</p>
      )}
    </div>
  );
} 