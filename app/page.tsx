"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowDown, Play, X, Sparkles, Shirt } from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force dark mode for the landing page aesthetic
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <main>
      <div className="relative bg-[#F0EBE3] dark:bg-[#0C0A08] text-[#0C0A08] dark:text-[#F0EBE3] font-body selection:bg-[#D4793A]/30 overflow-x-clip transition-colors duration-1000">

        {/* FILM GRAIN */}
        <div className="pointer-events-none fixed inset-0 z-[200] opacity-[0.05] dark:opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")' }}></div>

        {/* ARCHITECTURAL GRID LINES */}
        <div className="pointer-events-none fixed inset-0 z-[150] flex justify-between px-6 md:px-10 mix-blend-overlay opacity-10 dark:opacity-20">
          <div className="w-[1px] h-full bg-black dark:bg-white"></div>
          <div className="w-[1px] h-full bg-black dark:bg-white hidden md:block"></div>
          <div className="w-[1px] h-full bg-black dark:bg-white hidden md:block"></div>
          <div className="w-[1px] h-full bg-black dark:bg-white"></div>
        </div>

        {/* NAVBAR */}
        <nav className="fixed top-0 inset-x-0 z-[100] p-6 md:p-10 flex justify-between items-start pointer-events-none mix-blend-difference text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-black text-[9vw] md:text-[5vw] leading-none tracking-tighter uppercase pointer-events-auto"
          >
            FITS
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-end gap-1 pointer-events-auto"
          >
            <div className="text-[10px] uppercase tracking-widest font-medium opacity-70 hidden md:block">
              HOW IT WORKS
            </div>
            <div className="w-10 h-[1px] bg-white opacity-40 my-1 hidden md:block"></div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-[10px] uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity">
                [ DASHBOARD ]
              </Link>
            </div>
          </motion.div>
        </nav>

        {/* SECTION 1 - EDITORIAL / RUNWAY (Hero) */}
        {/* Force dark mode aesthetics here because the video has a dark background */}
        <section className="relative h-screen w-full overflow-hidden bg-[#0C0A08]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A08]/40 via-transparent to-[#0C0A08] z-[1] pointer-events-none opacity-100 dark:opacity-100" />

          <video
            src="/videos/hero.mp4"
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />

          {/* Bottom Left */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-6 md:bottom-12 md:left-10 flex flex-col gap-1 z-10 mix-blend-difference text-white"
          >
            <div className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">
              // VISUAL DISCOVERY
            </div>
            <div className="text-sm md:text-base font-medium max-w-xs leading-relaxed opacity-90">
              Scan the world. Acquire the look.
            </div>
          </motion.div>

          {/* Bottom Right */}
          <div className="absolute bottom-8 right-6 md:bottom-10 md:right-10 flex flex-col items-end z-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              className="text-[10px] md:text-xs uppercase tracking-[0.4em] mb-2 opacity-80 font-bold text-white mix-blend-difference"
            >
              THE FASHION LOOP
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
              className="font-black text-[15vw] md:text-[10vw] leading-[0.75] uppercase tracking-tighter text-right"
            >
              <span className="text-white mix-blend-difference">IT</span> <span className="text-[#D4793A]">FITS</span>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 opacity-50 mix-blend-difference text-white">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 60 }}
              transition={{ duration: 1.5, ease: "circOut", delay: 1.2 }}
              className="w-[1px] bg-white origin-top"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1.5 }}
            >
              <ArrowDown className="w-3 h-3 mt-4" />
            </motion.div>
          </div>
        </section>

        {/* SECTION 2 - THE CONCEPT */}
        <section className="relative h-screen w-full overflow-hidden bg-[#0C0A08] flex border-t border-[#181410]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A08]/80 to-transparent z-[1] pointer-events-none" />

          <video
            src="/videos/iris-stylist.mov"
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity"
          />

          <div className="absolute bottom-10 left-6 md:bottom-12 md:left-10 flex flex-col gap-1 z-20 mix-blend-difference text-white">
            <div className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-60">
              [ FROM SIGHT TO STYLE ]
            </div>
            <div className="text-sm md:text-base font-medium max-w-xs leading-relaxed opacity-90">
              Zero searching. Just find the fit.
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex flex-col items-center text-center z-10 mix-blend-difference text-white">
            <div className="text-[10px] text-white/50 uppercase tracking-[0.5em] mb-6 font-bold">THE CONCEPT</div>
            <div className="font-black text-[12vw] md:text-[8vw] leading-[0.9] uppercase tracking-tighter">
              <div className="text-white/40 mix-blend-overlay">SEE IT.</div>
              <div className="text-[#D4793A] mix-blend-normal drop-shadow-[0_0_20px_rgba(212,121,58,0.4)]">GRAB IT.</div>
              <div className="text-white/40 mix-blend-overlay">WEAR IT.</div>
            </div>
          </div>
        </section>

        {/* SECTION 3 - HOW IRIS WORKS (PINNED SCROLL) */}
        <HowItWorksSection />

        {/* SECTION 4 - THE WARDROBE (INTERACTIVE UI) */}
        <InteractiveWardrobeSection />

        {/* SECTION 5 - FINAL CTA */}
        {/* We use dark mode variables to automatically flip the CTA to contrast with the page */}
        <section className="relative h-screen w-full bg-[#080706] dark:bg-[#F0EBE3] flex flex-col items-center justify-center px-4 overflow-hidden border-t border-[#2A2420] dark:border-[#181410] transition-colors duration-1000">

          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80"
            alt="Fashion Editorial"
            className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#080706] dark:from-[#F0EBE3] via-[#080706]/60 dark:via-[#F0EBE3]/60 to-transparent z-[1] pointer-events-none transition-colors duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A08]/40 dark:from-[#0C0A08]/40 to-transparent z-[1] pointer-events-none opacity-80 dark:opacity-40 transition-opacity duration-1000" />

          <div className="text-[10px] text-[#D4793A] uppercase tracking-[0.4em] mb-8 md:mb-12 font-bold z-10 drop-shadow-sm">
            YOUR DIGITAL CLOSET
          </div>

          <div className="font-black text-[13vw] md:text-[10vw] leading-[0.85] uppercase text-center mb-12 md:mb-16 text-[#F0EBE3] dark:text-[#0C0A08] tracking-tighter z-10 drop-shadow-xl transition-colors duration-1000">
            <div>ALREADY HAVE</div>
            <div className="text-[#D4793A]">MOST OF IT.</div>
          </div>

          <div className="text-sm md:text-lg mb-12 font-bold text-[#F0EBE3]/60 dark:text-[#0C0A08]/60 z-10 uppercase tracking-widest text-center max-w-md mix-blend-normal dark:mix-blend-multiply drop-shadow-sm transition-colors duration-1000">
            Your wardrobe is already enough.<br />Iris finds what completes it.
          </div>

          <Link
            href="/dashboard"
            className="group relative bg-[#F0EBE3] dark:bg-[#0C0A08] text-[#0C0A08] dark:text-[#F0EBE3] px-16 py-6 md:px-24 md:py-6 rounded-none font-black text-sm tracking-[0.2em] overflow-hidden hover:bg-white dark:hover:bg-[#181410] transition-all z-10 shadow-[0_20px_50px_rgba(240,235,227,0.1)] dark:shadow-[0_20px_50px_rgba(12,10,8,0.3)] hover:shadow-[0_20px_60px_rgba(240,235,227,0.2)] dark:hover:shadow-[0_20px_60px_rgba(12,10,8,0.5)] scale-100 hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span>ENTER DASHBOARD</span>
          </Link>

          <div className="absolute bottom-8 md:bottom-12 text-[9px] md:text-[10px] text-[#F0EBE3]/40 dark:text-[#0C0A08]/40 font-bold tracking-widest uppercase z-10 transition-colors duration-1000">
            FITS INTELLIGENCE // PRIVATE ACCESS
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative z-[80] bg-[#080706] dark:bg-[#F0EBE3] pb-8 text-center pt-4 transition-colors duration-1000 border-t border-[#181410] dark:border-[#D0C5B1]/50">
          <p className="text-[9px] text-[#F0EBE3]/30 dark:text-[#0C0A08]/30 uppercase tracking-[0.5em] font-bold transition-colors duration-1000">
            <span className="text-[#D4793A] opacity-100">FITS</span> · HACK DEVENGERS 1.0 · 2026
          </p>
        </footer>

      </div>
    </main>
  );
}

