import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.png";
    if (imagePath.startsWith("http")) return imagePath;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return `${baseUrl}/${imagePath.replace(/\\/g, "/")}`;
  };

  // Deterministic random subtle color based on product ID
  const getColor = (id) => {
    const colors = [
      "from-white to-red-50/60",
      "from-white to-orange-50/60",
      "from-white to-amber-50/60",
      "from-white to-yellow-50/60",
      "from-white to-lime-50/60",
      "from-white to-green-50/60",
      "from-white to-emerald-50/60",
      "from-white to-teal-50/60",
      "from-white to-cyan-50/60",
      "from-white to-sky-50/60",
      "from-white to-blue-50/60",
      "from-white to-indigo-50/60",
      "from-white to-violet-50/60",
      "from-white to-purple-50/60",
      "from-white to-fuchsia-50/60",
      "from-white to-pink-50/60",
      "from-white to-rose-50/60"
    ];
    // Use last char code to pick color
    const index = id ? id.charCodeAt(id.length - 1) : 0;
    return colors[index % colors.length];
  };

  const bgClass = getColor(product._id);

  return (
    <Link to={`/product/${product._id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        className={`group relative bg-gradient-to-br ${bgClass} rounded-2xl border border-white/60 shadow-sm hover:shadow-xl hover:shadow-black/5 overflow-hidden h-full`}
      >
        <div className="relative aspect-square overflow-hidden bg-white">
          <img
            src={getImageUrl(product.image)}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {product.category && (
            <div className="hidden md:block absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-semibold text-neutral-700 rounded-full shadow-sm">
                {product.category}
              </span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>

        <div className="p-2 md:p-5">
          <h3 className="font-semibold text-neutral-800 text-[10px] md:text-lg mb-1 md:mb-2 line-clamp-2 md:line-clamp-1 group-hover:text-primary transition-colors leading-tight">
            {product.title}
          </h3>
          <div className="flex items-center justify-between mt-1 md:mt-0">
            <p className="text-sm md:text-xl font-bold text-primary">
              ₹{product.price}
            </p>
            <button className="hidden md:flex w-8 h-8 rounded-full bg-primary/10 text-primary items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <span className="text-xl leading-none mb-0.5">+</span>
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
