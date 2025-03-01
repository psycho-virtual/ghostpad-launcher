/**
 * Normalizes an Ethereum address or hex string to ensure it has a single 0x prefix
 * @param address The address or hex string to normalize
 * @returns Properly formatted address with single 0x prefix
 */
export function normalizeAddress(address: string): string {
  if (!address) return address;
  
  // Remove all 0x prefixes
  let cleaned = address.replace(/^0x/i, '');
  
  // If we ended up with another 0x (might have been 0x0x), clean it again
  while (cleaned.startsWith('0x')) {
    cleaned = cleaned.substring(2);
  }
  
  // Add single 0x prefix
  return `0x${cleaned}`;
}

/**
 * Validates if a string is a valid Ethereum address
 * @param address The address to validate
 * @returns True if the address is valid
 */
export function isValidAddress(address: string): boolean {
  // Should be 0x followed by 40 hex chars
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Validates if a string is a valid Ethereum hash (32 bytes)
 * @param hash The hash to validate
 * @returns True if the hash is valid
 */
export function isValidHash(hash: string): boolean {
  // Should be 0x followed by 64 hex chars (32 bytes)
  return /^0x[0-9a-fA-F]{64}$/.test(hash);
} 