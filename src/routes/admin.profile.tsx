import { createFileRoute } from "@tanstack/react-router";
import { DashboardProfile } from "@/components/marketplace/DashboardPages";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile — E-Com" },
      { name: "description", content: "Manage your E-Com admin profile." },
      { property: "og:title", content: "Admin Profile — E-Com" },
      { property: "og:description", content: "Manage your E-Com admin profile." },
    ],
  }),
  component: () => <DashboardProfile admin />,
});
