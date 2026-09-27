import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell, SellerRoute } from "@/components/marketplace/Shells";
export const Route = createFileRoute("/seller")({
  head: () => ({
    meta: [
      { title: "Seller Dashboard — E-Com" },
      { name: "description", content: "Manage your E-Com storefront, products, and orders." },
      { property: "og:title", content: "Seller Dashboard — E-Com" },
      {
        property: "og:description",
        content: "Manage your E-Com storefront, products, and orders.",
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
