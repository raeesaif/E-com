import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  HeartHandshake,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "./Shells";
import { Footer } from "./Footer";
import { PageHeader } from "./Common";

// ==========================================
// 1. ABOUT US PAGE
// ==========================================
export function AboutPage() {
  const pillars = [
    {
      icon: <Sparkles className="size-6 text-primary" />,
      title: "Thoughtfully Curated",
      description:
        "We reject mindless mass production. Every product on Marketly is hand-selected for craftsmanship, utility, and enduring beauty.",
    },
    {
      icon: <Users className="size-6 text-primary" />,
      title: "Direct From Makers",
      description:
        "By shortening the bridge between independent artisans and discerning customers, we empower creators to thrive on fair terms.",
    },
    {
      icon: <ShieldCheck className="size-6 text-primary" />,
      title: "Uncompromising Integrity",
      description:
        "Transparent pricing, authentic reviews, and 30-day buyer protection ensure you can shop with absolute confidence.",
    },
    {
      icon: <HeartHandshake className="size-6 text-primary" />,
      title: "Conscious Delivery",
      description:
        "All seller orders are packed with minimal plastics and carbon-offset shipping partners to minimize our environmental footprint.",
    },
  ];

  const milestones = [
    { value: "40+", label: "Independent Brands", note: "Across 14 countries" },
    { value: "2.4k+", label: "Curated Essentials", note: "Vetted for longevity" },
    { value: "99.4%", label: "On-Time Dispatch", note: "Monitored fulfillment" },
    { value: "4.9 / 5", label: "Customer Love", note: "Verified buyer ratings" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-surface/50 py-16 md:py-24">
          <div className="page-shell">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Compass className="size-3.5" /> Our Story & Mission
              </span>
              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Elevating everyday living with goods that matter.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Marketly was founded on a simple conviction: the objects we invite into our homes,
                workspaces, and journeys should be crafted with intention, designed to last, and
                support the real people who build them.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Milestones Stats */}
        <section className="border-b bg-card py-12">
          <div className="page-shell">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
              {milestones.map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="panel p-5 text-center sm:text-left"
                >
                  <p className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                    {item.value}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-16 md:py-24">
          <div className="page-shell">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                What sets Marketly apart
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Our standards are uncompromising. Here is how we ensure each interaction feels
                delightful, honest, and truly premium.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar, idx) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className="panel group relative p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/40"
                >
                  <div className="grid size-12 place-items-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {pillar.icon}
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="border-t bg-surface/50 py-16">
          <div className="page-shell">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="panel relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 p-8 text-center sm:p-12"
            >
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                Ready to discover your next favorite essential?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Join thousands of shoppers who value considered design, craftsmanship, and
                supporting independent businesses.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="font-semibold">
                  <Link to="/shop">
                    Explore the Shop <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/register">Become a Seller</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ==========================================
// 2. CONTACT US PAGE
// ==========================================
export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "general",
    orderNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please complete all required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message received!", {
        description: "Our concierge team will respond to your email within 2 hours.",
      });
      setFormData({ name: "", email: "", topic: "general", orderNumber: "", message: "" });
    }, 800);
  };

  const contactCards = [
    {
      icon: <MapPin className="size-5 text-primary" />,
      title: "Studio & HQ",
      line1: "440 Pine Street, Suite 500",
      line2: "San Francisco, CA 94104",
      action: "Get Directions",
      href: "https://maps.google.com",
    },
    {
      icon: <Mail className="size-5 text-primary" />,
      title: "Concierge Email",
      line1: "support@marketly.store",
      line2: "press@marketly.store",
      action: "Send Email",
      href: "mailto:support@marketly.store",
    },
    {
      icon: <Phone className="size-5 text-primary" />,
      title: "Phone Support",
      line1: "+1 (555) 382-7190",
      line2: "Mon – Fri, 9am – 6pm EST",
      action: "Call Us",
      href: "tel:+15553827190",
    },
    {
      icon: <Clock className="size-5 text-primary" />,
      title: "Average Response",
      line1: "< 2 hours during business hours",
      line2: "24/7 automated order lookups",
      action: "View Orders",
      to: "/orders" as const,
    },
  ];

  const faqs = [
    {
      q: "How do shipping and fulfillment work?",
      a: "Items are dispatched directly from our verified independent makers. Most orders ship within 1-2 business days with full real-time tracking.",
    },
    {
      q: "What is Marketly's return policy?",
      a: "We offer a 30-day money-back guarantee on all products in their original condition. Return shipping is hassle-free through your order dashboard.",
    },
    {
      q: "How can I apply to sell on Marketly?",
      a: "Artisans and brands can sign up via our Seller Registration portal. Our curation committee reviews brand applications within 48 hours.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="page-shell">
          <PageHeader
            eyebrow="Help & Concierge"
            title="We're here to help."
            description="Have a question about an order, an artisan, or interested in joining Marketly as a brand? Send us a note or reach out through any of our channels below."
          />

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="panel p-5"
              >
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10">
                  {card.icon}
                </div>
                <h3 className="mt-3.5 font-display text-base font-bold">{card.title}</h3>
                <p className="mt-1 text-sm text-foreground">{card.line1}</p>
                <p className="text-xs text-muted-foreground">{card.line2}</p>
                {card.to ? (
                  <Link
                    to={card.to}
                    className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    {card.action} →
                  </Link>
                ) : (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs font-semibold text-primary hover:underline"
                  >
                    {card.action} →
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Main Grid: Form + FAQs */}
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Contact Form (Span 7) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="panel p-6 sm:p-8 lg:col-span-7"
            >
              <h2 className="font-display text-xl font-bold">Send us a direct message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill out the details below and a team member will follow up promptly.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name">
                      Your Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-topic">What can we help with?</Label>
                    <select
                      id="contact-topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Status & Tracking</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="seller">Seller / Artisan Partnership</option>
                      <option value="press">Press & Collaborations</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-order">Order Number (Optional)</Label>
                    <Input
                      id="contact-order"
                      placeholder="e.g. ORD-1048"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message">
                    Your Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    placeholder="How can we assist you today? Please share as much context as possible..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto font-semibold"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Sending message...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Message <Send className="size-4" />
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* FAQs Accordion / Support sidebar (Span 5) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="space-y-6 lg:col-span-5"
            >
              <div className="panel p-6">
                <div className="flex items-center gap-2.5">
                  <div className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                    <HelpCircle className="size-4" />
                  </div>
                  <h3 className="font-display text-lg font-bold">Frequently Asked Questions</h3>
                </div>

                <div className="mt-5 space-y-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h4 className="text-sm font-semibold text-foreground">{faq.q}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Immediate Help Box */}
              <div className="panel bg-surface/50 p-6">
                <h4 className="font-display text-sm font-bold">Looking to Track an Order?</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can view full tracking timelines and dispatch updates directly inside your
                  customer portal without waiting for email replies.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/orders">Check Order Status</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ==========================================
// 3. TERMS & CONDITIONS PAGE
// ==========================================
export function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing, browsing, or utilizing the Marketly marketplace platform (the 'Platform'), you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not accept these terms, you must refrain from using the platform.",
    },
    {
      title: "2. The Marketly Marketplace Model",
      content:
        "Marketly operates as a curated multi-vendor marketplace platform. Products displayed on the site are produced, listed, and fulfilled by independent sellers. Marketly facilitates transactions, payment clearing, and order monitoring, but the contract of sale is established between buyer and independent seller.",
    },
    {
      title: "3. Account Creation & Security",
      content:
        "Users are responsible for safeguarding their login credentials and account access tokens. Any unauthorized account activity must be reported to support@marketly.store immediately. Marketly reserves the right to suspend or terminate accounts that breach community trust.",
    },
    {
      title: "4. Pricing, Taxes & Payment Processing",
      content:
        "All product prices are quoted in USD and include any relevant discounts calculated in real time. Payments are processed securely using PCI-DSS compliant payment gateways. Buyers authorize Marketly to charge the designated payment method for all orders placed.",
    },
    {
      title: "5. Shipping, Delivery & Inspection",
      content:
        "Sellers agree to dispatch confirmed orders within their stated handling timeframe. Customers receive tracking notifications upon shipment. If an order arrives damaged or fails to match listing specifications, customers have 30 days from delivery to request resolution.",
    },
    {
      title: "6. Seller Obligations & Standards",
      content:
        "Independent sellers must maintain accurate inventory counts, honor promotional discounts, and deliver original, non-counterfeit items. Marketly maintains absolute discretion to delist goods or terminate seller stores that violate our curation guidelines.",
    },
    {
      title: "7. Intellectual Property & Brand Assets",
      content:
        "All visual branding, typography, illustrations, UI components, and software code constituting Marketly are the exclusive intellectual property of Marketly Inc. Product photography and trademarks remain the property of their respective creators.",
    },
    {
      title: "8. Limitation of Liability",
      content:
        "In no event shall Marketly Inc., its officers, or affiliates be liable for indirect, incidental, punitive, or consequential damages resulting from platform use, delayed courier delivery, or product defects beyond the replacement or refund value of the purchased goods.",
    },
    {
      title: "9. Modifications & Inquiries",
      content:
        "We may update these terms periodically to reflect operational, legal, or regulatory modifications. Continued usage constitutes acceptance. For inquiries regarding these terms, contact legal@marketly.store.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="page-shell max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <FileText className="size-4" /> Legal & Governance
            </div>
            <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: September 2026 • Effective immediately across all user roles
            </p>

            <div className="mt-8 panel divide-y bg-card p-6 sm:p-10">
              {sections.map((sec, idx) => (
                <div key={idx} className="py-6 first:pt-0 last:pb-0">
                  <h2 className="font-display text-lg font-bold text-foreground">{sec.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
              <p>Questions? Reach out to support@marketly.store</p>
              <Link to="/privacy" className="font-medium text-primary hover:underline">
                Read Privacy Policy →
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ==========================================
// 4. PRIVACY POLICY PAGE
// ==========================================
export function PrivacyPage() {
  const policies = [
    {
      title: "1. Information We Collect",
      items: [
        "Personal Identifiers: Name, email address, phone number, and physical shipping address provided during checkout or registration.",
        "Account Details: Encrypted password hashes, user preferences, cart line items, and saved addresses.",
        "Transactional Records: Order IDs, payment confirmation tokens (we do not store raw credit card numbers), order dates, and statuses.",
        "Technical Telemetry: Browser user-agent, operating system, and IP address for fraud detection and session security.",
      ],
    },
    {
      title: "2. How We Use Collected Data",
      items: [
        "Fulfilling and tracking product shipments with independent sellers.",
        "Processing secure payments and preventing fraudulent checkout attempts.",
        "Communicating order confirmations, tracking alerts, and critical account notices.",
        "Improving platform speed, responsiveness, and user experience.",
      ],
    },
    {
      title: "3. Cookie Preferences & Local Storage",
      items: [
        "Marketly utilizes client-side LocalStorage exclusively for active authentication tokens, theme preferences (light/dark mode), and shopping cart caching.",
        "We do not sell user behavioral data to third-party ad networks or data brokers.",
      ],
    },
    {
      title: "4. Information Sharing & Third Parties",
      items: [
        "Independent Sellers: Sellers receive only the customer name and delivery address required to dispatch your order.",
        "Payment Processors: Payment data is transmitted via TLS 1.3 encryption directly to Stripe and banking partners.",
        "Legal Compliance: We may disclose records if strictly required by subpoena, court order, or applicable law.",
      ],
    },
    {
      title: "5. Data Retention & Your Rights",
      items: [
        "Right to Access: You may request a complete export of your personal information at any time.",
        "Right to Rectification: You can update your account name and email directly via the Profile settings.",
        "Right to Erasure ('Right to be Forgotten'): You can request permanent deletion of your account and personal data by emailing privacy@marketly.store.",
      ],
    },
    {
      title: "6. Security Architecture",
      items: [
        "Marketly enforces modern security controls including HTTPS-only communication, CSRF middleware protection, and granular role-based access tokens.",
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="page-shell max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="size-4" /> Data Protection & Privacy
            </div>
            <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: September 2026 • GDPR & CCPA compliant
            </p>

            <div className="mt-8 panel divide-y bg-card p-6 sm:p-10">
              {policies.map((p, idx) => (
                <div key={idx} className="py-6 first:pt-0 last:pb-0">
                  <h2 className="font-display text-lg font-bold text-foreground">{p.title}</h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {p.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
              <p>Privacy inquiries: privacy@marketly.store</p>
              <Link to="/terms" className="font-medium text-primary hover:underline">
                Read Terms & Conditions →
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
