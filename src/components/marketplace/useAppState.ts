import { createContext, useContext } from "react";
import type { CartLine, CustomerAddress, Order, Product, Role } from "@/lib/marketplace";
import type { AuthUser } from "@/api/auth.api";

export interface AppStateValue {
  role: Role | null;
  setRole: (role: Role | null) => void;
  user: AuthUser | null;
  accessToken: string | null;
  hydrated: boolean;
  signIn: (user: AuthUser, tokens: { accessToken: string; refreshToken: string }) => void;
  updateUser: (user: AuthUser) => void;
  signOut: () => void;
  cart: CartLine[];
  addToCart: (id: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  products: Product[];
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  refreshProducts: () => Promise<void>;
  // Customer Experience
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;
  orders: Order[];
  createOrder: (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      state?: string;
      zip?: string;
      phone?: string;
    };
  }) => Order;
  addresses: CustomerAddress[];
  saveAddress: (address: CustomerAddress) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const AppState = createContext<AppStateValue | null>(null);

export function useAppState() {
  const value = useContext(AppState);
  if (!value) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return value;
}
