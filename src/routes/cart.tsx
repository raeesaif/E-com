import { createFileRoute } from "@tanstack/react-router";
import { CartPage } from "@/components/marketplace/StorePages";
export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — E-Com" },
      { name: "description", content: "Review your E-Com shopping cart." },
      { property: "og:title", content: "Cart — E-Com" },
      { property: "og:description", content: "Review your E-Com shopping cart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});
