"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthCard from "@/components/AuthCard";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormValues = z.infer<typeof schema>;

// Phase 1: UI only. Phase 2 wires this to /api/auth/forgot-password,
// which emails a signed, expiring reset token linking to /reset-password.
export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 400));
    setSent(true);
  };

  if (sent) {
    return (
      <AuthCard title="Check your email" subtitle="If an account matches, a reset link is on its way (once email sending is wired up in Phase 2).">
        <Link href="/login" className="text-sm text-ash font-medium underline underline-offset-4">
          Back to login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Email</label>
          <input type="email" {...register("email")} className="input" placeholder="you@example.com" />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
        <button type="submit" className="w-full rounded-full bg-ash py-3.5 text-sm font-medium text-white hover:bg-ash-dark transition-colors">
          Send Reset Link
        </button>
      </form>
      <p className="mt-6 text-sm text-ash/60 text-center">
        <Link href="/login" className="text-ash font-medium underline underline-offset-4">
          Back to login
        </Link>
      </p>
    </AuthCard>
  );
}
