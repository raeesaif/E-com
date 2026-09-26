import { createFileRoute } from "@tanstack/react-router";
import { DashboardProfile } from "@/components/marketplace/DashboardPages";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile — Marketly" },
      { name: "description", content: "Manage your Marketly admin profile." },
      { property: "og:title", content: "Admin Profile — Marketly" },
      { property: "og:description", content: "Manage your Marketly admin profile." },
    ],
  }),
  component: () => <DashboardProfile admin />,
});
