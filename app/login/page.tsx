"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import AuthCard from "@/components/AuthCard";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        setSubmitting(false);
        return;
      }
      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to track orders and manage your wishlist.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <input type="email" {...register("email")} className="input" placeholder="you@example.com" />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium">Password</label>
            <Link href="/forgot-password" className="text-xs text-ash/50 hover:text-ash underline underline-offset-4">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="input pr-11"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ash/40 hover:text-ash"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 rounded-xl p-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ash py-3.5 text-sm font-medium text-white hover:bg-ash-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Logging in…" : "Log In"}
        </button>
      </form>

      {notice && <p className="mt-6 text-xs text-ash/60 bg-cloud rounded-xl p-3">{notice}</p>}

      <p className="mt-6 text-sm text-ash/60 text-center">
        Don&rsquo;t have an account?{" "}
        <Link href="/register" className="text-ash font-medium underline underline-offset-4">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
