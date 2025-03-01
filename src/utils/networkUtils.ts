/**
 * Check if the Anvil local network is running
 */
export async function isAnvilRunning(): Promise<boolean> {
  try {
    const response = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: [],
      }),
      // Add a short timeout to prevent long loading times if server is not responding
      signal: AbortSignal.timeout(1000)
    });
    
    const data = await response.json();
    return !!data.result;
  } catch (error) {
    console.log('Anvil is not available:', error);
    return false;
  }
}

/**
 * Add local network to MetaMask
 */
export async function addLocalNetworkToMetaMask(): Promise<boolean> {
  if (!window.ethereum) {
    console.error("No ethereum provider found");
    return false;
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
    return true;
  } catch (error) {
    console.error("Failed to add local network to MetaMask:", error);
    return false;
  }
} 