import { createFileRoute } from "@tanstack/react-router";
import { CategoriesPage } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/admin/categories")({
  head: () => ({
    meta: [
      { title: "Categories — E-Com Admin" },
      { name: "description", content: "Add, edit, and remove marketplace categories." },
      { property: "og:title", content: "Categories — E-Com Admin" },
      { property: "og:description", content: "Add, edit, and remove marketplace categories." },
    ],
  }),
  component: CategoriesPage,
});
