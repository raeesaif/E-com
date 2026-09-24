import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell, SellerRoute } from "@/components/marketplace/Shells";
export const Route = createFileRoute("/seller")({
  head: () => ({
    meta: [
      { title: "Seller Dashboard — Marketly" },
      { name: "description", content: "Manage your Marketly storefront, products, and orders." },
      { property: "og:title", content: "Seller Dashboard — Marketly" },
      {
        property: "og:description",
        content: "Manage your Marketly storefront, products, and orders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SellerRoute>
      <DashboardShell role="seller">
        <Outlet />
      </DashboardShell>
    </SellerRoute>
  ),
});
