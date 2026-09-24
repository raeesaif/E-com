import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/marketplace/StaticPages";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Marketly" },
      {
        name: "description",
        content:
          "Read Marketly's Privacy Policy regarding data protection, security, and user rights.",
      },
      { property: "og:title", content: "Privacy Policy — Marketly" },
      {
        property: "og:description",
        content:
          "Read Marketly's Privacy Policy regarding data protection, security, and user rights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});
