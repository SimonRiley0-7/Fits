"use client";

import { useState } from "react";
import { UploadBox } from "@/components/UploadBox";
import { ProductMatchCard, Product } from "@/components/ProductMatchCard";
import { useCart } from "@/store/useCart";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Scan, ArrowRight } from "lucide-react";

export default function GrabPage() {
  const [analyzedData, setAnalyzedData] = useState<any>(null);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const [findingMatches, setFindingMatches] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState<Record<string, Product[]>>({});
  
  const addToCart = useCart(state => state.addToCart);

  const handleAnalysisComplete = async (data: any, imageUrl: string) => {
    setAnalyzedData(data);
    setAnalyzedImage(imageUrl);
    setMatchedProducts({});
    setFindingMatches(true);

    const products: Record<string, Product[]> = {};

    try {
      const promises = data.items.map(async (item: any) => {
        const res = await fetch("/api/find-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
        const result = await res.json();
        if (result.matches) {
          products[item.category] = result.matches;
        }
      });

      await Promise.all(promises);
      setMatchedProducts(products);
    } catch (err) {
      console.error(err);
      toast.error("Failed to find exact product matches.");
    } finally {
      setFindingMatches(false);
    }
  };

  const handleBuy = (product: Product, analysis: any) => {
    addToCart(product, analysis);
    toast.success("Added to grab sheet");
  };

  return (
    <main className="flex-1 w-full flex flex-col min-h-screen bg-bg">
      
      {!analyzedData && !findingMatches ? (
        /* ── Initial Empty State (Centered Upload) ── */
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          {/* Ambient center glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-p/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center mb-12">
            <h1 className="t-h1 mb-4">See it. Grab it.</h1>
            <p className="t-body max-w-md mx-auto">
              Drop any screenshot or photo. Iris will identify every piece and find the exact matches from Indian retailers.
            </p>
          </div>
          
          <div className="relative z-10 w-full max-w-2xl bg-bg-surface border-2 border-dashed border-border rounded-2xl p-4 lg:p-8 shadow-2xl">
            <UploadBox onAnalysisComplete={handleAnalysisComplete} />
          </div>
        </div>
      ) : (
        /* ── Results / Loading State (Top-to-Bottom Flow) ── */
        <div className="flex flex-col flex-1 w-full">
          
          {/* Top Banner (Uploaded Image Context) */}
          <div className="w-full bg-bg-surface border-b border-border sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                {analyzedImage && (
                  <button 
                    onClick={() => setIsZoomed(true)}
                    className="w-16 h-16 rounded-lg bg-bg border border-border overflow-hidden shrink-0 hover:ring-2 hover:ring-p transition-all cursor-zoom-in"
                  >
                    <img src={analyzedImage} alt="Uploaded" className="w-full h-full object-cover" />
                  </button>
                )}
                <div>
                  <h2 className="font-display text-2xl font-medium tracking-tight text-tx flex items-center gap-2">
                    {findingMatches ? "Analyzing Image" : "Matches Found"}
                    {findingMatches && <Sparkles className="w-4 h-4 text-p animate-pulse" />}
                  </h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-tx-muted mt-1">
                    {findingMatches ? "Scanning Retailers..." : `${analyzedData?.items?.length || 0} items detected`}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => { setAnalyzedData(null); setAnalyzedImage(null); }}
                className="btn-outline text-xs px-4 py-2 h-auto"
              >
                Scan Another
              </button>
            </div>
          </div>

          {/* Results Feed */}
          <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12">
            {findingMatches && (
              <div className="w-full flex flex-col items-center justify-center py-32">
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 rounded-full border border-p/20 animate-ping" />
                  <div className="absolute inset-4 rounded-full border border-p/40 animate-ping" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute inset-8 rounded-full bg-p flex items-center justify-center shadow-[0_0_60px_rgba(212,121,58,0.4)]">
                    <Scan className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
                <h3 className="font-display italic text-3xl text-tx mb-3">Matching items...</h3>
                <p className="t-body max-w-md text-center">
                  Iris is scanning through Myntra, Ajio, and Amazon to find exact matches for the items in your image.
                </p>
              </div>
            )}

            {analyzedData?.items && !findingMatches && (
              <div className="space-y-16">
                {analyzedData.items.map((item: any, i: number) => (
                  <section key={i} className="flex flex-col gap-6">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-4">
                      <div>
                        <h3 className="font-display text-3xl font-medium text-tx mb-2 capitalize">
                          {item.category}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-bg-surface border border-border text-tx-muted text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full">
                            {item.color}
                          </span>
                          <span className="bg-bg-surface border border-border text-tx-muted text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full">
                            {item.style}
                          </span>
                          {item.distinctive_feature && (
                            <span className="text-tx-muted text-[10px] uppercase font-bold tracking-wider flex items-center gap-2 ml-2">
                              <ArrowRight className="w-3 h-3 text-p" /> {item.distinctive_feature}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-[10px] uppercase font-bold tracking-widest text-tx-muted">
                        {matchedProducts[item.category]?.length || 0} Matches
                      </div>
                    </div>
                    
                    {/* Products Grid / Slider */}
                    <div className="w-full">
                      {matchedProducts[item.category] && matchedProducts[item.category].length > 0 ? (
                        <div className="flex gap-6 overflow-x-auto pb-8 snap-x custom-scrollbar">
                          {matchedProducts[item.category].map((product: Product) => (
                            <div key={product.id} className="w-[180px] md:w-[220px] snap-start shrink-0">
                              <ProductMatchCard product={product} onBuy={() => handleBuy(product, item)} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full py-20 flex flex-col items-center justify-center text-tx-muted bg-bg-surface/50 rounded-2xl border border-dashed border-border">
                          <Sparkles className="w-8 h-8 mb-4 opacity-50" />
                          <p className="font-display italic text-2xl text-tx mb-2">No identical matches.</p>
                          <p className="text-sm">Iris couldn't find this exact {item.category} in stock.</p>
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {isZoomed && analyzedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 md:p-12 cursor-zoom-out backdrop-blur-md"
          >
            <motion.img 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={analyzedImage} 
              alt="Zoomed" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
