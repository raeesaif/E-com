import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/marketplace/StaticPages";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — E-Com" },
      {
        name: "description",
        content:
          "Learn about E-Com's mission, curation ethos, and independent maker collective.",
      },
      { property: "og:title", content: "About Us — E-Com" },
      {
        property: "og:description",
        content:
          "Learn about E-Com's mission, curation ethos, and independent maker collective.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});
