import { useCallback, useState, useEffect } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractEvent } from 'wagmi';
import contractAddresses from '../../smart_contract_address.local.json';
import ghostPadAbi from '../../ghostpad-contract/out/GhostPad.sol/GhostPad.json';
import { ethers } from 'ethers';

// Get contract address from the JSON file
const ghostPadAddress = contractAddresses.contracts.ghostPad;

// Define types that match the contract structs
export interface TokenData {
  name: string;
  symbol: string;
  initialSupply: string;
  description: string;
  burnEnabled: boolean;
  liquidityLockPeriod: number;
  useProtocolFee: boolean;
  vestingEnabled: boolean;
  owner: string;
}

export interface ProofData {
  instanceIndex: number;
  proof: string;
  root: string;
  nullifierHash: string;
  recipient: string;
  relayer: string;
  fee: number;
  refund: number;
}

// Define the shape of the token deployment result
export interface TokenDeploymentResult {
  tokenAddress: string;
  tokenName?: string;
  tokenSymbol?: string;
}

/**
 * Hook for interacting with the GhostPad contract
 */
export const useGhostPadContract = (
  tokenData: TokenData | null,
  proofData: ProofData | null,
  onSuccess?: (txHash: string) => void,
  onError?: (error: Error) => void,
  onTokenDeployed?: (result: TokenDeploymentResult) => void
) => {
  const { address } = useAccount();
  const [isSuccess, setIsSuccess] = useState(false);
  const [deployedTokenAddress, setDeployedTokenAddress] = useState<string | null>(null);
  const [deployedTokenInfo, setDeployedTokenInfo] = useState<TokenDeploymentResult | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Prepare the contract write for deployTokenWithLiquidity
  const { config, error: prepareError, isError: isPrepareError } = usePrepareContractWrite({
    address: ghostPadAddress,
    abi: ghostPadAbi.abi,
    functionName: 'deployTokenWithLiquidity',
    args: tokenData && proofData ? [tokenData, proofData] : undefined,
    enabled: !!tokenData && !!proofData && !!address,
  });

  // Add debug info when config changes
  useEffect(() => {
    console.log("Contract write preparation:", {
      address: ghostPadAddress,
      enabled: !!tokenData && !!proofData && !!address,
      hasConfig: !!config,
      prepareError,
      isPrepareError
    });
    
    if (tokenData && proofData) {
      console.log("Token data:", tokenData);
      console.log("Proof data:", proofData);
    }
  }, [config, tokenData, proofData, address, prepareError, isPrepareError]);

  // Use the prepared config to write to the contract
  const { 
    data, 
    error, 
    isLoading, 
    isSuccess: isWriteSuccess, 
    isError: isWriteError,
    write,
  } = useContractWrite({
    ...config,
    onSuccess: (data) => {
      setIsSuccess(true);
      console.log("Transaction submitted successfully:", data);
      if (onSuccess) onSuccess(data.hash);
    },
    onError: (error) => {
      console.error("Transaction error:", error);
      if (onError) onError(error);
    },
  });

  // Also listen for the TokenDeployed event as a fallback
  useContractEvent({
    address: ghostPadAddress as `0x${string}`,
    abi: ghostPadAbi.abi,
    eventName: 'TokenDeployed',
    listener(logs) {
      console.log("TokenDeployed event detected:", logs);
      if (logs && logs.length > 0) {
        const log = logs[0];
        const eventData = log.args as unknown as {
          tokenAddress: string;
          name: string;
          symbol: string;
        };
        
        if (eventData) {
          const tokenAddress = eventData.tokenAddress?.toString();
          const tokenName = eventData.name?.toString();
          const tokenSymbol = eventData.symbol?.toString();
          
          console.log("Token information from event:", {
            address: tokenAddress,
            name: tokenName,
            symbol: tokenSymbol
          });
          
          if (tokenAddress) {
            const deploymentResult: TokenDeploymentResult = {
              tokenAddress,
              tokenName,
              tokenSymbol
            };
            
            setDeployedTokenAddress(tokenAddress);
            setDeployedTokenInfo(deploymentResult);
            
            if (onTokenDeployed) onTokenDeployed(deploymentResult);
          }
        }
      }
    },
  });

  // Create a wrapper function that accepts our parameters
  const deployToken = useCallback(
    () => {
      if (write) {
        console.log("Executing deployToken function");
        write();
      } else {
        console.warn("Write function is not available");
      }
    },
    [write]
  );

  return {
    deployToken,
    isLoading,
    isSuccess: isWriteSuccess || isSuccess,
    isError: isPrepareError || isWriteError,
    error: prepareError || error,
    data,
    deployedTokenAddress,
    deployedTokenInfo,
    debugInfo
  };
}; 