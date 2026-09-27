import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/marketplace/AuthPages";
export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — E-Com" },
      { name: "description", content: "Create a customer or seller account on E-Com." },
      { property: "og:title", content: "Register — E-Com" },
      { property: "og:description", content: "Create a customer or seller account on E-Com." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthPage register />,
});
