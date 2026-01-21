import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDemoModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    const handleLogin = () => {
        onClose();
        navigate("/admin/login");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-lg bg-[#1c1c1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header Area */}
                        <div className="p-6 pb-0 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                    <Lock className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Admin Demo Access</h2>
                                    <p className="text-sm text-neutral-500">Portfolio Preview Mode</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                This is a demo e-commerce application built for portfolio and evaluation purposes.
                                Reviewers can access the admin dashboard to explore product, category, and user management features.
                            </p>

                            {/* Credentials Box */}
                            <div className="bg-neutral-900/50 rounded-xl p-4 border border-white/5 space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Demo Credentials</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                        <div className="text-xs text-neutral-500 mb-1">Email</div>
                                        <div className="text-sm font-mono text-white select-all">admin@shopai.com</div>
                                    </div>
                                    <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                                        <div className="text-xs text-neutral-500 mb-1">Password</div>
                                        <div className="text-sm font-mono text-white select-all">123456</div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <div className="flex items-start gap-2 text-xs text-neutral-500">
                                    <CheckCircle2 size={14} className="mt-0.5 text-emerald-500/50" />
                                    <span>This is a demo environment with sample data</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-neutral-500">
                                    <CheckCircle2 size={14} className="mt-0.5 text-emerald-500/50" />
                                    <span>No real users or payments are involved</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-neutral-500">
                                    <AlertCircle size={14} className="mt-0.5 text-amber-500/50" />
                                    <span>Admin actions may modify or reset demo data</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={handleLogin}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-indigo-900/20"
                            >
                                Go to Admin Login
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl font-medium text-sm transition-colors border border-white/5"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
