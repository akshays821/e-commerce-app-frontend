import { useEffect, useState } from "react";
import { Activity, DollarSign, Package, Users, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function DashboardStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/admin/stats`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total Revenue",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: "Potential Value",
            positive: true,
            icon: DollarSign,
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Active Users",
            value: stats.activeUsers,
            change: `${stats.totalUsers} Registered`,
            positive: true,
            icon: Users,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Total Products",
            value: stats.totalProducts,
            change: "In Inventory",
            positive: true,
            icon: Package,
            color: "bg-purple-50 text-purple-600",
        },
        {
            label: "Users Banned",
            value: stats.totalUsers - stats.activeUsers,
            change: "Restricted",
            positive: false,
            icon: Activity, // simple icon for now
            color: "bg-amber-50 text-amber-600",
        },
    ];

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-foreground">Dashboard Overview</h2>
                <p className="text-muted-foreground mt-1">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Mock Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold">Revenue Analytics</h3>
                        <select className="bg-gray-50 border-none text-sm font-medium rounded-lg px-3 py-2 outline-none">
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ duration: 1, delay: i * 0.05 }}
                                className="w-full bg-primary/10 rounded-t-lg hover:bg-primary/20 transition-colors relative group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {h}%
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-muted-foreground font-medium">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                        <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                                    <Activity size={16} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">New order placed</p>
                                    <p className="text-xs text-muted-foreground">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
