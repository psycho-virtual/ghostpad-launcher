import { useNetwork as useWagmiNetwork } from 'wagmi';

export function useSafeNetwork() {
  try {
    // Try to use the wagmi hook
    const networkData = useWagmiNetwork();
    return {
      ...networkData,
      isSupported: true,
      error: null
    };
  } catch (error) {
    // Return a fallback when the hook fails
    console.warn('Network hook failed, providing fallback data', error);
    return {
      chain: null,
      chains: [],
      isSupported: false,
      error,
      // Include any other properties that useNetwork normally returns
      // with safe default values
    };
  }
}
