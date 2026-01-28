
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Animations
import api from "../utils/api";
import toast from "react-hot-toast";

const PlaceOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // Support both single item buy-now and multiple items repayment (without touching cart)
    const buyNowItem = location.state?.buyNowItem;
    const buyNowItems = location.state?.buyNowItems;

    // Get User and Cart from Redux
    const { cartItems: reduxCartItems, totalPrice: reduxTotalPrice } = useSelector((state) => state.cart);

    // Determine items to show (Direct Buy List > Single Direct Buy > Cart)
    let cartItems = reduxCartItems;
    let totalPrice = reduxTotalPrice;

    if (buyNowItems && buyNowItems.length > 0) {
        cartItems = buyNowItems;
        totalPrice = buyNowItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    } else if (buyNowItem) {
        cartItems = [buyNowItem];
        totalPrice = buyNowItem.price * buyNowItem.quantity;
    }

    const { token, user } = useSelector((state) => state.userAuth);

    // Address State
    const [formData, setFormData] = useState({
        address: user?.address?.street || "",
        city: user?.address?.city || "",
        postalCode: user?.address?.zip || "",
        country: user?.address?.country || "",
        phone: user?.address?.phone || "",
    });

    // Update form data if user profile changes (e.g. on initial load or rehydration)
    useEffect(() => {
        if (user && user.address) {
            setFormData(prev => ({
                ...prev,
                address: user.address.street || "",
                city: user.address.city || "",
                postalCode: user.address.zip || "",
                country: user.address.country || "",
                phone: user.address.phone || "",
            }));
        }
    }, [user]);

    // Redirect if no token or empty cart
    useEffect(() => {
        if (!token) {
            toast.error("Please login to place an order");
            navigate("/login");
        } else if (cartItems.length === 0 && !buyNowItem) {
            toast.error("Your cart is empty");
            navigate("/cart");
        }
    }, [token, cartItems, navigate, buyNowItem]);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Place Order Function
    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.address || !formData.city || !formData.phone) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            // API Call to Create Order
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const orderData = {
                orderItems: cartItems,
                shippingAddress: formData,
                paymentMethod: "PhonePe",
                totalAmount: totalPrice,
            };

            const { data } = await api.post(
                "/api/orders",
                orderData,
                config
            );

            if (data.success) {
                // Set flag for OrderSuccess to know if it should clear cart or not
                if (buyNowItem || (buyNowItems && buyNowItems.length > 0)) {
                    localStorage.setItem("isDirectBuy", "true");
                } else {
                    localStorage.removeItem("isDirectBuy");
                }

                // Redirect to PhonePe Payment Page
                window.location.href = data.paymentUrl;
            } else {
                toast.error("Failed to initiate payment");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen relative bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">

            {/* Soft Background Mesh - Violet Vibes */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-200/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-200/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-soft-light pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-20">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-slate-900">
                        Secure Checkout
                    </h1>
                    <div className="h-1.5 w-24 mx-auto bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full shadow-lg shadow-violet-500/20" />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 md:p-10 shadow-xl shadow-violet-100/50 relative overflow-hidden">

                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-600 text-xs text-white shadow-lg shadow-violet-600/30">1</span>
                                Shipping Details
                            </h2>

                            <form onSubmit={handlePlaceOrder} className="space-y-6">
                                <div className="space-y-6">
                                    <InputField
                                        label="Street Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="123 Luxury Lane"
                                    />

                                    <div className="grid grid-cols-2 gap-6">
                                        <InputField
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="New York"
                                        />
                                        <InputField
                                            label="Postal Code"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="10001"
                                        />
                                    </div>

                                    <InputField
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="United States"
                                    />
                                    <InputField
                                        label="Phone Number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        className="w-full relative group overflow-hidden bg-violet-600 text-white py-4 rounded-xl font-bold text-lg tracking-wide shadow-xl shadow-violet-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] hover:shadow-2xl hover:shadow-fuchsia-900/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Proceed to Pay <span className="text-xl">→</span>
                                        </span>
                                    </button>
                                    <p className="text-center text-xs mt-3 text-emerald-600 font-bold bg-emerald-50 py-2 rounded border border-emerald-100 px-2">
                                        🚀 Recommended: Use UPI ID <span className="bg-white px-1 py-0.5 rounded border border-emerald-200 text-emerald-700 select-all">success@ybl</span> for instant approval
                                    </p>
                                    <p className="text-center text-slate-400 text-xs mt-4 flex items-center justify-center gap-2 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> SSL Encrypted & Secure
                                    </p>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Right: Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-5"
                    >
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-xs text-white shadow-lg shadow-violet-500/30">2</span>
                                    Your Order
                                </h2>

                                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-white">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                                                <p className="text-sm text-slate-500 font-medium">Qty: {item.quantity} × <span className="text-slate-800">${item.price}</span></p>
                                                <p className="text-xs text-slate-400 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded-md">Size: {item.selectedSize}</p>
                                            </div>
                                            <div className="font-bold text-slate-900">${item.price * item.quantity}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="my-6 h-px bg-slate-100" />

                                <div className="space-y-3 text-slate-600 font-medium">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">${totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-sm">Free</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex justify-between items-end">
                                        <span className="text-slate-500 font-medium">Total</span>
                                        <span className="text-4xl font-black text-slate-900 tracking-tight">
                                            ${totalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, placeholder }) => (
    <div className="relative group">
        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">
            {label}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 font-medium outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all duration-300 shadow-sm"
        />
    </div>
);
export default PlaceOrder;
