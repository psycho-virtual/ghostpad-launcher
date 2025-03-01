import React from 'react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '../config/wagmi';

interface WagmiProviderProps {
  children: React.ReactNode;
}

const WagmiProvider: React.FC<WagmiProviderProps> = ({ children }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};

export default WagmiProvider; 