import { useState } from "react";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false); // card effect animation

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group bg-card rounded-2xl border border-transparent hover:border-border/60 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2`}
    >
      <div className="relative aspect-square bg-secondary/30 overflow-hidden">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"
            }`}
        />

        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-background/80 backdrop-blur-sm text-xs font-medium text-muted-foreground rounded-full">
              {product.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-foreground text-base mb-2 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-lg font-semibold text-primary">
          ₹{product.price}
        </p>
      </div>
    </div>
  );
}
