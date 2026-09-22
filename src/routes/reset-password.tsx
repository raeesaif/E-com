import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPasswordPage } from "@/components/marketplace/ResetPasswordPage";

const resetPasswordSearchSchema = z.object({
  email: z.string().optional(),
  token: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: resetPasswordSearchSchema,
  head: () => ({
    meta: [
      { title: "Reset password — Marketly" },
      {
        name: "description",
        content: "Choose a new password for your Marketly marketplace account.",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { email, token } = Route.useSearch();
  return <ResetPasswordPage email={email} token={token} />;
}
