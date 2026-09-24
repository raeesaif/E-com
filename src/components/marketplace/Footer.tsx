import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "./Common";
import { categories } from "@/lib/marketplace";

// Sleek X (Twitter) SVG Icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "size-4"}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      toast.success("Welcome to Marketly! You're now on our insider list.", {
        description: "Enjoy exclusive drops, artisan spotlights, and early access.",
      });
      setEmail("");
    }, 600);
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: <Instagram className="size-4" />,
      color: "hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10",
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: <Facebook className="size-4" />,
      color: "hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10",
    },
    {
      name: "X (Twitter)",
      href: "https://x.com",
      icon: <XIcon className="size-4" />,
      color: "hover:text-foreground hover:border-foreground/40 hover:bg-foreground/10",
    },
  ];

  return (
    <footer className="relative border-t bg-card text-foreground transition-colors">
      {/* Subtle top accent gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Trust & Guarantee Banner */}
      <section className="border-b bg-surface/50 py-6">
        <div className="page-shell grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3.5">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Curated Independent Brands</p>
              <p className="text-xs text-muted-foreground">Every seller rigorously vetted</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Truck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Conscious Shipping</p>
              <p className="text-xs text-muted-foreground">Plastic-free & carbon-offset delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Buyer Protection</p>
              <p className="text-xs text-muted-foreground">30-day hassle-free return guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Dedicated Support</p>
              <p className="text-xs text-muted-foreground">Human replies in under 2 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Navigation & Content */}
      <div className="page-shell py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Manifesto (Span 4) */}
          <div className="lg:col-span-4">
            <Brand />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Marketly is a curated online marketplace connecting conscious everyday shoppers with
              exceptional, trusted independent creators, designers, and artisans worldwide.
            </p>

            {/* Newsletter Subscription */}
            <div className="mt-6 max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Join the Marketly Dispatch
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                First access to artisan drops, seasonal collections & maker stories.
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3.5 py-2.5 text-xs font-medium text-success"
                >
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>You're subscribed! Welcome to the collective.</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 text-sm focus-visible:ring-primary"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={loading}
                    className="h-10 shrink-0 px-4 font-semibold"
                  >
                    {loading ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <>
                        Join <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Social Media Links */}
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Follow Our Story
              </p>
              <div className="mt-2.5 flex items-center gap-2.5">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit Marketly on ${social.name}`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`grid size-9 place-items-center rounded-md border bg-background text-muted-foreground shadow-sm transition-all duration-200 ${social.color}`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Categories (Span 2) */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Categories
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  All Products
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to="/shop"
                    search={{ category }}
                    className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                  >
                    {category}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline underline-offset-4"
                >
                  <span>Special Offers</span>
                  <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold">
                    Sale
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Information (Span 2) */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Company
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Sell on Marketly
                </Link>
              </li>
              <li>
                <Link
                  to="/seller"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Seller Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Account (Span 2) */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Customer Care
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/orders"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                >
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact & Studio Address (Span 2) */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Get in Touch
            </h2>
            <div className="mt-4 space-y-3.5 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-primary mt-0.5" />
                <span>
                  440 Pine Street, Suite 500
                  <br />
                  San Francisco, CA 94104
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" />
                <a
                  href="mailto:support@marketly.store"
                  className="hover:text-primary hover:underline underline-offset-4"
                >
                  support@marketly.store
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a
                  href="tel:+15553827190"
                  className="hover:text-primary hover:underline underline-offset-4"
                >
                  +1 (555) 382-7190
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-primary" />
                <span>Mon – Fri: 9am – 6pm EST</span>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1 text-[11px] font-medium text-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer / Bottom Bar */}
      <div className="border-t bg-muted/30 py-6 text-xs text-muted-foreground">
        <div className="page-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>© {new Date().getFullYear()} Marketly Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="hover:text-foreground hover:underline">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-foreground hover:underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-foreground hover:underline">
                Security & Trust
              </Link>
            </div>
          </div>

          {/* Payment & Craftsmanship Note */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px]">
              Crafted with <Heart className="size-3 text-destructive fill-destructive" /> for
              independent makers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
