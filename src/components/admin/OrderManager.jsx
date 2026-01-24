import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/orders/admin/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem("adminToken");
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/orders/admin/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Optimistic update
            setOrders(prev => prev.map(order =>
                order._id === orderId ? { ...order, orderStatus: newStatus } : order
            ));

            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
            }

            toast.success(`Order marked as ${newStatus}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered": return "bg-green-100 text-green-700 border-green-200";
            case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
            case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
            case "cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-amber-100 text-amber-700 border-amber-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
                    <p className="text-slate-500 text-sm">Track and manage customer orders.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search Order ID or User..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4 font-mono font-bold text-slate-600">
                                        #{order._id.slice(-6).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {order.user?.name || "Unknown"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        ${order.totalAmount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {paginatedOrders.length === 0 && (
                    <div className="p-10 text-center text-slate-400">
                        No orders found matching your criteria.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-white"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-slate-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-2 border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-white"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-100"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Order Details</h3>
                                    <p className="text-sm text-slate-500 font-mono">ID: #{selectedOrder._id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status Actions */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Update Status</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                            <button
                                                key={status}
                                                disabled={selectedOrder.orderStatus === status || updatingStatus}
                                                onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${selectedOrder.orderStatus === status
                                                    ? "bg-slate-800 text-white border-slate-800"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Shipping Address</p>
                                        <div className="text-sm text-slate-700">
                                            <p className="font-bold">{selectedOrder.user?.name}</p>
                                            <p>{selectedOrder.shippingAddress.address}</p>
                                            <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                                            <p>{selectedOrder.shippingAddress.country}</p>
                                            <p className="mt-1 text-slate-500">{selectedOrder.shippingAddress.phone}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Payment Info</p>
                                        <div className="text-sm text-slate-700">
                                            <p className="flex justify-between"><span>Method:</span> <span className="font-bold">{selectedOrder.paymentMethod}</span></p>
                                            <p className="flex justify-between mt-1">
                                                <span>Status:</span>
                                                <span className={`px-1.5 py-0.5 rounded text-xs font-bold uppercase ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {selectedOrder.paymentStatus}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-3">Order Items</p>
                                    <div className="space-y-3">
                                        {selectedOrder.orderItems.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-white" />
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm text-slate-900">{item.name}</p>
                                                    <p className="text-xs text-slate-500">Qty: {item.qty} × ${item.price}</p>
                                                </div>
                                                <p className="font-bold text-slate-900">${item.qty * item.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-slate-500">Total Amount</span>
                                <span className="text-2xl font-black text-slate-900">${selectedOrder.totalAmount}</span>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
