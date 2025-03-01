import { useState } from 'react';
import { ethers } from 'ethers';

/**
 * A hook for generating cryptographic commitments for the Tornado cash-style privacy protocol
 * Compatible with the MockTornadoInstance contract interface
 */
export function useCommitmentGenerator() {
  const [loading, setLoading] = useState(false);
  const [commitment, setCommitment] = useState('');
  const [error, setError] = useState(null);
  const [depositData, setDepositData] = useState(null);

  /**
   * Generate a cryptographically secure random hex string of given length
   */
  const generateSecureRandom = () => {
    // Generate a random 32-byte hex string using ethers.js
    return ethers.randomBytes(32);
  };

  /**
   * Convert bytes to hex string
   */
  const bytesToHex = (bytes) => {
    return ethers.hexlify(bytes);
  };

  /**
   * Create a deposit with commitment and nullifier hash
   * This creates the commitment in a format compatible with the MockTornadoInstance contract
   */
  const createDeposit = async () => {
    // Generate random secret and nullifier
    const secret = generateSecureRandom();
    const nullifier = generateSecureRandom();

    // Convert to hex strings for display and storage
    const secretHex = bytesToHex(secret);
    const nullifierHex = bytesToHex(nullifier);

    // Generate nullifier hash using keccak256
    const nullifierHash = ethers.keccak256(nullifier);

    // Generate commitment by hashing the concatenation of nullifier and secret
    // This matches the format expected by the Tornado-style contracts
    const preimage = ethers.concat([nullifier, secret]);
    const commitment = ethers.keccak256(preimage);

    return {
      secret: secretHex,
      nullifier: nullifierHex,
      nullifierHash,
      commitment
    };
  };

  /**
   * Generate a commitment for a deposit
   */
  const generateCommitment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create the deposit
      const deposit = await createDeposit();

      // Update state
      setCommitment(deposit.commitment);
      setDepositData(deposit);

      // Log the deposit data for debugging
      console.log('Deposit data:', deposit);

      return {
        success: true,
        commitment: deposit.commitment,
        depositData: deposit
      };
    } catch (err) {
      console.error("Commitment generation error:", err);
      const errorMessage = err.message || 'Failed to generate commitment';
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Prepare data for submitting a deposit to the MockTornadoInstance contract
   */
  const prepareDepositData = () => {
    if (!depositData) {
      throw new Error('No deposit data available. Generate a commitment first.');
    }

    return {
      commitment: depositData.commitment
    };
  };

  /**
   * Prepare data for withdrawal from the MockTornadoInstance contract
   */
  const prepareWithdrawData = (recipient, relayer = ethers.ZeroAddress, fee = 0) => {
    if (!depositData) {
      throw new Error('No deposit data available. Generate a commitment first.');
    }

    // For a real implementation, you'd generate a proper ZK proof here
    // For now, we're just providing the nullifier hash which is necessary for withdrawal
    return {
      proof: '0x00', // Mock proof - in a real implementation this would be a proper ZK proof
      root: ethers.ZeroHash, // Mock root - in a real implementation this would be a valid Merkle root
      nullifierHash: depositData.nullifierHash,
      recipient: recipient || ethers.ZeroAddress,
      relayer: relayer || ethers.ZeroAddress,
      fee: fee || 0,
      refund: 0
    };
  };

  /**
   * Download the commitment data as a JSON file
   * @param filename Optional custom filename (defaults to 'tornado-deposit-data.json')
   * @returns boolean indicating success
   */
  const downloadCommitmentData = (filename = 'tornado-deposit-data.json') => {
    if (!depositData) {
      setError('No deposit data available. Generate a commitment first.');
      return false;
    }
    
    try {
      // Prepare data for download with additional metadata
      const downloadData = {
        ...depositData,
        generatedAt: new Date().toISOString(),
        instructions: "Keep this file secure! You'll need it to withdraw your funds."
      };
      
      // Convert to JSON and create a Blob
      const dataStr = JSON.stringify(downloadData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Create download link and trigger download
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      console.error("Failed to download commitment data:", err);
      setError('Failed to download commitment data');
      return false;
    }
  };

  return {
    loading,
    commitment,
    error,
    depositData,
    generateCommitment,
    prepareDepositData,
    prepareWithdrawData,
    downloadCommitmentData
  };
}
