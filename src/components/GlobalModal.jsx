import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/slices/uiSlice";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export default function GlobalModal() {
    const dispatch = useDispatch();
    const { modal } = useSelector((state) => state.ui);

    if (!modal.isOpen) return null;

    // Icon mapping based on type
    const getIcon = () => {
        switch (modal.type) {
            case "danger":
                return <XCircle className="w-10 h-10 text-red-500" />;
            case "success":
                return <CheckCircle className="w-10 h-10 text-green-500" />;
            case "warning":
                return <AlertTriangle className="w-10 h-10 text-yellow-500" />;
            default:
                return <Info className="w-10 h-10 text-blue-500" />;
        }
    };

    // Color theme mapping
    const getTheme = () => {
        switch (modal.type) {
            case "danger":
                return "border-red-500/30 shadow-red-500/10";
            case "success":
                return "border-green-500/30 shadow-green-500/10";
            case "warning":
                return "border-yellow-500/30 shadow-yellow-500/10";
            default:
                return "border-blue-500/30 shadow-blue-500/10";
        }
    };

    return (
        <AnimatePresence>
            {modal.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => dispatch(closeModal())}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`relative w-full max-w-sm bg-gray-900 border ${getTheme()} rounded-2xl shadow-2xl p-6 text-center overflow-hidden`}
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/5 rounded-full blur-[50px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-4 bg-white/5 p-3 rounded-full border border-white/10">
                                {getIcon()}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                {modal.title || "Notification"}
                            </h3>

                            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                                {modal.message}
                            </p>

                            <div className="flex gap-3 w-full">
                                {modal.showCancel && (
                                    <button
                                        onClick={() => dispatch(closeModal())}
                                        className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
                                    >
                                        {modal.cancelText || "Cancel"}
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        if (modal.onConfirm) modal.onConfirm();
                                        dispatch(closeModal());
                                    }}
                                    className={`flex-1 py-2.5 px-4 font-semibold rounded-xl text-white transition-all shadow-lg ${modal.type === "danger" ? "bg-red-600 hover:bg-red-700 shadow-red-500/20" :
                                            modal.type === "success" ? "bg-green-600 hover:bg-green-700 shadow-green-500/20" :
                                                "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                                        }`}
                                >
                                    {modal.confirmText || "Okay"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
