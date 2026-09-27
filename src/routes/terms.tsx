import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/marketplace/StaticPages";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — E-Com" },
      {
        name: "description",
        content:
          "Review E-Com's marketplace terms of service, buyer protections, and seller obligations.",
      },
      { property: "og:title", content: "Terms & Conditions — E-Com" },
      {
        property: "og:description",
        content:
          "Review E-Com's marketplace terms of service, buyer protections, and seller obligations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});
