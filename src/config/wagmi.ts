import { createConfig, configureChains } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import contractAddresses from '../../smart_contract_address.local.json';
import localContractAddresses from '../../smart_contract_address.local.json';
import { normalizeAddress } from '../utils/addressUtils';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Configure chains based on environment
const { chains, publicClient } = configureChains(
  // In development, use Hardhat local network. In production, use mainnet and sepolia
  isDevelopment ? [hardhat] : [mainnet, sepolia],
  [publicProvider()]
);

// Set up the client configuration
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ 
      chains,
      options: {
        shimDisconnect: true,
      }
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'GhostPad',
      },
    }),
  ],
  publicClient,
});

// Export chains for use elsewhere
export { chains };

// Get contract addresses based on the current network
export function getTornadoInstanceAddress(amount: number): `0x${string}` {
  // Get current chainId from wagmi
  const chainId = typeof window !== 'undefined' && window.ethereum 
    ? parseInt(window.ethereum.chainId, 16)
    : 31337; // Default to local network if not connected
  
  let addressToReturn: string;
  
  // Use the appropriate addresses based on chain ID
  if (chainId === 31337) {
    // Local network - use the addresses from local.json
    const localAddresses = localContractAddresses.tornadoInstances;
    
    if (amount === 0.1) {
      addressToReturn = localAddresses.tornadoInstance0ETH;
    } else if (amount === 1) {
      addressToReturn = localAddresses.tornadoInstance1ETH;
    } else if (amount === 10) {
      addressToReturn = localAddresses.tornadoInstance10ETH;
    } else if (amount === 100) {
      addressToReturn = localAddresses.tornadoInstance100ETH;
    } else {
      // Default to 1 ETH instance if no match
      addressToReturn = localAddresses.tornadoInstance1ETH;
    }
  } 
  else if (chainId === 11155111) {
    // Sepolia testnet
    // Replace these with actual Sepolia addresses when you deploy to Sepolia
    addressToReturn = '0x0000000000000000000000000000000000000000';
  } 
  else {
    // Mainnet or other networks
    // For now, use the regular contract addresses
    const mainnetAddresses = contractAddresses.tornadoInstances;
    
    if (amount === 0.1) {
      addressToReturn = mainnetAddresses.tornadoInstance0ETH;
    } else if (amount === 1) {
      addressToReturn = mainnetAddresses.tornadoInstance1ETH;
    } else if (amount === 10) {
      addressToReturn = mainnetAddresses.tornadoInstance10ETH;
    } else if (amount === 100) {
      addressToReturn = mainnetAddresses.tornadoInstance100ETH;
    } else {
      // Default to 1 ETH instance if no match
      addressToReturn = mainnetAddresses.tornadoInstance1ETH;
    }
  }
  
  // Normalize the address to prevent double 0x prefixes
  const normalizedAddress = normalizeAddress(addressToReturn);
  
  console.log(`Getting tornado instance for ${amount} ETH, address: ${normalizedAddress}`);
  
  return normalizedAddress as `0x${string}`;
}

// Export contract addresses for easy access
export const getContractAddress = (contractName: string): string | null => {
  // Get current chainId
  const chainId = typeof window !== 'undefined' && window.ethereum 
    ? parseInt(window.ethereum.chainId, 16)
    : 31337; // Default to local network
  
  // For local development, use the contracts from the local JSON
  if (chainId === 31337) {
    return localContractAddresses.contracts[contractName] || null;
  }
  
  // For Sepolia testnet, you would add your Sepolia addresses here
  if (chainId === 11155111) {
    // Replace with Sepolia addresses when available
    return null;
  }
  
  // For mainnet or other networks, use the main contract addresses
  return contractAddresses.contracts[contractName] || null;
}; 