// -------------------------------------------------------------
// SECTION 3 - HOW IRIS WORKS 
// -------------------------------------------------------------
function HowItWorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeStep, setActiveStep] = useState(1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) setActiveStep(1);
    else if (latest < 0.50) setActiveStep(2);
    else if (latest < 0.75) setActiveStep(3);
    else setActiveStep(4);
  });

  return (
    <section ref={containerRef} className="relative h-[250vh] bg-[#F0EBE3] dark:bg-[#0C0A08] transition-colors duration-1000">
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row overflow-hidden border-t border-[#D0C5B1] dark:border-[#181410] transition-colors duration-1000">

        {/* LEFT: STICKY TEXT BLOCK */}
        <div className="w-full md:w-1/2 h-[45vh] md:h-full flex flex-col justify-center px-6 md:px-10 relative z-20 bg-[#F0EBE3]/80 dark:bg-[#0C0A08]/80 backdrop-blur-md md:bg-transparent md:backdrop-blur-none border-r border-[#D0C5B1] dark:border-[#181410]/50 transition-colors duration-1000">
          <div className="absolute top-8 md:top-32 left-6 md:left-10 text-[10px] text-[#D4793A] uppercase tracking-[0.4em] font-bold">
            HOW IRIS WORKS
          </div>

          <StepText
            activeStep={activeStep} step={1} number="01"
            title="CAPTURE."
            desc="You see a look you desire. Screenshot it. That is the only input Iris requires."
          />
          <StepText
            activeStep={activeStep} step={2} number="02"
            title="IDENTIFY."
            desc="Iris isolates every garment. The jacket, the denim, the footwear. Nothing is missed."
          />
          <StepText
            activeStep={activeStep} step={3} number="03"
            title="DISCOVERY."
            desc="Iris scans premium retailers instantly, matching exact styles, cuts, and colors."
          />
          <StepText
            activeStep={activeStep} step={4} number="04"
            title="ACQUIRE."
            desc="One tap checkout. Every piece lands directly in your digital wardrobe."
          />
        </div>

        {/* RIGHT: SCROLLING IMAGES IN NEGATIVE SPACE */}
        <div className="w-full md:w-1/2 h-[55vh] md:h-full relative overflow-hidden flex items-center justify-center bg-[#E8E2D9] dark:bg-[#080706] transition-colors duration-1000">
          <div className="absolute inset-0 bg-[#F0EBE3] dark:bg-[#0C0A08] opacity-50 mix-blend-overlay transition-colors duration-1000"></div>

          {/* UPDATED RELIABLE IMAGE URLS */}
          <StepImage
            activeStep={activeStep} step={1}
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
          />
          <StepImage
            activeStep={activeStep} step={2}
            src="/images/wardrobe/step_2.png"
          />
          <StepImage
            activeStep={activeStep} step={3}
            src="/images/wardrobe/step_3.png"
          />
          <StepImage
            activeStep={activeStep} step={4}
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80"
          />
        </div>
      </div>
    </section>
  );
}

