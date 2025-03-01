/**
 * Formats a commitment string for display by showing only first 10 characters
 */
export const formatCommitment = (commitment: string): string => {
  return commitment.substring(0, 10) + '...';
};

/**
 * Creates a download of commitment data
 */
export const downloadCommitmentData = (amount: number): void => {
  // Get commitment data
  const commitmentData = JSON.parse(localStorage.getItem('depositData') || '{}');

  // Add additional metadata
  const downloadData = {
    ...commitmentData,
    metadata: {
      date: new Date().toISOString(),
      amount: amount,
      type: 'ghostpad-commitment'
    }
  };

  // Create and download file
  const element = document.createElement('a');
  const file = new Blob([JSON.stringify(downloadData, null, 2)], {type: 'application/json'});
  element.href = URL.createObjectURL(file);
  element.download = `ghostpad-commitment-${Date.now()}.json`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Parse a JSON file from a FileReader event
 */
export const parseJsonFile = (
  event: ProgressEvent<FileReader>,
  onSuccess: (data: any) => void,
  onError: (message: string) => void
): void => {
  try {
    const result = event.target?.result;
    if (typeof result === 'string') {
      const jsonData = JSON.parse(result);
      onSuccess(jsonData);
    } else {
      onError('Invalid file format');
    }
  } catch (error) {
    onError(`Error parsing file: ${error.message}`);
  }
};

/**
 * Validate token information
 */
export const validateTokenInfo = (
  name: string,
  ticker: string,
  description: string
): { isValid: boolean; missingRequired: string[]; missingOptional: string[] } => {
  const missingRequired = [];
  if (!name) missingRequired.push('name');
  if (!ticker) missingRequired.push('ticker');
  if (!description) missingRequired.push('description');

  // Optional fields validation would go here
  const missingOptional = [];
  
  return {
    isValid: missingRequired.length === 0,
    missingRequired,
    missingOptional
  };
}; 