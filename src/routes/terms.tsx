import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/marketplace/StaticPages";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Marketly" },
      {
        name: "description",
        content:
          "Review Marketly's marketplace terms of service, buyer protections, and seller obligations.",
      },
      { property: "og:title", content: "Terms & Conditions — Marketly" },
      {
        property: "og:description",
        content:
          "Review Marketly's marketplace terms of service, buyer protections, and seller obligations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});
