import { useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Shield } from "lucide-react";
import logo from "../../assets/logo2.png";
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
          <img src={logo} alt="ShopAI Admin" className="h-10 w-auto object-contain" />
          <span className="text-sm font-medium text-muted-foreground border-l pl-3 ml-2 border-gray-200">
            Admin Panel
          </span>
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
