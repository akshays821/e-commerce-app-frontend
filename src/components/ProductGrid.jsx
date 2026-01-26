import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

export default function ProductGrid({ products = [] }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Featured Products
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Handpicked for you based on AI trends
          </p>
        </div>
        <span className="px-3 py-1 bg-secondary/50 text-secondary-foreground text-xs font-medium rounded-full border border-border">
          {products.length} Items
        </span>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No products found
        </p>
      ) : (
        <>
          {/* Mobile Note: Used grid-cols-3 for mobile for high density (3 items per row) */}
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        </>
      )}
    </section>
  );
}
