import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function FloatingAIButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3.5 rounded-full font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
    >
      <Sparkles
        className={`w-5 h-5 ${isHovered ? "animate-pulse" : ""}`}
      />
      <span>Ask AI</span>

      {/* subtle ping effect */}
      <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-20 pointer-events-none" />
    </button>
  );
}
