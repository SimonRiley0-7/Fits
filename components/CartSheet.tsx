"use client";

import { useCart } from "@/store/useCart";
import { ShoppingBag, X, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function CartSheet() {
  const { items, removeFromCart, clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });
      
      if (!res.ok) throw new Error("Checkout failed");
      
      setSuccess(true);
      setTimeout(() => {
        clearCart();
        setSuccess(false);
        setOpen(false);
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-p text-white p-4 rounded-none shadow-hover flex items-center justify-center hover:scale-105 transition-transform"
      >
        <ShoppingBag className="w-6 h-6" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-bg-surface border border-border text-tx text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
            {items.length}
          </span>
        )}
      </button>
      
      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-bg-surface border-l border-border z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl font-medium tracking-tight text-tx">Your Grab</h2>
                  {items.length > 0 && (
                    <span className="bg-p text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm">
                      {items.length}
                    </span>
                  )}
                </div>
                <button onClick={() => setOpen(false)} className="text-tx-muted hover:text-tx transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {success ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle2 className="w-16 h-16 text-success mb-6" />
                    <h3 className="t-h3 mb-2">Purchase Successful.</h3>
                    <p className="t-body text-tx-muted">Items added to your Wardrobe.</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-tx-muted">
                    <p className="font-display italic text-2xl mb-4 text-tx-muted">Empty.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-start group relative pb-6 border-b border-border/50 last:border-0">
                        <div className="w-[60px] h-[80px] bg-bg shrink-0 border border-border">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.title} 
                            className="w-full h-full object-cover opacity-90"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-[80px]">
                          <div>
                            <p className="font-body text-sm text-tx mb-1 line-clamp-1">{item.product.title}</p>
                            <p className="text-[10px] text-tx-muted uppercase tracking-widest">{item.product.retailer}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="font-body font-semibold text-tx">₹{parseFloat(item.product.price).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="absolute right-0 bottom-6 text-tx-muted hover:text-tx transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {!success && items.length > 0 && (
                <div className="p-6 border-t border-border bg-bg-surface">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-body text-sm font-medium text-tx-muted uppercase tracking-widest">Total</span>
                    <span className="font-body text-xl font-bold text-tx">₹{totalPrice().toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-p text-white font-bold py-4 hover:bg-p-h transition-colors flex justify-center items-center gap-2 rounded-none"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Checkout & Add to Wardrobe"
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
