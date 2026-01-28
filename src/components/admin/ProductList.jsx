import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Package } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { fetchProducts } from "../../redux/slices/productsSlice";
import ConfirmDialog from "./ConfirmDialog";
import GlobalLoading from "../GlobalLoading";

export default function ProductList({ categoryFilter, onEdit }) {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);

  const filteredProducts = categoryFilter
    ? products.filter(p => {
      if (Array.isArray(p.category)) {
        return p.category.some(c => c.toLowerCase() === categoryFilter.toLowerCase());
      }
      return p.category?.toLowerCase() === categoryFilter.toLowerCase();
    })
    : products;

  const [modal, setModal] = useState({
    isOpen: false,
    productId: null,
    title: ""
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const promptDelete = (product) => {
    setModal({
      isOpen: true,
      productId: product._id,
      title: product.title
    });
  };

  const executeDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.delete(
        `/api/products/${modal.productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Product deleted");
      dispatch(fetchProducts());
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setModal({ ...modal, isOpen: false });
    }
  };

  if (loading) {
    return <GlobalLoading isLoading={true} message="Loading Products..." />;
  }

  if (!products.length) {
    return (
      <motion.div className="p-16 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold">No products yet</h3>
        <p className="text-sm text-muted-foreground">
          {categoryFilter
            ? `No products found in ${categoryFilter}`
            : "Add your first product to get started"}
        </p>
      </motion.div>
    );
  }

  if (categoryFilter && !filteredProducts.length) {
    return (
      <div className="p-16 text-center text-muted-foreground">
        No products found in <span className="font-bold">{categoryFilter}</span>.
      </div>
    )
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/100?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return `${baseUrl}/${imagePath.replace(/\\/g, "/")}`;
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="p-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Product</th>
              <th className="p-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Category</th>
              <th className="p-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Price</th>
              <th className="p-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stock</th>
              <th className="p-4 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-neutral-100 flex-shrink-0 border border-neutral-200 overflow-hidden">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-neutral-900">
                          {product.title}
                        </p>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">
                          #{product._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-neutral-600">
                    <span className="capitalize">
                      {Array.isArray(product.category)
                        ? product.category.join(", ")
                        : product.category}
                    </span>
                  </td>

                  <td className="p-4 text-sm font-medium text-neutral-900">
                    ₹{product.price.toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.stock > 10
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                      }`}>
                      {product.stock} in stock
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Edit button */}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => promptDelete(product)}
                        className="p-2 rounded-md transition-colors text-neutral-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={executeDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${modal.title}"? This action cannot be undone.`}
        confirmText="Delete Product"
        isDestructive={true}
      />
    </div>
  );
}
