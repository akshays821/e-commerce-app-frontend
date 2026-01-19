import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeBannedModal } from "../redux/slices/uiSlice";
import { Ban, ShieldAlert, XCircle } from "lucide-react";

export default function BannedAccountModal() {
    const dispatch = useDispatch();
    const { showBannedModal } = useSelector((state) => state.ui);

    if (!showBannedModal) return null;

    return (
        <AnimatePresence>
            {showBannedModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop with Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        onClick={() => dispatch(closeBannedModal())}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 text-center"
                    >
                        {/* Glowing effect behind the icon */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/20 rounded-full blur-[50px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            {/* Icon with Animation */}
                            <motion.div
                                initial={{ rotate: -15, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1
                                }}
                                className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            >
                                <Ban className="w-10 h-10 text-red-500" />
                            </motion.div>

                            <h2 className="text-2xl font-bold text-white mb-2">
                                Account Suspended
                            </h2>

                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Your account has been restricted due to a violation of our terms. You have been logged out securely.
                            </p>

                            <button
                                onClick={() => dispatch(closeBannedModal())}
                                className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20"
                            >
                                Should have followed the rules 🤷‍♂️
                            </button>

                            <div className="mt-4 text-xs text-gray-500">
                                Contact support if you believe this is an error.
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
