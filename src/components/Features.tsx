
import { Lock, Link, Network, TreePine } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "Zero-Knowledge Proofs",
    description: "Ensure complete privacy with advanced cryptographic guarantees",
  },
  {
    icon: Link,
    title: "Cross-Chain Privacy",
    description: "Seamlessly operate across multiple blockchain networks",
  },
  {
    icon: TreePine,
    title: "Merkle Tree Verification",
    description: "Secure and efficient proof verification system",
  },
  {
    icon: Network,
    title: "Relayer Network",
    description: "Distributed network ensuring transaction privacy",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-ghost-darker">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 animate-fade-up">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-ghost-primary to-ghost-secondary">
            Technical Features
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-ghost-dark border border-ghost-primary/10 hover:border-ghost-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon className="w-12 h-12 text-ghost-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
