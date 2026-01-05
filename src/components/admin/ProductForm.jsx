import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/slices/productsSlice";

export default function ProductForm({ onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value, // if file input , store file , else normal value
    });
  };
  
// manual validation to replace browser "requiired popups"
  const validate = () => {
    if (!form.title || !form.price || !form.category || !form.stock) {
      toast.error("Please fill all required fields");
      return false;
    }
    if (Number(form.price) <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Admin not authenticated");
        return;
      }

      // Convert form object into FormData, appending only fields that have values
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) data.append(key, form[key]);
      });

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/products`,
        data,
        {
          headers: { // send token from headers to backend 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product added successfully");
      dispatch(fetchProducts());
      onClose();
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-card border-b p-6 flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add Product</h2>
          <p className="text-sm text-muted-foreground">
            Enter product details
          </p>
        </div>
        <button onClick={onClose}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <input
          name="title"
          placeholder="Product title *"
          onChange={handleChange}
          className="input"
        />

        <input
          name="price"
          type="number"
          placeholder="Price *"
          onChange={handleChange}
          className="input"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock *"
          onChange={handleChange}
          className="input"
        />

        <select name="category" onChange={handleChange} className="input">
          <option value="">Select category *</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="input"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white py-2 rounded-lg"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-muted py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
