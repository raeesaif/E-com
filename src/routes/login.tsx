import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/marketplace/AuthPages";
export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — E-Com" },
      { name: "description", content: "Sign in to your E-Com marketplace account." },
      { property: "og:title", content: "Sign in — E-Com" },
      { property: "og:description", content: "Sign in to your E-Com marketplace account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthPage />,
});
