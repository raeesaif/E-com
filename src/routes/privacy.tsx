import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/marketplace/StaticPages";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — E-Com" },
      {
        name: "description",
        content:
          "Read E-Com's Privacy Policy regarding data protection, security, and user rights.",
      },
      { property: "og:title", content: "Privacy Policy — E-Com" },
      {
        property: "og:description",
        content:
          "Read E-Com's Privacy Policy regarding data protection, security, and user rights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPage,
});
