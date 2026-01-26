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
        <section className="py-6 md:py-10 relative z-10 bg-white">

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 md:p-8 shadow-inner">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                                className="flex flex-col items-center text-center group bg-white md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none shadow-sm md:shadow-none border md:border-none border-slate-100"
                            >
                                {/* Icon Container - Compact on mobile */}
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white md:bg-white border border-slate-200 flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 group-hover:border-violet-200 group-hover:shadow-lg group-hover:shadow-violet-900/5 transition-all duration-500 shadow-sm">
                                    <badge.icon size={18} strokeWidth={1.5} className="text-slate-400 group-hover:text-violet-600 transition-colors duration-300 md:w-5 md:h-5" />
                                </div>

                                {/* Text Content */}
                                <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-0.5 md:mb-1 tracking-wide">
                                    {badge.title}
                                </h3>
                                <p className="hidden md:block text-xs text-slate-500 leading-relaxed font-medium max-w-[150px]">
                                    {badge.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subtle Divider at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-100" />
        </section>
    );
}
