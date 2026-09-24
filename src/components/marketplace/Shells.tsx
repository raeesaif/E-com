import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  ChevronDown,
  CircleUserRound,
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

export function Navbar() {
  const { cart, role, signOut } = useAppState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const roleLabel = role ? `${role.charAt(0).toUpperCase()}${role.slice(1)} panel` : "";
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
          <Button asChild variant="ghost">
            <Link to="/orders">My orders</Link>
          </Button>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon" className="relative" aria-label="Cart">
            <Link to="/cart">
              <ShoppingBag />
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
          {role ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="outline">
                <Link to={role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/profile"}>
                  {role === "customer" ? "My account" : roleLabel}
                </Link>
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
              <Link to="/shop">Shop</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setOpen(false)}
            >
              <Link to="/about">About</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setOpen(false)}
            >
              <Link to="/contact">Contact</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setOpen(false)}
            >
              <Link to="/orders">My orders</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="justify-start"
              onClick={() => setOpen(false)}
            >
              <Link to="/login">Sign in</Link>
            </Button>
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
            <div>
              <p className="text-sm font-bold">
                {role === "admin"
                  ? "Admin Console"
                  : `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
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
  const { setRole } = useAppState();
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="panel max-w-md p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-md bg-secondary text-secondary-foreground">
          <UserRound />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold">Preview the {role} experience</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a frontend-only access gate. Choose the role to open its protected interface.
        </p>
        <Button className="mt-6 w-full" onClick={() => setRole(role)}>
          Continue as {role}
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link to="/login">Go to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
