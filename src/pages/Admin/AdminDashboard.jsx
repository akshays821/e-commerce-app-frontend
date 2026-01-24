import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import ProductManager from "../../components/admin/ProductManager";
import UserManagement from "../../components/admin/UserManagement";
import CategoryManager from "../../components/admin/CategoryManager";
import OrderManager from "../../components/admin/OrderManager";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check auth

  // Check auth & block back button
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      // Optional: Verify token by making a lightweight request
      // If this fails with 401, the interceptor in utils/api.js (if used) or this catch block will handle it
      // For now, relying on the presence + API failures to kick out is a start, but let's be safer:
      // We'll rely on the sub-components to fail fast or add a verify endpoint later.
    };
    checkAuth();

    // Prevent back button logic remains...
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
    <div className="min-h-screen bg-[#F8F9FC] flex font-['Outfit']">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
