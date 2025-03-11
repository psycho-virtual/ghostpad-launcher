import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  MintLayout,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMint,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createMintToInstruction
} from '@solana/spl-token';
import { Buffer } from 'buffer';

// Define Solana token data interface
export interface SolanaTokenData {
  name: string;
  symbol: string;
  description?: string;
  initialSupply: number; // in tokens (will be adjusted for decimals)
  decimals: number;
  uri?: string; // Metadata URI
  burnEnabled?: boolean;
}

// Define result interface
export interface TokenCreationResult {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  txId: string;
}

/**
 * Hook for creating SPL tokens on Solana
 */
export const useSolanaToken = (
  onSuccess?: (txId: string) => void,
  onError?: (error: Error) => void,
  onTokenCreated?: (result: TokenCreationResult) => void
) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenCreationResult | null>(null);

  /**
   * Create a new SPL token
   */
  const createToken = useCallback(async (tokenData: SolanaTokenData) => {
    if (!publicKey || !connection || !sendTransaction) {
      setError(new Error('Wallet not connected'));
      if (onError) onError(new Error('Wallet not connected'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate a new keypair for the mint
      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey;

      console.log('Creating token with mint address:', mintAddress.toString());

      // Calculate rent for the token
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      // Get the associated token account address for the owner
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintAddress,
        publicKey
      );

      // Create a transaction
      const transaction = new Transaction();

      // Add instruction to create account for the mint
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintAddress,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        })
      );

      // Add instruction to initialize the mint
      transaction.add(
        createInitializeMintInstruction(
          mintAddress,
          tokenData.decimals,
          publicKey,
          tokenData.burnEnabled ? publicKey : null,
          TOKEN_PROGRAM_ID
        )
      );

      // Add instruction to create associated token account for the owner
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          associatedTokenAccount,
          publicKey,
          mintAddress
        )
      );

      // Add instruction to mint tokens to the owner's associated token account
      const initialSupplyWithDecimals = tokenData.initialSupply * Math.pow(10, tokenData.decimals);
      transaction.add(
        createMintToInstruction(
          mintAddress,
          associatedTokenAccount,
          publicKey,
          BigInt(initialSupplyWithDecimals),
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // TODO: Add an additional instruction to store metadata (name, symbol, image)
      // This would typically use the Metaplex Token Metadata program
      // For simplicity, we're just creating the basic token first

      // Get recent blockhash and sign the transaction
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send the transaction
      const signature = await sendTransaction(transaction, connection, {
        signers: [mintKeypair]
      });

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }

      console.log('Token created successfully!');
      console.log('Mint address:', mintAddress.toString());
      console.log('Transaction signature:', signature);

      // Set state and call callbacks
      setTokenAddress(mintAddress.toString());
      setIsSuccess(true);

      const result: TokenCreationResult = {
        tokenAddress: mintAddress.toString(),
        tokenName: tokenData.name,
        tokenSymbol: tokenData.symbol,
        txId: signature
      };

      setTokenInfo(result);

      if (onSuccess) onSuccess(signature);
      if (onTokenCreated) onTokenCreated(result);

      return result;
    } catch (err) {
      console.error('Error creating token:', err);
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (onError) onError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey, sendTransaction, onSuccess, onError, onTokenCreated]);

  /**
   * Function to add token to a wallet
   */
  const addTokenToWallet = useCallback(async (tokenMintAddress: string) => {
    if (!window.solana) {
      console.warn('No Solana wallet detected');
      return false;
    }

    try {
      // This works for many Solana wallets, including Phantom
      await window.solana.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'spl-token',
          options: {
            address: tokenMintAddress
          }
        }
      });
      return true;
    } catch (err) {
      console.error('Error adding token to wallet:', err);
      return false;
    }
  }, []);

  return {
    createToken,
    addTokenToWallet,
    isLoading,
    isSuccess,
    error,
    tokenAddress,
    tokenInfo
  };
};
