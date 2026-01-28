import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/search imm.json";

const GlobalLoading = ({ isLoading, message }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                >
                    <div className="text-center">
                        {/* 1. Lottie Animation Container */}
                        <div className="w-48 h-48 mx-auto -mb-6">
                            {/* Fallback to simple spinner if animation fails loading (or component is used before asset exists) */}
                            <Lottie
                                animationData={loadingAnimation}
                                loop={true}
                                className="w-full h-full"
                            />
                        </div>

                        {/* 2. Premium Text */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg font-medium text-slate-800 tracking-wide font-['Outfit']"
                        >
                            {message || "Loading..."}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoading;
