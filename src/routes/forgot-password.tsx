import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/components/marketplace/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — Marketly" },
      { name: "description", content: "Reset your Marketly marketplace account password." },
    ],
  }),
  component: () => <ForgotPasswordPage />,
});
