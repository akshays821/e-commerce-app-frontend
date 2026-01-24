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
        <section className="py-10 relative z-10 bg-white">

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-inner">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="flex flex-col items-center text-center group"
                            >
                                {/* Icon Container - Light Premium */}
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-violet-200 group-hover:shadow-lg group-hover:shadow-violet-900/5 transition-all duration-500 shadow-sm">
                                    <badge.icon size={20} strokeWidth={1.5} className="text-slate-400 group-hover:text-violet-600 transition-colors duration-300" />
                                </div>

                                {/* Text Content */}
                                <h3 className="text-sm font-bold text-slate-900 mb-1 tracking-wide">
                                    {badge.title}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-[150px]">
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
