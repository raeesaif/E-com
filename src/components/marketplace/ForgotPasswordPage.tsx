import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Brand, ThemeToggle } from "./Common";
import { TextField } from "./AuthField";
import { authApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await authApi.forgotPassword(values.email);
      setSent(true);
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
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto size-10 text-primary" />
            <h1 className="mt-4 text-2xl font-extrabold">Check your inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              If an account exists with that email, you'll receive a password reset link shortly.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              <Link to="/login" className="font-bold text-primary">
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase text-primary">Reset password</p>
            <h1 className="mt-2 text-3xl font-extrabold">Forgot your password?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we'll send you a link to reset it.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-4">
                <TextField
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                />
                <Button size="lg" type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : null}
                  Send reset link
                  <ArrowRight />
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered it?{" "}
              <Link to="/login" className="font-bold text-primary">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
