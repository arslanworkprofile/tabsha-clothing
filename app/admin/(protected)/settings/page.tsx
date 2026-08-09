"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { StoreSettings } from "@/lib/settingsStore";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get("/api/settings").then((res) => setSettings(res.data.settings));
  }, []);

  const handleChange = (key: keyof StoreSettings, value: string) => {
    if (!settings) return;
    setSaved(false);
    setSettings({
      ...settings,
      [key]: key === "freeShippingThreshold" || key === "standardShippingFee" ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await axios.put("/api/settings", settings);
      setSettings(res.data.settings);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <p className="text-sm text-ash/50">Loading settings…</p>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold mb-2">Store Settings</h1>
      <p className="text-sm text-ash/50 mb-8">
        These save for real, to data/settings.json (or MongoDB once you're storing settings there too).
      </p>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Store Name</label>
          <input value={settings.storeName} onChange={(e) => handleChange("storeName", e.target.value)} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Support Email</label>
          <input value={settings.supportEmail} onChange={(e) => handleChange("supportEmail", e.target.value)} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Currency Code</label>
          <input value={settings.currency} onChange={(e) => handleChange("currency", e.target.value)} className="input" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Free Shipping Over</label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => handleChange("freeShippingThreshold", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Standard Shipping Fee</label>
            <input
              type="number"
              value={settings.standardShippingFee}
              onChange={(e) => handleChange("standardShippingFee", e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-ash px-8 py-3 text-sm font-medium text-white hover:bg-ash-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
          {saved && <span className="text-sm text-green-700">Saved.</span>}
        </div>
      </div>
    </div>
  );
}
