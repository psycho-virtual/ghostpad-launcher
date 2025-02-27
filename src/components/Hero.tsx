import React from "react";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const Hero: React.FC = () => {
  const { toast } = useToast();

  const handleLaunch = () => {
    toast({
      title: "Coming Soon! 👻",
      description: "Anonymous token launching will be available shortly. Stay tuned!",
      className: "bg-ghost-dark border border-ghost-primary/20",
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ghost-dark">
      <div className="w-full max-w-4xl mx-auto px-4 flex-grow flex items-center">
        <div className="bg-gradient-to-b from-orange-500 to-yellow-500 p-8 rounded-xl animate-fade-in w-full">
          <div className="bg-gray-900 rounded-xl p-6 border-8 border-yellow-500 shadow-2xl">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-ghost-primary/10 text-ghost-primary mb-4">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Secure & Anonymous Token Launching</span>
              </div>

              <h1 className="text-4xl font-extrabold text-yellow-500 -rotate-2 mb-2">
                GhostPad
              </h1>
              <div className="bg-black/50 inline-block px-4 py-1 rounded-lg border-l-4 border-r-4 border-yellow-500 transform -rotate-1">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 font-mono tracking-wider">
                  anonymous meme coin launchpad
                </p>
              </div>
            </div>
            {/* Theme Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['Pepe Season', 'AI Tokens', 'GameFi', 'Meme Coins'].map((theme) => (
                <button
                  key={theme}
                  className="bg-orange-500/90 hover:bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{theme}</span>
                </button>
              ))}
            </div>
            {/* Console Section */}
            <div className="bg-black p-6 rounded-lg border-4 border-orange-500 font-mono">
              <div className="mb-6 space-y-4">
                <div className="p-3 rounded-lg border-l-4 bg-gray-900 text-yellow-500 border-yellow-500">
                  <span className="font-extrabold mr-3">←</span>
                  Welcome to GhostPad - The future of anonymous token launching
                </div>
                <div className="p-3 rounded-lg border-l-4 bg-gray-900 text-yellow-500 border-yellow-500">
                  <span className="font-extrabold mr-3">←</span>
                  Launch tokens with complete privacy on Solana
                </div>
              </div>
              {/* Input Section */}
              <div className="bg-gray-800 p-4 rounded-lg border-4 border-orange-500 flex gap-4">
                <Button
                  onClick={handleLaunch}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-mono py-6"
                >
                  Launch Application
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => window.open('/public/whitepaper.pdf', '_blank')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-mono py-6"
                >
                  Learn More
                  <Shield className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

// No default export, using named export instead
