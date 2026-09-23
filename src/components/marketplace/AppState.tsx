import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine, Product, Role } from "@/lib/marketplace";
import { products as seedProducts } from "@/lib/marketplace";
import { authApi, type AuthUser } from "@/api/auth.api";
import { ApiError } from "@/api/client";

interface AppStateValue {
  role: Role | null;
  setRole: (role: Role | null) => void;
  user: AuthUser | null;
  accessToken: string | null;
  hydrated: boolean;
  signIn: (user: AuthUser, tokens: { accessToken: string; refreshToken: string }) => void;
  signOut: () => void;
  cart: CartLine[];
  addToCart: (id: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  products: Product[];
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
}
const AppState = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([
    { productId: "p1", quantity: 1 },
    { productId: "p3", quantity: 1 },
  ]);
  const [products, setProducts] = useState(seedProducts);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const stored = window.localStorage.getItem("market-role") as Role | null;
    if (stored === "admin" || stored === "seller" || stored === "customer") setRoleState(stored);
    const storedUser = window.localStorage.getItem("market-user");
    const storedToken = window.localStorage.getItem("market-access-token");
    if (!storedUser || !storedToken) {
      setHydrated(true);
      return;
    }
    try {
      setUser(JSON.parse(storedUser) as AuthUser);
      setAccessToken(storedToken);
    } catch {
      window.localStorage.removeItem("market-user");
      window.localStorage.removeItem("market-access-token");
      setHydrated(true);
      return;
    }
    setHydrated(true);
    authApi
      .getMe(storedToken)
      .then(({ data }) => {
        setUser(data);
        window.localStorage.setItem("market-user", JSON.stringify(data));
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          setUser(null);
          setAccessToken(null);
          window.localStorage.removeItem("market-user");
          window.localStorage.removeItem("market-access-token");
          window.localStorage.removeItem("market-refresh-token");
          window.localStorage.removeItem("market-role");
          setRoleState(null);
        }
      });
  }, []);
  const setRole = (next: Role | null) => {
    setRoleState(next);
    if (next) window.localStorage.setItem("market-role", next);
    else window.localStorage.removeItem("market-role");
  };
  const signIn = (nextUser: AuthUser, tokens: { accessToken: string; refreshToken: string }) => {
    setUser(nextUser);
    setAccessToken(tokens.accessToken);
    window.localStorage.setItem("market-user", JSON.stringify(nextUser));
    window.localStorage.setItem("market-access-token", tokens.accessToken);
    window.localStorage.setItem("market-refresh-token", tokens.refreshToken);
    setRole(nextUser.role);
  };
  const signOut = () => {
    if (accessToken) authApi.logout(accessToken).catch(() => undefined);
    setUser(null);
    setAccessToken(null);
    window.localStorage.removeItem("market-user");
    window.localStorage.removeItem("market-access-token");
    window.localStorage.removeItem("market-refresh-token");
    setRole(null);
  };
  const value = useMemo<AppStateValue>(
    () => ({
      role,
      setRole,
      hydrated,
      user,
      accessToken,
      signIn,
      signOut,
      cart,
      products,
      addToCart: (id, quantity = 1) =>
        setCart((lines) =>
          lines.some((line) => line.productId === id)
            ? lines.map((line) =>
                line.productId === id ? { ...line, quantity: line.quantity + quantity } : line,
              )
            : [...lines, { productId: id, quantity }],
        ),
      updateQuantity: (id, quantity) =>
        setCart((lines) =>
          lines.map((line) =>
            line.productId === id ? { ...line, quantity: Math.max(1, quantity) } : line,
          ),
        ),
      removeFromCart: (id) => setCart((lines) => lines.filter((line) => line.productId !== id)),
      saveProduct: (product) =>
        setProducts((items) =>
          items.some((item) => item.id === product.id)
            ? items.map((item) => (item.id === product.id ? product : item))
            : [product, ...items],
        ),
      deleteProduct: (id) => setProducts((items) => items.filter((item) => item.id !== id)),
    }),
    [role, user, accessToken, hydrated, cart, products],
  );
  return <AppState.Provider value={value}>{children}</AppState.Provider>;
}

export function useAppState() {
  const value = useContext(AppState);
  if (!value) throw new Error("useAppState must be used within AppStateProvider");
  return value;
}
