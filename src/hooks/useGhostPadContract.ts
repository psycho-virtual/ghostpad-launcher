import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { parseEther } from 'ethers';
import GhostPadABI from '../../ghostpad-contract/out/GhostPad.sol/GhostPad.json';
import contractAddresses from '../../smart_contract_address.local.json';

// Get contract address from JSON file
const GHOSTPAD_CONTRACT_ADDRESS = contractAddresses.contracts.ghostPad;

export type TokenData = {
  name: string;
  symbol: string;
  initialSupply: string;
  description: string;
  burnEnabled: boolean;
  liquidityLockPeriod: number;
  useProtocolFee: boolean;
  vestingEnabled: boolean;
};

export type ProofData = {
  instanceIndex: number;
  proof: string;
  root: string;
  nullifierHash: string;
  recipient: string;
  relayer: string;
  fee: number;
  refund: number;
};

export function useGhostPadContract(
  tokenData: TokenData | null,
  proofData: ProofData | null,
  onSuccess: (txHash: string) => void,
  onError: (error: Error) => void
) {
  const { config } = usePrepareContractWrite({
    address: GHOSTPAD_CONTRACT_ADDRESS,
    abi: GhostPadABI.abi,
    functionName: 'deployTokenWithLiquidity',
    args: tokenData && proofData ? [tokenData, proofData] : undefined,
    enabled: !!tokenData && !!proofData
  });

  const { write, isLoading, isSuccess, data } = useContractWrite({
    ...config,
    onSuccess(data) {
      onSuccess(data.hash);
    },
    onError
  });

  return { deployToken: write, isLoading, isSuccess, transactionData: data };
} 