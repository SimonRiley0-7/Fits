"use client";

import { motion } from "framer-motion";
import { ChevronRight, RefreshCw } from "lucide-react";

export function DemoVideo({ src, label }: { src: string; label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 6 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      className="relative w-full max-w-3xl mx-auto"
      style={{ transformStyle: "preserve-3d", perspective: 1200 }}
    >
      {/* Ambient glow behind the frame */}
      <div className="absolute -inset-6 bg-p/15 blur-[90px] rounded-full pointer-events-none" />

      {/* Browser chrome */}
      <div className="relative bg-bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg-soft">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          {/* URL / app bar */}
          <div className="flex-1 max-w-xs mx-auto flex items-center gap-2 bg-bg-surface border border-border rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-p" />
            <span className="text-[10px] font-medium text-tx-muted uppercase tracking-widest truncate">
              {label || "fits.live"}
            </span>
          </div>
          <RefreshCw className="w-3.5 h-3.5 text-tx-muted" />
        </div>

        {/* Video */}
        <div className="relative aspect-[4/3] bg-bg overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={src} type="video/mp4" />
          </video>

          {/* Bottom progress hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-p animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">
              Part of the loop
            </span>
            <ChevronRight className="w-3 h-3 text-white/60" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}