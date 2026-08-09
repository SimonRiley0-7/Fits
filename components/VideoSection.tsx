"use client";

import { motion } from "framer-motion";

interface VideoSectionProps {
  src: string | string[];
  poster?: string;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  loop?: boolean;
  muted?: boolean;
  autoplay?: boolean;
  playsInline?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  height?: string;
}

export function VideoSection({
  src,
  poster,
  children,
  className = "",
  overlay = true,
  overlayOpacity = 0.4,
  loop = true,
  muted = true,
  autoplay = true,
  playsInline = true,
  objectFit = "cover",
  height = "100vh",
}: VideoSectionProps) {
  const sources = Array.isArray(src) ? src : [src];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{ height, width: "100%" }}
    >
      <video
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        poster={poster}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        style={{ objectFit }}
        aria-hidden="true"
      >
        {sources.map((source, i) => (
          <source key={i} src={source} type={`video/${source.split(".").pop()}`} />
        ))}
      </video>

      {overlay && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity * 0.5}) 0%, rgba(0,0,0,${overlayOpacity}) 100%)`,
          }}
        />
      )}

      <div className="relative z-20 w-full px-6 text-center">
        {children}
      </div>
    </motion.section>
  );
}

export function VideoHero({
  src,
  poster,
  title,
  subtitle,
  cta,
  ctaHref,
  className = "",
  ...props
}: VideoSectionProps & {
  title: string;
  subtitle?: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <VideoSection src={src} poster={poster} className={className} {...props}>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="t-display text-white font-bold leading-[1.05]"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="t-body text-white/90 max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {cta && ctaHref && (
          <motion.a
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            href={ctaHref}
            className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-full text-base hover:scale-105 active:scale-95 transition-transform shadow-xl"
          >
            {cta}
          </motion.a>
        )}
      </div>
    </VideoSection>
  );
}