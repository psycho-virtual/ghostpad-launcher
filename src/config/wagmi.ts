import { createConfig, configureChains } from 'wagmi';
import { hardhat, mainnet, sepolia, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import contractAddresses from '../../smart_contract_address.local.json';
import localContractAddresses from '../../smart_contract_address.local.json';
import { normalizeAddress } from '../utils/addressUtils';
import { getTornadoInstanceAddress as getInstanceAddress } from '../utils/contractAddresses';

// Replace with your Alchemy API key
const ALCHEMY_API_KEY = 'MdX1PhCwrdO1wlaJJNlb6sAWQ8pM5GGs';

// Check if we should force using Sepolia instead of local network
// Instead of process.env, we'll use a global window-based approach or constants
const forceNetwork = typeof window !== 'undefined' && (window as any).REACT_APP_FORCE_NETWORK || '';

// For development check, we'll use a constant or detect specific features
// Let's set a constant for now - you can change this to true/false as needed
const isDevelopment = true; // Set to true to show localhost/Hardhat

// Configure chains with Alchemy provider first, then fallback to public provider
const { chains, publicClient } = configureChains(
  // Use Sepolia by default
  forceNetwork === 'mainnet' ? [mainnet] :
  forceNetwork === 'local' ? [hardhat] : 
  isDevelopment ? [hardhat, sepolia, mainnet, goerli] : [sepolia, mainnet],
  [
    // Use Alchemy as primary provider (CORS-friendly)
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    
    // Use JSON-RPC for local development
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === hardhat.id) {
          return { http: 'http://localhost:8545' };
        }
        return null;
      },
    }),
    // Fallback to public provider
    publicProvider()
  ]
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

/**
 * Gets the address of a tornado instance for a given ETH amount
 * This is a wrapper around the utility function for backward compatibility
 * @param amount ETH amount (0.1, 1, 10, or 100)
 * @returns The tornado instance address
 */
export function getTornadoInstanceAddress(amount: number): `0x${string}` {
  // Get chain ID from window.ethereum like the original function
  const chainId = typeof window !== 'undefined' && window.ethereum 
    ? parseInt(window.ethereum.chainId, 16)
    : 31337; // Default to Hardhat local network if not connected
  
  // Map chain ID to environment
  let environment: string;
  switch (chainId) {
    case 11155111:
      environment = 'sepolia';
      break;
    case 1:
      environment = 'mainnet';
      break;
    case 5:
      environment = 'goerli';
      break;
    default:
      environment = 'local'; // Default to local
  }
  
  // Use our utility function with the determined environment
  const address = getInstanceAddress(amount, environment);
  
  console.log(`Getting tornado instance for ${amount} ETH, environment: ${environment}, address: ${address}`);
  
  return address;
}

