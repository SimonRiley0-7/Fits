"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { PaymentModal } from "./PaymentModal";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { items, removeFromCart, totalPrice } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center p-2 rounded-full hover:bg-tx/5 transition-colors"
      >
        <ShoppingBag className="w-5 h-5 text-tx" />
        {items.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-p text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-bg-surface">
            {items.length}
          </span>
        )}
      </button>

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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-bg-surface border-l border-border z-[101] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Grab Sheet
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-tx/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-tx-muted" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-tx-muted opacity-50 py-12">
                    <ShoppingBag className="w-16 h-16 mb-4" />
                    <p className="font-display italic text-2xl">Your sheet is empty.</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex gap-4 bg-bg border border-border p-4 rounded-xl group relative">
                      <img src={item.product.imageUrl} alt={item.product.title} className="w-20 h-24 object-cover rounded-lg" />
                      <div className="flex-1 flex flex-col">
                        <h4 className="font-bold text-tx text-sm line-clamp-2 leading-snug mb-1">{item.product.title}</h4>
                        <span className="text-[10px] uppercase tracking-widest text-tx-muted font-bold bg-tx/5 w-fit px-2 py-0.5 rounded-full mb-auto">
                          {item.product.retailer}
                        </span>
                        <div className="flex items-end justify-between mt-2">
                          <span className="font-bold text-tx">₹{item.product.price}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 p-2 text-tx-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-bg-soft flex flex-col gap-4">
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice().toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      setIsPaymentOpen(true);
                    }}
                    className="w-full btn-primary py-4 text-base"
                  >
                    Proceed to Checkout
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
    </>
  );
}
