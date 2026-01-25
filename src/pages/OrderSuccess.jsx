
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const OrderSuccess = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.userAuth);

    const [status, setStatus] = useState("loading"); // loading, success, failed

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                if (!token) return;

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                // Call backend to check status
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/orders/status/${transactionId}`,
                    config
                );

                if (data.success) {
                    setStatus("success");

                    // Only clear cart if it wasn't a direct buy
                    const isDirectBuy = localStorage.getItem("isDirectBuy") === "true";

                    if (!isDirectBuy) {
                        try {
                            // Clear Backend Cart
                            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/cart/clear`, config);
                            dispatch(clearCart()); // Clear local cart
                        } catch (err) {
                            console.error("Failed to clear cart", err);
                        }
                    }
                    // Clean up flag
                    localStorage.removeItem("isDirectBuy");

                } else {
                    setStatus("failed");
                }

            } catch (error) {
                console.error("Payment Verification Failed", error);
                setStatus("failed");
            }
        };

        if (token) {
            verifyPayment();
        }
    }, [transactionId, token, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans relative overflow-hidden">

            {/* Colorful Background confetti */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-50 via-white to-white pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/40 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="max-w-lg w-full relative z-10 mx-4"
            >
                <div className="bg-white/80 backdrop-blur-2xl border border-white p-12 rounded-[3rem] shadow-2xl shadow-violet-900/10 text-center relative group">

                    {status === "loading" && (
                        <div className="flex flex-col items-center py-10">
                            <div className="relative w-20 h-20 mb-8">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-violet-600 rounded-full animate-spin" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Verifying Payment</h2>
                            <p className="text-slate-500 font-medium">Securely connecting to bank...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border border-emerald-100 shadow-inner"
                            >
                                <CheckCircle className="w-14 h-14 text-emerald-500" strokeWidth={3} />
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Order Placed!</h2>
                            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
                                Thank you for your purchase. <br /> Your order has been confirmed.
                            </p>

                            <div className="flex flex-col gap-4 w-full">
                                <button
                                    onClick={() => navigate("/my-orders")}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-slate-900/20"
                                >
                                    View Your Orders
                                </button>
                                <button
                                    onClick={() => navigate("/")}
                                    className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}

                    {status === "failed" && (
                        <div className="flex flex-col items-center py-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500 border border-red-100"
                            >
                                <XCircle className="w-12 h-12" />
                            </motion.div>
                            <h2 className="text-3xl font-bold mb-2 text-slate-900">Payment Failed</h2>
                            <p className="text-slate-500 mb-8 font-medium">Something went wrong with the transaction. <br /> Please try again.</p>
                            <button
                                onClick={() => navigate("/cart")}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                            >
                                Back to Cart
                            </button>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
