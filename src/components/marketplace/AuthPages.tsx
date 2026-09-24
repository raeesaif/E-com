import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Loader2, ShieldCheck, Store, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Brand, ThemeToggle } from "./Common";
import { useAppState } from "./useAppState";
import { TextField } from "./AuthField";
import { authApi } from "@/api/auth.api";
import { ApiError } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type LoginValues = z.infer<typeof loginSchema>;

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    role: z.enum(["customer", "seller"]),
    storeName: z.string(),
    description: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    if (data.role === "seller") {
      if (!data.storeName?.trim()) {
        ctx.addIssue({ code: "custom", message: "Store name is required", path: ["storeName"] });
      }
      if (!data.description?.trim()) {
        ctx.addIssue({ code: "custom", message: "Description is required", path: ["description"] });
      }
    }
  });
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthPage({ register = false }: { register?: boolean }) {
  const { setRole: previewRole } = useAppState();
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <section className="flex min-h-screen flex-col p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <Brand />
          <ThemeToggle />
        </div>
        <div className="mx-auto my-auto w-full max-w-md py-10">
          <p className="text-xs font-bold uppercase text-primary">
            {register ? "Create an account" : "Welcome back"}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">
            {register ? "Join the marketplace" : "Sign in to Marketly"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {register
              ? "Shop distinct products or start your own storefront."
              : "Sign in to continue to Marketly."}
          </p>
          {register ? <RegisterForm /> : <LoginForm />}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {register ? "Already have an account?" : "New to Marketly?"}{" "}
            <Link to={register ? "/login" : "/register"} className="font-bold text-primary">
              {register ? "Sign in" : "Register"}
            </Link>
          </p>
          <div className="mt-7 border-t pt-5">
            <p className="text-center text-xs text-muted-foreground">
              Admin accounts are managed separately.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => {
                previewRole("admin");
                navigate({ to: "/admin" });
              }}
            >
              <ShieldCheck /> Preview admin dashboard
            </Button>
          </div>
        </div>
      </section>
      <aside className="subtle-grid hidden border-l bg-surface p-10 lg:flex lg:items-center">
        <div className="mx-auto max-w-lg">
          <span className="grid size-12 place-items-center rounded-md bg-primary text-primary-foreground">
            <Check />
          </span>
          <h2 className="mt-6 text-4xl font-extrabold">
            One marketplace.
            <br />
            Three focused experiences.
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            A clear buying journey for customers, practical catalog tools for sellers, and a concise
            operational view for administrators.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              "Thoughtful storefront and checkout",
              "Focused seller product management",
              "Marketplace-wide admin visibility",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-md border bg-card p-4 text-sm font-semibold"
              >
                <Check className="size-4 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}

function LoginForm() {
  const { signIn } = useAppState();
  const navigate = useNavigate();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setUnverifiedEmail(null);
    try {
      const { data } = await authApi.login(values);
      signIn(data.user, { accessToken: data.accessToken, refreshToken: data.refreshToken });
      toast.success("Login successful.");
      navigate({
        to:
          data.user.role === "seller" ? "/seller" : data.user.role === "admin" ? "/admin" : "/shop",
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setUnverifiedEmail(values.email);
      }
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const resendVerification = async () => {
    if (!unverifiedEmail) return;
    try {
      const { message } = await authApi.resendVerification(unverifiedEmail);
      toast.success(message || "Verification email resent. Please check your inbox.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend verification email.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <TextField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />
        <Link to="/forgot-password" className="-mt-2 text-right text-sm font-semibold text-primary">
          Forgot password?
        </Link>
        {unverifiedEmail && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={form.formState.isSubmitting}
            onClick={resendVerification}
          >
            Resend verification email
          </Button>
        )}
        <Button size="lg" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Sign in
          <ArrowRight />
        </Button>
      </form>
    </Form>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer",
      storeName: "",
      description: "",
    },
  });
  const role = form.watch("role");

  const onSubmit = async (values: RegisterValues) => {
    try {
      await authApi.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: values.role,
        ...(values.role === "seller"
          ? { storeName: values.storeName, description: values.description }
          : {}),
      });
      toast.success("Registration successful. Check your inbox to verify your email.");
      navigate({ to: "/login" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <Form {...form}>
      <div className="mt-7 grid grid-cols-2 gap-2">
        <RoleButton
          active={role === "customer"}
          onClick={() => form.setValue("role", "customer")}
          icon={<UserRound />}
          label="Customer"
        />
        <RoleButton
          active={role === "seller"}
          onClick={() => form.setValue("role", "seller")}
          icon={<Store />}
          label="Seller"
        />
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            control={form.control}
            name="firstName"
            label="First name"
            placeholder="Jane"
          />
          <TextField control={form.control} name="lastName" label="Last name" placeholder="Doe" />
        </div>
        <TextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <TextField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
        />
        <TextField
          control={form.control}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="••••••••"
        />
        {role === "seller" && (
          <>
            <TextField
              control={form.control}
              name="storeName"
              label="Store name"
              placeholder="Your storefront name"
            />
            <TextField
              control={form.control}
              name="description"
              label="Store description"
              placeholder="What do you sell?"
            />
          </>
        )}
        <Button size="lg" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Create account
          <ArrowRight />
        </Button>
      </form>
    </Form>
  );
}

function RoleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      className="h-12"
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
}
