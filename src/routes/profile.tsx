import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "@/components/marketplace/StorePages";
import { ProtectedRoute } from "@/components/marketplace/Shells";
export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Marketly" },
      { name: "description", content: "Manage your Marketly account and shipping details." },
      { property: "og:title", content: "Profile — Marketly" },
      { property: "og:description", content: "Manage your Marketly account and shipping details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <ProtectedRoute allowed={["customer"]}>
      <ProfilePage />
    </ProtectedRoute>
  ),
});
