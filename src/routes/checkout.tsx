import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/components/marketplace/StorePages";
import { ProtectedRoute } from "@/components/marketplace/Shells";
export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Marketly" },
      {
        name: "description",
        content: "Complete your Marketly order and continue to secure payment.",
      },
      { property: "og:title", content: "Checkout — Marketly" },
      {
        property: "og:description",
        content: "Complete your Marketly order and continue to secure payment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <ProtectedRoute allowed={["customer"]}>
      <CheckoutPage />
    </ProtectedRoute>
  ),
});
