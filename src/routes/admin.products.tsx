import { createFileRoute } from "@tanstack/react-router";
import { AdminProductsPage } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — E-Com Admin" },
      { name: "description", content: "Review products across every marketplace seller." },
      { property: "og:title", content: "Products — E-Com Admin" },
      { property: "og:description", content: "Review products across every marketplace seller." },
    ],
  }),
  component: AdminProductsPage,
});
