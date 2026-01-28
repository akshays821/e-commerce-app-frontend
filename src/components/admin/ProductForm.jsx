import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../../redux/slices/productsSlice";
import { Upload, X, Plus, Image as ImageIcon, Check } from "lucide-react";

export default function ProductForm({ onClose, productToEdit = null }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    categories: [], // Array of strings
    tags: [],
    stock: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Load Categories & Initial Data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/categories");
        setAvailableCategories(data);
      } catch (error) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();

    if (productToEdit) {
      setForm({
        title: productToEdit.title,
        price: productToEdit.price,
        categories: Array.isArray(productToEdit.category)
          ? productToEdit.category
          : [productToEdit.category], // Handle legacy string data
        tags: productToEdit.tags || [],
        stock: productToEdit.stock,
        description: productToEdit.description || "",
      });

      // Set existing image as preview
      if (productToEdit.image) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const imgUrl = productToEdit.image.startsWith("http")
          ? productToEdit.image
          : `${baseUrl}/${productToEdit.image.replace(/\\/g, "/")}`;
        setImagePreview(imgUrl);
      }
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Image Handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Category Logic
  const toggleCategory = (catName) => {
    const lowerName = catName.toLowerCase();
    if (form.categories.includes(lowerName)) {
      setForm({
        ...form,
        categories: form.categories.filter((c) => c !== lowerName),
      });
    } else {
      setForm({
        ...form,
        categories: [...form.categories, lowerName],
      });
    }
  };

  const removeCategory = (catName) => {
    setForm({
      ...form,
      categories: form.categories.filter((c) => c !== catName),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || form.categories.length === 0 || !form.stock) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      data.append("title", form.title);
      data.append("price", form.price);
      data.append("stock", form.stock);
      data.append("description", form.description);

      // Send categories as JSON string to be parsed by backend
      data.append("category", JSON.stringify(form.categories));

      // Send tags as JSON string
      data.append("tags", JSON.stringify(form.tags));

      if (imageFile) {
        data.append("image", imageFile);
      }

      if (productToEdit) {
        // Update Mode
        await api.put(
          `/api/products/${productToEdit._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product updated successfully");
      } else {
        // Create Mode
        if (!imageFile) {
          toast.error("Product image is required");
          setLoading(false);
          return;
        }
        await api.post(
          "/api/products",
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product created successfully");
      }

      dispatch(fetchProducts());
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {productToEdit ? "Update product details" : "Create a new item for your store"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Image Upload Section */}
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-foreground/80">Product Image</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative aspect-video w-full rounded-2xl border-2 border-dashed border-border 
              flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden
              group hover:border-primary/50 hover:bg-primary/5
              ${imagePreview ? 'bg-black/50' : 'bg-muted/30'}
            `}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain p-4 z-0"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                  <p className="text-white font-medium flex items-center gap-2">
                    <Upload size={18} /> Change Image
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon size={32} />
                </div>
                <p className="text-lg font-medium">Click to upload image</p>
                <p className="text-sm text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Basic Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Product Name</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              className="w-full bg-input border border-border rounded-xl px-4 py-3 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">Price (₹)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full bg-input border border-border rounded-xl px-4 py-3 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories Multi-Select */}
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-foreground/80">Categories</label>

          <div
            className="w-full min-h-[50px] bg-input border border-border rounded-xl px-4 py-3 cursor-pointer focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all flex flex-wrap gap-2"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
          >
            {form.categories.length === 0 && (
              <span className="text-muted-foreground">Select categories...</span>
            )}

            {form.categories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <span className="capitalize">{cat}</span>
                <X
                  size={14}
                  className="cursor-pointer hover:text-destructive transition-colors relative z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(cat);
                  }}
                />
              </span>
            ))}
          </div>

          <AnimatePresence>
            {isCategoryDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute w-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 max-h-[200px] overflow-y-auto p-1 text-neutral-200"
              >
                {availableCategories.length === 0 ? (
                  <div className="p-3 text-center text-sm text-muted-foreground">
                    No categories found. Create one first.
                  </div>
                ) : (
                  availableCategories.map(cat => {
                    const isSelected = form.categories.includes(cat.name.toLowerCase());
                    return (
                      <div
                        key={cat._id}
                        onClick={() => toggleCategory(cat.name)}
                        className={`
                          flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors
                          ${isSelected
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'hover:bg-neutral-800 text-neutral-300'}
                        `}
                      >
                        <span className="capitalize">{cat.name}</span>
                        {isSelected && <Check size={16} />}
                      </div>
                    )
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simple overlay to close dropdown */}
          {isCategoryDropdownOpen && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsCategoryDropdownOpen(false)}
            ></div>
          )}
        </div>

        {/* Tags Input (New) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">Search Tags (Hidden keywords)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a tag and press Enter (e.g. shoes, running)"
              className="flex-1 bg-input border border-border rounded-xl px-4 py-3 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = e.currentTarget.value.trim();
                  if (val && !form.tags.includes(val)) {
                    setForm({ ...form, tags: [...form.tags, val] });
                    e.currentTarget.value = "";
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.tags && form.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm border border-border">
                #{tag}
                <X
                  size={14}
                  className="cursor-pointer hover:text-destructive ml-1"
                  onClick={() => setForm({ ...form, tags: form.tags.filter(t => t !== tag) })}
                />
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">These tags help in search but won't be visible to customers.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">Stock Quantity</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
            className="w-full bg-input border border-border rounded-xl px-4 py-3 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/80">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your product..."
            rows={4}
            className="w-full bg-input border border-border rounded-xl px-4 py-3 placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0 z-10 flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 px-4 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 disabled:opacity-50"
        >
          {loading
            ? (productToEdit ? "Updating..." : "Creating...")
            : (productToEdit ? "Save Changes" : "Create Product")
          }
        </button>
      </div>
    </div>
  );
}
