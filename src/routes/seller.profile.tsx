import { createFileRoute } from "@tanstack/react-router";
import { DashboardProfile } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/seller/profile")({
  head: () => ({
    meta: [
      { title: "Seller Profile — E-Com" },
      { name: "description", content: "Manage your E-Com seller profile." },
      { property: "og:title", content: "Seller Profile — E-Com" },
      { property: "og:description", content: "Manage your E-Com seller profile." },
    ],
  }),
  component: () => <DashboardProfile seller />,
});
