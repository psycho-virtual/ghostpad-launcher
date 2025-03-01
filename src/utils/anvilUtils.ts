/**
 * Sets the balance of an account on local Anvil network
 * @param address The address to fund
 * @param amountInEth The amount to fund in ETH
 * @returns Promise that resolves to true if successful
 */
export async function fundWalletOnAnvil(address: string, amountInEth: number = 100): Promise<boolean> {
  try {
    // Convert ETH to Wei in hex
    const amountInWei = BigInt(amountInEth * 10**18).toString(16);
    const hexAmount = `0x${amountInWei}`;
    
    const response = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'anvil_setBalance',
        params: [address, hexAmount],
      }),
    });
    
    const data = await response.json();
    console.log(`Successfully funded ${address} with ${amountInEth} ETH on local network`);
    return !!data.result;
  } catch (error) {
    console.error('Failed to fund wallet on Anvil:', error);
    return false;
  }
}

/**
 * Mines a block on Anvil (useful to force state updates)
 */
export async function mineBlock(): Promise<boolean> {
  try {
    const response = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'evm_mine',
        params: [],
      }),
    });
    
    const data = await response.json();
    return !!data.result;
  } catch (error) {
    console.error('Failed to mine a block:', error);
    return false;
  }
} 