function StepText({ activeStep, step, title, desc, number }: any) {
  const isActive = activeStep === step;

  return (
    <div
      className={`absolute inset-x-6 md:inset-x-10 top-1/2 -translate-y-1/2 flex flex-col pointer-events-none transition-all duration-700 ease-out 
        ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
    >
      <div className="text-[25vw] md:text-[12vw] font-black text-[#D0C5B1] dark:text-[#2A2420] leading-none absolute -top-16 -left-2 md:-top-24 md:-left-6 z-0 opacity-40 dark:opacity-80 transition-colors duration-1000">
        {number}
      </div>
      <h3 className="font-black text-[8vw] md:text-[4vw] uppercase leading-[0.85] text-[#0C0A08] dark:text-[#F0EBE3] z-10 mb-6 tracking-tighter drop-shadow-md transition-colors duration-1000">
        {title}
      </h3>
      <p className="text-[#5A4F43] dark:text-[#8A7968] text-sm md:text-base max-w-sm z-10 leading-relaxed font-normal transition-colors duration-1000">
        {desc}
      </p>
    </div>
  );
}

function StepImage({ activeStep, step, src }: any) {
  const isActive = activeStep === step;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center p-8 md:p-20 transition-all duration-1000 ease-out
        ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
    >
      <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden shadow-2xl border border-[#D0C5B1] dark:border-[#2A2420] rounded-sm transition-colors duration-1000">
        <div className="absolute inset-0 bg-white/10 dark:bg-[#0C0A08]/10 z-10 mix-blend-overlay transition-colors duration-1000" />
        <img
          src={src}
          alt={`Step ${step}`}
          className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SECTION 4 - THE WARDROBE
// -------------------------------------------------------------
function InteractiveWardrobeSection() {
  const [activeOutfit, setActiveOutfit] = useState<number | null>(null);

  // UPDATED RELIABLE IMAGE URLS (Fixed item 4 and replaced mobile phone accessory with a fashion bag)
  const items = [
    { id: 1, type: 'top', src: '/images/wardrobe/grid_1.png', outfit: 1 }, // Editorial Full Look 1
    { id: 2, type: 'bottom', src: '/images/wardrobe/grid_2.png', outfit: 1 }, // Jacket Detail
    { id: 3, type: 'shoes', src: '/images/wardrobe/grid_3.png', outfit: 1 }, // Denim / Trousers
    { id: 4, type: 'top', src: '/images/wardrobe/grid_4.png', outfit: 2 }, // Footwear
    { id: 5, type: 'bottom', src: '/images/wardrobe/grid_5.png', outfit: 2 }, // Accessory
    { id: 6, type: 'accessory', src: '/images/wardrobe/grid_6.png', outfit: 2 }, // Editorial Full Look 2
  ];

  return (
    <section className="relative min-h-screen bg-[#E8E2D9] dark:bg-[#080706] pt-24 pb-32 px-6 md:px-10 flex flex-col items-center border-t border-[#D0C5B1] dark:border-[#181410] z-20 transition-colors duration-1000">

      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-[0.03] pointer-events-none transition-opacity duration-1000">
        <div className="w-[80vw] h-[80vw] rounded-full bg-[#D4793A] blur-[150px]"></div>
      </div>

      <div className="text-center mb-16 md:mb-24 relative z-10 mt-10">
        <div className="text-[10px] text-[#D4793A] uppercase tracking-[0.4em] mb-4 font-bold">WARDROBE</div>
        <div className="font-black text-[11vw] md:text-[6vw] leading-[0.85] uppercase text-[#0C0A08] dark:text-[#F0EBE3] tracking-tighter transition-colors duration-1000">
          YOUR DIGITAL CLOSET
        </div>
        <p className="text-[#5A4F43] dark:text-[#8A7968] mt-6 max-w-lg mx-auto text-sm md:text-base transition-colors duration-1000">
          Every piece you acquire is saved. Iris constructs outfits instantly from your existing wardrobe. Hover over the outfits below to see them highlighted.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">

        {/* Left: Iris Interface Mockup */}
        <div className="w-full lg:w-[420px] bg-white/80 dark:bg-[#181410]/80 border border-[#D0C5B1] dark:border-[#2A2420] rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-3xl transition-colors duration-1000">
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-[#D0C5B1] dark:border-[#2A2420] transition-colors duration-1000">
            <div className="w-10 h-10 rounded-full bg-[#D4793A]/10 dark:bg-[#D4793A]/20 flex items-center justify-center border border-[#D4793A]/30 dark:border-[#D4793A]/40 shadow-[0_0_15px_rgba(212,121,58,0.2)] dark:shadow-[0_0_15px_rgba(212,121,58,0.3)]">
              <Sparkles className="w-5 h-5 text-[#D4793A]" />
            </div>
            <div className="font-bold text-sm tracking-widest text-[#0C0A08] dark:text-[#F0EBE3] transition-colors duration-1000">IRIS STYLIST</div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="bg-[#F5F0E6] dark:bg-[#2A2420] text-[#0C0A08] dark:text-[#F0EBE3] text-sm p-5 rounded-2xl rounded-tr-sm self-end ml-8 border border-[#D0C5B1] dark:border-[#3A3430] shadow-xl transition-colors duration-1000">
              "Iris, what should I wear for a coffee date today?"
            </div>
            <div className="bg-[#D4793A]/10 dark:bg-[#D4793A]/15 text-[#D4793A] text-sm p-5 rounded-2xl rounded-tl-sm self-start mr-8 border border-[#D4793A]/30 dark:border-[#D4793A]/40 shadow-xl leading-relaxed transition-colors duration-1000">
              "I pulled a look from your wardrobe.<br />Your denim jacket works perfectly with the raw denim."
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <button
              onMouseEnter={() => setActiveOutfit(1)}
              onMouseLeave={() => setActiveOutfit(null)}
              className={`w-full py-5 px-6 text-left text-sm font-bold border rounded-2xl transition-all flex justify-between items-center group
                 ${activeOutfit === 1 ? 'bg-[#D4793A] border-[#D4793A] text-white shadow-[0_0_20px_rgba(212,121,58,0.4)]' : 'bg-white dark:bg-[#0C0A08] border-[#D0C5B1] dark:border-[#2A2420] text-[#0C0A08] dark:text-[#F0EBE3] hover:border-[#D4793A]/50 hover:bg-[#F5F0E6] dark:hover:bg-[#181410]'}`}
            >
              <span className="flex items-center gap-4"><Shirt className={`w-5 h-5 ${activeOutfit === 1 ? 'opacity-100' : 'opacity-50'}`} /> Coffee Date</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-[10px]">View</span>
            </button>
            <button
              onMouseEnter={() => setActiveOutfit(2)}
              onMouseLeave={() => setActiveOutfit(null)}
              className={`w-full py-5 px-6 text-left text-sm font-bold border rounded-2xl transition-all flex justify-between items-center group
                ${activeOutfit === 2 ? 'bg-[#D4793A] border-[#D4793A] text-white shadow-[0_0_20px_rgba(212,121,58,0.4)]' : 'bg-white dark:bg-[#0C0A08] border-[#D0C5B1] dark:border-[#2A2420] text-[#0C0A08] dark:text-[#F0EBE3] hover:border-[#D4793A]/50 hover:bg-[#F5F0E6] dark:hover:bg-[#181410]'}`}
            >
              <span className="flex items-center gap-4"><Shirt className={`w-5 h-5 ${activeOutfit === 2 ? 'opacity-100' : 'opacity-50'}`} /> Casual Office</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest text-[10px]">View</span>
            </button>
          </div>
        </div>

        {/* Right: Wardrobe Grid */}
        <div className="flex-1 bg-white dark:bg-[#0C0A08] border border-[#D0C5B1] dark:border-[#2A2420] rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-1000">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(item => {
              const isHighlighted = activeOutfit === item.outfit;
              const isFaded = activeOutfit !== null && activeOutfit !== item.outfit;

              return (
                <div
                  key={item.id}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden border border-[#D0C5B1] dark:border-[#2A2420] transition-all duration-500 ease-out 
                   ${isHighlighted ? 'ring-4 ring-[#D4793A] scale-105 z-20 shadow-[0_20px_40px_rgba(212,121,58,0.4)]' : ''} 
                   ${isFaded ? 'opacity-40 grayscale blur-[1px]' : 'opacity-100 hover:opacity-90 hover:scale-[1.02]'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#0C0A08]/90 via-transparent to-transparent z-10 opacity-80 transition-colors duration-1000" />
                  <img src={item.src} className="absolute inset-0 w-full h-full object-cover" alt="Wardrobe item" />

                  {/* Mock UI overlay on cards */}
                  <div className={`absolute bottom-3 left-3 right-3 p-3 bg-white/90 dark:bg-[#181410]/90 backdrop-blur-xl rounded-lg border border-[#D0C5B1] dark:border-[#3A3430] text-[10px] font-bold transition-all duration-300 transform ${isHighlighted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <div className="text-[#D4793A] uppercase tracking-widest mb-1">{item.type}</div>
                    <div className="text-[#0C0A08] dark:text-white tracking-wider">OWNED PIECE</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
