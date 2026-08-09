"use client";

import { useEffect, useState } from "react";

export default function DashboardProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setName(data.user.name);
          setEmail(data.user.email);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-8">My Profile</h1>

      <div className="max-w-xl space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full Name</label>
            <input value={loading ? "" : name} onChange={(e) => setName(e.target.value)} className="input" placeholder={loading ? "Loading…" : ""} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input value={loading ? "" : email} disabled className="input" placeholder={loading ? "Loading…" : ""} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone</label>
            <input className="input" placeholder="+92 300 1234567" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">City</label>
            <input className="input" placeholder="Lahore" />
          </div>
        </div>
        <button className="rounded-full bg-ash px-6 py-3 text-sm font-medium text-white hover:bg-ash-dark transition-colors">
          Save Changes
        </button>
        <p className="text-xs text-ash/40">
          Name and email above are your real account details. Phone, city, and Save Changes are still demo-only —
          not yet persisted to your account.
        </p>
      </div>
    </div>
  );
}
