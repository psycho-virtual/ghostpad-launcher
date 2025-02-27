import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Navbar } from "@/components/Navbar";
import { ConnectWallet } from "@/components/ConnectWallet";

const Index = () => {
  return (
    <main className="min-h-screen bg-ghost-darker text-white">
      <Navbar />
      <ConnectWallet />
      <Hero />
      <Features />
    </main>
  );
};

export default Index;
