import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/marketplace/StaticPages";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Marketly" },
      {
        name: "description",
        content: "Get in touch with Marketly's customer care, studio, or artisan partnership team.",
      },
      { property: "og:title", content: "Contact Us — Marketly" },
      {
        property: "og:description",
        content: "Get in touch with Marketly's customer care, studio, or artisan partnership team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});
