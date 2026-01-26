import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroTech from "../assets/hero-tech.png";
import heroFashion from "../assets/hero-fashion.png";
import heroGaming from "../assets/hero-gaming.png";

const slides = [
  {
    id: 1,
    image: heroTech,
    title: "Future of Sound",
    subtitle: "Experience music like never before with next-gen audio",
    accent: "text-cyan-400"
  },
  {
    id: 2,
    image: heroFashion,
    title: "Urban Collection",
    subtitle: "Redefine your style with our latest streetwear drop",
    accent: "text-orange-400"
  },
  {
    id: 3,
    image: heroGaming,
    title: "Level Up",
    subtitle: "High-performance gear for the ultimate gaming setup",
    accent: "text-purple-400"
  }
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // 4s for better readability
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[280px] md:h-[550px] w-full overflow-hidden mb-4 md:mb-12 rounded-b-[2rem] md:rounded-b-[3.5rem] shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10" />
          <div className="absolute inset-0 bg-black/10 z-10" />
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover object-center"
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pb-6 md:pb-0">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-2 md:space-y-4 max-w-4xl"
            >
              <h1 className="text-3xl md:text-8xl font-black text-white tracking-widest uppercase drop-shadow-lg">
                <span className="block text-xs md:text-3xl font-medium tracking-[0.5em] mb-1 md:mb-2 opacity-90">
                  New Arrival
                </span>
                {slides[current].title}
              </h1>

              <p className="text-sm md:text-2xl text-white/90 font-medium max-w-[250px] md:max-w-2xl mx-auto leading-tight md:leading-relaxed drop-shadow-md">
                {slides[current].subtitle}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-8 px-6 py-2 md:px-8 md:py-3 bg-white text-black font-bold rounded-full text-xs md:text-base tracking-widest hover:bg-neutral-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                EXPLORE NOW
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 rounded-full shadow-lg ${index === current
              ? "w-8 h-2 bg-white"
              : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
