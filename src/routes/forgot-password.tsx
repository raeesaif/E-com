import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/components/marketplace/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — E-Com" },
      { name: "description", content: "Reset your E-Com marketplace account password." },
    ],
  }),
  component: () => <ForgotPasswordPage />,
});
