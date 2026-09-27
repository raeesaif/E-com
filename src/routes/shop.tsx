import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/marketplace/StorePages";
export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — E-Com" },
      { name: "description", content: "Search and filter curated marketplace products." },
      { property: "og:title", content: "Shop — E-Com" },
      { property: "og:description", content: "Search and filter curated marketplace products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});
