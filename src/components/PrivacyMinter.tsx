import React, { useState } from 'react';
import { Terminal, Shield, Coins, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PrivacyMinter = ({ onClose }: { onClose: () => void }) => {
  const [mode, setMode] = useState('deposit'); // deposit or mint
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(1); // Fixed at 1 ETH
  const [tokenName, setTokenName] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [loading, setLoading] = useState(false);
  const [commitment, setCommitment] = useState('');
  const [output, setOutput] = useState([
    { content: 'GhostPad initialized...', type: 'system' },
    { content: 'Ready for anonymous operations', type: 'system' }
  ]);

  const addOutput = (content, type = 'system', isError = false, isSuccess = false) => {
    setOutput(prev => [...prev, { content, type, isError, isSuccess }]);
  };

  const generateDeposit = async () => {
    setLoading(true);
    addOutput('Generating deposit commitment...', 'input');
    try {
      // Simulate k, r generation and commitment
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockCommitment = 'Cx' + Math.random().toString(16).slice(2, 10);
      setCommitment(mockCommitment);
      addOutput(`Commitment generated: ${mockCommitment}`, 'system', false, true);
      setStep(2);
    } catch (error) {
      addOutput('Error generating commitment', 'system', true);
    }
    setLoading(false);
  };

  const submitDeposit = async () => {
    setLoading(true);
    addOutput(`Submitting ${amount} ETH deposit...`, 'input');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addOutput('Deposit successful - save your commitment!', 'system', false, true);
      setStep(3);
    } catch (error) {
      addOutput('Error processing deposit', 'system', true);
    }
    setLoading(false);
  };

  const generateMintProof = async () => {
    setLoading(true);
    addOutput(`Generating ZK proof for ${tokenName}...`, 'input');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addOutput('Zero-knowledge proof generated', 'system', false, true);
      setStep(2);
    } catch (error) {
      addOutput('Error generating proof', 'system', true);
    }
    setLoading(false);
  };

  const executeMint = async () => {
    setLoading(true);
    addOutput('Submitting mint transaction via relayer...', 'input');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addOutput(`Token ${tokenName} minted successfully!`, 'system', false, true);
      setStep(3);
    } catch (error) {
      addOutput('Error minting token', 'system', true);
    }
    setLoading(false);
  };

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
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

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

            <div className="bg-ghost-dark p-6 rounded-lg border-4 border-ghost-primary/30 mb-6">
              {mode === 'deposit' ? (
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
                    {commitment && <p className="text-green-500 mt-2">Commitment: {commitment}</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-ghost-primary">MINT TOKEN</h3>
                  <input
                    placeholder="Token Name"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    disabled={step !== 1}
                    className="w-full bg-ghost-darker text-ghost-primary p-3 rounded border-2 border-ghost-primary/20 focus:border-ghost-primary focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Token Supply"
                    value={tokenSupply}
                    onChange={(e) => setTokenSupply(e.target.value)}
                    disabled={step !== 1}
                    className="w-full bg-ghost-darker text-ghost-primary p-3 rounded border-2 border-ghost-primary/20 focus:border-ghost-primary focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="bg-black p-6 rounded-lg border-4 border-ghost-primary/30 font-mono">
              <div className="mb-6 max-h-64 overflow-y-auto flex flex-col gap-4">
                {output.map(renderConsoleOutput)}
              </div>

              <div className="bg-ghost-darker p-4 rounded-lg border-4 border-ghost-primary/30">
                {mode === 'deposit' ? (
                  <>
                    {step === 1 && (
                      <Button
                        onClick={generateDeposit}
                        disabled={loading}
                        className="w-full bg-ghost-primary hover:bg-ghost-primary/80 text-ghost-darker font-bold py-3 px-6 rounded-lg disabled:opacity-50"
                        variant="outline"
                      >
                        {loading ? 'GENERATING...' : 'GENERATE COMMITMENT'}
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
                  <>
                    {step === 1 && (
                      <Button
                        onClick={generateMintProof}
                        disabled={loading || !tokenName || !tokenSupply}
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

                {step === 3 && (
                  <Button
                    onClick={() => {
                      setStep(1);
                      setTokenName('');
                      setTokenSupply('');
                      setCommitment('');
                      setOutput([
                        { content: 'GhostPad initialized...', type: 'system' },
                        { content: 'Ready for anonymous operations', type: 'system' }
                      ]);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
                    variant="outline"
                  >
                    START NEW {mode.toUpperCase()}
                  </Button>
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
