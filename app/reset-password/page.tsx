"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AuthCard from "@/components/AuthCard";

const schema = z
  .object({
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type FormValues = z.infer<typeof schema>;

// Phase 1: UI only. Phase 2 verifies the ?token= query param server-side
// against /api/auth/reset-password before allowing the update.
export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 400));
    setDone(true);
  };

  if (done) {
    return <AuthCard title="Password updated" subtitle="You can now log in with your new password." children={null} />;
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose something you haven't used before.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">New Password</label>
          <input type="password" {...register("password")} className="input" placeholder="••••••••" />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Confirm Password</label>
          <input type="password" {...register("confirmPassword")} className="input" placeholder="••••••••" />
          {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" className="w-full rounded-full bg-ash py-3.5 text-sm font-medium text-white hover:bg-ash-dark transition-colors">
          Update Password
        </button>
      </form>
    </AuthCard>
  );
}
