import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Heart,
  Package,
  PackageCheck,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categories, finalPrice, money, products as seedProducts } from "@/lib/marketplace";
import {
  BackLink,
  CustomerNavStrip,
  DiscountBadge,
  EmptyState,
  OrderStatusBadge,
  OrderStatusTimeline,
  PageHeader,
  Pagination,
  ProductGrid,
  ProductImage,
  ProductPrice,
  QuantityControl,
  RecentlyViewedStrip,
  SearchInput,
  StockBadge,
} from "./Common";
import { useAppState } from "./useAppState";
import { CustomerAccount } from "./CustomerAccount";
import { Navbar } from "./Shells";
import { Footer } from "./Footer";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HomePage() {
  const featured = seedProducts.slice(0, 4);
  const discounted = seedProducts.filter((p) => p.discount > 0).slice(0, 4);
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b bg-surface">
          <div className="page-shell grid min-h-[520px] items-center gap-10 py-14 lg:grid-cols-[1.05fr_.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-bold text-primary shadow-xs">
                CURATED INDEPENDENT BRANDS
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl tracking-tight">
                Remarkable goods, thoughtfully gathered.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
                Shop considered essentials from trusted independent sellers—all in one modern
                marketplace.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="font-semibold shadow-sm">
                  <Link to="/shop">
                    Shop now <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/register">Start selling</Link>
                </Button>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t pt-6">
                <div>
                  <p className="font-display text-xl font-extrabold">40+</p>
                  <p className="text-xs text-muted-foreground">Independent sellers</p>
                </div>
                <div>
                  <p className="font-display text-xl font-extrabold">2.4k</p>
                  <p className="text-xs text-muted-foreground">Curated products</p>
                </div>
                <div>
                  <p className="font-display text-xl font-extrabold">4.9/5</p>
                  <p className="text-xs text-muted-foreground">Buyer satisfaction</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="subtle-grid rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="grid grid-cols-2 gap-3.5">
                {seedProducts.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    to="/products/$id"
                    params={{ id: product.id }}
                    className="group relative overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-md hover:border-primary/40"
                  >
                    <ProductImage
                      product={product}
                      className="aspect-square transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 right-2 rounded-md bg-card/90 px-2.5 py-1.5 text-xs font-bold backdrop-blur-md shadow-xs">
                      {product.name}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        <section className="page-shell py-10">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <Button asChild variant="secondary">
              <Link to="/shop">All products</Link>
            </Button>
            {categories.map((category) => (
              <Button key={category} asChild variant="outline">
                <Link to="/shop">{category}</Link>
              </Button>
            ))}
          </div>
        </section>
        <section className="page-shell pb-16">
          <PageHeader
            eyebrow="Editor’s picks"
            title="Featured products"
            action={
              <Button asChild variant="ghost">
                <Link to="/shop">
                  View all <ArrowRight />
                </Link>
              </Button>
            }
          />
          <ProductGrid products={featured} />
        </section>
        <section className="border-y bg-surface">
          <div className="page-shell py-16">
            <PageHeader
              eyebrow="Limited offers"
              title="Worth a closer look"
              description="Selected products with considered prices while stock lasts."
            />
            <ProductGrid products={discounted} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function ShopPage() {
  const { products } = useAppState();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [stock, setStock] = useState("All");
  const [sort, setSort] = useState("featured");
  const [discounted, setDiscounted] = useState(false);
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === "All" || p.category === category) &&
            (stock === "All" || (stock === "available" ? p.stock > 0 : p.stock === 0)) &&
            (!discounted || p.discount > 0),
        )
        .sort((a, b) =>
          sort === "price-low"
            ? finalPrice(a) - finalPrice(b)
            : sort === "price-high"
              ? finalPrice(b) - finalPrice(a)
              : b.discount - a.discount,
        ),
    [products, search, category, stock, sort, discounted],
  );
  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="shop" />
        <PageHeader
          eyebrow="Marketplace"
          title="Shop all products"
          description={`${filtered.length} curated products from independent sellers.`}
        />
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="panel h-fit p-5">
            <div className="mb-5 flex items-center gap-2 font-display font-bold">
              <SlidersHorizontal className="size-4" /> Filters
            </div>
            <div className="grid gap-5">
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All categories</SelectItem>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Availability</Label>
                <Select value={stock} onValueChange={setStock}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All stock</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="out">Out of stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Maximum price</Label>
                <Input type="number" placeholder="$250" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={discounted}
                  onChange={(e) => setDiscounted(e.target.checked)}
                  className="size-4 accent-primary"
                />{" "}
                On sale only
              </label>
              <Button
                variant="outline"
                onClick={() => {
                  setCategory("All");
                  setStock("All");
                  setDiscounted(false);
                  setSearch("");
                }}
              >
                Clear filters
              </Button>
            </div>
          </aside>
          <div>
            <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_190px]">
              <SearchInput value={search} onChange={setSearch} />
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: low to high</SelectItem>
                  <SelectItem value="price-high">Price: high to low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filtered.length ? (
              <ProductGrid products={filtered} />
            ) : (
              <EmptyState
                title="No products found"
                description="Try adjusting your search or filters."
              />
            )}
            <Pagination />
          </div>
        </div>
        <RecentlyViewedStrip />
      </main>
      <Footer />
    </>
  );
}

