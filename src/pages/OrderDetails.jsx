
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../redux/slices/uiSlice";
import { addItemToCart, clearCart } from "../redux/slices/cartSlice"; // Import cart actions
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Truck, CreditCard, Home, XCircle, ShoppingBag, Trash2, Download, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.userAuth);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}`,
                    config
                );
                setOrder(data);
            } catch (error) {
                console.error("Fetch Error", error);
                toast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchOrder();
    }, [id, token]);

    const confirmCancelOrder = async () => {
        setCancelling(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}/cancel`,
                {},
                config
            );
            toast.success("Order cancelled successfully");
            // Refresh order data
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}`,
                config
            );
            setOrder(data);
        } catch (error) {
            console.error("Cancel Error", error);
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancelling(false);
        }
    };

    const handleCancelClick = () => {
        dispatch(showModal({
            type: "danger",
            title: "Cancel Order?",
            message: "Are you sure you want to cancel this order? This action cannot be undone.",
            confirmText: "Yes, Cancel It",
            cancelText: "No, Keep Order",
            showCancel: true,
            onConfirm: confirmCancelOrder
        }));
    };



    const handleRepay = async () => {
        if (!order) return;

        const loadingToast = toast.loading("Checking stock availability...");

        try {
            // 1. Verify Stock for all items
            const stockChecks = order.orderItems.map(async (item) => {
                // Handle populated product vs ID string
                const productId = typeof item.product === 'object' ? item.product._id : item.product;

                const { data: fetchedData } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`);

                // Handle potential response structure: { product: {...} } or {...}
                const product = fetchedData.product || fetchedData;
                const availableStock = product.countInStock ?? product.stock ?? 0;

                return {
                    name: item.name,
                    requested: item.qty,
                    available: availableStock,
                    inStock: availableStock >= item.qty
                };
            });

            const results = await Promise.all(stockChecks);
            const outOfStockItems = results.filter(r => !r.inStock);

            if (outOfStockItems.length > 0) {
                toast.dismiss(loadingToast);
                toast.error(`Unavailable: ${outOfStockItems[0].name} (Only ${outOfStockItems[0].available} left)`);
                return;
            }

            // 2. If all good, proceed to payment flow
            toast.dismiss(loadingToast);

            dispatch(showModal({
                type: "info",
                title: "Proceed to Payment",
                message: "Stock verified! Proceeding to secure checkout.",
                confirmText: "Pay Now",
                showCancel: true,
                onConfirm: async () => {
                    // Create direct buy payload without touching cart
                    const itemsToBuy = order.orderItems.map(item => ({
                        _id: typeof item.product === 'object' ? item.product._id : item.product,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        selectedSize: item.size,
                        quantity: item.qty,
                        category: 'General' // Default category if missing in order history
                    }));

                    // Navigate directly to checkout with these specific items
                    navigate("/place-order", { state: { buyNowItems: itemsToBuy } });
                }
            }));

        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Stock Check Error", error);
            toast.error("Could not verify stock. Please try again.");
        }
    };

    const downloadInvoice = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text("INVOICE", 105, 20, null, null, "center");

        doc.setFontSize(10);
        doc.text(`Order ID: ${order._id.toUpperCase()}`, 14, 40);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 46);

        // Table
        const tableBody = order.orderItems.map(item => [
            item.name,
            item.qty.toString(),
            `$${item.price}`,
            `$${(item.qty * item.price).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 55,
            head: [['Item', 'Quantity', 'Price', 'Total']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] },
        });

        const finalY = doc.lastAutoTable.finalY + 10;

        doc.text(`Total Amount: $${order.totalAmount}`, 14, finalY);
        doc.text(`Payment Method: ${order.paymentMethod}`, 14, finalY + 6);

        doc.save(`invoice_${order._id}.pdf`);
    };


    if (loading) return <div className="p-10 text-center font-bold text-xl">Loading Details...</div>;
    if (!order) return <div className="p-10 text-center text-red-500">Order not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-12 md:py-20 px-4 md:px-12 font-sans relative">

            {/* Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4 bg-white/60 backdrop-blur-lg p-5 md:p-6 rounded-3xl border border-white/50 shadow-sm"
                >
                    <div className="w-full md:w-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <Link to="/my-orders" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 text-xs md:text-sm font-bold group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Orders
                            </Link>
                            <Link to="/" className="text-slate-500 hover:text-violet-600 transition-colors flex items-center gap-2 text-xs md:text-sm font-bold group border-l border-slate-300 pl-4">
                                <ShoppingBag className="w-4 h-4" /> Continue Shopping
                            </Link>
                        </div>

                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex flex-wrap items-center gap-3 md:gap-4">
                            Order #{order._id.slice(-6).toUpperCase()}
                            <span className={`px-2.5 py-1 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border ${order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                    'bg-violet-100 text-violet-700 border-violet-200'
                                }`}>
                                {order.orderStatus}
                            </span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-wrap w-full md:w-auto gap-2 md:gap-3">
                        {(order.orderStatus === "pending" || order.orderStatus === "processing") && (
                            <button
                                onClick={handleCancelClick}
                                disabled={cancelling}
                                className="flex-1 md:flex-none justify-center px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all font-bold flex items-center gap-2"
                            >
                                {cancelling ? "Cancelling..." : <><XCircle className="w-4 h-4" /> Cancel</>}
                            </button>
                        )}

                        {/* Retry Payment for Pending Orders */}
                        {order.orderStatus === 'pending' && (
                            <button
                                onClick={handleRepay}
                                className="flex-1 md:flex-none justify-center px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-violet-600 hover:shadow-violet-600/30 transition-all font-bold flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" /> Pay Now
                            </button>
                        )}
                        {/* Download Invoice - Only if Paid */}
                        {order.paymentStatus === 'paid' && (
                            <button
                                onClick={downloadInvoice}
                                className="flex-1 md:flex-none justify-center px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base rounded-xl bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm hover:shadow-md font-bold flex items-center gap-2 text-slate-800"
                            >
                                Invoice <Download className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                    {/* Left Column: Items */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-5 md:p-8 shadow-xl shadow-slate-200/50">
                            <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                                <span className="w-1.5 h-6 bg-violet-500 rounded-full" /> Items Ordered
                            </h2>
                            <div className="space-y-6">
                                {order.orderItems.map((item) => (
                                    <div key={item._id} className="flex gap-4 md:gap-6 items-start md:items-center group border-b border-slate-100 pb-4 last:border-0 last:pb-0 md:border-none">

                                        {/* Image */}
                                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>

                                        {/* Content Wrapper */}
                                        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">

                                            {/* Details */}
                                            <div>
                                                <h3 className="font-bold text-sm md:text-lg text-slate-900 mb-1 line-clamp-2 md:line-clamp-none group-hover:text-violet-600 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-slate-500 text-xs md:text-sm font-medium">Size: {item.size || 'N/A'}</p>

                                                {/* Mobile Qty/Price Row */}
                                                <div className="flex items-center gap-3 mt-2 md:hidden">
                                                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Qty: {item.qty}</span>
                                                    <span className="text-slate-900 font-bold text-sm ml-auto">${(item.price * item.qty).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Desktop Price/Qty */}
                                            <div className="hidden md:flex flex-col items-end">
                                                <span className="text-xl font-black text-slate-900">${(item.price * item.qty).toFixed(2)}</span>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <span>{item.qty} x ${item.price}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4 md:space-y-6"
                    >
                        {/* Shipping */}
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-8 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-3 mb-4 text-slate-400">
                                <Truck className="w-5 h-5" /> <span className="text-xs font-bold uppercase tracking-wider">Delivery</span>
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-1">{order.shippingAddress.address}</h3>
                            <p className="text-sm md:text-base text-slate-500 font-medium">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p className="text-sm md:text-base text-slate-500 font-medium mb-4">{order.shippingAddress.country}</p>
                            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Mobile: {order.shippingAddress.phone}
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 md:p-8 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-3 mb-4 text-slate-400">
                                <CreditCard className="w-5 h-5" /> <span className="text-xs font-bold uppercase tracking-wider">Payment Info</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm md:text-base text-slate-500 font-medium">Method</span>
                                <span className="text-sm md:text-base font-bold text-slate-900">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm md:text-base text-slate-500 font-medium">Status</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />

                            <p className="text-violet-100 text-xs md:text-sm font-medium mb-1">Total Verified Amount</p>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">${order.totalAmount}</h2>

                            <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/20 flex justify-between items-center text-xs md:text-sm text-violet-100 font-medium">
                                <span>Included Taxes</span>
                                <span>${(order.totalAmount * 0.05).toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div >
        </div >
    );
};

export default OrderDetails;
