import { useState, useEffect } from 'react';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi';
import { parseEther } from 'viem';
import { getTornadoInstanceAddress } from '../config/wagmi';
import tornadoInstanceABI from '../../ghostpad-contract/out/ITornadoInstance.sol/ITornadoInstance.json';

export type CommitmentData = {
  commitment: string;
  nullifierHash?: string;
};

export const useTornadoDeposit = (amount: number, addOutput: (message: string, type?: string, isError?: boolean, isSuccess?: boolean) => void) => {
  // Get the contract address based on the selected amount
  const getTornadoContractAddress = (amt: number) => {
    return getTornadoInstanceAddress(amt);
  };

  const [contractAddress, setContractAddress] = useState(() => getTornadoContractAddress(amount));
  const [commitmentData, setCommitmentData] = useState<CommitmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectedToContract, setIsConnectedToContract] = useState(false);
  const { chain } = useNetwork();

  // Update contract address when amount changes
  useEffect(() => {
    setContractAddress(getTornadoContractAddress(amount));
    addOutput(`Selected ${amount} ETH pool at ${getTornadoContractAddress(amount)}`, 'system');
  }, [amount, addOutput]);
  
  // Load saved commitment data if it exists
  useEffect(() => {
    const savedData = localStorage.getItem('depositData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCommitmentData(parsedData);
      } catch (e) {
        console.error('Failed to parse saved deposit data', e);
      }
    }
  }, []);

  // Log network information
  useEffect(() => {
    if (chain) {
      addOutput(`Current network: ${chain.name} (Chain ID: ${chain.id})`, 'system');
      
      // Check if we're on Sepolia for development testing
      if (chain.id !== 11155111) {
        addOutput(`Warning: Connected to ${chain.name}, but Sepolia (11155111) is recommended for testing`, 'system', true);
      }
    } else {
      addOutput('Not connected to any network', 'system', true);
    }
  }, [chain, addOutput]);

  // Prepare the contract write transaction
  const { config, error: prepareError } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: tornadoInstanceABI.abi,
    functionName: 'deposit',
    args: [commitmentData?.commitment ? 
      (commitmentData.commitment.startsWith('0x') ? 
        commitmentData.commitment as `0x${string}` : 
        `0x${commitmentData.commitment}` as `0x${string}`) : 
      '0x0000000000000000000000000000000000000000000000000000000000000000'],
    value: amount ? parseEther(amount.toString()) : BigInt(0),
    enabled: !!commitmentData?.commitment && amount > 0,
  });

  // Execute the contract write
  const {
    data: txData,
    isLoading: isWriteLoading,
    write,
    error: writeError,
  } = useContractWrite(config);

  // Wait for transaction confirmation
  const {
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: txData?.hash,
  });

  // Track overall loading state
  useEffect(() => {
    setIsLoading(isWriteLoading || isTxLoading);
  }, [isWriteLoading, isTxLoading]);

  // Log contract connection status
  useEffect(() => {
    // We consider being connected to the contract if we don't have prepare errors
    // and the write function is available
    const connected = !prepareError && !!write;
    setIsConnectedToContract(connected);
    
    if (connected) {
      addOutput(`✅ Successfully connected to contract at ${contractAddress}`, 'system', false, true);
    } else if (prepareError) {
      addOutput(`❌ Failed to connect to contract: ${prepareError.message}`, 'system', true);
      console.error("Contract connection error details:", prepareError);
    } else if (commitmentData?.commitment && amount > 0) {
      // Only show this if we have data and should be connecting
      addOutput(`⏳ Attempting to connect to contract at ${contractAddress}...`, 'system');
    }
  }, [prepareError, write, contractAddress, commitmentData, amount, addOutput]);

  // Handle errors and success
  useEffect(() => {
    if (writeError) {
      addOutput(`Error sending transaction: ${writeError.message}`, 'system', true);
    }
    if (txError) {
      addOutput(`Transaction failed: ${txError.message}`, 'system', true);
    }
    if (isTxSuccess && txData?.hash) {
      addOutput(`Deposit successful! Transaction hash: ${txData.hash}`, 'system', false, true);
    }
  }, [writeError, txError, isTxSuccess, txData?.hash, addOutput]);

  const updateCommitmentData = (data: CommitmentData) => {
    setCommitmentData(data);
    localStorage.setItem('depositData', JSON.stringify(data));
    addOutput(`Using ${amount} ETH pool at ${contractAddress}`, 'system');
  };

  const submitDeposit = async () => {
    addOutput(`Submitting ${amount} ETH deposit to contract ${contractAddress}...`, 'input');

    if (!isConnectedToContract) {
      addOutput('Cannot submit transaction. No connection to smart contract.', 'system', true);
      return false;
    }

    if (!write) {
      addOutput('Cannot submit transaction. Please check your inputs and try again.', 'system', true);
      return false;
    }

    try {
      write({
        methodName: 'Tornado Deposit'
      });
      return true;
    } catch (error) {
      addOutput(`Error processing deposit: ${error.message || error}`, 'system', true);
      return false;
    }
  };

  return {
    contractAddress,
    isLoading,
    isTxSuccess,
    updateCommitmentData,
    submitDeposit,
    txData,
    isConnectedToContract
  };
}; 