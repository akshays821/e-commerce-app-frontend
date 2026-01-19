import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

export default function ProductManager() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowAddForm(true);
    };

    const handleClose = () => {
        setShowAddForm(false);
        setEditingProduct(null);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">Products</h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your store inventory
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setEditingProduct(null);
                        setShowAddForm(true);
                    }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                >
                    <Plus size={18} />
                    Add Product
                </motion.button>
            </div>

            <ProductList onEdit={handleEdit} />

            {/* Modal Logic moved here */}
            <AnimatePresence>
                {showAddForm && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                        />
                        <motion.div
                            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-background z-[70] border-l border-border shadow-2xl overflow-y-auto"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        >
                            <ProductForm onClose={handleClose} productToEdit={editingProduct} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
