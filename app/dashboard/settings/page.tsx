"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ orders: true, promotions: false, restock: true });

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold mb-8">Settings</h1>

      <section className="mb-10">
        <h2 className="text-sm font-semibold mb-4">Change Password</h2>
        <div className="space-y-4">
          <input type="password" placeholder="Current password" className="input" />
          <input type="password" placeholder="New password" className="input" />
          <input type="password" placeholder="Confirm new password" className="input" />
          <button className="rounded-full bg-ash px-6 py-3 text-sm font-medium text-white hover:bg-ash-dark transition-colors">
            Update Password
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold mb-4">Notifications</h2>
        <div className="space-y-3">
          {(
            [
              ["orders", "Order status updates"],
              ["promotions", "Promotions & discounts"],
              ["restock", "Back-in-stock alerts"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-ash/10 px-4 py-3">
              <span className="text-sm">{label}</span>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => setNotifications((n) => ({ ...n, [key]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
