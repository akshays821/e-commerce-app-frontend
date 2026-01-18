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
    <section className="mb-12">
      <div className="flex items-end justify-between mb-6 px-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Explore Categories
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse our wide range of premium products
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.name;

          return (
            <button
              key={category.name}
              onClick={() => onSelect(isActive ? null : category.name)}
              className={`
                relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300
                border border-transparent hover:-translate-y-1
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-white/60 hover:bg-white text-foreground hover:shadow-xl hover:shadow-black/5"
                }
              `}
            >
              <div
                className={`p-3 rounded-xl transition-colors ${isActive
                    ? "bg-white/20"
                    : "bg-primary/5 group-hover:bg-primary/10"
                  }`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-white" : "text-primary"
                    }`}
                />
              </div>
              <span className="font-semibold text-sm tracking-wide">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
