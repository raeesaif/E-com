import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Brand, ThemeToggle } from "./Common";
import { authApi } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "verifying" | "success" | "error";

export function VerifyEmailPage({ token }: { token: string | undefined }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [message, setMessage] = useState(token ? "" : "This verification link is missing a token.");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    authApi
      .verifyEmail(token)
      .then(({ message }) => {
        setStatus("success");
        setMessage(message || "Your email has been verified.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed.");
      });
  }, [token]);

  useEffect(() => {
    if (status !== "success") return;
    const timeout = setTimeout(() => navigate({ to: "/login" }), 1500);
    return () => clearTimeout(timeout);
  }, [status, navigate]);

  const resend = async (event: React.FormEvent) => {
    event.preventDefault();
    setResending(true);
    try {
      const { message } = await authApi.resendVerification(resendEmail);
      toast.success(message || "Verification email resent. Please check your inbox.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend verification email.");
    } finally {
      setResending(false);
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
      <div className="mx-auto w-full max-w-md text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto size-10 animate-spin text-primary" />
            <h1 className="mt-4 text-2xl font-extrabold">Verifying your email…</h1>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto size-10 text-primary" />
            <h1 className="mt-4 text-2xl font-extrabold">Email verified</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message} Redirecting to sign in…</p>
            <Button size="lg" className="mt-6" onClick={() => navigate({ to: "/login" })}>
              Continue to sign in
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="mx-auto size-10 text-destructive" />
            <h1 className="mt-4 text-2xl font-extrabold">Verification failed</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <form onSubmit={resend} className="mt-6 grid gap-3 text-left">
              <label className="grid gap-1.5 text-sm font-medium">
                Resend the verification email
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={resendEmail}
                  onChange={(event) => setResendEmail(event.target.value)}
                />
              </label>
              <Button type="submit" disabled={resending}>
                {resending ? <Loader2 className="animate-spin" /> : null}
                Resend verification email
              </Button>
            </form>
            <p className="mt-6 text-sm text-muted-foreground">
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
