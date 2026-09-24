import { createFileRoute } from "@tanstack/react-router";
import { AdminProductsPage } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Marketly Admin" },
      { name: "description", content: "Review products across every marketplace seller." },
      { property: "og:title", content: "Products — Marketly Admin" },
      { property: "og:description", content: "Review products across every marketplace seller." },
    ],
  }),
  component: AdminProductsPage,
});
