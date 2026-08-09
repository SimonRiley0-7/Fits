"use client";
import { useState, useEffect, useRef } from "react";
import { ProductMatchCard, Product } from "@/components/ProductMatchCard";
import { Loader2, Sparkles, Send, Save, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

// ── Iris Personality Loading Lines ─────────────────────────────────────────
const IRIS_LINES = [
  "Scanning your wardrobe...",
  "Finding your vibe...",
  "Almost there, styling takes thought.",
  "Matching patterns and textures...",
  "Reading the occasion...",
  "Building your perfect look...",
  "Considering color theory...",
  "Curating your next statement...",
];

// ── Occasion Quick-Picks ────────────────────────────────────────────────────
const OCCASIONS = [
  { label: "Job Interview", emoji: "💼" },
  { label: "Date Night", emoji: "🌹" },
  { label: "Casual Day Out", emoji: "☀️" },
  { label: "Party", emoji: "🎉" },
  { label: "Travel", emoji: "✈️" },
  { label: "Gym", emoji: "💪" },
  { label: "Wedding Guest", emoji: "💍" },
  { label: "Work From Home", emoji: "🏠" },
];

export default function StylePage() {
  const searchParams = useSearchParams();
  const [occasion, setOccasion] = useState("");
  const [loading, setLoading] = useState(false);
  const [irisLine, setIrisLine] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [findingMissing, setFindingMissing] = useState(false);
  const [missingMatches, setMissingMatches] = useState<Product[]>([]);
  const [saved, setSaved] = useState(false);
  const addToCart = useCart(state => state.addToCart);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Rotate Iris loading lines
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setIrisLine(p => (p + 1) % IRIS_LINES.length), 1800);
    return () => clearInterval(interval);
  }, [loading]);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // If redirected from wardrobe "Complete This Outfit"
  useEffect(() => {
    const preOccasion = searchParams.get("occasion");
    const preItem = searchParams.get("item");
    if (preItem) {
      const query = `Build an outfit around my ${preItem}`;
      setOccasion(query);
      handleStyle(undefined, query);
    } else if (preOccasion) {
      setOccasion(preOccasion);
      handleStyle(undefined, preOccasion);
    }
  }, []);

  const handleStyle = async (e?: React.FormEvent, presetOccasion?: string) => {
    if (e) e.preventDefault();
    const query = presetOccasion || occasion;
    if (!query.trim()) return;

    setOccasion(query);
    setLoading(true);
    setResult(null);
    setMissingMatches([]);
    setSaved(false);
    setIrisLine(0);

    setChatHistory(prev => [...prev, { role: "user", content: query }]);

    try {
      const res = await fetch("/api/style-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion: query }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate outfit");

      setResult(data);
      setChatHistory(prev => [...prev, { role: "iris", content: data.message }]);

      if (data.missing_piece) {
        findMissingPiece(data.missing_piece);
      }

      // Auto-save outfit to history
      saveOutfit(query, data.item_ids, data.missing_piece);
    } catch (err: any) {
      toast.error(err.message);
      setChatHistory(prev => [...prev, { role: "iris", content: `I couldn't style you today — ${err.message}` }]);
    } finally {
      setLoading(false);
      setOccasion("");
    }
  };

  const saveOutfit = async (occasion: string, item_ids: string[], missing_category?: string) => {
    try {
      await fetch("/api/outfit/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, item_ids, missing_category }),
      });
      setSaved(true);
    } catch (_) {}
  };

  const findMissingPiece = async (keywords: string) => {
    setFindingMissing(true);
    try {
      const res = await fetch("/api/find-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });
      const data = await res.json();
      setMissingMatches(data.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFindingMissing(false);
    }
  };

  const handleBuy = (product: Product) => {
    addToCart(product, { category: result?.missing_piece || "accessory", source: "iris_suggestion" });
    toast.success("Added to Cart!");
  };

  const selectedItems = result
    ? result.wardrobe.filter((item: any) => result.item_ids.includes(item.id))
    : [];

  return (
    <main className="flex-1 w-full flex flex-col md:flex-row h-screen overflow-hidden bg-bg">

      {/* LEFT: Outfit Canvas */}
      <div className="w-full md:w-[60%] h-full overflow-y-auto p-6 md:p-12 border-r border-border">
        
        {/* Empty state */}
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-tx-muted opacity-50">
            <Sparkles className="w-12 h-12 mb-4" />
            <p className="font-display italic text-2xl">Your canvas is waiting.</p>
            <p className="text-sm mt-2">Tell Iris where you're going.</p>
          </div>
        )}

        {/* Loading with Iris personality */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-p gap-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border border-p/20 animate-ping" />
              <div className="absolute inset-3 rounded-full border border-p/40 animate-ping" style={{ animationDelay: '0.3s' }} />
              <div className="absolute inset-6 rounded-full bg-p flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={irisLine}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="font-display italic text-xl text-center"
              >
                {IRIS_LINES[irisLine]}
              </motion.p>
            </AnimatePresence>
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-24">
            <header className="mb-8 border-b border-border pb-4 flex items-center justify-between">
              <h2 className="t-h2 mb-0">
                Iris built this for: <span className="text-p italic">{chatHistory.findLast(m => m.role === "user")?.content}</span>
              </h2>
              {saved && (
                <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Saved to History
                </span>
              )}
            </header>

            {selectedItems.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-tx-muted mb-4">Iris picked from your wardrobe</h3>
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x custom-scrollbar">
                  {selectedItems.map((item: any) => (
                    <div key={item.id} className="w-[120px] md:w-[140px] shrink-0 snap-start">
                      <div className="w-full h-[140px] rounded-xl overflow-hidden bg-bg-surface border border-p/40 relative">
                        <img src={item.image_url} alt={item.category} className="object-cover w-full h-full" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
                          <p className="text-white text-[9px] font-bold uppercase tracking-wider truncate">{item.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Also pairs well — non-selected wardrobe items */}
            {result.wardrobe && result.wardrobe.length > selectedItems.length && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-tx-muted mb-1">Also in your wardrobe that pairs well</h3>
                <p className="text-[11px] text-tx-muted mb-4">Other pieces you own that could work with this look</p>
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x custom-scrollbar">
                  {result.wardrobe
                    .filter((item: any) => !result.item_ids.includes(item.id))
                    .map((item: any) => (
                      <div key={item.id} className="w-[110px] shrink-0 snap-start group">
                        <div className="w-full h-[110px] rounded-xl overflow-hidden bg-bg-surface border border-border group-hover:border-p transition-colors relative">
                          <img src={item.image_url} alt={item.category} className="object-cover w-full h-full opacity-75 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
                            <p className="text-white text-[9px] font-bold uppercase tracking-wider truncate">{item.category}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {result.missing_piece && (
              <div className="border border-p bg-bg-surface rounded-none p-8 relative">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-p mb-4 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Missing Piece
                </h3>
                <p className="t-h3 mb-8">
                  You&apos;re missing a <span className="text-p">{result.missing_piece}</span> for this look.
                </p>

                {findingMissing ? (
                  <div className="flex gap-4 overflow-x-auto">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="min-w-[200px] aspect-[4/5] bg-bg animate-pulse rounded-lg border border-border" />
                    ))}
                  </div>
                                ) : missingMatches.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
                    {missingMatches.map(product => (
                      <div key={product.id} className="w-[180px] md:w-[220px] snap-start shrink-0">
                        <ProductMatchCard product={product} onBuy={handleBuy} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* RIGHT: Chat Panel */}
      <div className="w-full md:w-[40%] h-full flex flex-col bg-bg-surface border-t-2 md:border-t-0">

        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-bg-surface flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <h2 className="font-display font-bold text-lg text-tx">
            Iris <span className="font-body font-normal text-xs uppercase tracking-widest text-tx-muted ml-2">your AI stylist</span>
          </h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatHistory.length === 0 && (
            <div className="text-center pt-16 opacity-60">
              <p className="t-body italic">&ldquo;I&apos;m Iris. Tell me where you&apos;re going.&rdquo;</p>
            </div>
          )}

          {chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "user" ? (
                <div className="bg-p text-white px-4 py-3 text-sm max-w-[80%] rounded-2xl rounded-tr-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="bg-bg border border-border text-tx p-4 text-sm max-w-[85%] rounded-2xl rounded-tl-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              )}
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-bg border border-border p-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-p rounded-full" />
                ))}
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Occasion Pills + Input */}
        <div className="p-5 border-t border-border bg-bg">
          {/* Occasion Quick-Picks */}
          <div className="flex flex-wrap gap-2 mb-4">
            {OCCASIONS.map(occ => (
              <button
                key={occ.label}
                onClick={() => handleStyle(undefined, occ.label)}
                disabled={loading}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 border border-border hover:border-p text-tx-muted hover:text-p bg-bg-surface hover:bg-bg transition-all disabled:opacity-40 rounded-full"
              >
                <span>{occ.emoji}</span> {occ.label}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => handleStyle(e)} className="relative flex items-center">
            <input
              type="text"
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              placeholder="Tell Iris where you're going..."
              className="w-full bg-bg-surface px-4 py-4 pr-14 border border-border focus:border-p outline-none text-sm transition-colors rounded-xl"
            />
            <button
              type="submit"
              disabled={loading || !occasion.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-p text-white flex items-center justify-center hover:bg-p-h transition-colors disabled:opacity-50 rounded-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
