import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Keypair,
  clusterApiUrl,
  TransactionInstruction
} from '@solana/web3.js';
import { Buffer } from 'buffer';

/**
 * Validates if a string is a valid Solana address
 * @param address The address to validate
 * @returns True if the address is valid
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Shortens a Solana address for display
 * @param address The address to shorten
 * @param chars Number of characters to show on each end
 * @returns Shortened address with ellipsis in the middle
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';

  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Formats a lamports amount as SOL
 * @param lamports Amount in lamports
 * @param decimals Number of decimal places to show
 * @returns Formatted SOL amount
 */
export function formatSol(lamports: number, decimals = 4): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(decimals);
}

/**
 * Converts SOL to lamports
 * @param sol Amount in SOL
 * @returns Amount in lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

/**
 * Checks if Solana local validator is running
 * @returns Promise resolving to true if local validator is available
 */
export async function isLocalValidatorRunning(): Promise<boolean> {
  try {
    const connection = new Connection('http://127.0.0.1:8899');
    await connection.getVersion();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Airdrop SOL to an address on devnet or local network
 * @param connection Solana connection
 * @param address The recipient address
 * @param amount Amount in SOL (default: 1)
 * @returns Promise resolving to airdrop transaction signature
 */
export async function requestAirdrop(
  connection: Connection,
  address: string,
  amount = 1
): Promise<string | null> {
  try {
    const publicKey = new PublicKey(address);
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );

    // Wait for confirmation
    await connection.confirmTransaction(signature);
    return signature;
  } catch (error) {
    console.error('Airdrop failed:', error);
    return null;
  }
}

/**
 * Creates a Solana transaction to transfer SOL
 * @param connection Solana connection
 * @param fromPubkey Sender's public key
 * @param toPubkey Recipient's public key
 * @param amount Amount in SOL
 * @returns Transaction object ready to be signed
 */
export async function createTransferTransaction(
  connection: Connection,
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amount: number
): Promise<Transaction> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports: solToLamports(amount)
    })
  );

  // Set recent blockhash and fee payer
  transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  transaction.feePayer = fromPubkey;

  return transaction;
}

/**
 * Helper to convert a hex string to Uint8Array
 * @param hexString Hex string to convert
 * @returns Uint8Array
 */
export function hexToUint8Array(hexString: string): Uint8Array {
  // Remove 0x prefix if it exists
  hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString;

  if (hexString.length % 2 !== 0) {
    throw new Error('Hex string must have an even number of characters');
  }

  const result = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    result[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }

  return result;
}

/**
 * Convert Uint8Array to hex string
 * @param bytes Uint8Array to convert
 * @returns Hex string
 */
export function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Creates a program address deterministically
 * @param seeds Array of Buffer seeds
 * @param programId Program ID
 * @returns Public key
 */
export async function createProgramAddress(
  seeds: Buffer[],
  programId: PublicKey
): Promise<PublicKey> {
  return await PublicKey.findProgramAddress(seeds, programId);
}

/**
 * Helper function to get explorer URL for a transaction or address
 * @param txOrAddress Transaction signature or address
 * @param network Network to use (mainnet, devnet, testnet)
 * @returns Explorer URL
 */
export function getExplorerUrl(
  txOrAddress: string,
  network: 'mainnet' | 'devnet' | 'testnet' = 'devnet'
): string {
  const baseUrl = 'https://explorer.solana.com';
  const path = isValidSolanaAddress(txOrAddress) ? 'address' : 'tx';
  const networkParam = network === 'mainnet' ? '' : `?cluster=${network}`;

  return `${baseUrl}/${path}/${txOrAddress}${networkParam}`;
}
