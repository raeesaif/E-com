import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Brand, ThemeToggle } from "./Common";
import { TextField } from "./AuthField";
import { authApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage({
  email,
  token,
}: {
  email: string | undefined;
  token: string | undefined;
}) {
  const navigate = useNavigate();
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    if (!email || !token) return;
    try {
      await authApi.resetPassword({ email, token, newPassword: values.newPassword });
      toast.success("Password reset successful. Please sign in with your new password.");
      navigate({ to: "/login" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-5 sm:p-8">
      <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
        <Brand />
      </div>
      <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>
      <div className="mx-auto w-full max-w-md">
        {!email || !token ? (
          <div className="text-center">
            <XCircle className="mx-auto size-10 text-destructive" />
            <h1 className="mt-4 text-2xl font-extrabold">Invalid reset link</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This link is missing information. Request a new one to reset your password.
            </p>
            <Link to="/forgot-password" className="mt-6 inline-block font-bold text-primary">
              Request a new link
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase text-primary">Reset password</p>
            <h1 className="mt-2 text-3xl font-extrabold">Choose a new password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Set a new password for <span className="font-semibold text-foreground">{email}</span>.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-4">
                <TextField
                  control={form.control}
                  name="newPassword"
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                />
                <TextField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm new password"
                  type="password"
                  placeholder="••••••••"
                />
                <Button size="lg" type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : null}
                  Reset password
                  <ArrowRight />
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/login" className="font-bold text-primary">
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
