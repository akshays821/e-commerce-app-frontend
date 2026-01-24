
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronRight, Hash, Calendar, DollarSign, Truck, CheckCircle, Clock, XCircle, MapPin, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast"; // Ensure toast is imported
import { showModal } from "../redux/slices/uiSlice"; // Import showModal
import { useDispatch } from "react-redux"; // Import useDispatch
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const { token } = useSelector((state) => state.userAuth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Tracking Modal State
    const [trackingOrder, setTrackingOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/orders/myorders`,
                    config
                );
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchOrders();
        else {
            setLoading(false);
        }
    }, [token]);

    const filteredOrders = activeTab === "all"
        ? orders
        : orders.filter(order => order.orderStatus.toLowerCase() === activeTab);

    const tabs = [
        { id: "all", label: "All Orders" },
        { id: "processing", label: "Processing" },
        { id: "shipped", label: "Shipped" },
        { id: "delivered", label: "Delivered" },
        { id: "cancelled", label: "Cancelled" },
    ];

    const getEmptyStateMessage = () => {
        switch (activeTab) {
            case "processing": return "You have no orders currently being processed.";
            case "shipped": return "No orders have been shipped yet.";
            case "delivered": return "You haven't received any orders yet.";
            case "cancelled": return "You have no cancelled orders.";
            default: return "Looks like you haven't placed any orders yet.";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 md:px-8 relative font-sans">

            {/* Tracking Modal */}
            <AnimatePresence>
                {trackingOrder && (
                    <TrackingModal order={trackingOrder} onClose={() => setTrackingOrder(null)} />
                )}
            </AnimatePresence>

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-100/40 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 text-center md:text-left"
                >
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">My Orders</h1>
                        <p className="text-slate-500 text-lg">Track your extensive shopping history.</p>
                    </div>
                    <button
                        onClick={() => navigate("/")}
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <ShoppingBag className="w-4 h-4" /> Continue Shopping
                    </button>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap gap-2 mb-8"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${activeTab === tab.id
                                ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 transform scale-105"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Orders Grid */}
                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {filteredOrders.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm"
                            >
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Package className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders found</h3>
                                <p className="text-slate-500 mb-6">{getEmptyStateMessage()}</p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    Start Shopping
                                </button>
                            </motion.div>
                        ) : (
                            filteredOrders.map((order, index) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    index={index}
                                    navigate={navigate}
                                    token={token}
                                    dispatch={dispatch}
                                    setOrders={setOrders} // Pass setter to update list after delete
                                    onTrack={() => setTrackingOrder(order)}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
};

const OrderCard = ({ order, index, navigate, onTrack, token, dispatch, setOrders }) => {
    // Stepper Logic
    const steps = ["pending", "processing", "shipped", "delivered"];
    const isCancelled = order.orderStatus === "cancelled";

    // If cancelled, we don't show the process logic
    const currentStepIndex = steps.indexOf(order.orderStatus.toLowerCase());

    // Helper to calculate progress percentage
    const progress = Math.max(5, (currentStepIndex / (steps.length - 1)) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-[#FFFCF6]/90 backdrop-blur-md border border-stone-200/60 rounded-2xl p-5 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 to-orange-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
                {/* Top Row: ID, Date, Status */}
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <Hash className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Order ID</p>
                            <p className="font-mono text-lg font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block h-10 w-px bg-slate-100"></div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date Placed</p>
                            <p className="text-base font-bold text-slate-700">
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="md:ml-auto">
                        <StatusBadge status={order.orderStatus} />
                    </div>
                </div>

                {/* Middle: Items & Stepper */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
                    {/* Images Preview */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
                            {order.orderItems.map((item) => (
                                <div key={item._id} className="relative flex-shrink-0 group/item">
                                    <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-white">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                                        {item.qty}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex flex-col justify-center items-start lg:items-end">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-slate-900">${order.totalAmount}</p>
                        <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Paid via {order.paymentMethod}
                        </p>
                    </div>
                </div>

                {/* Stepper Visual -- Hide if Cancelled */}
                {!isCancelled && currentStepIndex !== -1 && (
                    <div className="mt-8 relative">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 rounded-full -translate-y-1/2" />

                        {/* Active Progress */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute top-1/2 left-0 h-1.5 bg-blue-600 rounded-full -translate-y-1/2 z-10"
                        />

                        <div className="relative z-20 flex justify-between w-full">
                            {steps.map((step, i) => {
                                const isActive = i <= currentStepIndex;
                                const isCurrent = i === currentStepIndex;

                                return (
                                    <div key={step} className="flex flex-col items-center gap-2">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.2 + (i * 0.1) }}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-500 bg-white ${isActive ? "border-blue-600 text-blue-600" : "border-slate-200 text-slate-300"
                                                } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                                        >
                                            {getStepIcon(step)}
                                        </motion.div>
                                        <p className={`text-xs font-bold uppercase tracking-wider ${isActive ? "text-slate-900" : "text-slate-300"}`}>
                                            {step}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {isCancelled && (
                    <div className="mt-8 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-700">
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-bold text-sm">This order has been cancelled.</p>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="mt-6 flex justify-end gap-3 items-center">
                    {(isCancelled || order.orderStatus === "delivered") && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                dispatch(showModal({
                                    type: "danger",
                                    title: "Delete Order?",
                                    message: "Only you can see this. Delete from history?",
                                    confirmText: "Delete",
                                    showCancel: true,
                                    onConfirm: async () => {
                                        try {
                                            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${order._id}`, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            toast.success("Order deleted");
                                            setOrders(prev => prev.filter(o => o._id !== order._id));
                                        } catch (err) {
                                            toast.error("Failed to delete");
                                        }
                                    }
                                }));
                            }}
                            className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete Order"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-xs"
                    >
                        View Details
                    </button>
                    {/* Only show Track Order if not cancelled and not pending (usually tracking starts after processing) */}
                    {!isCancelled && order.orderStatus !== 'pending' && (
                        <button
                            onClick={onTrack}
                            className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 text-xs"
                        >
                            Track Order
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Tracking Modal Component
const TrackingModal = ({ order, onClose }) => {
    // Generate some fake timeline events based on status
    const getEvents = () => {
        const events = [
            { title: "Order Placed", date: order.createdAt, desc: "Your order has been received." },
            { title: "Payment Confirmed", date: order.createdAt, desc: "Payment successfully verified." },
            { title: "Processing Started", date: order.createdAt, desc: "We are preparing your items." }
        ];

        if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
            events.unshift({ title: "Shipped", date: new Date(), desc: "Your package is on the way." });
        }
        if (order.orderStatus === 'delivered') {
            events.unshift({ title: "Delivered", date: new Date(), desc: "Package delivered to your address." });
        }
        return events;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Tracking Info</h3>
                        <p className="text-slate-500 text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {getEvents().map((event, i) => (
                            <div key={i} className="relative">
                                <div className={`absolute -left-[2.1rem] w-5 h-5 rounded-full border-4 border-white shadow-sm ${i === 0 ? "bg-blue-600 ring-4 ring-blue-100" : "bg-slate-300"}`} />
                                <h4 className={`font-bold ${i === 0 ? "text-slate-900" : "text-slate-500"}`}>{event.title}</h4>
                                <p className="text-xs text-slate-400 mb-1">{new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString()}</p>
                                <p className="text-sm text-slate-600">{event.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Estimated Delivery</p>
                    <p className="text-lg font-bold text-slate-900">
                        {new Date(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 5)).toDateString()}
                    </p>
                </div>

            </motion.div>
        </motion.div>
    );
};


// Utils
const StatusBadge = ({ status }) => {
    const styles = {
        pending: "bg-amber-100 text-amber-700 border-amber-200",
        processing: "bg-blue-100 text-blue-700 border-blue-200",
        shipped: "bg-purple-100 text-purple-700 border-purple-200",
        delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
        cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    const style = styles[status?.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200";

    return (
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${style}`}>
            {status}
        </span>
    );
};

const getStepIcon = (step) => {
    switch (step) {
        case "pending": return <Clock className="w-4 h-4" />;
        case "processing": return <Package className="w-4 h-4" />;
        case "shipped": return <Truck className="w-4 h-4" />;
        case "delivered": return <CheckCircle className="w-4 h-4" />;
        default: return <div className="w-2 h-2 bg-current rounded-full" />;
    }
};

export default MyOrders;
