import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  ChevronDown,
  CircleUserRound,
  Heart,
  LayoutDashboard,
  ListOrdered,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Store,
  Tags,
  Truck,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brand, ThemeToggle } from "./Common";
import { useAppState } from "./useAppState";
import type { Role } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Navbar() {
  const { cart, wishlist, orders, role, user, signOut } = useAppState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const roleLabel = role ? `${role.charAt(0).toUpperCase()}${role.slice(1)} panel` : "";
  const customerName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Ariana Wells";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="page-shell flex h-16 items-center gap-4">
        <Brand />
        <nav className="ml-5 hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/shop">Shop</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/about">About</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/contact">Contact</Link>
          </Button>
          {role === "customer" && (
            <Button asChild variant="ghost">
              <Link to="/orders">My orders</Link>
            </Button>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />

          {/* Wishlist Link Button */}
          {role === "customer" && (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Wishlist"
              title="Saved wishlist"
            >
              <Link to="/profile">
                <Heart className="size-5" />
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </Link>
            </Button>
          )}

          {/* Cart Link Button */}
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Cart" title="Shopping Cart">
            <Link to="/cart">
              <ShoppingBag className="size-5" />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {cart.length}
                </motion.span>
              )}
            </Link>
          </Button>

          {/* Account Controls */}
          {role === "customer" ? (
            <div className="hidden items-center gap-2 sm:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 font-semibold">
                    <div className="grid size-6 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                      {user?.firstName?.[0] || "A"}
                    </div>
                    <span className="max-w-28 truncate">{user?.firstName || "Account"}</span>
                    <ChevronDown className="size-3.5 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{customerName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "ariana@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center gap-2">
                      <UserRound className="size-4" /> My Account & Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/orders" className="flex items-center gap-2">
                      <Package className="size-4" /> Order History ({orders.length})
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center gap-2">
                      <Heart className="size-4 text-destructive" /> Wishlist ({wishlist.length})
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/cart" className="flex items-center gap-2">
                      <ShoppingBag className="size-4" /> Shopping Cart ({cart.length})
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => {
                      signOut();
                      navigate({ to: "/shop" });
                      toast.info("Signed out of your account.");
                    }}
                  >
                    <LogOut className="size-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : role ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="outline">
                <Link to={role === "admin" ? "/admin" : "/seller"}>{roleLabel}</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  signOut();
                  navigate({ to: "/" });
                }}
                aria-label="Sign out"
              >
                <LogOut />
              </Button>
            </div>
          ) : (
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/login">
                <LogIn /> Sign in
              </Link>
            </Button>
          )}

          {/* Mobile menu hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Open navigation"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="page-shell grid gap-1 border-t py-3 md:hidden overflow-hidden"
          >
            <Button
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setOpen(false)}
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setOpen(false)}
            >
              <Link to="/shop">Shop Marketplace</Link>
            </Button>
            {role === "customer" && (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/orders">My Orders</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/profile">
                    Wishlist ({wishlist.length})
                  </Link>
                </Button>
              </>
            )}
            <Button
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setOpen(false)}
            >
              <Link to="/cart">Cart ({cart.length})</Link>
            </Button>

            {role ? (
              <>
                <div className="my-1 border-t" />
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start font-bold"
                  onClick={() => setOpen(false)}
                >
                  <Link to={role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/profile"}>
                    {role === "customer" ? `My Account (${customerName})` : roleLabel}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-destructive"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                    navigate({ to: "/shop" });
                    toast.info("Signed out of your account.");
                  }}
                >
                  <LogOut className="size-4 mr-2" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <div className="my-1 border-t" />
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start font-semibold text-primary"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="justify-start"
                  onClick={() => setOpen(false)}
                >
                  <Link to="/register">Create an account</Link>
                </Button>
              </>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

type NavItem = { label: string; to: string; icon: typeof LayoutDashboard };
const sellerNav: NavItem[] = [
  { label: "Dashboard", to: "/seller", icon: LayoutDashboard },
  { label: "My Products", to: "/seller/products", icon: Package },
  { label: "Orders", to: "/seller/orders", icon: Truck },
  { label: "Profile", to: "/seller/profile", icon: CircleUserRound },
];
const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Sellers", to: "/admin/sellers", icon: Store },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Products", to: "/admin/products", icon: Boxes },
  { label: "Categories", to: "/admin/categories", icon: Tags },
  { label: "Orders", to: "/admin/orders", icon: ListOrdered },
  { label: "Profile", to: "/admin/profile", icon: CircleUserRound },
];

export function DashboardShell({
  role,
  children,
}: {
  role: "seller" | "admin";
  children: ReactNode;
}) {
  const items = role === "seller" ? sellerNav : adminNav;
  const { pathname } = useLocation();
  const { signOut, user } = useAppState();
  const navigate = useNavigate();
  const [mobile, setMobile] = useState(false);
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-card px-4 lg:px-6">
        <Brand />
        <Button variant="outline" size="sm" className="ml-4 hidden sm:flex">
          <span className="capitalize">{role}</span>
          <ChevronDown />
        </Button>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobile(!mobile)}
            aria-label="Open dashboard navigation"
          >
            <Menu />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              signOut();
              navigate({ to: "/login" });
            }}
            aria-label="Sign out"
          >
            <LogOut />
          </Button>
        </div>
      </header>
      <div className="flex">
        <aside
          className={cn(
            "fixed inset-y-16 left-0 z-30 w-64 border-r bg-card p-4 transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0",
            mobile ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-6 flex items-center gap-3 rounded-md bg-muted p-3">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              {role === "admin" ? <BarChart3 /> : <Store />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold truncate">
                {`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                  user?.name ||
                  (role === "admin" ? "Admin" : "Seller")}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{role} workspace</p>
            </div>
          </div>
          <nav className="grid gap-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Button
                  key={item.to}
                  asChild
                  variant={active ? "secondary" : "ghost"}
                  className="justify-start"
                >
                  <Link to={item.to}>
                    <Icon />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </aside>
        {mobile && (
          <button
            className="fixed inset-0 top-16 z-20 bg-foreground/20 lg:hidden"
            onClick={() => setMobile(false)}
            aria-label="Close navigation"
          />
        )}
        <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children, allowed }: { children: ReactNode; allowed?: Role[] }) {
  const { role, hydrated } = useAppState();
  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!role || (allowed && !allowed.includes(role))) {
    const gateRole = allowed?.[0] ?? "customer";
    return <AccessGate role={gateRole} />;
  }
  return children;
}
export function SellerRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowed={["seller"]}>{children}</ProtectedRoute>;
}
export function AdminRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowed={["admin"]}>{children}</ProtectedRoute>;
}
function AccessGate({ role = "customer" }: { role?: Role }) {
  const roleName = role === "admin" ? "Admin" : role === "seller" ? "Seller" : "Customer";

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="panel max-w-md p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-md bg-secondary text-secondary-foreground">
          <UserRound />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold">{roleName} sign in required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in to your {role} account to access this protected area.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Button asChild className="w-full font-semibold">
            <Link to="/login">Sign in with email</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full text-xs text-muted-foreground">
            <Link to="/shop">Explore marketplace as guest</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
