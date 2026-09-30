import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  Heart,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  User,
  UserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DiscountBadge,
  EmptyState,
  OrderStatusBadge,
  OrderStatusTimeline,
  ProductImage,
  ProductPrice,
  RecentlyViewedStrip,
  StockBadge,
} from "./Common";
import { useAppState } from "./useAppState";
import { finalPrice, money, type CustomerAddress, type Order } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

export function CustomerAccount() {
  const {
    user,
    role,
    cart,
    wishlist,
    orders,
    addresses,
    products,
    updateUser,
    signOut,
    addToCart,
    removeFromWishlist,
    clearWishlist,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAppState();

  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName ?? "Ariana");
  const [lastName, setLastName] = useState(user?.lastName ?? "Wells");
  const [email, setEmail] = useState(user?.email ?? "ariana@example.com");
  const [phone, setPhone] = useState(user?.phone ?? "+1 (555) 012-3489");
  const [street, setStreet] = useState(user?.shippingAddress ?? "128 Market Street, Apt 4B");
  const [savingProfile, setSavingProfile] = useState(false);

  // Notification settings state
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [promoNotifs, setPromoNotifs] = useState(false);
  const [securityNotifs, setSecurityNotifs] = useState(true);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Orders Tab Filter & Search
  const [orderFilter, setOrderFilter] = useState<"all" | "active" | "delivered">("all");
  const [orderSearch, setOrderSearch] = useState("");

  // New Address Dialog State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState("Home");
  const [newAddrName, setNewAddrName] = useState(`${firstName} ${lastName}`.trim());
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("San Francisco");
  const [newAddrState, setNewAddrState] = useState("CA");
  const [newAddrZip, setNewAddrZip] = useState("94105");
  const [newAddrPhone, setNewAddrPhone] = useState(phone);
  const [newAddrDefault, setNewAddrDefault] = useState(false);

  const fullName = `${user?.firstName ?? firstName} ${user?.lastName ?? lastName}`.trim() || "Ariana Wells";
  const userInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AW";

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      orderFilter === "all"
        ? true
        : orderFilter === "active"
          ? ["Pending", "Confirmed", "Processing", "Shipped"].includes(order.status)
          : order.status === "Delivered";

    const matchesSearch =
      !orderSearch.trim() ||
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.product.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.seller.toLowerCase().includes(orderSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Most recent order for spotlight
  const latestOrder: Order | undefined = orders[0];

  // Wishlist products
  const wishlistProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[0] => Boolean(p));

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      if (user) {
        updateUser({
          ...user,
          firstName,
          lastName,
          email,
          phone,
          shippingAddress: street,
        });
      }
      setSavingProfile(false);
      toast.success("Profile information updated successfully!");
    }, 400);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    }, 500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) {
      toast.error("Street address is required");
      return;
    }
    const newAddress: CustomerAddress = {
      id: `addr-${Date.now()}`,
      label: newAddrLabel || "Other",
      isDefault: newAddrDefault || addresses.length === 0,
      name: newAddrName || fullName,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      zip: newAddrZip,
      country: "United States",
      phone: newAddrPhone || phone,
    };
    saveAddress(newAddress);
    setAddressModalOpen(false);
    setNewAddrStreet("");
    setNewAddrDefault(false);
  };

  const handleBuyAgain = async (productId?: string) => {
    if (!productId) return;
    await addToCart(productId, 1);
  };

  const handleMoveAllToCart = () => {
    if (wishlistProducts.length === 0) return;
    wishlistProducts.forEach((p) => {
      if (p.stock > 0) addToCart(p.id, 1, { silent: true });
    });
    clearWishlist();
    toast.success(`Moved ${wishlistProducts.length} item(s) to your cart!`);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header Hero Card */}
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm md:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="grid size-18 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 font-display text-2xl font-black text-primary-foreground shadow-md ring-4 ring-background">
              {userInitials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl font-black tracking-tight md:text-3xl">
                  {fullName}
                </h1>
                <Badge variant="secondary" className="gap-1 font-semibold text-xs">
                  <CheckCircle2 className="size-3 text-primary" /> Verified Buyer
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" /> Customer since May 2026
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" /> San Francisco, CA
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="gap-1.5 font-semibold">
              <Link to="/shop">
                <ShoppingBag className="size-4" /> Browse Shop
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-destructive"
              onClick={() => {
                signOut();
                navigate({ to: "/shop" });
                toast.info("You have signed out.");
              }}
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>

        {/* Quick Stat Tiles */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 border-t pt-6">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className="flex flex-col rounded-xl border bg-surface/50 p-4 text-left transition-all hover:bg-surface hover:shadow-xs"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Orders
            </span>
            <span className="mt-1 font-display text-2xl font-black text-foreground">
              {orders.length}
            </span>
            <span className="mt-1 text-[11px] text-primary font-medium flex items-center gap-1">
              View history <ArrowRight className="size-3" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wishlist")}
            className="flex flex-col rounded-xl border bg-surface/50 p-4 text-left transition-all hover:bg-surface hover:shadow-xs"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Wishlist Items
            </span>
            <span className="mt-1 font-display text-2xl font-black text-foreground">
              {wishlist.length}
            </span>
            <span className="mt-1 text-[11px] text-primary font-medium flex items-center gap-1">
              Manage saved <ArrowRight className="size-3" />
            </span>
          </button>

          <Link
            to="/cart"
            className="flex flex-col rounded-xl border bg-surface/50 p-4 text-left transition-all hover:bg-surface hover:shadow-xs"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cart Items
            </span>
            <span className="mt-1 font-display text-2xl font-black text-foreground">
              {cartCount}
            </span>
            <span className="mt-1 text-[11px] text-primary font-medium flex items-center gap-1">
              Go to checkout <ArrowRight className="size-3" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className="flex flex-col rounded-xl border bg-surface/50 p-4 text-left transition-all hover:bg-surface hover:shadow-xs"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Addresses
            </span>
            <span className="mt-1 font-display text-2xl font-black text-foreground">
              {addresses.length}
            </span>
            <span className="mt-1 text-[11px] text-primary font-medium flex items-center gap-1">
              Shipping destinations <ArrowRight className="size-3" />
            </span>
          </button>
        </div>
      </section>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-1 hide-scrollbar">
          <TabsList className="inline-flex h-11 w-full justify-start gap-1 rounded-xl bg-muted/60 p-1 sm:w-auto">
            <TabsTrigger value="overview" className="gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold sm:text-sm">
              <LayoutDashboard className="size-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold sm:text-sm">
              <Package className="size-4" /> My Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold sm:text-sm">
              <Heart className="size-4" /> Wishlist ({wishlist.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold sm:text-sm">
              <UserRound className="size-4" /> Profile & Settings
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold sm:text-sm">
              <MapPin className="size-4" /> Addresses ({addresses.length})
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold sm:text-sm">
              <ShieldCheck className="size-4" /> Security
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Latest Order Spotlight */}
          {latestOrder && (
            <div className="panel overflow-hidden border-primary/20 bg-gradient-to-r from-card to-primary/5 p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                      LATEST ORDER
                    </span>
                    <OrderStatusBadge status={latestOrder.status} />
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold">
                    Order {latestOrder.id} • {latestOrder.product}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Placed on {latestOrder.date} • Total: <strong>{money(latestOrder.amount)}</strong> via {latestOrder.payment}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm">
                    <Link to="/orders/$id" params={{ id: latestOrder.id }}>
                      Track delivery <Truck className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBuyAgain(latestOrder.items?.[0]?.productId ?? "p1")}
                  >
                    Buy again
                  </Button>
                </div>
              </div>

              <div className="mt-6 border-t pt-5">
                <OrderStatusTimeline status={latestOrder.status} />
              </div>
            </div>
          )}

          {/* Shortcuts & Address Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Actions Card */}
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold">Customer Quick Actions</h3>
                <Sparkles className="size-4 text-primary" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Everyday shortcuts to keep your shopping effortless.
              </p>

              <div className="mt-4 grid gap-2.5">
                <Link
                  to="/shop"
                  className="flex items-center justify-between rounded-lg border bg-surface/60 p-3 text-sm font-semibold transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="size-4 text-primary" /> Browse Curated Marketplace
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center justify-between rounded-lg border bg-surface/60 p-3 text-sm font-semibold transition-colors hover:bg-surface"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingCart className="size-4 text-primary" /> Review Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveTab("wishlist")}
                  className="flex items-center justify-between rounded-lg border bg-surface/60 p-3 text-sm font-semibold transition-colors hover:bg-surface text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="size-4 text-destructive" /> View Saved Wishlist ({wishlist.length} items)
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className="flex items-center justify-between rounded-lg border bg-surface/60 p-3 text-sm font-semibold transition-colors hover:bg-surface text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <User className="size-4 text-primary" /> Update Shipping & Contact Details
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Default Shipping Address Card */}
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold">Default Delivery Address</h3>
                <Badge variant="outline" className="text-xs">Primary</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Orders will ship to this address during one-click checkout.
              </p>

              {addresses.find((a) => a.isDefault) || addresses[0] ? (
                (() => {
                  const addr = addresses.find((a) => a.isDefault) || addresses[0];
                  return (
                    <div className="mt-4 rounded-lg border bg-surface/40 p-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{addr.label}</span>
                        <span className="text-xs text-muted-foreground">{addr.phone}</span>
                      </div>
                      <p className="mt-2 font-medium text-foreground">{addr.name}</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {addr.street}
                        <br />
                        {addr.city}, {addr.state} {addr.zip}
                        <br />
                        {addr.country}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("addresses")}
                        >
                          Change address
                        </Button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="mt-4 rounded-lg border border-dashed p-6 text-center">
                  <MapPin className="mx-auto size-6 text-muted-foreground" />
                  <p className="mt-2 text-xs text-muted-foreground">No saved address yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => setActiveTab("addresses")}
                  >
                    Add address
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Recently Viewed Products strip */}
          <RecentlyViewedStrip title="Pick Up Where You Left Off" />
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: ORDERS HISTORY */}
        {/* ========================================================================= */}
        <TabsContent value="orders" className="mt-6 space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-bold">Order History & Tracking</h2>
              <p className="text-xs text-muted-foreground">
                Review your past orders, delivery updates, and re-order favorites.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order or product..."
                  className="h-9 w-60 pl-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Status filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Button
              variant={orderFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrderFilter("all")}
              className="text-xs h-8"
            >
              All orders ({orders.length})
            </Button>
            <Button
              variant={orderFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrderFilter("active")}
              className="text-xs h-8"
            >
              Active / In Transit
            </Button>
            <Button
              variant={orderFilter === "delivered" ? "default" : "outline"}
              size="sm"
              onClick={() => setOrderFilter("delivered")}
              className="text-xs h-8"
            >
              Delivered
            </Button>
          </div>

          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={<Package className="size-6" />}
              title="No orders found"
              description={
                orderSearch
                  ? "No orders matched your search criteria. Try a different term or clear filters."
                  : "You haven't placed any orders in this category yet. Explore products in the shop!"
              }
              action={
                <Button asChild size="sm">
                  <Link to="/shop">Start shopping</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((order) => {
                const sampleProduct =
                  products.find((p) => order.items?.some((i) => i.productId === p.id)) ||
                  products[0];

                return (
                  <div
                    key={order.id}
                    className="panel overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    {/* Order Header bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-5 py-3.5 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                            ORDER PLACED
                          </span>
                          <p className="text-foreground font-medium">{order.date}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                            TOTAL
                          </span>
                          <p className="font-bold text-foreground">{money(order.amount)}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                            SHIP TO
                          </span>
                          <p className="font-medium text-foreground">{order.customer}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {order.id}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                          <ProductImage
                            product={sampleProduct}
                            className="size-16 shrink-0 rounded-lg border object-cover"
                          />
                          <div>
                            <h4 className="font-display font-bold text-foreground">
                              {order.product}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Sold by <span className="font-semibold">{order.seller}</span> • Quantity: {order.quantity}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-primary">
                              Payment: {order.payment}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button asChild variant="outline" size="sm" className="font-semibold">
                            <Link to="/orders/$id" params={{ id: order.id }}>
                              View details & tracking
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleBuyAgain(
                                order.items?.[0]?.productId ?? sampleProduct.id,
                              )
                            }
                          >
                            Buy again
                          </Button>
                        </div>
                      </div>

                      {/* Mini Timeline bar */}
                      <div className="mt-4 border-t pt-4">
                        <OrderStatusTimeline status={order.status} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: WISHLIST */}
        {/* ========================================================================= */}
        <TabsContent value="wishlist" className="mt-6 space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-bold">Saved Wishlist</h2>
              <p className="text-xs text-muted-foreground">
                Items you loved and saved for later. Ready to add to cart whenever you want!
              </p>
            </div>
            {wishlistProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleMoveAllToCart}
                  className="gap-1.5 font-semibold"
                >
                  <ShoppingCart className="size-4" /> Move all to cart
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {wishlistProducts.length === 0 ? (
            <EmptyState
              icon={<Heart className="size-6 text-destructive" />}
              title="Your wishlist is empty"
              description="Browse the marketplace and tap the heart icon on any product to save it here."
              action={
                <Button asChild size="sm">
                  <Link to="/shop">Explore products</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <ProductImage
                      product={product}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-2.5 top-2.5">
                      <DiscountBadge discount={product.discount} />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      title="Remove from wishlist"
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-background/90 text-destructive shadow-xs backdrop-blur-md transition-transform hover:scale-110"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-primary truncate">{product.category}</p>
                        <StockBadge stock={product.stock} />
                      </div>
                      <h3
                        className="mt-1.5 font-display text-base font-bold text-foreground leading-snug line-clamp-2"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">by {product.storeName || product.seller}</p>
                    </div>

                    <div className="mt-auto pt-4">
                      <ProductPrice product={product} />

                      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                        <Button
                          size="sm"
                          disabled={!product.stock}
                          onClick={() => {
                            addToCart(product.id);
                            removeFromWishlist(product.id);
                          }}
                          className="font-semibold"
                        >
                          <ShoppingCart className="size-3.5 mr-1" /> Move to cart
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link to="/products/$id" params={{ id: product.productId || product.id }}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 4: PROFILE & SETTINGS */}
        {/* ========================================================================= */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Personal Details Form */}
            <form onSubmit={handleProfileSubmit} className="panel space-y-6 p-6">
              <div>
                <h3 className="font-display text-lg font-bold">Personal Information</h3>
                <p className="text-xs text-muted-foreground">
                  Update your name, contact details, and default delivery address.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3489"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="street">Default delivery address</Label>
                  <Input
                    id="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="128 Market Street, Apt 4B, San Francisco, CA 94105"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-xs text-muted-foreground">
                  Saved changes reflect immediately across checkout.
                </span>
                <Button type="submit" disabled={savingProfile} className="font-semibold">
                  {savingProfile ? (
                    <>
                      <RefreshCw className="size-4 animate-spin mr-1.5" /> Saving...
                    </>
                  ) : (
                    "Save profile changes"
                  )}
                </Button>
              </div>
            </form>

            {/* Notification & Communication Preferences */}
            <div className="panel space-y-5 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <Bell className="size-4 text-primary" />
                  <h3 className="font-display text-base font-bold">Preferences</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose what updates you want to receive.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orderNotifs}
                    onChange={(e) => setOrderNotifs(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-semibold text-foreground">Order Tracking Alerts</span>
                    <p className="text-xs text-muted-foreground">
                      Get email notifications whenever order status changes.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={promoNotifs}
                    onChange={(e) => setPromoNotifs(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-semibold text-foreground">Special Deals & Offers</span>
                    <p className="text-xs text-muted-foreground">
                      Receive weekly curated discounts on your wishlist brands.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityNotifs}
                    onChange={(e) => setSecurityNotifs(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="font-semibold text-foreground">Security Notices</span>
                    <p className="text-xs text-muted-foreground">
                      Alerts for new logins and account password updates.
                    </p>
                  </div>
                </label>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold"
                onClick={() => toast.success("Notification preferences saved!")}
              >
                Update preferences
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 5: ADDRESSES */}
        {/* ========================================================================= */}
        <TabsContent value="addresses" className="mt-6 space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-bold">Saved Shipping Destinations</h2>
              <p className="text-xs text-muted-foreground">
                Manage your home, office, and gift delivery addresses.
              </p>
            </div>

            <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 font-semibold">
                  <Plus className="size-4" /> Add new address
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleAddAddress}>
                  <DialogHeader>
                    <DialogTitle>Add Shipping Address</DialogTitle>
                    <DialogDescription>
                      Save a destination for fast one-click checkout.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-4 grid gap-3.5 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="addrLabel">Label</Label>
                        <Input
                          id="addrLabel"
                          value={newAddrLabel}
                          onChange={(e) => setNewAddrLabel(e.target.value)}
                          placeholder="Home, Office, etc."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="addrName">Recipient name</Label>
                        <Input
                          id="addrName"
                          value={newAddrName}
                          onChange={(e) => setNewAddrName(e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="addrStreet">Street address</Label>
                      <Input
                        id="addrStreet"
                        value={newAddrStreet}
                        onChange={(e) => setNewAddrStreet(e.target.value)}
                        placeholder="128 Market Street, Apt 4B"
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label htmlFor="addrCity">City</Label>
                        <Input
                          id="addrCity"
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="addrState">State</Label>
                        <Input
                          id="addrState"
                          value={newAddrState}
                          onChange={(e) => setNewAddrState(e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="addrZip">ZIP Code</Label>
                        <Input
                          id="addrZip"
                          value={newAddrZip}
                          onChange={(e) => setNewAddrZip(e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="addrPhone">Phone number</Label>
                      <Input
                        id="addrPhone"
                        value={newAddrPhone}
                        onChange={(e) => setNewAddrPhone(e.target.value)}
                        placeholder="+1 (555) 012-3489"
                        className="mt-1"
                      />
                    </div>

                    <label className="flex items-center gap-2 pt-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAddrDefault}
                        onChange={(e) => setNewAddrDefault(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Make this my default shipping address</span>
                    </label>
                  </div>

                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddressModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save address</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={cn(
                  "panel relative flex flex-col justify-between p-5 transition-all",
                  addr.isDefault && "border-primary/40 bg-primary/5",
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span className="font-display font-bold">{addr.label}</span>
                    </div>
                    {addr.isDefault && (
                      <Badge className="bg-primary text-primary-foreground text-[10px]">
                        Default
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-foreground">{addr.name}</p>
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} {addr.zip}
                    </p>
                    <p>{addr.country}</p>
                    <p className="mt-2 text-xs font-mono">{addr.phone}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t pt-3">
                  {!addr.isDefault ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setDefaultAddress(addr.id)}
                    >
                      Set as default
                    </Button>
                  ) : (
                    <span className="text-xs text-primary font-medium">Default destination</span>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive size-8"
                    onClick={() => deleteAddress(addr.id)}
                    title="Delete address"
                    aria-label={`Delete ${addr.label} address`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 6: SECURITY */}
        {/* ========================================================================= */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Password Change */}
            <form onSubmit={handlePasswordSubmit} className="panel space-y-5 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <KeyRound className="size-4 text-primary" />
                  <h3 className="font-display text-base font-bold">Change Password</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Keep your account safe by updating your password periodically.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="currPass">Current password</Label>
                  <Input
                    id="currPass"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="newPass">New password</Label>
                  <Input
                    id="newPass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confPass">Confirm new password</Label>
                  <Input
                    id="confPass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button type="submit" disabled={savingPassword} className="font-semibold">
                {savingPassword ? "Updating password..." : "Update password"}
              </Button>
            </form>

            {/* Session Info & Account Management */}
            <div className="panel space-y-5 p-6">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <h3 className="font-display text-base font-bold">Account Status</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Overview of your authentication and session details.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2.5">
                  <span className="text-muted-foreground">Account Role</span>
                  <span className="font-bold capitalize">{role ?? "Customer"}</span>
                </div>
                <div className="flex justify-between border-b pb-2.5">
                  <span className="text-muted-foreground">Email Verification</span>
                  <span className="font-semibold text-primary flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Verified
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2.5">
                  <span className="text-muted-foreground">Two-Factor Authentication</span>
                  <span className="text-muted-foreground">Not configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Session</span>
                  <span className="font-medium text-foreground">Active Now</span>
                </div>
              </div>

              <Separator />

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Sign out of E-Com
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can sign back in anytime to access your orders and saved wishlist.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4 gap-1.5 font-semibold"
                  onClick={() => {
                    signOut();
                    navigate({ to: "/shop" });
                    toast.info("Signed out successfully.");
                  }}
                >
                  <LogOut className="size-4" /> Sign out of account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
