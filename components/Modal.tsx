"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, footer }: {
  open: boolean; onClose: () => void; title: string;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <motion.div
            initial={{ opacity:0, scale:0.96, y:8 }} animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.96, y:8 }}
            transition={{ duration:0.2, ease:[0.16,1,0.3,1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-full max-w-lg bg-bg-surface rounded-2xl shadow-modal z-50 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="t-h3">{title}</h2>
              <button onClick={onClose} className="p-1.5 hover:bg-bg-soft rounded-lg transition-colors">
                <X size={18} className="text-tx-muted" />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-border bg-bg-soft">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
