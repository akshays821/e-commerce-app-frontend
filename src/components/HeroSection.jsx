export default function HeroSection() {
  return (
    <section className="relative py-8 md:py-12 text-center overflow-hidden">
      
      {/* Decorative background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* ACTUAL CONTENT */}
      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          Find exactly what you need
        </h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          Powered by AI to help you discover products faster
        </p>
      </div>
    </section>
  );
}
