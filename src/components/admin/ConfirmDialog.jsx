import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDestructive = false }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                                }`}>
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-none">{title}</h3>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-white shadow-lg transition-all text-sm ${isDestructive
                                        ? "bg-red-600 hover:bg-red-700 shadow-red-200"
                                        : "bg-primary hover:bg-primary/90 shadow-blue-200"
                                    }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
