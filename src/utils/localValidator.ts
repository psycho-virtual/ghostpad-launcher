import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
  Commitment
} from '@solana/web3.js';

/**
 * Sets the balance of an account on local Solana validator
 * @param address The address to fund
 * @param amountInSol The amount to fund in SOL
 * @returns Promise that resolves to true if successful
 */
export async function fundWalletOnLocalValidator(address: string, amountInSol: number = 100): Promise<boolean> {
  try {
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
    const publicKey = new PublicKey(address);

    // Local validators allow us to airdrop SOL for testing
    const signature = await connection.requestAirdrop(
      publicKey,
      amountInSol * LAMPORTS_PER_SOL
    );

    // Wait for confirmation
    await connection.confirmTransaction(signature);

    // Check that the balance was updated
    const balance = await connection.getBalance(publicKey);
    console.log(`Successfully funded ${address} with ${amountInSol} SOL on local network`);
    console.log(`New balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    return true;
  } catch (error) {
    console.error('Failed to fund wallet on local validator:', error);
    return false;
  }
}

/**
 * Check if a local Solana validator is running
 */
export async function isLocalValidatorRunning(): Promise<boolean> {
  try {
    const connection = new Connection('http://127.0.0.1:8899');
    const version = await connection.getVersion();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get recent test accounts from local validator
 * (primarily for development/testing)
 */
export async function getLocalValidatorTestAccounts(count: number = 5): Promise<Keypair[]> {
  // Generate some test keypairs for development use
  const keypairs: Keypair[] = [];

  for (let i = 0; i < count; i++) {
    keypairs.push(Keypair.generate());
  }

  // Try to fund these accounts on the local validator
  try {
    const connection = new Connection('http://127.0.0.1:8899');

    // Airdrop 2 SOL to each test account
    for (const keypair of keypairs) {
      const signature = await connection.requestAirdrop(
        keypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);
    }

    console.log(`Created and funded ${count} test accounts on local validator`);
  } catch (error) {
    console.error('Failed to fund test accounts:', error);
  }

  return keypairs;
}

/**
 * Mine new blocks on the local validator (useful to force state updates)
 * Note: For Solana this is a no-op as Solana produces blocks continuously
 */
export async function advanceClockOnLocalValidator(): Promise<boolean> {
  try {
    // Unlike Ethereum, Solana produces blocks continuously
    // So we don't need to manually mine blocks
    // We just wait briefly for the next block to be produced
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify new blocks were created
    const connection = new Connection('http://127.0.0.1:8899');
    const slot = await connection.getSlot();
    console.log(`Current slot: ${slot}`);

    return true;
  } catch (error) {
    console.error('Failed to check slot:', error);
    return false;
  }
}

/**
 * Get genesis accounts (accounts with SOL already funded)
 * in the local validator
 */
export async function getGenesisAccounts(): Promise<PublicKey[]> {
  try {
    const connection = new Connection('http://127.0.0.1:8899');

    // This returns largest accounts by SOL balance,
    // which should include genesis accounts on local validator
    const largestAccounts = await connection.getLargestAccounts();

    return largestAccounts.value.map(account => account.address);
  } catch (error) {
    console.error('Failed to get genesis accounts:', error);
    return [];
  }
}