export function ProductDetailsPage({ id }: { id: string }) {
  const { products, addToCart, isInWishlist, toggleWishlist, addRecentlyViewed } = useAppState();
  const product =
    products.find((item) => item.id === id) ??
    seedProducts.find((item) => item.id === id) ??
    seedProducts[0];
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product?.id, addRecentlyViewed]);

  if (!product) return null;
  const isWishlisted = isInWishlist(product.id);

  return (
    <>
      <Navbar />
      <main className="page-shell py-8">
        <CustomerNavStrip current="shop" />
        <BackLink to="/shop" label="Back to shop" />
        <div className="grid gap-9 lg:grid-cols-2">
          <ProductImage product={product} className="aspect-square rounded-lg border" />
          <div className="flex flex-col justify-center">
            <div className="flex gap-2">
              <DiscountBadge discount={product.discount} />
              <StockBadge stock={product.stock} />
            </div>
            <p className="mt-5 text-sm font-bold text-primary">{product.category}</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sold by <span className="font-semibold text-foreground">{product.seller}</span>
            </p>
            <p className="mt-6 leading-7 text-muted-foreground">{product.description}</p>
            <div className="mt-6">
              <ProductPrice product={product} large />
            </div>
            <Separator className="my-7" />
            <div>
              <Label>Quantity</Label>
              <div className="mt-2">
                <QuantityControl value={quantity} onChange={setQuantity} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                disabled={!product.stock}
                onClick={() => addToCart(product.id, quantity)}
                className="flex-1 font-semibold"
              >
                <ShoppingBag /> Add to cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                disabled={!product.stock}
                onClick={() => {
                  addToCart(product.id, quantity);
                  navigate({ to: "/checkout" });
                }}
                className="flex-1 font-semibold"
              >
                Buy now
              </Button>
              <Button
                size="lg"
                variant={isWishlisted ? "default" : "outline"}
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "gap-1.5 font-semibold",
                  isWishlisted && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                )}
                aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart className={cn("size-4", isWishlisted && "fill-current")} />
                {isWishlisted ? "Saved" : "Wishlist"}
              </Button>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-muted p-4">
                <Truck className="size-5 text-primary" />
                <p className="mt-2 text-sm font-bold">Tracked delivery</p>
                <p className="text-xs text-muted-foreground">Status updates at every step</p>
              </div>
              <div className="rounded-md bg-muted p-4">
                <ShieldCheck className="size-5 text-primary" />
                <p className="mt-2 text-sm font-bold">Secure checkout</p>
                <p className="text-xs text-muted-foreground">Stripe-ready payment flow</p>
              </div>
            </div>
          </div>
        </div>

        <RecentlyViewedStrip title="You Might Also Like" />
      </main>
      <Footer />
    </>
  );
}

