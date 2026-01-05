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
    <header className="sticky top-0 z-50 bg-secondary/50 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/20"
            whileHover={{ scale: 1.1 }}
          >
            <Shield className="w-6 h-6 text-primary" />
          </motion.div>

          <div>
            <h1 className="text-lg font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground">
              Control Center
            </p>
          </div>
        </motion.div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </header>
  );
}
