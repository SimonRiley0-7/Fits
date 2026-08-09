"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/store/useCart";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { PaymentModal } from "./PaymentModal";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { items, removeFromCart, totalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center p-2 hover:text-p transition-colors group"
      >
        <ShoppingBag className="w-5 h-5" />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-p text-white text-[9px] font-bold flex items-center justify-center border border-bg group-hover:border-p">
            {items.length}
          </span>
        )}
      </button>

      {mounted && createPortal(
        <>
          <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 m-auto w-[90vw] max-w-3xl h-[80vh] bg-bg-surface/95 backdrop-blur-3xl border border-border z-[101] shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-bg/50">
                <h2 className="font-black text-2xl uppercase tracking-tighter flex items-center gap-3 text-tx">
                  <ShoppingBag className="w-5 h-5" /> Grab Sheet
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:text-p transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-tx-muted opacity-50 py-12">
                    <ShoppingBag className="w-16 h-16 mb-4" />
                    <p className="font-black text-3xl uppercase tracking-tighter">Empty.</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex gap-4 bg-bg border border-border p-3 group relative hover:border-p transition-all">
                      <img src={item.product.imageUrl} alt={item.product.title} className="w-16 h-20 object-cover border border-border" />
                      <div className="flex-1 flex flex-col">
                        <h4 className="font-bold text-tx text-[9px] uppercase tracking-widest line-clamp-2 leading-relaxed mb-1 pr-6">{item.product.title}</h4>
                        <span className="text-[8px] uppercase tracking-[0.2em] text-tx-muted font-bold border border-border bg-bg-surface w-fit px-2 py-1 mb-auto">
                          {item.product.retailer}
                        </span>
                        <div className="flex items-end justify-between mt-2">
                          <span className="font-black text-sm tracking-tighter text-tx">₹{item.product.price}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 p-1.5 text-tx-muted hover:text-red-500 bg-bg border border-transparent hover:border-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-bg flex flex-col gap-5">
                  <div className="flex items-center justify-between font-black text-xl tracking-tighter">
                    <span>Total</span>
                    <span>₹{totalPrice().toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      setIsPaymentOpen(true);
                    }}
                    className="w-full bg-p text-white font-bold text-[10px] uppercase tracking-[0.2em] py-5 hover:bg-p-h transition-colors"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

          <PaymentModal 
            isOpen={isPaymentOpen}
            items={items}
            onClose={() => setIsPaymentOpen(false)}
          />
        </>,
        document.body
      )}
    </>
  );
}
