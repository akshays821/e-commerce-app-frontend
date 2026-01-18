import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Loader2, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmDialog from "./ConfirmDialog";
import ProductList from "./ProductList";

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");
    const [adding, setAdding] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [modal, setModal] = useState({
        isOpen: false,
        categoryId: null,
        name: ""
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
            setCategories(data);
        } catch {
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setAdding(true);
        try {
            const token = localStorage.getItem("adminToken");
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/categories`,
                { name: newCategory },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Category added");
            setNewCategory("");
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add category");
        } finally {
            setAdding(false);
        }
    };

    const promptDelete = (category) => {
        setModal({
            isOpen: true,
            categoryId: category._id,
            name: category.name
        });
    };

    const executeDelete = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/api/categories/${modal.categoryId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Category removed");
            fetchCategories();
        } catch {
            toast.error("Failed to delete category");
        } finally {
            setModal({ ...modal, isOpen: false });
        }
    };

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading categories...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-1">
                        {selectedCategory ? selectedCategory.name : "Categories"}
                    </h2>
                    <p className="text-muted-foreground">
                        {selectedCategory
                            ? `Managing products in ${selectedCategory.name}`
                            : "Manage product categories"}
                    </p>
                </div>

                {selectedCategory && (
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 px-4 py-2 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Categories
                    </button>
                )}
            </div>

            {selectedCategory ? (
                <ProductList categoryFilter={selectedCategory.name} />
            ) : (
                <>

                    {/* Add Category Card */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm mb-8">
                        <form onSubmit={handleAddCategory} className="flex gap-4">
                            <input
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="e.g. Shoes, Electronics..."
                                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            <button
                                type="submit"
                                disabled={adding || !newCategory.trim()}
                                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                                {adding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                Add Category
                            </button>
                        </form>
                    </div>

                    {/* Category List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((cat) => (
                            <div
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat)}
                                className="group flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Tag size={18} />
                                    </div>
                                    <span className="font-medium text-foreground capitalize">{cat.name}</span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        promptDelete(cat);
                                    }}
                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Category"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        {categories.length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                                No categories found. Add one above!
                            </div>
                        )}
                    </div>
                </>
            )}

            <ConfirmDialog
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={executeDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${modal.name}"? Products in this category will not be deleted but may differ.`}
                confirmText="Delete Category"
                isDestructive={true}
            />
        </div>
    );
}
