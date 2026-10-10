import { createFileRoute } from "@tanstack/react-router";
import { OrderSuccessPage } from "@/components/marketplace/StorePages";
import { ProtectedRoute } from "@/components/marketplace/Shells";

function OrderSuccessRouteComponent() {
  const { session_id } = Route.useSearch();
  return (
    <ProtectedRoute allowed={["customer"]}>
      <OrderSuccessPage {...(session_id ? { sessionId: session_id } : {})} />
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/orders/success")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } =>
    typeof search["session_id"] === "string" ? { session_id: search["session_id"] } : {},
  head: () => ({
    meta: [
      { title: "Payment — E-Com" },
      { name: "description", content: "Confirming your E-Com payment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccessRouteComponent,
});
