"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      const res = await fetch("/api/auth/admin-login", {
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
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-5 py-16 bg-ink text-paper grain">
      <div className="w-full max-w-sm rounded-3xl bg-white text-ash p-8 md:p-10 shadow-lift">
        <div className="flex items-center gap-2.5 mb-8">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ash text-paper font-heading text-sm font-bold">
            T
          </span>
          <span className="font-heading text-sm font-bold tracking-widest2 uppercase">Tabsha Admin</span>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tightest">Admin Login</h1>
        <p className="text-sm text-ash/50 mt-2 mb-6">Restricted to store administrators.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input type="email" {...register("email")} className="input" placeholder="admin@tabsha.com" />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
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
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-xs text-ash/40 text-center">
          <Link href="/" className="underline underline-offset-4">
            Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
