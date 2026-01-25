import {
  Headphones,
  Smartphone,
  Laptop,
  Watch,
  ShoppingBag,
  Footprints,
  Package,
  Home,
  Shirt,
  Armchair,
  Gamepad2,
  Camera,
  Utensils
} from "lucide-react";
import { motion } from "framer-motion";

// Icon mapping helper
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();

  const iconMap = {
    'shoes': Footprints,
    'footwear': Footprints,
    'sneakers': Footprints,
    'headphones': Headphones,
    'audio': Headphones,
    'mobile': Smartphone,
    'mobiles': Smartphone,
    'phones': Smartphone,
    'electronics': Smartphone,
    'laptop': Laptop,
    'laptops': Laptop,
    'computer': Laptop,
    'computers': Laptop,
    'watch': Watch,
    'watches': Watch,
    'accessories': ShoppingBag,
    'bags': ShoppingBag,
    'clothing': Shirt,
    'clothes': Shirt,
    'fashion': Shirt,
    'furniture': Armchair,
    'decor': Armchair,
    'gaming': Gamepad2,
    'games': Gamepad2,
    'camera': Camera,
    'cameras': Camera,
    'food': Utensils,
    'grocery': Utensils,
    'kitchen': Utensils,
  };

  return iconMap[name] || Package;
};

export default function CategorySection({ categories, activeCategory, onSelect }) {
  // If no categories are passed or empty, don't render or render default message
  // But caller should ensure top 6 are passed.

  const categoriesToRender = categories && categories.length > 0 ? categories : [];

  if (categoriesToRender.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-end justify-between mb-6 px-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Explore Categories
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse our most popular categories
          </p>
        </div>

        {/* Optional: Show "All" button or "Clear filter" if activeCategory is selected */}
        {activeCategory && (
          <button
            onClick={() => onSelect(null)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </button>
        )}
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {categoriesToRender.map((categoryName, index) => {
          const Icon = getCategoryIcon(categoryName);
          const isActive = activeCategory === categoryName;

          // Colorful backgrounds for inactive state
          const colors = [
            "bg-violet-100 hover:bg-violet-200",
            "bg-indigo-100 hover:bg-indigo-200",
            "bg-emerald-100 hover:bg-emerald-200",
            "bg-rose-100 hover:bg-rose-200",
            "bg-amber-100 hover:bg-amber-200",
            "bg-cyan-100 hover:bg-cyan-200"
          ];
          const colorClass = colors[index % colors.length];

          return (
            <motion.button
              key={categoryName}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(isActive ? null : categoryName)}
              className={`
                relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl transition-all duration-300
                border border-transparent
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : `${colorClass} text-foreground hover:shadow-xl hover:shadow-black/5`
                }
              `}
            >
              <div
                className={`p-3 rounded-xl transition-colors ${isActive
                  ? "bg-white/20"
                  : "bg-white/60 group-hover:bg-white"
                  }`}
              >
                <Icon
                  className={`w-6 h-6 ${isActive ? "text-white" : "text-primary"
                    }`}
                />
              </div>
              <span className="font-semibold text-sm tracking-wide capitalize">
                {categoryName}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
