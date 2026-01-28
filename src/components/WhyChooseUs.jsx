import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % features.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative py-8 md:py-16 overflow-hidden bg-slate-50 border-t border-slate-200">
            {/* Soft Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-soft-light pointer-events-none" />
            <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-50%] left-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">

                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2 text-slate-900">
                        Why Choose ShopAI
                    </h2>
                    <div className="h-1.5 w-20 bg-violet-500 rounded-full mx-auto" />
                </div>

                {/* 4-Column Grid - Compact Glassmorphism */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"> {/* Compact grid */}
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }} // reduced movement
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05, duration: 0.4 }}
                            className="bg-white border border-slate-200 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-violet-900/5 transition-all group flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-blue-500 transform transition-transform duration-300 ${idx === activeIndex ? "scale-x-100" : "scale-x-0"} md:scale-x-0 md:group-hover:scale-x-100`} />

                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 ${idx === activeIndex ? "bg-violet-600 text-white scale-110" : "bg-violet-50 text-violet-600"} md:bg-violet-50 md:text-violet-600 md:group-hover:bg-violet-600 md:group-hover:text-white md:group-hover:scale-110`}>
                                <feature.icon size={20} />
                            </div>
                            <h3 className="text-sm md:text-base font-bold mb-1 md:mb-2 text-slate-900 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}


