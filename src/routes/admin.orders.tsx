import { createFileRoute } from "@tanstack/react-router";
import { OrdersManagementPage } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — E-Com Admin" },
      { name: "description", content: "View marketplace-wide orders and fulfillment status." },
      { property: "og:title", content: "Orders — E-Com Admin" },
      {
        property: "og:description",
        content: "View marketplace-wide orders and fulfillment status.",
      },
    ],
  }),
  component: () => <OrdersManagementPage admin />,
});
