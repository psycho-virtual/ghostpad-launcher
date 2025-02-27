import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Navbar } from "@/components/Navbar";
import { ConnectWallet } from "@/components/ConnectWallet";
import PrivacyMinter from "@/components/PrivacyMinter";
import { useState } from "react";

const Index = () => {
  const [showMinter, setShowMinter] = useState(false);

  return (
    <main className="min-h-screen bg-ghost-darker text-white">
      <Navbar />
      <ConnectWallet />
      <Hero />
      <Features />
      {showMinter && <PrivacyMinter onClose={() => setShowMinter(false)} />}
    </main>
  );
};

export default Index;
