"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ExternalLink, Sparkles } from "lucide-react";
import { useWishlist } from "@/store/useWishlist";
import { useCart } from "@/store/useCart";
import toast from "react-hot-toast";
import Link from "next/link";

export default function WishlistPage() {
  const { items, load, toggle, loaded } = useWishlist();
  const addToCart = useCart(s => s.addToCart);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const handleRemove = async (item: any) => {
    setRemoving(item.product_id);
    await toggle({
      id: item.product_id,
      title: item.title,
      price: String(item.price),
      imageUrl: item.image_url,
      link: item.link,
      retailer: item.retailer,
    });
    setRemoving(null);
    toast("Removed from wishlist", { duration: 1500 });
  };

  const handleAddToCart = (item: any) => {
    addToCart(
      {
        id: item.product_id,
        title: item.title,
        price: String(item.price),
        currency: "INR",
        imageUrl: item.image_url,
        link: item.link,
        retailer: item.retailer,
      },
      { category: "wishlist", source: "wishlist" }
    );
    toast.success("Added to Cart!");
  };

  return (
    <main className="flex-1 w-full flex flex-col p-6 md:p-12 overflow-y-auto bg-bg">
      <div className="max-w-5xl mx-auto w-full">

        {/* Header */}
        <header className="mb-10 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="t-h1">Wishlist</h1>
              <span className="bg-bg-surface border border-border text-tx-muted text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                {items.length} items
              </span>
            </div>
            <p className="t-body">Items you're saving for later.</p>
          </div>
        </header>

        {/* Loading skeleton */}
        {!loaded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-bg" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-bg rounded w-3/4" />
                  <div className="h-3 bg-bg rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {loaded && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 text-tx-muted text-center"
          >
            <div className="w-20 h-20 rounded-full bg-bg-surface border border-border flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 opacity-40" />
            </div>
            <p className="font-display italic text-2xl mb-2">Nothing saved yet.</p>
            <p className="text-sm mb-8">Hover any product card and hit the ❤️ to save it here.</p>
            <div className="flex gap-3">
              <Link href="/dashboard/grab" className="btn-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Grab something
              </Link>
              <Link href="/dashboard/style" className="px-5 py-2.5 border border-border rounded-lg text-sm font-semibold hover:border-p transition-colors">
                Ask Iris
              </Link>
            </div>
          </motion.div>
        )}

        {/* Grid */}
        {loaded && items.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div
                  key={item.product_id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-bg-surface border border-border rounded-xl overflow-hidden group hover:border-p transition-all relative flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] bg-bg overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=No+Image"; }}
                    />

                    {/* Retailer badge */}
                    <div className="absolute top-2 right-2 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border bg-bg/80 backdrop-blur-sm border-border text-tx-muted">
                      {item.retailer}
                    </div>

                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-10 h-10 rounded-full bg-p text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                        title="Add to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-bg/90 text-tx flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                        title="View on site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleRemove(item)}
                        disabled={removing === item.product_id}
                        className="w-10 h-10 rounded-full bg-bg/90 text-red-400 flex items-center justify-center shadow-xl hover:scale-110 transition-transform disabled:opacity-50"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <p className="text-xs font-medium text-tx line-clamp-2 leading-snug flex-1">{item.title}</p>
                    <p className="text-sm font-bold text-tx">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                  </div>

                  {/* Add to Cart bottom button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-p/10 text-p hover:bg-p hover:text-white py-2.5 text-xs font-bold transition-all border-t border-p/20"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </main>
  );
}
