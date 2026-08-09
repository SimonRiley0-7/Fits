"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import { useWishlist } from "@/store/useWishlist";
import toast from "react-hot-toast";

export interface Product {
  id: string;
  title: string;
  price: string;
  currency: string;
  imageUrl: string;
  link: string;
  retailer: string;
}

export function ProductMatchCard({ product, onBuy }: { product: Product, onBuy: (p: Product) => void }) {
  const parsedPrice = parseFloat(product.price) || 0;
  const { load, toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  // Lazy-load wishlist state on first render
  useEffect(() => { load(); }, []);

  const getBadgeColor = (retailer: string) => {
    const r = retailer.toLowerCase();
    if (r.includes('myntra')) return 'bg-pink-900/40 text-pink-200 border-pink-900';
    if (r.includes('ajio')) return 'bg-blue-900/40 text-blue-200 border-blue-900';
    if (r.includes('amazon')) return 'bg-yellow-900/40 text-yellow-200 border-yellow-900';
    return 'bg-tx-muted/20 text-tx-muted border-tx-muted/40';
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggle(product);
    toast(wishlisted ? "Removed from Wishlist" : "❤️ Added to Wishlist!", {
      duration: 1500,
      style: { fontSize: "13px" },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col overflow-hidden bg-bg-surface border border-border hover:border-p rounded-lg group relative h-full"
    >
      <div className="relative aspect-[4/5] bg-bg overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=No+Image";
          }}
        />

        {/* Retailer badge */}
        <div className={`absolute top-2 right-2 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border shadow-sm ${getBadgeColor(product.retailer)}`}>
          {product.retailer}
        </div>

        {/* Wishlist heart button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={wishlisted ? "filled" : "empty"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-tx-muted"}`}
              />
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h4 className="font-body text-sm font-medium text-tx line-clamp-2 leading-snug flex-1" title={product.title}>
          {product.title}
        </h4>
        <p className="font-body text-base font-semibold text-tx">
          ₹{parsedPrice.toLocaleString('en-IN')}
        </p>
      </div>

      <button
        onClick={() => onBuy(product)}
        className="w-full bg-p text-white py-3 text-sm font-bold hover:bg-p-h transition-colors"
      >
        Add to Cart
      </button>
    </motion.div>
  );
}
