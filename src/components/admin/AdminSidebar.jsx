import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }) {
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "products", label: "Products", icon: ShoppingBag },
        { id: "users", label: "Users", icon: Users },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Logo Area */}
            <div className="p-8 pb-12">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    ShopAI
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide mt-1">
                    ADMIN WORKSPACE
                </p>
            </div>

            {/* Main Menu */}
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === item.id
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                            }`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? "animate-pulse" : ""} />
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && (
                            <ChevronRight size={16} className="ml-auto opacity-50" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2">
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "settings"
                            ? "bg-gray-100 text-foreground"
                            : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                        }`}
                >
                    <Settings size={20} />
                    <span className="font-medium">Settings</span>
                </button>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
