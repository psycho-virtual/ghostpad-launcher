// Load contract addresses based on environment
import localAddresses from '../../smart_contract_address.local.json';
import sepoliaAddresses from '../../smart_contract_address.sepolia.json';
import { useNetwork } from 'wagmi';

// Import environment-specific address files
// For sepolia, uncomment this when available:
// import sepoliaAddresses from '../../smart_contract_address.sepolia.json';

// Define type for contract addresses structure
interface ContractAddresses {
  contracts: Record<string, string>;
  tornadoInstances: Record<string, string>;
}

/**
 * Gets contract addresses based on the specified environment
 * @param environment The network environment (local, sepolia, mainnet)
 * @returns Contract addresses object for the specified environment
 */
export function getContractAddresses(environment?: string): ContractAddresses {
  // If no environment is specified, use default from environment variables
  // Avoid using process.env
  const env = environment || 'sepolia'; // Default to sepolia
  
  switch (env) {
    case 'sepolia':
      // When we have sepolia addresses available:
      // return sepoliaAddresses;
      return sepoliaAddresses;
    case 'mainnet':
      throw new Error('Mainnet addresses not implemented yet');
    case 'local':
    default:
      return localAddresses;
  }
}

/**
 * Gets a specific contract address by name for the given environment
 * @param contractName The name of the contract to get the address for
 * @param environment The network environment (optional)
 * @returns The contract address
 */
export function getContractAddress(contractName: string, environment?: string): string {
  const addresses = getContractAddresses(environment);
  return addresses.contracts[contractName];
}

/**
 * Gets tornado instance addresses for the given environment
 * @param environment The network environment (optional)
 * @returns Object containing tornado instance addresses
 */
export function getTornadoInstances(environment?: string) {
  const addresses = getContractAddresses(environment);
  return addresses.tornadoInstances;
}

/**
 * Maps an ETH amount to the corresponding tornado instance key
 * @param amount ETH amount for the tornado instance
 * @returns The key used in the tornadoInstances object
 */
function getTornadoInstanceKey(amount: number): string {
  switch (amount) {
    case 0.1:
      return 'tornadoInstance0ETH';
    case 1:
      return 'tornadoInstance1ETH';
    case 10:
      return 'tornadoInstance10ETH';
    case 100:
      return 'tornadoInstance100ETH';
    default:
      // Default to 1 ETH instance if no match
      return 'tornadoInstance1ETH';
  }
}

/**
 * Gets the tornado instance address for a specific ETH amount
 * @param amount ETH amount for the tornado instance
 * @param environment Optional environment override
 * @returns The tornado instance address as a 0x-prefixed string
 */
export function getTornadoInstanceAddress(amount: number, environment?: string): `0x${string}` {
  const instances = getTornadoInstances(environment);
  const instanceKey = getTornadoInstanceKey(amount);
  
  // Get the address from the instances
  const address = instances[instanceKey];
  
  // Normalize the address to ensure proper 0x prefix
  const normalizedAddress = address.startsWith('0x') 
    ? address as `0x${string}` 
    : `0x${address}` as `0x${string}`;
  
  return normalizedAddress;
}

/**
 * React hook that returns contract addresses for the current connected network
 * @returns Functions to get addresses for the current network
 */
export function useContractAddresses() {
  const { chain } = useNetwork();
  
  // Map chain ID to environment name
  const getEnvironmentFromChain = () => {
    if (!chain) return 'local';
    
    switch (chain.id) {
      case 11155111: // Sepolia chain ID
        return 'sepolia';
      case 1: // Ethereum Mainnet
        return 'mainnet';
      default:
        return 'local';
    }
  };
  
  const environment = getEnvironmentFromChain();
  
  return {
    /**
     * Gets a contract address for the current network
     * @param contractName Name of the contract
     * @returns Contract address for the current network
     */
    getAddress: (contractName: string) => getContractAddress(contractName, environment),
    
    /**
     * Gets all tornado instances for the current network
     * @returns Tornado instances for the current network
     */
    getTornadoInstances: () => getTornadoInstances(environment),
    
    /**
     * Current network environment
     */
    environment
  };
}

/**
 * Hook version of getTornadoInstanceAddress that uses the current network
 */
export function useTornadoInstanceAddress() {
  const { environment } = useContractAddresses();
  
  return {
    /**
     * Gets the tornado instance address for the current network and specified amount
     * @param amount ETH amount for the tornado instance
     * @returns The tornado instance address for the current network
     */
    getInstanceAddress: (amount: number): `0x${string}` => 
      getTornadoInstanceAddress(amount, environment)
  };
} 