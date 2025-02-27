import React, { useState } from "react";
import { X, Twitter, Instagram } from "lucide-react";

export const Navbar = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
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
          <a href="#" className="hover:text-ghost-primary transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-ghost-primary transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3.25c0-.69-.56-1.25-1.25-1.25s-1.25.56-1.25 1.25V17h-2v-6h2v1.13c.47-.8 1.4-1.13 2.25-1.13 1.38 0 2.5 1.12 2.5 2.5V17z" />
            </svg>
          </a>
          <a href="#" className="hover:text-ghost-primary transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-ghost-primary transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
          </a>
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
