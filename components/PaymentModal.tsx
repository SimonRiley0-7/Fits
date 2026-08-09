import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, ShieldCheck, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem, useCart } from "@/store/useCart";

export function PaymentModal({ 
  items, 
  isOpen, 
  onClose 
}: { 
  items: CartItem[]; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();
  const clearCart = useCart(state => state.clearCart);

  const totalPrice = items.reduce((total, item) => {
    const priceVal = parseFloat(item.product.price.toString().replace(/,/g, ''));
    return total + (isNaN(priceVal) ? 0 : priceVal);
  }, 0);

  // Poll for status once sessionId is available
  useEffect(() => {
    if (!sessionId || success) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/prava/status?session_id=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isApproved) {
            clearInterval(interval);
            await finalizeInternalCheckout();
          }
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [sessionId, success]);

  // Listen for iframe postMessage as a backup to polling
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      // Allow messages from prava.space
      if (e.origin.includes('prava.space') || e.origin.includes('localhost')) {
        console.log("[PRAVA IFRAME MESSAGE]", e.data);
        if (e.data?.status === 'success' || e.data?.status === 'approved' || e.data?.type === 'payment_success') {
          if (!success && sessionId) {
            await finalizeInternalCheckout();
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sessionId, success]);

  const finalizeInternalCheckout = async () => {
    setSuccess(true);
    setIframeUrl(null); // Hide iframe
    
    try {
      const checkoutItems = items.map(item => ({
        product: item.product,
        analysis: item.analysis
      }));

      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems, sessionId }),
      });
      
      clearCart();
      setTimeout(() => {
        onClose();
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (e) {
      console.error("Internal checkout failed after Prava success", e);
    }
  };

  const handlePay = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const checkoutItems = items.map(item => ({
        product: item.product,
        analysis: item.analysis
      }));

      // Create Prava Session First
      const sessionRes = await fetch("/api/prava/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      });
      
      if (!sessionRes.ok) throw new Error("Failed to create Prava session");
      
      const sessionData = await sessionRes.json();
      
      if (sessionData.iframe_url) {
        setSessionId(sessionData.session_id);
        setIframeUrl(sessionData.iframe_url);
      } else {
        // Fallback if no iframe URL is returned (e.g., bypass or direct token)
        await finalizeInternalCheckout();
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIframeUrl(null);
      setSessionId(null);
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (items.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-md bg-white overflow-hidden border-none shadow-2xl transition-all duration-300 ${iframeUrl ? '!p-0 !max-w-lg' : ''}`}>
        {!iframeUrl && (
          <DialogHeader className="bg-bg-soft/50 p-6 pb-4 border-b border-border">
            <DialogTitle className="flex items-center justify-center gap-2 text-xl">
              <ShieldCheck className="text-p w-5 h-5" />
              Prava Checkout
            </DialogTitle>
          </DialogHeader>
        )}
        
        <div className={iframeUrl ? "h-[600px] w-full" : "p-6"}>
          <AnimatePresence mode="wait">
            {iframeUrl ? (
              <motion.div 
                key="waiting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 px-6 text-center"
              >
                <div className="w-16 h-16 bg-p/10 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8 text-p" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-tx">Secure Checkout</h3>
                <p className="text-tx-muted text-sm mb-8">
                  Please complete the security check and payment in the Prava secure window.
                </p>
                
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <button
                    onClick={() => window.open(iframeUrl, 'PravaCheckout', 'width=500,height=700')}
                    className="w-full bg-p text-white font-semibold py-3 rounded-xl hover:bg-p-h transition-all shadow-md"
                  >
                    Open Secure Window
                  </button>
                  <button
                    onClick={finalizeInternalCheckout}
                    className="w-full bg-bg-soft text-tx-muted font-medium py-3 rounded-xl hover:bg-bg transition-all border border-border text-xs"
                  >
                    🚀 Skip (Hackathon Demo)
                  </button>
                </div>
                
                <p className="text-xs font-medium text-tx-muted mt-8 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" /> Waiting for payment approval...
                </p>
              </motion.div>
            ) : !success ? (
              <motion.div 
                key="checkout"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                <div className="flex -space-x-4 mb-6">
                  {items.slice(0, 3).map((item, i) => (
                    <img 
                      key={item.id}
                      src={item.product.imageUrl} 
                      className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-sm"
                      alt={item.product.title}
                    />
                  ))}
                  {items.length > 3 && (
                    <div className="w-16 h-16 rounded-full border-2 border-white bg-bg-soft flex items-center justify-center text-xs font-bold text-tx-muted shadow-sm z-10">
                      +{items.length - 3}
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-center text-sm text-tx-muted mb-2">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your Grab Sheet
                </h3>
                <p className="text-4xl font-bold mb-8 text-tx">₹{totalPrice.toLocaleString('en-IN')}</p>
                
                <button 
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full relative overflow-hidden group flex justify-center items-center gap-2 bg-p text-white font-bold py-4 rounded-xl hover:bg-p-h transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> Checkout & Pay
                      </span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-tx-muted mt-4 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure One-Time Prava Token
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-green-500 mb-6 drop-shadow-md" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3 text-tx">Checkout Successful!</h3>
                <p className="text-tx-muted">Items securely added to your digital wardrobe.</p>
                <p className="text-sm font-medium text-p mt-6 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Wardrobe...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
