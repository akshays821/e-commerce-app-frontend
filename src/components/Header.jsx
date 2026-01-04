import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            ShopAI
          </span>
        </div>

        <p className="hidden sm:block text-sm text-muted-foreground">
          Discover products smarter with AI
        </p>
      </div>
    </header>
  );
}
