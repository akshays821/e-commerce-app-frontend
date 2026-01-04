import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Package } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { fetchProducts } from "../../redux/slices/productsSlice";

export default function ProductList() {
  const dispatch = useDispatch();

  const { products, loading } = useSelector((state) => state.products);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product deleted");

      // Refresh list after delete
      dispatch(fetchProducts());
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-muted-foreground">
        Loading products…
      </div>
    );
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
          Add your first product to get started
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/10">
              <th className="p-4 text-left text-xs uppercase">Product</th>
              <th className="p-4 text-left text-xs uppercase">Category</th>
              <th className="p-4 text-left text-xs uppercase">Price</th>
              <th className="p-4 text-left text-xs uppercase">Stock</th>
              <th className="p-4 text-right text-xs uppercase">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/50 hover:bg-secondary/5"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                      <div>
                        <p className="font-medium text-sm">
                          {product.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {product._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-sm text-muted-foreground">
                    {product.category}
                  </td>

                  <td className="p-4 text-sm font-bold text-primary">
                    ₹{product.price}
                  </td>

                  <td className="p-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {product.stock} items
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="px-3 py-1 text-xs rounded bg-primary/20 text-primary">
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(product._id)}
                        className={`px-3 py-1 text-xs rounded ${
                          deleteConfirm === product._id
                            ? "bg-red-600 text-white"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
