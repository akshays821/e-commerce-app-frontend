
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    Trash2,
    Plus,
    Minus,
    ShoppingBag,
    ArrowRight,
    ArrowLeft,
    X,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import {
    removeItemFromCart,
    updateCartItemQuantity
} from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cartItems, totalQuantity, totalPrice } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.userAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [itemToDelete, setItemToDelete] = useState(null);

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const shippingCost = totalPrice > 500 ? 0 : 20;
    const finalTotal = totalPrice + shippingCost;

    const confirmDelete = () => {
        if (itemToDelete) {
            dispatch(removeItemFromCart({ id: itemToDelete._id, selectedSize: itemToDelete.selectedSize }));
            setItemToDelete(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] relative font-sans selection:bg-indigo-100 selection:text-indigo-900">

            {/* Premium Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img
                    src="/bg-cart.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-40 mix-blend-multiply"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-white/50" />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-32 md:py-32">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 text-slate-600 shadow-sm hover:shadow-md transition-all"
                        >
                            <ArrowLeft size={20} />
                        </motion.button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Cart</h1>
                            <p className="text-slate-500 font-medium mt-1">
                                You have <span className="text-indigo-600 font-bold">{totalQuantity} items</span> in your bag
                            </p>
                        </div>
                    </div>

                    {totalQuantity > 0 && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl text-slate-600 font-semibold hover:bg-white hover:shadow-md transition-all"
                            onClick={() => navigate('/')}
                        >
                            Continue Shopping
                        </motion.button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    // Empty Cart State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 px-4 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white/50 text-center max-w-2xl mx-auto"
                    >
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-500" />
                            <div className="relative w-28 h-28 bg-gradient-to-tr from-indigo-50 to-white rounded-[2rem] flex items-center justify-center shadow-lg border border-white/50">
                                <ShoppingBag className="w-12 h-12 text-indigo-500" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Your cart feels a bit light</h2>
                        <p className="text-slate-500 text-lg max-w-md mb-10 leading-relaxed">
                            There's nothing in here yet. Discover our latest collection and find the perfect match for your style.
                        </p>

                        <Link
                            to="/"
                            className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:translate-y-[-2px]"
                        >
                            Start Exploring
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-start">

                        {/* Cart Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={`${item._id}-${item.selectedSize}`}
                                        variants={itemVariants}
                                        layout
                                        className="group relative bg-white/70 backdrop-blur-md rounded-[2rem] p-4 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 border border-white/60 transition-all duration-300"
                                    >
                                        <div className="flex gap-4 sm:gap-6">
                                            {/* Product Image - larger on mobile relative to container */}
                                            <div className="w-24 h-28 sm:w-36 sm:h-40 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start gap-2 sm:gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-base sm:text-xl font-bold text-slate-800 leading-tight line-clamp-2">
                                                                <Link to={`/product/${item._id}`} className="hover:text-indigo-600 transition-colors">
                                                                    {item.name}
                                                                </Link>
                                                            </h3>
                                                            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 uppercase tracking-wide">
                                                                {item.category}
                                                            </p>
                                                        </div>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => setItemToDelete(item)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all sm:opacity-0 group-hover:opacity-100 focus:opacity-100 sm:translate-x-2 group-hover:translate-x-0"
                                                            title="Remove item"
                                                        >
                                                            <Trash2 size={18} className="sm:w-5 sm:h-5" />
                                                        </button>
                                                    </div>

                                                    {item.selectedSize && (
                                                        <div className="mt-2 sm:mt-3 inline-flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-1 bg-white rounded-lg border border-slate-100 shadow-sm">
                                                            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Size</span>
                                                            <span className="text-xs sm:text-sm font-bold text-slate-800">{item.selectedSize}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-end justify-between mt-4">
                                                    {/* Quantity Controls - Compact on mobile */}
                                                    <div className="flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                                                        <button
                                                            onClick={() => dispatch(updateCartItemQuantity({ id: item._id, selectedSize: item.selectedSize, quantity: item.quantity - 1 }))}
                                                            disabled={item.quantity <= 1}
                                                            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg text-slate-500 disabled:opacity-30 transition-colors"
                                                        >
                                                            <Minus size={14} strokeWidth={3} />
                                                        </button>
                                                        <span className="w-4 sm:w-6 text-center font-bold text-slate-800 tabular-nums text-sm sm:text-base">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => dispatch(updateCartItemQuantity({ id: item._id, selectedSize: item.selectedSize, quantity: item.quantity + 1 }))}
                                                            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                        >
                                                            <Plus size={14} strokeWidth={3} />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="sticky top-28 space-y-6">

                                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-white/60 relative overflow-hidden">
                                    {/* Decorative Top Gradient */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>

                                    <div className="space-y-4">
                                        <div className="flex justify-between text-slate-500">
                                            <span className="font-medium">Subtotal</span>
                                            <span className="font-bold text-slate-800">${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span className="font-medium">Shipping Estimate</span>
                                            {shippingCost === 0 ? (
                                                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-lg text-sm">Free</span>
                                            ) : (
                                                <span className="font-bold text-slate-800">${shippingCost.toFixed(2)}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span className="font-medium">Tax (5%)</span>
                                            <span className="font-bold text-slate-800">${(totalPrice * 0.05).toFixed(2)}</span>
                                        </div>

                                        <div className="my-6 border-t border-slate-200"></div>

                                        <div className="flex justify-between items-baseline mb-8">
                                            <span className="text-lg font-bold text-slate-800">Total Amount</span>
                                            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                                ${(finalTotal + totalPrice * 0.05).toFixed(2)}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => navigate('/place-order')}
                                            className="w-full group relative overflow-hidden bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all hover:scale-[1.02] hover:shadow-2xl"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                            <span className="relative flex items-center justify-center gap-3">
                                                Checkout Now <ArrowRight size={20} />
                                            </span>
                                        </button>
                                    </div>

                                    <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                        <ShieldCheckIcon /> Secure Checkout
                                    </div>
                                </div>

                                {/* Promo Code Info (Optional) */}
                                <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-indigo-900 text-sm">Free Shipping Available</h4>
                                        <p className="text-indigo-700/80 text-xs mt-1 leading-relaxed">
                                            Orders over $500 qualify for free express delivery depending on your location.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Mobile Sticky Checkout Bar (Hidden on Desktop) */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 md:hidden pb-safe">
                    <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                            <p className="text-2xl font-black text-slate-900">${(finalTotal + totalPrice * 0.05).toFixed(2)}</p>
                        </div>
                        <button
                            onClick={() => navigate('/place-order')}
                            className="flex-1 bg-slate-900 text-white py-3.5 px-6 rounded-xl font-bold text-base shadow-lg shadow-slate-900/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            Checkout <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {itemToDelete && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setItemToDelete(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 text-center">
                                <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                                        <Trash2 className="w-8 h-8 text-red-500" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Remove Item?</h3>
                                <p className="text-slate-500 mb-8 leading-relaxed">
                                    Do you really want to remove <span className="font-bold text-slate-800">"{itemToDelete.name}"</span> from your cart? <br />This process cannot be undone.
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setItemToDelete(null)}
                                        className="flex-1 py-3.5 px-6 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                                    >
                                        Yes, Remove
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Helper Component for Icon
const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default Cart;
