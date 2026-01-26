import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ProductManager from "../../components/admin/ProductManager";
import UserManagement from "../../components/admin/UserManagement";
import CategoryManager from "../../components/admin/CategoryManager";
import OrderManager from "../../components/admin/OrderManager";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Check auth & block back button
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }
    };
    checkAuth();

    const handlePopState = (event) => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardStats />;
      case "products":
        return <ProductManager />;
      case "categories":
        return <CategoryManager />;
      case "users":
        return <UserManagement />;
      case "orders":
        return <OrderManager />;
      case "settings":
        return (
          <div className="p-8 text-center text-muted-foreground">
            <h2 className="text-2xl font-bold mb-2">Settings</h2>
            <p>System configuration coming soon.</p>
          </div>
        );
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col md:flex-row font-['Outfit'] relative">

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="font-bold text-lg text-slate-800 uppercase tracking-wider">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-50 rounded-lg text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false); // Close sidebar on selection (mobile)
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
