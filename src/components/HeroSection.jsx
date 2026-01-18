import { useState, useEffect } from "react";
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[300px] md:h-[450px] w-full overflow-hidden mb-12 rounded-b-[2.5rem] shadow-xl group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
            }`}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 mt-8">
            <h1 className={`text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter transition-all duration-700 transform ${index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
              {slide.title}
            </h1>
            <p className={`text-xl md:text-2xl text-white/90 font-light max-w-2xl transition-all duration-700 delay-100 transform ${index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === current ? "w-8 bg-white" : "bg-white/50 hover:bg-white/80"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
