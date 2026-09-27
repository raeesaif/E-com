import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "@/components/marketplace/StorePages";
import { ProtectedRoute } from "@/components/marketplace/Shells";
export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — E-Com" },
      { name: "description", content: "Track your E-Com purchases and delivery status." },
      { property: "og:title", content: "My Orders — E-Com" },
      { property: "og:description", content: "Track your E-Com purchases and delivery status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <ProtectedRoute allowed={["customer"]}>
      <OrdersPage />
    </ProtectedRoute>
  ),
});
