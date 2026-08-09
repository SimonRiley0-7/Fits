import { create } from 'zustand';
import { Product } from '@/components/ProductMatchCard';

export interface CartItem {
  id: string; // unique ID for the cart item
  product: Product;
  analysis: any; // the original Iris/Grabbit analysis to determine category/color
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, analysis: any) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product, analysis) => set((state) => {
    // Generate a unique ID for this cart entry (in case they add the same product twice)
    const newCartItem: CartItem = {
      id: Math.random().toString(36).substring(7),
      product,
      analysis
    };
    return { items: [...state.items, newCartItem] };
  }),
  removeFromCart: (cartItemId) => set((state) => ({
    items: state.items.filter(item => item.id !== cartItemId)
  })),
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.length,
  totalPrice: () => {
    return get().items.reduce((total, item) => {
      // Parse price safely, removing any commas if they exist
      const priceVal = parseFloat(item.product.price.toString().replace(/,/g, ''));
      return total + (isNaN(priceVal) ? 0 : priceVal);
    }, 0);
  }
}));
