import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CartLine, CustomerAddress, Order, Product, Role } from "@/lib/marketplace";
import {
  finalPrice,
  orders as seedOrders,
  products as seedProducts,
  seedAddresses,
} from "@/lib/marketplace";
import { authApi, type AuthUser, DEMO_CUSTOMER } from "@/api/auth.api";
import { cartApi, mapBackendCartToCartLines } from "@/api/cart.api";
import { categoryApi, type ActiveCategoryItem } from "@/api/category.api";
import { productApi, mapBackendProductToProduct } from "@/api/product.api";
import { ApiError } from "@/api/client";
import { toast } from "sonner";
import { AppState, type AppStateValue } from "./useAppState";
import { LoginRequiredDialog } from "./Dialogs";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [products, setProducts] = useState(seedProducts);
  const [hydrated, setHydrated] = useState(false);

  // Customer Experience State
  const [wishlist, setWishlist] = useState<string[]>(["p2", "p5"]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(["p1", "p3", "p4"]);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [addresses, setAddresses] = useState<CustomerAddress[]>(seedAddresses);

  useEffect(() => {
    // 1. Role & User
    const storedRole = window.localStorage.getItem("market-role") as Role | null;
    if (storedRole === "admin" || storedRole === "seller" || storedRole === "customer") {
      setRoleState(storedRole);
    }
    const storedUser = window.localStorage.getItem("market-user");
    const storedToken = window.localStorage.getItem("market-access-token");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        window.localStorage.removeItem("market-user");
      }
    } else if (storedRole === "customer") {
      setUser(DEMO_CUSTOMER);
    }

    if (storedToken) {
      setAccessToken(storedToken);
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
    }

    // 2. Wishlist
    const storedWishlist = window.localStorage.getItem("market-wishlist");
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch {
        // use fallback
      }
    }

    // 3. Recently viewed
    const storedRecently = window.localStorage.getItem("market-recently-viewed");
    if (storedRecently) {
      try {
        setRecentlyViewed(JSON.parse(storedRecently));
      } catch {
        // use fallback
      }
    }

    // 4. Orders
    const storedOrders = window.localStorage.getItem("market-orders");
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
      } catch {
        // use fallback
      }
    }

    // 5. Addresses
    const storedAddresses = window.localStorage.getItem("market-addresses");
    if (storedAddresses) {
      try {
        const parsed = JSON.parse(storedAddresses);
        if (Array.isArray(parsed) && parsed.length > 0) setAddresses(parsed);
      } catch {
        // use fallback
      }
    }

    // 6. Cart - only restore for logged-in user with token
    if (storedToken) {
      cartApi
        .get(storedToken)
        .then((backendCart) => {
          if (backendCart && Array.isArray(backendCart.items)) {
            const mapped = mapBackendCartToCartLines(backendCart);
            setCart(mapped);
            window.localStorage.setItem("market-cart", JSON.stringify(mapped));
          }
        })
        .catch(() => {
          const storedCart = window.localStorage.getItem("market-cart");
          if (storedCart) {
            try {
              const parsed = JSON.parse(storedCart);
              if (Array.isArray(parsed)) setCart(parsed);
            } catch {
              // ignore
            }
          }
        });
    } else {
      setCart([]);
      window.localStorage.removeItem("market-cart");
    }

    setHydrated(true);
  }, []);

  const setRole = useCallback((next: Role | null) => {
    setRoleState(next);
    if (next) window.localStorage.setItem("market-role", next);
    else window.localStorage.removeItem("market-role");
  }, []);

  const signIn = useCallback(
    (nextUser: AuthUser, tokens: { accessToken: string; refreshToken: string }) => {
      setUser(nextUser);
      setAccessToken(tokens.accessToken);
      window.localStorage.setItem("market-user", JSON.stringify(nextUser));
      window.localStorage.setItem("market-access-token", tokens.accessToken);
      window.localStorage.setItem("market-refresh-token", tokens.refreshToken);
      setRole(nextUser.role);
      if (nextUser.role === "customer") {
        cartApi
          .get(tokens.accessToken)
          .then((backendCart) => {
            if (backendCart && Array.isArray(backendCart.items)) {
              const mapped = mapBackendCartToCartLines(backendCart);
              setCart(mapped);
              window.localStorage.setItem("market-cart", JSON.stringify(mapped));
            }
          })
          .catch(() => undefined);
      }
    },
    [setRole],
  );

  const updateUser = useCallback(
    (nextUser: AuthUser) => {
      setUser(nextUser);
      window.localStorage.setItem("market-user", JSON.stringify(nextUser));
      if (accessToken) {
        authApi
          .updateProfile({ firstName: nextUser.firstName, lastName: nextUser.lastName }, accessToken)
          .catch(() => undefined);
      }
    },
    [accessToken],
  );

  const signOut = useCallback(() => {
    if (accessToken) authApi.logout(accessToken).catch(() => undefined);
    setUser(null);
    setAccessToken(null);
    setCart([]);
    window.localStorage.removeItem("market-user");
    window.localStorage.removeItem("market-access-token");
    window.localStorage.removeItem("market-refresh-token");
    window.localStorage.removeItem("market-cart");
    setRole(null);
  }, [accessToken, setRole]);

  const addToCart = useCallback(
    async (
      id: string,
      quantity = 1,
      options: { silent?: boolean } = {},
    ) => {
      const token =
        accessToken ||
        (typeof window !== "undefined"
          ? window.localStorage.getItem("market-access-token") ||
            window.localStorage.getItem("accessToken") ||
            window.localStorage.getItem("token")
          : null);

      if (!token) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        }
        setLoginModalOpen(true);
        return null;
      }

      const targetProduct = products.find(
        (p) => p.id === id || p._id === id || p.productId === id,
      );
      const apiProductId = targetProduct?.productId || targetProduct?._id || id;
      const matchIds = new Set(
        [id, targetProduct?.id, targetProduct?._id, targetProduct?.productId].filter(
          (val): val is string => Boolean(val),
        ),
      );

      // Verify whether that product already exists in the user's cart
      const alreadyInCart = cart.some((line) => matchIds.has(line.productId));
      if (alreadyInCart) {
        if (!options.silent) {
          toast.info("Product is already in the cart.");
        }
        return null;
      }

      try {
        const res = await cartApi.addToCart(
          { productId: apiProductId, quantity },
          token,
        );
        if (res && Array.isArray(res.items)) {
          const mapped = mapBackendCartToCartLines(res);
          setCart(mapped);
          window.localStorage.setItem("market-cart", JSON.stringify(mapped));
        } else {
          setCart((lines) => {
            const next = [...lines, { productId: id, quantity }];
            window.localStorage.setItem("market-cart", JSON.stringify(next));
            return next;
          });
        }
        if (!options.silent) {
          toast.success("Product added to cart successfully.");
        }
        return res;
      } catch (error) {
        console.warn("[addToCart API response]", error);
        if (error instanceof ApiError) {
          if (error.message && error.message.toLowerCase().includes("already in the cart")) {
            if (!options.silent) {
              toast.info("Product is already in the cart.");
            }
          } else if (error.status === 400 || error.status === 403 || error.status === 404) {
            toast.error(error.message);
          }
        }
        return null;
      }
    },
    [products, accessToken, cart],
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      const token =
        accessToken ||
        (typeof window !== "undefined"
          ? window.localStorage.getItem("market-access-token") ||
            window.localStorage.getItem("accessToken") ||
            window.localStorage.getItem("token")
          : null);

      if (!token) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        }
        setLoginModalOpen(true);
        return;
      }

      const target = products.find(
        (p) => p.id === id || p._id === id || p.productId === id,
      );
      const apiProductId = target?.productId || target?._id || id;
      const matchIds = new Set(
        [id, target?.id, target?._id, target?.productId].filter(
          (val): val is string => Boolean(val),
        ),
      );

      const desiredQuantity = Math.max(1, quantity);

      setCart((lines) => {
        const next = lines.map((line) =>
          matchIds.has(line.productId)
            ? { ...line, quantity: desiredQuantity }
            : line,
        );
        window.localStorage.setItem("market-cart", JSON.stringify(next));
        return next;
      });

      try {
        const res = await cartApi.updateCartQuantity(apiProductId, desiredQuantity, token);
        if (res && Array.isArray(res.items)) {
          const mapped = mapBackendCartToCartLines(res);
          setCart(mapped);
          window.localStorage.setItem("market-cart", JSON.stringify(mapped));
        }
      } catch (error) {
        console.warn("[updateQuantity API error]", error);
        if (error instanceof ApiError) {
          toast.error(error.message);
        }
      }
    },
    [products, accessToken],
  );

  const removeFromCart = useCallback(
    async (id: string) => {
      const token =
        accessToken ||
        (typeof window !== "undefined"
          ? window.localStorage.getItem("market-access-token") ||
            window.localStorage.getItem("accessToken") ||
            window.localStorage.getItem("token")
          : null);

      if (!token) {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        }
        setLoginModalOpen(true);
        return;
      }

      const target = products.find(
        (p) => p.id === id || p._id === id || p.productId === id,
      );
      const apiProductId = target?.productId || target?._id || id;
      const matchIds = new Set(
        [id, target?.id, target?._id, target?.productId].filter(
          (val): val is string => Boolean(val),
        ),
      );

      setCart((lines) => {
        const next = lines.filter((line) => !matchIds.has(line.productId));
        window.localStorage.setItem("market-cart", JSON.stringify(next));
        return next;
      });
      toast.info("Removed from cart");

      try {
        const res = await cartApi.removeFromCart(apiProductId, token);
        if (res && Array.isArray(res.items)) {
          const mapped = mapBackendCartToCartLines(res);
          setCart(mapped);
          window.localStorage.setItem("market-cart", JSON.stringify(mapped));
        }
      } catch (error) {
        console.warn("[removeFromCart API error]", error);
        if (error instanceof ApiError) {
          toast.error(error.message);
        }
      }
    },
    [products, accessToken],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    window.localStorage.setItem("market-cart", JSON.stringify([]));
  }, []);

  // Customer: Wishlist
  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      window.localStorage.setItem("market-wishlist", JSON.stringify(next));
      if (exists) {
        toast.info("Removed from wishlist");
      } else {
        toast.success("Saved to wishlist");
      }
      return next;
    });
  }, []);

  const isInWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const next = prev.filter((item) => item !== id);
      window.localStorage.setItem("market-wishlist", JSON.stringify(next));
      return next;
    });
    toast.info("Removed from wishlist");
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    window.localStorage.setItem("market-wishlist", JSON.stringify([]));
  }, []);

  // Customer: Recently Viewed
  const addRecentlyViewed = useCallback((id: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item !== id);
      const next = [id, ...filtered].slice(0, 10);
      window.localStorage.setItem("market-recently-viewed", JSON.stringify(next));
      return next;
    });
  }, []);

  // Customer: Create Order
  const createOrder = useCallback(
    (orderData: {
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress: {
        name: string;
        street: string;
        city: string;
        state?: string;
        zip?: string;
        phone?: string;
      };
    }) => {
      const orderItems = orderData.items.map((line) => {
        const product =
          products.find(
            (p) =>
              p.id === line.productId ||
              p._id === line.productId ||
              p.productId === line.productId,
          ) ?? seedProducts[0]!;
        return {
          productId: product.id,
          name: product.name,
          price: finalPrice(product),
          quantity: line.quantity,
          seller: product.storeName || product.seller,
        };
      });

      const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const primaryProduct = orderItems[0]?.name ?? "E-Com Product";
      const primarySeller = orderItems[0]?.seller ?? "E-Com Merchant";

      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customer:
          orderData.shippingAddress.name ||
          (user ? `${user.firstName} ${user.lastName}`.trim() : "Ariana Wells"),
        seller: primarySeller,
        product:
          orderItems.length > 1
            ? `${primaryProduct} + ${orderItems.length - 1} more items`
            : primaryProduct,
        quantity: orderItems.reduce((acc, it) => acc + it.quantity, 0),
        amount: totalAmount,
        payment: "Paid",
        status: "Processing",
        date: "Today",
        items: orderItems,
        shippingAddress: orderData.shippingAddress,
      };

      setOrders((prev) => {
        const next = [newOrder, ...prev];
        window.localStorage.setItem("market-orders", JSON.stringify(next));
        return next;
      });

      // Clear cart
      setCart([]);
      window.localStorage.setItem("market-cart", JSON.stringify([]));

      return newOrder;
    },
    [products, user],
  );

  // Customer: Addresses
  const saveAddress = useCallback((address: CustomerAddress) => {
    setAddresses((prev) => {
      const exists = prev.some((a) => a.id === address.id);
      let next: CustomerAddress[];
      if (address.isDefault) {
        // Demote other defaults
        const clean = prev.map((a) => ({ ...a, isDefault: false }));
        next = exists
          ? clean.map((a) => (a.id === address.id ? address : a))
          : [address, ...clean];
      } else {
        next = exists
          ? prev.map((a) => (a.id === address.id ? address : a))
          : [...prev, address];
      }
      window.localStorage.setItem("market-addresses", JSON.stringify(next));
      return next;
    });
    toast.success("Address saved");
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        const first = filtered[0];
        if (first) {
          filtered[0] = { ...first, isDefault: true };
        }
      }
      window.localStorage.setItem("market-addresses", JSON.stringify(filtered));
      return filtered;
    });
    toast.info("Address deleted");
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) => {
      const next = prev.map((a) => ({ ...a, isDefault: a.id === id }));
      window.localStorage.setItem("market-addresses", JSON.stringify(next));
      return next;
    });
    toast.success("Default address updated");
  }, []);

  const saveProduct = useCallback((product: Product) => {
    setProducts((items) =>
      items.some((item) => item.id === product.id)
        ? items.map((item) => (item.id === product.id ? product : item))
        : [product, ...items],
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((items) => items.filter((item) => item.id !== id));
  }, []);

  const openLoginModal = useCallback(() => setLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setLoginModalOpen(false), []);

  const [categories, setCategories] = useState<ActiveCategoryItem[]>(() =>
    categoryApi.getCachedActive(),
  );

  const refreshCategories = useCallback(async () => {
    try {
      const cats = await categoryApi.listActive();
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
    } catch {
      // Offline fallback
    }
  }, []);

  const hasFetchedInitialProducts = useRef(false);

  const refreshProducts = useCallback(async (options: { forceRefresh?: boolean } = {}) => {
    try {
      const cats = await categoryApi.listActive().catch(() => []);
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
      const items = await productApi.list(options);
      if (Array.isArray(items) && items.length > 0) {
        setProducts(items.map(mapBackendProductToProduct));
      }
    } catch {
      // Offline fallback: keep seed products
    }
  }, []);

  useEffect(() => {
    if (hasFetchedInitialProducts.current) return;
    hasFetchedInitialProducts.current = true;
    refreshProducts();
  }, [refreshProducts]);

  const value = useMemo<AppStateValue>(
    () => ({
      role,
      setRole,
      hydrated,
      user,
      accessToken,
      signIn,
      updateUser,
      signOut,
      loginModalOpen,
      setLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      cart,
      products,
      refreshProducts,
      categories,
      refreshCategories,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      saveProduct,
      deleteProduct,
      wishlist,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      clearWishlist,
      recentlyViewed,
      addRecentlyViewed,
      orders,
      createOrder,
      addresses,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
    }),
    [
      role,
      setRole,
      hydrated,
      user,
      accessToken,
      signIn,
      updateUser,
      signOut,
      loginModalOpen,
      openLoginModal,
      closeLoginModal,
      cart,
      products,
      refreshProducts,
      categories,
      refreshCategories,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      saveProduct,
      deleteProduct,
      wishlist,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      clearWishlist,
      recentlyViewed,
      addRecentlyViewed,
      orders,
      createOrder,
      addresses,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
    ],
  );

  return (
    <AppState.Provider value={value}>
      {children}
      <LoginRequiredDialog />
    </AppState.Provider>
  );
}
