import { createFileRoute } from "@tanstack/react-router";
import { PeoplePage } from "@/components/marketplace/DashboardPages";
export const Route = createFileRoute("/admin/sellers")({
  head: () => ({
    meta: [
      { title: "Sellers — Marketly Admin" },
      { name: "description", content: "View seller accounts and marketplace activity." },
      { property: "og:title", content: "Sellers — Marketly Admin" },
      { property: "og:description", content: "View seller accounts and marketplace activity." },
    ],
  }),
  component: () => <PeoplePage type="sellers" />,
});
