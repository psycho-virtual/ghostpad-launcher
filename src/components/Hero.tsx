
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ghost-dark">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-ghost-primary/5 via-transparent to-transparent" />
      </div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-ghost-primary/10 text-ghost-primary mb-8 animate-fade-in">
            <Shield className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Secure & Anonymous Token Launching</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-ghost-primary to-ghost-secondary animate-fade-up">
            GhostPad
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Launch tokens with complete privacy on Solana. No technical knowledge required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button
              className="px-8 py-6 bg-gradient-to-r from-ghost-primary to-ghost-secondary hover:opacity-90 transition-all duration-200 text-ghost-darker font-semibold text-lg rounded-xl"
            >
              Launch Anonymously
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              className="px-8 py-6 border-ghost-primary/20 text-ghost-primary hover:bg-ghost-primary/10 transition-all duration-200 font-semibold text-lg rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
