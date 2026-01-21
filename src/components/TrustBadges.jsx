import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
    {
        icon: Truck,
        title: "Free Worldwide Shipping",
        desc: "On all orders over $200"
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        desc: "100% protected transactions"
    },
    {
        icon: Clock,
        title: "24/7 Support",
        desc: "Expert assistance anytime"
    },
    {
        icon: CreditCard,
        title: "Money Back Guarantee",
        desc: "30-day hassle-free returns"
    }
];

export default function TrustBadges() {
    return (
        <section className="py-24 relative z-10 overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#1c1c1c]">

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Ambient Lighting */}
            <div className="absolute top-0 left-1/4 w-full max-w-3xl h-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-full max-w-3xl h-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-3xl p-8 lg:p-12 backdrop-blur-sm">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="flex flex-col items-center text-center group"
                            >
                                {/* Icon Container - Dark Glass */}
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center mb-5 group-hover:bg-white/10 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 shadow-2xl shadow-black/20">
                                    <badge.icon size={24} strokeWidth={1.5} className="text-neutral-200 group-hover:text-white transition-colors duration-300" />
                                </div>

                                {/* Text Content */}
                                <h3 className="text-base font-bold text-white mb-2 tracking-wide group-hover:text-white transition-colors duration-300">
                                    {badge.title}
                                </h3>
                                <p className="text-sm text-neutral-500 leading-relaxed font-medium max-w-[200px] group-hover:text-neutral-400 transition-colors duration-300">
                                    {badge.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subtle Divider at bottom to blend into footer */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </section>
    );
}
