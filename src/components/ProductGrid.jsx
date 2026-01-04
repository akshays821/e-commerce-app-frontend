import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Products
        </h2>
        <span className="text-sm text-muted-foreground">
          {products.length} products
        </span>
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No products found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
