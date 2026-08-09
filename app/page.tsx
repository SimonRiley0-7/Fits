"use client";

import Link from "next/link";
import { NumberTicker } from "@/components/NumberTicker";
import { ArrowRight, Play, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DemoVideo } from "@/components/DemoVideo";

export default function LandingPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="min-h-screen bg-bg text-tx selection:bg-p selection:text-white pb-24">
      
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-bg/80 backdrop-blur-md border-b border-border transition-all">
        <div className="font-display italic font-bold text-2xl tracking-tight text-tx">Fits.</div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="t-small hover:text-tx transition-colors">How it works</Link>
          <Link href="#iris" className="t-small hover:text-tx transition-colors">Iris</Link>
          <Link href="#grab" className="t-small hover:text-tx transition-colors">Grab</Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/dashboard" className="btn-pill px-6 py-2">Start for free</Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-center border-b border-border pt-20">
        {/* Left 50% */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:pl-24 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">AI stylist · live</span>
          </div>
          
          <h1 className="t-display mb-8">
            <span className="block font-normal">See it.</span>
            <span className="block text-p italic">Grab it.</span>
            <span className="block font-normal">Wear it.</span>
          </h1>
          
          <p className="t-body max-w-md mb-12">
            Screenshot anything. Iris finds it, styles it, and only buys what you're actually missing from your wardrobe.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link href="/dashboard" className="btn-pill">Start Grabbing</Link>
            <button className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium text-tx border border-tx rounded-full hover:bg-tx hover:text-bg transition-colors">
              See how it works <Play className="w-4 h-4 fill-current" />
            </button>
          </div>

          <p className="t-small">127 looks grabbed today · 43 wardrobes styled</p>
        </div>

        {/* Right 50% */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative flex items-center justify-center overflow-hidden border-t lg:border-t-0 lg:border-l border-border bg-bg-surface">
          <div className="absolute top-8 right-8 z-20">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">01 · GRABBIT IN ACTION</span>
          </div>
          
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-p/20 blur-[120px] rounded-full pointer-events-none" />

          {/* Phone Mockup */}
          <motion.div 
            animate={{ y: [0, -12, 0] }} 
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            className="relative z-10 w-[300px] h-[600px] bg-bg rounded-[3rem] border-[8px] border-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-border rounded-b-3xl w-1/2 mx-auto z-20" />
            
            <div className="p-4 pt-12 flex-1 flex flex-col gap-4 overflow-y-auto">
              <div className="w-full h-48 bg-bg-surface rounded-xl overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80" alt="Jacket" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent flex items-end p-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-bg-surface px-2 py-1 rounded-full border border-border">Screenshot Uploaded</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-p">Jacket Matches</span>
                </div>
                
                {/* Best Match */}
                <div className="flex gap-3 bg-bg-surface border-2 border-p p-3 rounded-xl items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-p text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-bl-lg">Best Match</div>
                  <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&q=80" alt="Myntra Match" className="w-12 h-12 rounded object-cover border border-border" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">Myntra</p>
                    <p className="text-xs text-tx-muted">₹1,299</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-bg-surface border border-border p-3 rounded-xl items-center opacity-70">
                  <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&q=80" alt="Ajio Match" className="w-12 h-12 rounded object-cover border border-border" />
                  <div className="flex-1">
                    <p className="text-xs font-medium">Ajio</p>
                    <p className="text-xs text-tx-muted">₹1,499</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-bg-surface">
              <button className="w-full bg-p text-white py-3 rounded-xl text-sm font-bold">Add to Cart</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── VIDEO BANNER 1: SEE IT. GRAB IT. ─── */}
      <section className="relative bg-bg-surface py-24 md:py-32 border-b border-border overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-p/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">01 · THE LOOP</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight uppercase leading-none mb-6">
              See it.<br/>
              <span className="italic font-normal text-p">Grab it.</span><br/>
              Wear it.
            </h2>
            <p className="t-body text-tx-muted max-w-lg">
              You send us what catches your eye. We tell you where to buy it and what it costs — in one tap, no tabs to juggle.
            </p>
          </div>
          <DemoVideo src="/videos/see-it-grab-it.mov" label="fits.live/grab" />
        </div>
      </section>

      {/* ─── MARQUEE STRIP ─── */}
      <div className="w-full bg-bg-surface border-b border-border py-4 overflow-hidden relative flex items-center">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 t-small uppercase tracking-widest text-tx-muted">
          <span>Screenshot anything</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>₹2,14,000 in outfits found</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>127 looks grabbed</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>43 closets styled by Iris</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>Zero manual searching</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>Full outfits, one checkout</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          
          {/* Duplicate for infinite loop */}
          <span>Screenshot anything</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>₹2,14,000 in outfits found</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>127 looks grabbed</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>43 closets styled by Iris</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>Zero manual searching</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
          <span>Full outfits, one checkout</span>
          <span className="w-1.5 h-1.5 rounded-full bg-p" />
        </div>
      </div>

      {/* ─── HOW IT WORKS (THE LOOP) ─── */}
      <section id="how-it-works" className="bg-bg py-24 md:py-32 border-b border-border">
        <div className="wrap">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="mb-16 md:mb-24"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">The loop</h2>
            <p className="t-body text-tx-muted">Three steps to a better wardrobe.</p>
          </motion.div>

          <div className="relative">
            {/* Steps Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 space-y-6"
              >
                <h3 className="font-display text-2xl font-medium">Screenshot anything</h3>
                <p className="t-body">Any source. Instagram, Pinterest, a photo you took on the street.</p>
                <div className="aspect-[4/3] bg-bg-surface border border-border flex items-center justify-center relative overflow-hidden rounded-xl">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" alt="Fashion street style" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-2 border-dashed border-white/80 rounded-xl flex items-center justify-center bg-black/30 backdrop-blur-sm">
                      <ArrowRight className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 space-y-6"
              >
                <h3 className="font-display text-2xl font-medium">Iris finds every piece</h3>
                <p className="t-body">Multi-item detection. One screenshot finds the whole outfit.</p>
                <div className="aspect-[4/3] bg-bg-surface border border-border p-4 flex flex-col gap-2 rounded-xl relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" alt="Detected items" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
                  <div className="relative z-10 flex-1 bg-bg/80 backdrop-blur-md border border-border p-2 flex gap-2 rounded-lg">
                    <div className="w-1/3 bg-bg-surface relative rounded-md overflow-hidden ring-2 ring-p ring-offset-2 ring-offset-bg">
                      <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80" alt="Jacket" className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 bg-p text-[10px] font-bold px-1.5 py-0.5 rounded-sm text-white shadow-md">Jacket</div>
                    </div>
                    <div className="w-1/3 bg-bg-surface rounded-md overflow-hidden border border-border">
                      <img src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=400&q=80" alt="Shirt" className="w-full h-full object-cover opacity-70" />
                    </div>
                    <div className="w-1/3 bg-bg-surface rounded-md overflow-hidden border border-border">
                      <img src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&q=80" alt="Pants" className="w-full h-full object-cover opacity-70" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="relative z-10 space-y-6"
              >
                <h3 className="font-display text-2xl font-medium">Buy the look</h3>
                <p className="t-body">One checkout. Everything lands in your wardrobe automatically.</p>
                <div className="aspect-[4/3] bg-bg-surface border border-border p-4 flex flex-col rounded-xl relative overflow-hidden">
                  <div className="flex-1 mb-3 flex flex-col gap-2 relative z-10">
                    <div className="flex items-center gap-3 bg-bg border border-border p-2 rounded-lg">
                      <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&q=80" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1"><div className="h-2 bg-tx/20 rounded w-3/4 mb-1" /><div className="h-2 bg-tx/10 rounded w-1/2" /></div>
                    </div>
                    <div className="flex items-center gap-3 bg-bg border border-border p-2 rounded-lg opacity-80">
                      <img src="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=100&q=80" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1"><div className="h-2 bg-tx/20 rounded w-2/3 mb-1" /><div className="h-2 bg-tx/10 rounded w-1/2" /></div>
                    </div>
                    <div className="flex items-center gap-3 bg-bg border border-border p-2 rounded-lg opacity-60">
                      <img src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=100&q=80" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1"><div className="h-2 bg-tx/20 rounded w-1/2 mb-1" /><div className="h-2 bg-tx/10 rounded w-1/3" /></div>
                    </div>
                  </div>
                  <div className="h-10 bg-p w-full rounded-lg flex items-center justify-center text-white text-xs font-bold relative z-10 shadow-lg">Checkout — ₹8,497</div>
                </div>
              </motion.div>
            </div>

            {/* Background Numbers */}
            <div className="absolute top-12 left-0 w-full flex justify-between px-8 md:px-12 pointer-events-none select-none z-0">
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 1 }} className="font-display text-[15rem] leading-none font-bold text-tx opacity-5">01</motion.span>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 1 }} className="font-display text-[15rem] leading-none font-bold text-tx opacity-5 hidden md:block">02</motion.span>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 1 }} className="font-display text-[15rem] leading-none font-bold text-tx opacity-5 hidden lg:block">03</motion.span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VIDEO BANNER 2: IRIS STYLIST ─── */}
      <section className="relative bg-bg py-24 md:py-32 border-b border-border overflow-hidden">
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <DemoVideo src="/videos/iris-stylist.mov" label="fits.live/style" />
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">02 · YOUR STYLIST</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight uppercase leading-none mb-6">
              Meet<br/>
              <span className="italic font-normal text-p">Iris.</span>
            </h2>
            <p className="t-body max-w-md mb-8">
              Your personal AI stylist. She reads your wardrobe and builds the perfect outfit for any occasion — and only shops the exact piece you&apos;re missing.
            </p>
            <Link href="#iris" className="text-p font-bold uppercase tracking-widest text-sm hover:text-tx transition-colors">
              See how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── IRIS FEATURE SECTION ─── */}
      <section id="iris" className="border-b border-border flex flex-col lg:flex-row bg-bg">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="w-full lg:w-[45%] p-8 md:p-16 lg:p-24 border-r-0 lg:border-r border-b lg:border-b-0 border-border flex flex-col justify-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-p/10 flex items-center justify-center mb-8">
            <Sparkles className="w-6 h-6 text-p" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Your personal AI stylist.</h2>
          <p className="t-body text-tx-muted mb-8">
            Iris knows your wardrobe better than you do. Tell her you're going to a beach wedding, and she'll build the perfect fit using pieces you already own.
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "Mixes existing pieces with new ones",
              "Understands dress codes & weather",
              "Creates infinite combinations"
            ].map(item => (
              <li key={item} className="flex items-center gap-3 t-small">
                <Check className="w-4 h-4 text-p" />
                {item}
              </li>
            ))}
          </ul>
          <div>
            <Link href="/dashboard" className="btn-outline">Meet Iris</Link>
          </div>
        </motion.div>
        
        <div className="w-full lg:w-[55%] bg-bg-surface p-8 md:p-16 flex items-center justify-center overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-md bg-bg border border-border rounded-2xl shadow-2xl p-6 relative"
          >
            <div className="p-4 border-b border-border bg-bg-surface flex items-center gap-3 rounded-t-2xl">
              <div className="w-2 h-2 rounded-full bg-p animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-tx-muted">Iris · your wardrobe has 14 pieces</span>
            </div>
            
            <div className="flex-1 p-6 space-y-6">
              <div className="flex justify-end">
                <div className="bg-p text-white px-4 py-3 text-sm max-w-[80%] rounded-2xl rounded-tr-sm">
                  what do I wear for my interview tomorrow
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-bg-surface border border-border text-tx p-4 text-sm max-w-[85%] rounded-2xl rounded-tl-sm leading-relaxed space-y-3">
                  <p>For a formal interview, here's what works from your wardrobe:</p>
                  <ul className="space-y-1 text-tx-muted">
                    <li>→ White Oxford shirt (saved 12 Aug)</li>
                    <li>→ Charcoal slim trousers (saved 3 Aug)</li>
                  </ul>
                  <p>You're missing a blazer for this look.</p>
                </div>
              </div>

              <div className="flex justify-start pl-4">
                <div className="bg-bg-surface border border-p p-3 rounded-xl w-[240px]">
                  <p className="text-xs font-bold text-tx mb-1">Blazer</p>
                  <p className="text-[10px] text-tx-muted mb-3">Found on Myntra · ₹2,199</p>
                  <button className="w-full bg-bg border border-border text-tx py-1.5 rounded-full text-xs hover:border-tx transition-colors">Grab it</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── WARDROBE PREVIEW SECTION ─── */}
      <section className="section border-b border-border bg-bg-surface">
        <div className="wrap">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4">Your wardrobe, finally organized</h2>
            <p className="t-body max-w-xl mx-auto">Every piece you grab lands here automatically. Iris reads it every time.</p>
          </div>

          <div className="max-w-5xl mx-auto bg-bg border border-border shadow-2xl rounded-2xl overflow-hidden flex h-[500px]">
            {/* Sidebar mock */}
            <div className="w-48 border-r border-border bg-bg-surface hidden md:block p-4">
              <div className="font-display italic font-bold text-xl mb-8">Fits.</div>
              <div className="space-y-2">
                <div className="h-8 bg-border w-full opacity-50 rounded-lg" />
                <div className="h-8 bg-bg w-full rounded-lg" />
                <div className="h-8 bg-bg w-full rounded-lg" />
              </div>
            </div>
            {/* Content mock */}
            <div className="flex-1 p-8 overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
                <h3 className="font-display text-2xl font-medium">Your Wardrobe</h3>
                <span className="t-small">14 pieces · 3 full outfits</span>
              </div>
              
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {[
                  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80",
                  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80",
                  "https://images.unsplash.com/photo-1588099768523-f4e6a5679d88?w=500&q=80",
                  "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&q=80",
                  "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&q=80",
                  "https://images.unsplash.com/photo-1588117305388-c2631a279f82?w=500&q=80"
                ].map((img, i) => (
                  <div key={i} className={`relative bg-bg-surface border border-border rounded-xl break-inside-avoid overflow-hidden ${i === 1 ? 'border-p ring-1 ring-p/50' : ''}`}>
                    <div className="aspect-[3/4] bg-bg relative">
                      <img src={img} alt="Wardrobe Item" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="p-3 border-t border-border flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-tx-muted">Category</span>
                      <span className="text-[10px] text-tx-muted flex items-center gap-1">
                        <Check className="w-3 h-3 text-p" /> In wardrobe
                      </span>
                    </div>
                    {i === 1 && (
                      <div className="absolute top-2 right-2 bg-p text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1 shadow-md rounded-full">
                        <Sparkles className="w-3 h-3" /> Build outfit →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / STATS ─── */}
      <section className="py-24 border-b border-border bg-bg">
        <div className="wrap grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-p text-center">
          <div className="pt-12 md:pt-0">
            <NumberTicker value={127} className="font-display text-5xl md:text-7xl font-bold text-tx mb-2 block" />
            <span className="t-body uppercase tracking-widest text-xs font-bold text-tx-muted">looks grabbed</span>
          </div>
          <div className="pt-12 md:pt-0">
            <span className="font-display text-5xl md:text-7xl font-bold text-tx mb-2 block">
              ₹<NumberTicker value={6.2} className="inline" />L
            </span>
            <span className="t-body uppercase tracking-widest text-xs font-bold text-tx-muted">in outfits discovered</span>
          </div>
          <div className="pt-12 md:pt-0">
            <NumberTicker value={43} className="font-display text-5xl md:text-7xl font-bold text-tx mb-2 block" />
            <span className="t-body uppercase tracking-widest text-xs font-bold text-tx-muted">wardrobes styled by Iris</span>
          </div>
        </div>
      </section>

      {/* ─── VIDEO BANNER 3: FINAL CTA ─── */}
      <section className="relative bg-bg-surface py-24 md:py-32 border-b border-border overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-p/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 wrap flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">03 · ZERO MANUAL SEARCHING</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-tx mb-6 uppercase tracking-tight">
            Zero Manual<br/>
            <span className="italic font-normal text-p">Searching.</span>
          </h2>
          <p className="t-body text-tx-muted max-w-xl mx-auto mb-12">
            Your closet already has most of it. Iris will find exactly what's missing, and check you out in one tap.
          </p>
          <div className="w-full max-w-3xl mb-12">
            <DemoVideo src="/videos/zero-manual-searching.mov" label="fits.live/wardrobe" />
          </div>
          <Link href="/dashboard" className="btn-primary px-12 text-lg mb-6">
            Start for free
          </Link>
          <p className="t-small text-tx-muted">No credit card. Works with any clothing image.</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 bg-bg border-t border-border">
        <div className="wrap flex justify-between items-center">
          <span className="font-display italic font-bold text-xl text-tx">Fits.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="t-small hover:text-tx transition-colors">Privacy</Link>
            <span className="t-small">Built at Hack Devengers 1.0</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
