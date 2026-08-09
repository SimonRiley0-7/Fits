"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, Clock, Tag, Store, ChevronRight, Wand2 } from "lucide-react";
import Link from "next/link";

const IRIS_LOADING = [
  "Scanning your fashion footprint...",
  "Digging through the archives...",
  "Pulling your style history...",
  "Recalling every outfit decision...",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HistoryPage() {
  const [tab, setTab] = useState<"purchases" | "outfits">("purchases");
  const [data, setData] = useState<{ purchases: any[]; outfits: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingLine, setLoadingLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setLoadingLine(p => (p + 1) % IRIS_LOADING.length), 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/history")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 w-full flex flex-col p-6 md:p-12 overflow-y-auto bg-bg">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-10">
          <div className="text-[10px] text-p uppercase tracking-[0.4em] mb-2 font-bold">THE ARCHIVES</div>
          <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tighter text-tx mb-4">Your History</h1>
          <p className="text-tx-muted uppercase tracking-widest text-xs font-bold mt-4">Every piece you've bought and every outfit Iris has built for you.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-bg border border-border p-1 w-fit">
          {(["purchases", "outfits"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-3 px-8 py-3 text-[10px] uppercase tracking-widest font-bold transition-all ${
                tab === t
                  ? "bg-p text-white border border-p shadow-[0_0_20px_rgba(212,121,58,0.2)]"
                  : "text-tx-muted hover:text-tx hover:bg-bg-surface border border-transparent"
              }`}
            >
              {t === "purchases" ? <ShoppingBag className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
              {t === "purchases" ? "Purchases" : "Outfit Sessions"}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-24 text-tx-muted">
            <div className="flex gap-1 mb-6">
              {[0,1,2].map(i => (
                <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} className="w-2 h-2 bg-p rounded-full" />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={loadingLine} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="font-display italic text-lg">
                {IRIS_LOADING[loadingLine]}
              </motion.p>
            </AnimatePresence>
          </div>
        )}

        {/* Purchases Tab */}
        {!loading && tab === "purchases" && (
          <AnimatePresence mode="wait">
            <motion.div key="purchases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {(data?.purchases || []).length === 0 ? (
                <div className="flex flex-col items-center py-24 text-tx-muted opacity-60">
                  <ShoppingBag className="w-12 h-12 mb-4" />
                  <p className="font-display italic text-2xl">No purchases yet.</p>
                  <p className="text-sm mt-2">Go grab something from the Grab page!</p>
                </div>
              ) : (data?.purchases || []).map((p: any, i: number) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-5 bg-bg-surface border border-border p-5 hover:border-p transition-all group"
                >
                  <div className="w-20 h-24 overflow-hidden bg-bg shrink-0 border border-border">
                    {p.wardrobe_items?.image_url ? (
                      <img src={p.wardrobe_items.image_url} alt={p.wardrobe_items.category} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-tx-muted">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-tx uppercase tracking-widest text-[10px] truncate mb-2">
                      {p.wardrobe_items?.category || "Item"}
                      {p.wardrobe_items?.color && <span className="text-tx-muted"> · {p.wardrobe_items.color}</span>}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-tx-muted">
                        <Store className="w-3 h-3 text-p" /> {p.retailer || "UNKNOWN RETAILER"}
                      </span>
                      <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-tx-muted">
                        <Clock className="w-3 h-3 text-p" /> {formatDate(p.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    <p className="text-xl font-black tracking-tighter text-tx">₹{(p.price || 0).toLocaleString("en-IN")}</p>
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 border ${
                      p.status === "completed" ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                    }`}>
                      {p.status || "completed"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Outfits Tab */}
        {!loading && tab === "outfits" && (
          <AnimatePresence mode="wait">
            <motion.div key="outfits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {(data?.outfits || []).length === 0 ? (
                <div className="flex flex-col items-center py-24 text-tx-muted opacity-60">
                  <Sparkles className="w-12 h-12 mb-4" />
                  <p className="font-display italic text-2xl">No outfit sessions yet.</p>
                  <p className="text-sm mt-2">Head to the Style tab and ask Iris!</p>
                  <Link href="/dashboard/style" className="mt-6 btn-primary flex items-center gap-2">
                    <Wand2 className="w-4 h-4" /> Ask Iris
                  </Link>
                </div>
              ) : (data?.outfits || []).map((outfit: any, i: number) => (
                <motion.div
                  key={outfit.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-bg-surface border border-border p-6 hover:border-p transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-p/10 border border-p/30 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-p" />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-p">IRIS OUTFIT</span>
                      </div>
                      <h3 className="font-black tracking-tighter text-3xl uppercase text-tx">{outfit.occasion}</h3>
                      {outfit.missing_category && (
                        <p className="text-[10px] uppercase font-bold tracking-widest text-tx-muted mt-3 border-l-2 border-p pl-3">
                          MISSING: <span className="text-p">{outfit.missing_category}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <p className="text-[9px] uppercase tracking-widest font-bold text-tx-muted mb-1">{formatDate(outfit.created_at)}</p>
                      <p className="text-[10px] font-bold text-tx-muted uppercase tracking-widest border border-border bg-bg px-2 py-1">{(outfit.item_ids || []).length} PIECES</p>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/style?occasion=${encodeURIComponent(outfit.occasion)}`}
                    className="mt-6 flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase font-bold text-tx hover:text-p transition-colors"
                  >
                    RECREATE LOOK <ChevronRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </main>
  );
}
