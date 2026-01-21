import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Lock, Database } from "lucide-react";
import bgImage from "../assets/why-choose-bg.png";

const features = [
    {
        icon: Sparkles,
        title: "AI Search", // Shortened title
        desc: "Find products using natural language."
    },
    {
        icon: ShieldCheck,
        title: "Admin Verified",
        desc: "Curated quality managed securely."
    },
    {
        icon: Lock,
        title: "Secure",
        desc: "Role-based JWT authentication."
    },
    {
        icon: Database,
        title: "MERN Stack",
        desc: "MongoDB, Express, React, Node."
    }
];

export default function WhyChooseUs() {
    return (
        <section className="relative py-10 overflow-hidden border-t border-white/5">

            {/* Premium Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={bgImage}
                    alt="Background"
                    className="w-full h-full object-cover opacity-50" // Reduced opacity slightly
                />
                <div className="absolute inset-0 bg-[#0a0a0a]/90" /> {/* Simpler overlay */}
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header - Compact & Centered */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight mb-2 text-white">
                        Why Choose ShopAI
                    </h2>
                </div>

                {/* 4-Column Grid - Compact Glassmorphism */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {/* Compact grid */}
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }} // reduced movement
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05, duration: 0.4 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-all group flex flex-col items-center text-center"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                <feature.icon size={18} />
                            </div>
                            <h3 className="text-sm font-bold mb-1 text-white tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-neutral-400 leading-snug font-light">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}


