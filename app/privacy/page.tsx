"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShieldCheck, Eye, CreditCard, Trash2, Lock } from "lucide-react";

const sections = [
  {
    icon: Eye,
    title: "What we collect",
    body: "We store the clothing images you upload and the products you save to your wardrobe. We also keep your Style DNA profile (sizes and fit preferences) so Iris can style you accurately. Nothing more."
  },
  {
    icon: Lock,
    title: "How we use it",
    body: "Your images power the AI stylist and product-matching. Your wardrobe and wishlist make quick-checkout work. We never sell your data, and we never use your uploads for anything outside your account."
  },
  {
    icon: CreditCard,
    title: "Payments",
    body: "Purchases are completed through Prava's sandbox — a virtual card from our partner. Fits never sees or stores your real card number. Only the final purchase confirmation lands in your history."
  },
  {
    icon: Trash2,
    title: "Deletion",
    body: "You own everything. Remove an item from your wardrobe or wishlist anytime and it's gone immediately. Contact us and we'll wipe your account and images within 30 days."
  }
];

export default function PrivacyPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }} className="min-h-screen bg-bg text-tx selection:bg-p selection:text-white pb-24">
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-bg/80 backdrop-blur-md border-b border-border transition-all">
        <Link href="/" className="font-display italic font-bold text-2xl tracking-tight text-tx">Fits.</Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/dashboard" className="btn-pill px-6 py-2">Start for free</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-tx-muted">Privacy Policy</span>
        </div>
        <h1 className="t-h1 mb-4">Your closet, your rules.</h1>
        <p className="t-body text-tx-muted mb-16">
          Fits is a hackathon build. Here&apos;s exactly what happens with the images you upload and the pieces you save. Last updated 9 August 2026.
        </p>

        <div className="space-y-4">
          {sections.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-bg-surface border border-border rounded-2xl p-6 flex gap-5"
            >
              <div className="w-10 h-10 rounded-xl bg-p/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-p" />
              </div>
              <div>
                <h3 className="t-h3 mb-2">{title}</h3>
                <p className="t-small">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-bg-surface border border-border rounded-2xl p-6 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-p/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-p" />
          </div>
          <p className="t-small text-tx-muted">
            This is a demo product built for Hack Devengers 1.0. Privacy-first by design: your images and wardrobe
            stay scoped to your own account. Reach out to us during the hackathon if you have any questions.
          </p>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <Link href="/" className="t-small uppercase tracking-widest font-bold hover:text-tx transition-colors">← Back home</Link>
          <span className="t-small">Built at Hack Devengers 1.0</span>
        </div>
      </main>
    </motion.div>
  );
}