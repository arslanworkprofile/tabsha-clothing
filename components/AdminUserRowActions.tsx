"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, ShieldCheck, ShieldMinus } from "lucide-react";
import type { UserRole } from "@/types/user";

export default function AdminUserRowActions({
  id,
  role,
  isSelf,
  isLastAdmin,
}: {
  id: string;
  role: UserRole;
  isSelf: boolean;
  isLastAdmin: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = loading || (role === "admin" && (isSelf || isLastAdmin));

  const toggleRole = async () => {
    const nextRole: UserRole = role === "admin" ? "customer" : "admin";
    const confirmMsg =
      nextRole === "admin"
        ? "Give this user admin access to the dashboard?"
        : "Remove admin access from this user?";
    if (!confirm(confirmMsg)) return;

    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/api/users/${id}/role`, { role: nextRole });
      router.refresh();
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error : null;
      setError(message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const title = isSelf
    ? "You can't remove your own admin access"
    : isLastAdmin
    ? "At least one admin must remain"
    : undefined;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggleRole}
        disabled={disabled}
        title={title}
        className={
          role === "admin"
            ? "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ash/60 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            : "inline-flex items-center gap-1.5 rounded-full bg-ash text-white px-3 py-1.5 text-xs font-medium hover:bg-ash/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        }
      >
        {loading ? (
          <Loader2 size={13} className="animate-spin" />
        ) : role === "admin" ? (
          <ShieldMinus size={13} />
        ) : (
          <ShieldCheck size={13} />
        )}
        {role === "admin" ? "Remove admin" : "Make admin"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
