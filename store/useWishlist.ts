import { create } from "zustand";

interface WishlistItem {
  product_id: string;
  title: string;
  price: number;
  image_url: string;
  link: string;
  retailer: string;
}

interface WishlistStore {
  items: WishlistItem[];
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (product: { id: string; title: string; price: string; imageUrl: string; link: string; retailer: string }) => Promise<void>;
  isWishlisted: (product_id: string) => boolean;
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: [],
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    try {
      const res = await fetch("/api/wishlist");
      const data = await res.json();
      set({ items: data.items || [], loaded: true });
    } catch (_) { set({ loaded: true }); }
  },

  toggle: async (product) => {
    const alreadyIn = get().isWishlisted(product.id);
    if (alreadyIn) {
      // Optimistic remove
      set(s => ({ items: s.items.filter(i => i.product_id !== product.id) }));
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id }),
      });
    } else {
      // Optimistic add
      const newItem: WishlistItem = {
        product_id: product.id,
        title: product.title,
        price: parseFloat(product.price) || 0,
        image_url: product.imageUrl,
        link: product.link,
        retailer: product.retailer,
      };
      set(s => ({ items: [newItem, ...s.items] }));
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          title: product.title,
          price: product.price,
          image_url: product.imageUrl,
          link: product.link,
          retailer: product.retailer,
        }),
      });
    }
  },

  isWishlisted: (product_id) => get().items.some(i => i.product_id === product_id),
}));
