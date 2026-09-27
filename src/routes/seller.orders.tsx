import { createFileRoute } from "@tanstack/react-router";
import { OrdersManagementPage } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/seller/orders")({
  head: () => ({
    meta: [
      { title: "Seller Orders — E-Com" },
      { name: "description", content: "View and update orders containing your products." },
      { property: "og:title", content: "Seller Orders — E-Com" },
      { property: "og:description", content: "View and update orders containing your products." },
    ],
  }),
  component: () => <OrdersManagementPage />,
});
