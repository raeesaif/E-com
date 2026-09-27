import { createFileRoute } from "@tanstack/react-router";
import { DashboardHome } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Marketplace Overview — E-Com Admin" },
      {
        name: "description",
        content: "Review E-Com revenue, orders, sellers, customers, and product stock.",
      },
      { property: "og:title", content: "Marketplace Overview — E-Com Admin" },
      {
        property: "og:description",
        content: "Review E-Com revenue, orders, sellers, customers, and product stock.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <DashboardHome role="admin" />,
});
