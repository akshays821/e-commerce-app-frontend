import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Star } from "lucide-react";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSize, setActiveSize] = useState(null);
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.userAuth);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            navigate("/login");
            return;
        }

        // If product needs size, check if size is selected
        const isFashionItem = product.category?.some(cat => /fashion|clothing|shoes|jacket|shirt|pant|wear|sneaker|boot|hoodie|heels|jeans/i.test(cat));

        if (isFashionItem && !activeSize) {
            toast.error("Please select a size first!");
            return;
        }

        dispatch(addItemToCart({
            _id: product._id,
            name: product.title,
            price: product.price,
            image: getImageUrl(product.image),
            selectedSize: activeSize,
            category: product.category ? product.category[0] : 'General',
            quantity: 1
        }));
    };

    // Fallback sizes if not in product data (Mocking for UI completeness)
    const sizes = ["S", "M", "L", "XL"];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`
                );
                setProduct(res.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/placeholder.png";
        if (imagePath.startsWith("http")) return imagePath;
        return `${import.meta.env.VITE_API_BASE_URL}/${imagePath.replace(/\\/g, "/")}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-neutral-800 relative z-0 overflow-hidden">

            {/* Alive Background Blobs */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-rose-200/20 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none"
            />

            {/* Navigation Header */}
            <nav className="fixed top-0 left-0 right-0 p-6 flex items-center justify-between z-50 pointer-events-none">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/50 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm hover:shadow-md pointer-events-auto"
                >
                    <ArrowLeft size={20} className="text-neutral-700" />
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/cart')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/50 backdrop-blur-md border border-white/60 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm hover:shadow-md pointer-events-auto text-indigo-600"
                >
                    <ShoppingBag size={20} />
                </motion.button>
            </nav>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-8 min-h-screen flex items-center relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full items-center">

                    {/* Left Column: Levitating Immersive Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-full max-w-lg mx-auto aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-indigo-500/10 border border-white/40"
                        >
                            <img
                                src={getImageUrl(product.image)}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Glassy Overlay Label */}
                            {/* Category Tags Floating */}
                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                {product.category?.map((cat, i) => (
                                    <span key={i} className="px-4 py-1.5 bg-white/80 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-neutral-900 rounded-full border border-white/50 shadow-sm">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Floor Shadow */}
                        <motion.div
                            animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.2, 0.3] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-black/20 blur-xl rounded-full -z-10"
                        />
                    </motion.div>

                    {/* Right Column: Lively Product Details */}
                    <div className="flex flex-col justify-center space-y-8 relative">

                        {/* Live Counter Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-12 left-0 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-red-100"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            24 people are viewing this right now
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h1 className="text-4xl lg:text-6xl font-black text-neutral-900 tracking-tight leading-[1.1] mb-4 drop-shadow-sm">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill="currentColor" className="text-amber-400" />
                                    ))}
                                </div>
                                <span className="text-neutral-400 font-medium text-sm border-l border-neutral-200 pl-4">4.9 Star Rating</span>
                            </div>

                            <div className="flex items-end gap-3 text-neutral-900">
                                <div className="text-5xl font-bold tracking-tight">
                                    ₹{product.price}
                                </div>
                                <div className="text-lg text-neutral-400 line-through font-medium mb-1.5">
                                    ₹{Math.round(product.price * 1.2)}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="space-y-8"
                        >
                            <div className="prose prose-neutral text-neutral-500 leading-relaxed font-light">
                                <p>{product.description || "Designed for those who appreciate fine detail and lasting quality. This product combines modern aesthetics with everyday functionality."}</p>
                            </div>

                            {/* Smart Size Selector */}
                            {(product.category?.some(cat => /fashion|clothing|shoes|jacket|shirt|pant|wear|sneaker|boot|hoodie|heels|jeans/i.test(cat))) && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-bold uppercase tracking-wider text-neutral-900">Select Size</label>
                                        <button className="text-xs text-indigo-600 font-semibold hover:underline">Size Guide</button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setActiveSize(s)}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 relative overflow-hidden
                                                ${activeSize === s
                                                        ? "bg-neutral-900 text-white shadow-xl shadow-neutral-900/30 scale-110"
                                                        : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                                                    }`}
                                            >
                                                {s}
                                                {activeSize === s && (
                                                    <motion.div
                                                        layoutId="activeSize"
                                                        className="absolute inset-0 border-2 border-white/20 rounded-2xl"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4">
                                <motion.button
                                    onClick={handleAddToCart}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 transition-colors"
                                >
                                    <ShoppingBag size={22} />
                                    <span>Add to Cart</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-16 h-16 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-colors shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </motion.button>
                            </div>

                            {/* Trust Badges Minimal */}
                            <div className="flex gap-6 pt-6 opacity-80">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    <Truck size={16} className="text-indigo-500" />
                                    Free Delivery
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                                    <ShieldCheck size={16} className="text-green-500" />
                                    Authentic
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
