import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { VerifyEmailPage } from "@/components/marketplace/VerifyEmailPage";

const verifyEmailSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: verifyEmailSearchSchema,
  head: () => ({
    meta: [
      { title: "Verify email — Marketly" },
      { name: "description", content: "Verify your Marketly marketplace account email." },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();
  return <VerifyEmailPage token={token} />;
}
