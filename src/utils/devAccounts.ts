import { privateKeyToAccount } from 'viem/accounts';

// Default Anvil accounts
export const ANVIL_ACCOUNTS = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    balance: '10000000000000000000000' // 10,000 ETH
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    balance: '10000000000000000000000'
  },
  // Add more if needed
];

/**
 * Get a pre-funded account to use for development
 */
export function getLocalDevAccount(index = 0) {
  if (index >= ANVIL_ACCOUNTS.length) {
    throw new Error(`Account index ${index} out of range`);
  }
  
  const account = privateKeyToAccount(ANVIL_ACCOUNTS[index].privateKey as `0x${string}`);
  return account;
} 