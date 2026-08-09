"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import AuthCard from "@/components/AuthCard";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="Join to save your wishlist and track orders.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Full Name</label>
          <input {...register("name")} className="input" placeholder="Ayesha Khan" />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <input type="email" {...register("email")} className="input" placeholder="you@example.com" />
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
        <div>
          <label className="text-sm font-medium mb-1.5 block">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="input"
            placeholder="••••••••"
          />
          {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 rounded-xl p-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ash py-3.5 text-sm font-medium text-white hover:bg-ash-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ash/60 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-ash font-medium underline underline-offset-4">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
