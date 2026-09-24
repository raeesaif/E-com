import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  LoaderCircle,
  Minus,
  Moon,
  PackageOpen,
  Plus,
  Search,
  ShoppingBag,
  Sun,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import productCollection from "@/assets/product-collection.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { finalPrice, money, stockStatus, type OrderStatus, type Product } from "@/lib/marketplace";
import { useAppState } from "./useAppState";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("market-theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("market-theme", next ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
        <ShoppingBag className="size-5" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-extrabold tracking-tight">Marketly</span>
      )}
    </Link>
  );
}

export function ProductImage({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      <img
        src={productCollection}
        alt={product.name}
        width={1536}
        height={1024}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
        style={{ objectPosition: product.imagePosition }}
      />
    </div>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  const status = stockStatus(stock);
  return (
    <Badge
      className={cn(
        "shadow-none",
        status === "In Stock" && "border-success bg-success text-success-foreground",
        status === "Low Stock" && "border-warning bg-warning text-warning-foreground",
        status === "Out of Stock" && "border-destructive/20 bg-destructive/10 text-destructive",
      )}
    >
      {status}
    </Badge>
  );
}

export function DiscountBadge({ discount }: { discount: number }) {
  return discount > 0 ? (
    <Badge className="border-transparent bg-accent text-accent-foreground shadow-none">
      -{discount}%
    </Badge>
  ) : null;
}

export function ProductPrice({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={cn("font-display font-extrabold", large ? "text-3xl" : "text-lg")}>
        {money(finalPrice(product))}
      </span>
      {product.discount > 0 && (
        <span className="text-sm text-muted-foreground line-through">{money(product.price)}</span>
      )}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search products",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useAppState();
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30"
    >
      <div className="relative overflow-hidden">
        <ProductImage
          product={product}
          className="aspect-[4/3] transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <DiscountBadge discount={product.discount} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary">{product.category}</p>
            <h3 className="mt-1 truncate font-display font-bold">{product.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">by {product.seller}</p>
          </div>
          <StockBadge stock={product.stock} />
        </div>
        <div className="mt-auto pt-4">
          <ProductPrice product={product} />
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
            <Button asChild variant="outline">
              <Link to="/products/$id" params={{ id: product.id }}>
                View details
              </Link>
            </Button>
            <Button
              size="icon"
              disabled={!product.stock}
              onClick={() => addToCart(product.id)}
              aria-label={`Add ${product.name} to cart`}
              title="Add to cart"
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      className={cn(
        "shadow-none",
        status === "Delivered"
          ? "bg-success text-success-foreground"
          : status === "Shipped"
            ? "bg-info text-info-foreground"
            : status === "Pending"
              ? "bg-warning text-warning-foreground"
              : "bg-secondary text-secondary-foreground",
      )}
    >
      {status}
    </Badge>
  );
}

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  const steps: OrderStatus[] = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  const current = steps.indexOf(status);
  return (
    <div className="grid gap-0 sm:grid-cols-5">
      {steps.map((step, index) => (
        <div key={step} className="relative flex gap-3 pb-5 sm:block sm:pb-0 sm:text-center">
          <div
            className={cn(
              "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2 sm:mx-auto transition-colors duration-300",
              index <= current
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {index < current ? (
              <Check className="size-4" />
            ) : (
              <span className="text-xs">{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "absolute left-3 top-7 h-[calc(100%-1.75rem)] w-0.5 sm:left-[calc(50%+14px)] sm:top-3 sm:h-0.5 sm:w-[calc(100%-28px)] transition-colors duration-300",
                index < current ? "bg-primary" : "bg-border",
              )}
            />
          )}
          <p className="pt-1 text-sm font-medium sm:pt-2">{step}</p>
        </div>
      ))}
    </div>
  );
}

export function QuantityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-flex h-9 items-center rounded-md border bg-background shadow-xs">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="Decrease quantity"
      >
        <Minus />
      </Button>
      <span className="w-9 text-center text-sm font-semibold">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus />
      </Button>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
        )}
        <h1 className="font-display text-2xl font-extrabold md:text-3xl tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatsCard({
  label,
  value,
  icon,
  note,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  note?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="panel p-5 transition-all duration-300 hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="grid size-9 place-items-center rounded-md bg-secondary text-secondary-foreground shadow-xs">
          {icon}
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold">{value}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </motion.div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel grid min-h-72 place-items-center p-8 text-center">
      <div>
        <PackageOpen className="mx-auto size-9 text-muted-foreground" />
        <h2 className="mt-4 font-display text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="grid min-h-56 place-items-center">
      <LoaderCircle className="size-7 animate-spin text-primary" />
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="panel flex items-center gap-3 p-5 text-destructive">
      <CircleAlert />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function Pagination() {
  return (
    <div className="mt-8 flex items-center justify-between border-t pt-5">
      <p className="text-sm text-muted-foreground">Showing 1–6 of 24</p>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" aria-label="Previous page">
          <ChevronLeft />
        </Button>
        <Button size="icon">1</Button>
        <Button variant="ghost" size="icon">
          2
        </Button>
        <Button variant="outline" size="icon" aria-label="Next page">
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export function BackLink({ to, label }: { to: "/shop" | "/orders"; label: string }) {
  return (
    <Link
      to={to}
      className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      <ChevronLeft className="size-4" />
      {label}
    </Link>
  );
}
