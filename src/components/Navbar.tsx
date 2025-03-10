import React, { useState } from "react";
import { X, Twitter, Instagram } from "lucide-react";

// Using external SVG file from public directory
// No need for a custom component definition

export const Navbar = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // Explicit handlers for social media links
  const handleTwitterClick = (e) => {
    e.preventDefault();
    window.open('https://x.com/ghostpadai', '_blank', 'noopener,noreferrer');
  };

  const handleInstagramClick = (e) => {
    e.preventDefault();
    window.open('https://instagram.com/ghostpadai', '_blank', 'noopener,noreferrer');
  };

  const handleTiktokClick = (e) => {
    e.preventDefault();
    window.open('https://tiktok.com/@ghostpadai', '_blank', 'noopener,noreferrer');
  };

  const handlePacmanClick = (e) => {
    e.preventDefault();
    window.open('https://www.daos.fun/dao/8fzhnxwVFdcvDxL16jtrEcRJrdLoQoNWk7UmS9z4h3dY', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-4 right-4 z-50 flex items-center gap-3 p-3 rounded-full bg-ghost-darker border border-ghost-primary/20 text-white">
        <span className="text-xl mr-1">👻</span>
        <button
          onClick={toggleInstructions}
          className="text-sm font-medium hover:text-ghost-primary transition-colors"
        >
          [how it works]
        </button>
        <a href="#advanced" className="text-sm font-medium hover:text-ghost-primary transition-colors">
          [advanced]
        </a>
        <a href="#support" className="text-sm font-medium hover:text-ghost-primary transition-colors">
          [support]
        </a>
        <div className="flex items-center gap-2 ml-1">
          <button
            onClick={handleTwitterClick}
            className="hover:text-ghost-primary transition-colors cursor-pointer"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </button>
          <button
            onClick={handlePacmanClick}
            className="hover:text-ghost-primary transition-colors cursor-pointer"
            aria-label="Pacman"
          >
            <img
              src="/pacman.svg"
              alt="Pacman"
              className="w-5 h-5"
            />
          </button>
        </div>
      </nav>

      {/* Instructions Modal Overlay */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-ghost-dark border border-ghost-primary/30 p-6 rounded-xl max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-ghost-primary">How It Works</h3>
              <button
                onClick={toggleInstructions}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-ghost-primary pl-4">
                <p className="text-white">
                  <span className="text-ghost-primary font-bold">1.</span> Connect your wallet and click "Launch Application"
                </p>
              </div>

              <div className="border-l-4 border-ghost-primary pl-4">
                <p className="text-white">
                  <span className="text-ghost-primary font-bold">2.</span> Configure your token parameters and privacy settings
                </p>
              </div>

              <div className="border-l-4 border-ghost-primary pl-4">
                <p className="text-white">
                  <span className="text-ghost-primary font-bold">3.</span> Deploy your token with complete anonymity
                </p>
              </div>

              <div className="border-l-4 border-ghost-primary pl-4">
                <p className="text-white">
                  <span className="text-ghost-primary font-bold">4.</span> Monitor and manage your token through the dashboard
                </p>
              </div>
            </div>

            <button
              onClick={toggleInstructions}
              className="mt-6 w-full py-2 bg-ghost-primary text-white rounded-lg hover:bg-ghost-primary/80 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
