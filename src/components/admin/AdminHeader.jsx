import { useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  // redirect to login if admin token is missing
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center font-['Outfit']">

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            ShopAI Admin
          </h1>
        </div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>
      </div>
    </header>
  );
}
