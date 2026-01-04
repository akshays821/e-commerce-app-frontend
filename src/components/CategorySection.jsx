import {
  Headphones,
  Smartphone,
  Laptop,
  Watch,
  ShoppingBag,
  Footprints,
} from "lucide-react";

const categories = [
  { name: "Shoes", icon: Footprints },
  { name: "Headphones", icon: Headphones },
  { name: "Mobiles", icon: Smartphone },
  { name: "Laptops", icon: Laptop },
  { name: "Watches", icon: Watch },
  { name: "Accessories", icon: ShoppingBag },
];

export default function CategorySection({ activeCategory, onSelect }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 text-center">
        Browse Categories
      </h2>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.name;

          return (
            <button
              key={category.name}
              onClick={() =>
                onSelect(isActive ? null : category.name)
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
