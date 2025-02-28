import React, { useState, useEffect, useRef } from 'react';
import { Shield, Coins, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCommitmentGenerator } from '@/hooks/useCommitmentGenerator';

const PrivacyMinter = ({ onClose }) => {
  // Workflow state
  const [mode, setMode] = useState('deposit'); // 'deposit' or 'mint'
  const [step, setStep] = useState(1); // Step within each mode (1, 2, or 3)
  const [amount, setAmount] = useState(1); // ETH amount (0.1, 1, or 10)

  // Token info form state
  const [tokenName, setTokenName] = useState('');
  const [tokenTicker, setTokenTicker] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [tokenTwitter, setTokenTwitter] = useState('');
  const [tokenWebsite, setTokenWebsite] = useState('');
  const [tokenTelegram, setTokenTelegram] = useState('');
  const [tokenImage, setTokenImage] = useState(null);
  const [selectedCommitmentFile, setSelectedCommitmentFile] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState([
    { content: 'GhostPad initialized...', type: 'system' },
    { content: 'Ready for anonymous operations', type: 'system' }
  ]);
  const outputEndRef = useRef(null);

  // Use commitment generator hook
  const {
    loading: commitmentLoading,
    commitment,
    error: commitmentError,
    depositData,
    generateCommitment,
    prepareDepositData,
    prepareWithdrawData
  } = useCommitmentGenerator();

  // Set up auto-scrolling for console output
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  // Show any commitment errors in the console
  useEffect(() => {
    if (commitmentError) {
      addOutput(`Error: ${commitmentError}`, 'system', true);
    }
  }, [commitmentError]);

  /**
   * Add a line to the console output
   */
  const addOutput = (content, type = 'system', isError = false, isSuccess = false) => {
    setOutput(prev => [...prev, { content, type, isError, isSuccess }]);
  };

  /**
   * Reset the form to start over
   */
  const resetForm = () => {
    setStep(1);
    setTokenName('');
    setTokenTicker('');
    setTokenDescription('');
    setTokenTwitter('');
    setTokenWebsite('');
    setTokenTelegram('');
    setTokenImage(null);
    setSelectedCommitmentFile(null);
    setOutput([
      { content: 'GhostPad initialized...', type: 'system' },
      { content: 'Ready for anonymous operations', type: 'system' }
    ]);
  };

  /**
   * Handle image upload for token
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTokenImage(reader.result);
      };
      reader.readAsDataURL(file);
      addOutput(`Token image selected: ${file.name}`, 'input');
    }
  };

  /**
   * Handle commitment file upload for minting process
   */
  const handleCommitmentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          if (jsonData.commitment && jsonData.nullifierHash) {
            // Store the commitment data in localStorage
            localStorage.setItem('depositData', JSON.stringify(jsonData));
            setSelectedCommitmentFile(file.name);
            addOutput(`Commitment file loaded: ${file.name}`, 'system', false, true);
          } else {
            addOutput('Invalid commitment file format', 'system', true);
          }
        } catch (error) {
          addOutput('Error parsing commitment file: ' + error.message, 'system', true);
        }
      };
      reader.onerror = () => {
        addOutput('Error reading file', 'system', true);
      };
      reader.readAsText(file);
    }
  };

  /**
   * Generate a cryptographic commitment for privacy
   */
  const handleGenerateCommitment = async () => {
    addOutput('Generating deposit commitment...', 'input');

    const result = await generateCommitment();

    if (result.success) {
      const shortCommitment = result.commitment.substring(0, 10) + '...';
      addOutput(`Commitment generated: ${shortCommitment}`, 'system', false, true);

      // Store commitment details securely for future reference
      localStorage.setItem('depositData', JSON.stringify(result.depositData));
      setStep(2);
    } else {
      addOutput('Error generating commitment: ' + result.error, 'system', true);
    }
  };

  /**
   * Submit a deposit to the privacy pool
   */
  const submitDeposit = async () => {
    setLoading(true);
    addOutput(`Submitting ${amount} ETH deposit...`, 'input');

    try {
      // Prepare the deposit data
      const depositData = prepareDepositData();

      // In a real implementation, this would call the contract:
      // const tx = await tornadoContract.deposit(depositData.commitment, {
      //   value: ethers.parseEther(amount.toString())
      // });
      // await tx.wait();

      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      addOutput('Deposit successful - save your commitment!', 'system', false, true);
      setStep(3);
    } catch (error) {
      addOutput('Error processing deposit: ' + (error.message || error), 'system', true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate a zero-knowledge proof for token minting
   */
  const generateMintProof = async () => {
    setLoading(true);
    addOutput(`Generating ZK proof for ${tokenName} (${tokenTicker})...`, 'input');

    try {
      // Validate required token info
      if (!tokenName || !tokenTicker || !tokenDescription) {
        throw new Error('Missing required token information');
      }

      // Check for any missing but optional fields
      const missingFields = [];
      if (!tokenImage) missingFields.push('token image');
      if (missingFields.length > 0) {
        addOutput(`Warning: Missing optional fields: ${missingFields.join(', ')}`, 'system');
      }

      // Load saved deposit data
      const savedDepositData = JSON.parse(localStorage.getItem('depositData') || '{}');
      if (!savedDepositData.nullifierHash) {
        throw new Error('No valid commitment data found. Please upload your commitment file from Phase 1.');
      }

      // Simulate proof generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const shortHash = savedDepositData.nullifierHash.substring(0, 10) + '...';
      addOutput(`Using nullifier hash: ${shortHash}`, 'system');
      addOutput('Zero-knowledge proof generated', 'system', false, true);

      setStep(2);
    } catch (error) {
      addOutput(error.message || 'Error generating proof', 'system', true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Execute the token minting transaction
   */
  const executeMint = async () => {
    setLoading(true);
    addOutput('Submitting mint transaction via relayer...', 'input');

    try {
      // Load saved deposit data
      const savedDepositData = JSON.parse(localStorage.getItem('depositData') || '{}');

      // Prepare withdrawal data with the current user account as recipient
      // In a real implementation, this would be the user's connected wallet address
      const withdrawData = prepareWithdrawData('0xUserAddress');

      // In a real implementation, this would call the token minting contract:
      // const tx = await tokenContract.deployToken(
      //   { name: tokenName, symbol: tokenTicker, ... },
      //   withdrawData,
      //   true, // useProtocolFee
      //   false // vestingEnabled
      // );
      // await tx.wait();

      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      addOutput(`Token ${tokenName} (${tokenTicker}) minted successfully!`, 'system', false, true);
      setStep(3);
    } catch (error) {
      addOutput('Error minting token: ' + (error.message || error), 'system', true);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render a console output line with appropriate styling
   */
  const renderConsoleOutput = (item, index) => (
    <div
      key={index}
      className={`p-3 rounded-lg border-l-4 ${
        item.isError
          ? 'bg-red-900/30 text-red-400 border-red-500'
          : item.isSuccess
          ? 'bg-green-900/30 text-green-400 border-green-500'
          : item.type === 'input'
          ? 'bg-gray-800 text-orange-400 border-orange-500'
          : 'bg-gray-900 text-yellow-500 border-yellow-500'
      }`}
    >
      <span className="font-extrabold mr-3">{item.type === 'input' ? '>' : '←'}</span>
      {item.content}
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-orange-500 to-yellow-500 p-8 rounded-xl animate-fade-in">
          <div className="bg-ghost-dark rounded-xl p-6 border-8 border-yellow-500 shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 p-1 rounded-lg transform -rotate-2">
                <h1 className="text-6xl font-black text-gray-900 bg-ghost-dark px-8 py-4 rounded-lg">
                  <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text">
                    GHOSTPAD
                  </span>
                </h1>
              </div>
              <div className="mt-4 text-ghost-primary font-bold text-xl">
                ANONYMOUS TOKEN LAUNCHER
              </div>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-4 mb-6">
              <Button
                onClick={() => {setMode('deposit'); setStep(1);}}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg font-bold text-lg ${
                  mode === 'deposit' ? 'bg-ghost-primary text-ghost-dark' : 'bg-ghost-dark text-gray-400 hover:bg-ghost-dark/80'
                }`}
                variant="outline"
              >
                <Shield className="w-5 h-5" />
                Phase 1: Deposit
              </Button>
              <Button
                onClick={() => {setMode('mint'); setStep(1);}}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg font-bold text-lg ${
                  mode === 'mint' ? 'bg-ghost-primary text-ghost-dark' : 'bg-ghost-dark text-gray-400 hover:bg-ghost-dark/80'
                }`}
                variant="outline"
              >
                <Coins className="w-5 h-5" />
                Phase 2: Mint
              </Button>
            </div>

            {/* Form Content */}
            <div className="bg-ghost-dark p-6 rounded-lg border-4 border-ghost-primary/30 mb-6">
              {mode === 'deposit' ? (
                /* Deposit Form */
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-ghost-primary">DEPOSIT ETH</h3>
                  <div className="bg-ghost-darker p-4 rounded border-2 border-ghost-primary/20">
                    <div className="flex gap-4 mb-4">
                      <Button
                        onClick={() => setAmount(0.1)}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold ${
                          amount === 0.1 ? 'bg-ghost-primary text-ghost-darker' : 'bg-ghost-dark text-gray-400 hover:bg-ghost-dark/80'
                        }`}
                        variant="outline"
                      >
                        0.1 ETH
                      </Button>
                      <Button
                        onClick={() => setAmount(1)}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold ${
                          amount === 1 ? 'bg-ghost-primary text-ghost-darker' : 'bg-ghost-dark text-gray-400 hover:bg-ghost-dark/80'
                        }`}
                        variant="outline"
                      >
                        1 ETH
                      </Button>
                      <Button
                        onClick={() => setAmount(10)}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold ${
                          amount === 10 ? 'bg-ghost-primary text-ghost-darker' : 'bg-ghost-dark text-gray-400 hover:bg-ghost-dark/80'
                        }`}
                        variant="outline"
                      >
                        10 ETH
                      </Button>
                    </div>
                    <p className="text-ghost-primary">Selected amount: {amount} ETH</p>
                    {commitment && (
                      <p className="text-green-500 mt-2">
                        Commitment: {typeof commitment === 'string'
                          ? commitment.substring(0, 12) + '...'
                          : 'Generated'}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* Mint Form */
                <div>
                  <h3 className="text-lg font-bold text-ghost-primary mb-4">MINT TOKEN</h3>

                  {/* Commitment File Upload Section */}
                  <div className="mb-4 p-4 bg-ghost-darker rounded border-2 border-ghost-primary/20">
                    <h4 className="text-md font-medium text-ghost-primary mb-2">Commitment Data</h4>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => document.getElementById('commitment-file-upload')?.click()}
                        disabled={step !== 1}
                        className="py-2 px-4 bg-ghost-dark text-ghost-primary border border-ghost-primary/20 rounded hover:bg-ghost-primary/10"
                        variant="outline"
                      >
                        Upload Commitment File
                      </Button>
                      <input
                        type="file"
                        id="commitment-file-upload"
                        className="hidden"
                        accept=".json"
                        onChange={handleCommitmentUpload}
                        disabled={step !== 1}
                      />
                      <span className="text-sm text-ghost-primary/70">
                        {selectedCommitmentFile
                          ? `File: ${selectedCommitmentFile}`
                          : "Upload your commitment .json file from Phase 1"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 max-h-60 overflow-y-auto pr-2"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#FFD700 #1A1F2C',
                    }}
                  >
                    {/* Image Upload Section */}
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                      <div
                        className="w-full aspect-square bg-ghost-darker rounded-lg border-2 border-dashed border-ghost-primary/20 flex items-center justify-center cursor-pointer hover:bg-ghost-darker/80 transition-colors"
                        onClick={() => document.getElementById('token-image-upload')?.click()}
                      >
                        {tokenImage ? (
                          <img
                            src={tokenImage}
                            alt="Token preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <div className="text-ghost-primary text-4xl mb-2">🖼️</div>
                            <p className="text-ghost-primary/70 text-sm">Upload Token Image</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        id="token-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={step !== 1}
                      />
                      <p className="text-ghost-primary/50 text-xs mt-2 text-center">Recommended: 500x500px</p>
                    </div>

                    {/* Token Details Section */}
                    <div className="w-full md:w-2/3 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          placeholder="Token Name *"
                          value={tokenName}
                          onChange={(e) => setTokenName(e.target.value)}
                          disabled={step !== 1}
                          className="w-full bg-ghost-darker text-ghost-primary p-3 rounded border-2 border-ghost-primary/20 focus:border-ghost-primary focus:outline-none"
                        />
                        <input
                          placeholder="Token Ticker *"
                          value={tokenTicker}
                          onChange={(e) => setTokenTicker(e.target.value)}
                          disabled={step !== 1}
                          className="w-full bg-ghost-darker text-ghost-primary p-3 rounded border-2 border-ghost-primary/20 focus:border-ghost-primary focus:outline-none"
                        />
                      </div>

                      <textarea
                        placeholder="Token Description *"
                        value={tokenDescription}
                        onChange={(e) => setTokenDescription(e.target.value)}
                        disabled={step !== 1}
                        rows={2}
                        className="w-full bg-ghost-darker text-ghost-primary p-3 rounded border-2 border-ghost-primary/20 focus:border-ghost-primary focus:outline-none resize-none"
                      />

                      {/* Social Media Fields */}
                      <div className="grid grid-cols-1 gap-3">
                        {/* Twitter Field */}
                        <div className="flex items-center">
                          <div className="text-ghost-primary/50 bg-ghost-darker/50 p-3 rounded-l border-2 border-r-0 border-ghost-primary/20 min-w-[40px] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                          </div>
                          <input
                            placeholder="Twitter (optional)"
                            value={tokenTwitter}
                            onChange={(e) => setTokenTwitter(e.target.value)}
                            disabled={step !== 1}
                            className="flex-1 bg-ghost-darker text-ghost-primary p-3 rounded-r border-2 border-ghost-primary/20 focus:border-ghost-primary focus:outline-none"
                          />
                        </div>

                        {/* Website Field */}
                        <div className="flex items-center">
                          <div className="text-ghost-primary/50 bg-ghost-darker/50 p-3 rounded-l border-2 border-r-0 border-ghost-primary/20 min-w-[40px] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="2" y1="12" x2="22" y2="12"></line>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                          </div>
                          <input
                            placeholder="Website (optional)"
                            value={tokenWebsite}
                            onChange={(e) => setTokenWebsite(e.target.value)}
                            disabled={step !== 1}
                            className="flex-1 bg-ghost-darker text-ghost-primary p-3 rounded-r border-2 border-ghost-primary/20 focus:border-ghost-primary focus:outline-none"
                          />
                        </div>

                        {/* Telegram Field */}
                        <div className="flex items-center">
                          <div className="text-ghost-primary/50 bg-ghost-darker/50 p-3 rounded-l border-2 border-r-0 border-ghost-primary/20 min-w-[40px] flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21.5 7.5L18.3 4.3C17.8 3.8 17.1 3.5 16.4 3.5H7.6C6.9 3.5 6.2 3.8 5.7 4.3L2.5 7.5"></path>
                              <path d="M2.5 7.5L5.7 10.7C6.2 11.2 6.9 11.5 7.6 11.5H16.4C17.1 11.5 17.8 11.2 18.3 10.7L21.5 7.5"></path>
                              <path d="M22 12V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V12"></path>
                              <line x1="2" y1="7.5" x2="22" y2="7.5"></line>
                            </svg>
                          </div>
                          <input
                            placeholder="Telegram (optional)"
                            value={tokenTelegram}
                            onChange={(e) => setTokenTelegram(e.target.value)}
                            disabled={step !== 1}
                            className="flex-1 bg-ghost-darker text-ghost-primary p-3 rounded-r border-2 border-ghost-primary/20 focus:border-ghost-primary focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-ghost-primary/50 text-xs">
                    * Required fields
                  </div>
                </div>
              )}
            </div>

            {/* Console Output & Buttons */}
            <div className="bg-black p-6 rounded-lg border-4 border-ghost-primary/30 font-mono">
              {/* Console Output */}
              <div
                className="mb-6 h-40 overflow-y-auto flex flex-col gap-4 pr-2"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#FFD700 #1A1F2C',
                }}
              >
                {output.map(renderConsoleOutput)}
                <div ref={outputEndRef} />
              </div>

              {/* Action Buttons */}
              <div className="bg-ghost-darker p-4 rounded-lg border-4 border-ghost-primary/30">
                {mode === 'deposit' ? (
                  // Deposit Mode Buttons
                  <>
                    {step === 1 && (
                      <Button
                        onClick={handleGenerateCommitment}
                        disabled={commitmentLoading || loading}
                        className="w-full bg-ghost-primary hover:bg-ghost-primary/80 text-ghost-darker font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                        variant="outline"
                      >
                        {commitmentLoading || loading ? 'GENERATING...' : 'GENERATE COMMITMENT'}
                      </Button>
                    )}
                    {step === 2 && (
                      <Button
                        onClick={submitDeposit}
                        disabled={loading}
                        className="w-full bg-ghost-primary hover:bg-ghost-primary/80 text-ghost-darker font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                        variant="outline"
                      >
                        {loading ? 'PROCESSING...' : 'SUBMIT DEPOSIT'}
                      </Button>
                    )}
                  </>
                ) : (
                  // Mint Mode Buttons
                  <>
                    {step === 1 && (
                      <Button
                        onClick={generateMintProof}
                        disabled={loading || !tokenName || !tokenTicker || !tokenDescription}
                        className="w-full bg-ghost-primary hover:bg-ghost-primary/80 text-ghost-darker font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                        variant="outline"
                      >
                        {loading ? 'GENERATING...' : 'GENERATE PROOF'}
                      </Button>
                    )}
                    {step === 2 && (
                      <Button
                        onClick={executeMint}
                        disabled={loading}
                        className="w-full bg-ghost-primary hover:bg-ghost-primary/80 text-ghost-darker font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                        variant="outline"
                      >
                        {loading ? 'MINTING...' : 'MINT TOKEN'}
                      </Button>
                    )}
                  </>
                )}

                {/* Complete Step Buttons (Step 3) */}
                {step === 3 && (
                  <div className="flex flex-col space-y-3">
                    {mode === 'deposit' && (
                      <Button
                        onClick={() => {
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

                          addOutput('Commitment data downloaded as JSON', 'system', false, true);
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
                        variant="outline"
                      >
                        DOWNLOAD COMMITMENT DATA
                      </Button>
                    )}

                    <Button
                      onClick={resetForm}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
                      variant="outline"
                    >
                      START NEW {mode.toUpperCase()}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyMinter;
