import { createFileRoute } from "@tanstack/react-router";
import { DashboardHome } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/seller/")({
  head: () => ({
    meta: [
      { title: "Seller Overview — E-Com" },
      {
        name: "description",
        content: "Review your E-Com products, stock, sales, and recent orders.",
      },
      { property: "og:title", content: "Seller Overview — E-Com" },
      {
        property: "og:description",
        content: "Review your E-Com products, stock, sales, and recent orders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <DashboardHome role="seller" />,
});
