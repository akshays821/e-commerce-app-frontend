import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "../../components/admin/AdminHeader";
import ProductListTable from "../../components/admin/ProductListTable";
import ProductForm from "../../components/admin/ProductForm";
import { Plus } from "lucide-react";

export default function AdminDashboard() {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/20 text-primary">
              Admin Panel
            </span>
            <h1 className="text-4xl font-bold mt-2">Product Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage and organize your product catalog
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
          >
            <Plus size={18} />
            Add Product
          </motion.button>
        </div>

        <ProductListTable />
      </main>

      <AnimatePresence>
        {showAddForm && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
            />

            {/* Slide Panel */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-card z-50 border-l border-border shadow-2xl overflow-y-auto"
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <ProductForm onClose={() => setShowAddForm(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