export function CartPage() {
  const { cart, products, updateQuantity, removeFromCart, clearCart, role } = useAppState();
  const lines = cart.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + finalPrice(line.product) * line.quantity, 0);

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const diff = FREE_SHIPPING_THRESHOLD - total;

  if (!lines.length)
    return (
      <>
        <Navbar />
        <main className="page-shell py-12">
          <CustomerNavStrip current="cart" />
          <EmptyState
            icon={<ShoppingBag className="size-8 text-muted-foreground" />}
            title="Your cart is empty"
            description="Explore the marketplace and discover thoughtful goods from independent sellers."
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button asChild>
                  <Link to="/shop">Browse products</Link>
                </Button>
                {role === "customer" && (
                  <Button asChild variant="outline">
                    <Link to="/profile">View saved wishlist</Link>
                  </Button>
                )}
              </div>
            }
          />
          <RecentlyViewedStrip title="Recommended For You" />
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="cart" />
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-2xl font-extrabold md:text-3xl tracking-tight">
              Shopping cart
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {lines.length} {lines.length === 1 ? "product" : "products"} ready for checkout.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="w-fit text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5 mr-1" /> Clear cart
          </Button>
        </div>

        {/* Free shipping progress alert */}
        <div className="mb-6 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-foreground">
              <Truck className="size-4 text-primary" />
              {diff <= 0
                ? "You have unlocked Free Standard Delivery!"
                : `Add ${money(diff)} more to unlock Free Delivery!`}
            </span>
            <span className="text-muted-foreground">{progressPercent}%</span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="panel divide-y">
            {lines.map((line) => (
              <div
                key={line.productId}
                className="grid grid-cols-[88px_1fr] gap-4 p-4 sm:grid-cols-[104px_1fr_auto]"
              >
                <ProductImage product={line.product} className="aspect-square rounded-md" />
                <div>
                  <h2 className="font-display font-bold">{line.product.name}</h2>
                  <p className="text-xs text-muted-foreground">{line.product.seller}</p>
                  <div className="mt-2">
                    <ProductPrice product={line.product} />
                  </div>
                  <div className="mt-3 sm:hidden">
                    <QuantityControl
                      value={line.quantity}
                      onChange={(value) => updateQuantity(line.productId, value)}
                    />
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end">
                  <div className="hidden sm:block">
                    <QuantityControl
                      value={line.quantity}
                      onChange={(value) => updateQuantity(line.productId, value)}
                    />
                  </div>
                  <p className="font-bold">{money(finalPrice(line.product) * line.quantity)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeFromCart(line.productId)}
                  >
                    <Trash2 className="size-4" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Summary
            subtotal={subtotal}
            total={total}
            action={
              <Button asChild size="lg" className="w-full font-semibold">
                <Link to="/checkout">
                  Proceed to checkout <ArrowRight />
                </Link>
              </Button>
            }
          />
        </div>

        <RecentlyViewedStrip title="You Might Also Like" />
      </main>
      <Footer />
    </>
  );
}

export function CheckoutPage() {
  const { cart, products, user, addresses, createOrder } = useAppState();
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  const [customerName, setCustomerName] = useState(
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || defaultAddr?.name || "Ariana Wells",
  );
  const [customerEmail, setCustomerEmail] = useState(user?.email || "ariana@example.com");
  const [customerPhone, setCustomerPhone] = useState(
    user?.phone || defaultAddr?.phone || "+1 (555) 012-3489",
  );
  const [shippingStreet, setShippingStreet] = useState(
    user?.shippingAddress || defaultAddr?.street || "128 Market Street, Apt 4B",
  );
  const [shippingCity, setShippingCity] = useState(defaultAddr?.city || "San Francisco");
  const [shippingState, setShippingState] = useState(defaultAddr?.state || "CA");
  const [shippingZip, setShippingZip] = useState(defaultAddr?.zip || "94105");

  const total = cart.reduce((sum, line) => {
    const p = products.find((item) => item.id === line.productId);
    return sum + (p ? finalPrice(p) * line.quantity : 0);
  }, 0);
  const navigate = useNavigate();

  const handleCheckout = (event: React.FormEvent) => {
    event.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const order = createOrder({
      items: cart,
      shippingAddress: {
        name: customerName,
        street: shippingStreet,
        city: shippingCity,
        state: shippingState,
        zip: shippingZip,
        phone: customerPhone,
      },
    });
    toast.success("Order placed successfully! Delivery tracking initialized.");
    navigate({ to: "/orders/$id", params: { id: order.id } });
  };

  if (!cart.length) {
    return (
      <>
        <Navbar />
        <main className="page-shell py-12">
          <CustomerNavStrip current="cart" />
          <EmptyState
            icon={<ShoppingBag className="size-8 text-muted-foreground" />}
            title="No items in checkout"
            description="Your cart is currently empty. Explore products to place an order."
            action={
              <Button asChild>
                <Link to="/shop">Shop marketplace</Link>
              </Button>
            }
          />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="cart" />
        <PageHeader
          title="Checkout"
          description="Complete your shipping details and proceed to secure order placement."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <form className="panel grid gap-5 p-6" onSubmit={handleCheckout}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Delivery destination</h2>
              {addresses.length > 0 && (
                <span className="text-xs text-primary font-medium">Using saved address</span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                placeholder="Ariana Wells"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Field
                label="Email"
                type="email"
                placeholder="ariana@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <Field
                label="Phone"
                placeholder="+1 555 012 3489"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
              <Field
                label="City & State"
                placeholder="San Francisco, CA"
                value={`${shippingCity}, ${shippingState}`}
                onChange={(e) => {
                  const parts = e.target.value.split(",");
                  setShippingCity(parts[0]?.trim() || "");
                  if (parts[1]) setShippingState(parts[1].trim());
                }}
              />
              <div className="sm:col-span-2">
                <Field
                  label="Shipping street address"
                  placeholder="128 Market Street, Apt 4B"
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2 rounded-lg border bg-surface/40 p-4 text-xs text-muted-foreground flex items-center gap-3">
              <ShieldCheck className="size-5 text-primary shrink-0" />
              <span>
                Simulated Stripe Payment: Placing this order generates real tracking records in your
                account.
              </span>
            </div>

            <Button type="submit" size="lg" className="w-full font-semibold">
              <CreditCard className="size-4" /> Place Order ({money(total)})
            </Button>
          </form>

          <div className="panel h-fit p-6">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <div className="mt-5 grid gap-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((line) => {
                const p = products.find((item) => item.id === line.productId);
                return p ? (
                  <div key={line.productId} className="flex gap-3">
                    <ProductImage product={p} className="size-16 shrink-0 rounded-md border" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.seller} · Qty {line.quantity}
                      </p>
                      <p className="mt-1 text-sm font-semibold">{money(finalPrice(p) * line.quantity)}</p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
            <Separator className="my-5" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-semibold text-success-foreground">Free</span>
            </div>
            <div className="mt-2 flex justify-between font-display text-lg font-extrabold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function OrdersPage() {
  const { orders, addToCart } = useAppState();
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((order) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
          ? ["Pending", "Confirmed", "Processing", "Shipped"].includes(order.status)
          : order.status === "Delivered";

    const matchesSearch =
      !search.trim() ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.seller.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="orders" />
        <PageHeader
          title="My orders"
          description="Track every purchase, view delivery milestones, and re-order goods."
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/shop">
                <ShoppingBag className="size-4 mr-1.5" /> Continue shopping
              </Link>
            </Button>
          }
        />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="text-xs h-8"
            >
              All orders ({orders.length})
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
              className="text-xs h-8"
            >
              Active / In Transit
            </Button>
            <Button
              variant={filter === "delivered" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("delivered")}
              className="text-xs h-8"
            >
              Delivered
            </Button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="size-8 text-muted-foreground" />}
            title="No orders found"
            description="You don't have any orders matching the selected filter."
            action={
              <Button asChild size="sm">
                <Link to="/shop">Start shopping</Link>
              </Button>
            }
          />
        ) : (
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="border-b bg-muted/60">
                  <tr>
                    {["Order", "Date", "Products", "Total", "Payment", "Status", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-4 font-mono font-bold text-foreground">{order.id}</td>
                      <td className="px-4 py-4 text-muted-foreground">{order.date}</td>
                      <td className="px-4 py-4 font-medium">
                        <div>{order.product}</div>
                        <span className="text-xs text-muted-foreground">from {order.seller}</span>
                      </td>
                      <td className="px-4 py-4 font-bold">{money(order.amount)}</td>
                      <td className="px-4 py-4">{order.payment}</td>
                      <td className="px-4 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to="/orders/$id" params={{ id: order.id }}>
                              View details
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              addToCart(order.items?.[0]?.productId ?? "p1", 1);
                              toast.success("Added to cart! Ready for checkout.");
                            }}
                          >
                            Buy again
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export function OrderPage({ id }: { id: string }) {
  const { orders, products, addToCart } = useAppState();
  const order = orders.find((item) => item.id === id) ?? orders[0];
  const sampleProduct =
    products.find(
      (p) => order?.items?.some((i) => i.productId === p.id) || p.name === order?.product,
    ) ?? products[0];

  if (!order) return null;

  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="orders" />
        <BackLink to="/orders" label="Back to orders" />
        <PageHeader
          title={`Order ${order.id}`}
          description={`Placed on ${order.date}`}
          action={
            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order.status} />
              <Button
                size="sm"
                onClick={() => {
                  addToCart(order.items?.[0]?.productId ?? sampleProduct.id, 1);
                  toast.success("Added to cart! Ready for checkout.");
                }}
              >
                Buy again
              </Button>
            </div>
          }
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="panel p-6">
            <h2 className="font-display text-lg font-bold">Order progress & tracking</h2>
            <div className="mt-8">
              <OrderStatusTimeline status={order.status} />
            </div>
            <Separator className="my-7" />
            <h2 className="font-display text-lg font-bold">Ordered items</h2>
            <div className="mt-4 divide-y">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => {
                  const itProd = products.find((p) => p.id === item.productId) ?? sampleProduct;
                  return (
                    <div key={item.productId} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                      <ProductImage
                        product={itProd}
                        className="size-20 rounded-md object-cover border"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.seller} · Quantity {item.quantity}
                        </p>
                        <p className="mt-2 font-bold text-primary">
                          {money(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex gap-4 py-3">
                  <ProductImage
                    product={sampleProduct}
                    className="size-20 rounded-md object-cover border"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-foreground">{order.product}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.seller} · Quantity {order.quantity}
                    </p>
                    <p className="mt-2 font-bold text-primary">{money(order.amount)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="panel h-fit p-6 space-y-4">
            <h2 className="font-display text-lg font-bold">Shipping information</h2>
            <div className="text-sm leading-6 text-muted-foreground">
              <p className="font-semibold text-foreground">
                {order.shippingAddress?.name || order.customer}
              </p>
              <p>{order.shippingAddress?.street || "128 Market Street, Apt 4B"}</p>
              <p>
                {order.shippingAddress?.city || "San Francisco"},{" "}
                {order.shippingAddress?.state || "CA"} {order.shippingAddress?.zip || "94105"}
              </p>
              {order.shippingAddress?.phone && (
                <p className="mt-1 text-xs font-mono">{order.shippingAddress.phone}</p>
              )}
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment method</span>
              <strong>Stripe ({order.payment})</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping fee</span>
              <strong className="text-success-foreground">Free</strong>
            </div>
            <Separator />
            <div className="flex justify-between font-display text-lg font-extrabold">
              <span>Total</span>
              <span>{money(order.amount)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="page-shell py-10">
        <CustomerNavStrip current="profile" />
        <CustomerAccount />
      </main>
      <Footer />
    </>
  );
}
function Field({ label, ...props }: React.ComponentProps<typeof Input> & { label: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Input required {...props} />
    </label>
  );
}
function Summary({
  subtotal,
  total,
  action,
}: {
  subtotal: number;
  total: number;
  action: React.ReactNode;
}) {
  return (
    <aside className="panel h-fit p-6">
      <h2 className="font-display text-lg font-bold">Order summary</h2>
      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total discount</span>
          <span className="text-success-foreground">−{money(subtotal - total)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-display text-lg font-extrabold">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>
      <div className="mt-6">{action}</div>
    </aside>
  );
}
