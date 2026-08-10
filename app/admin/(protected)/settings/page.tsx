"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";
import type { StoreSettings } from "@/types/settings";
import type { ProductImage } from "@/types/product";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [heroImages, setHeroImages] = useState<ProductImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get("/api/settings").then((res) => {
      const loaded: StoreSettings = res.data.settings;
      setSettings(loaded);
      setHeroImages(loaded.heroImage ? [{ url: loaded.heroImage, alt: "Homepage hero" }] : []);
    });
  }, []);

  const handleChange = (key: keyof StoreSettings, value: string) => {
    if (!settings) return;
    setSaved(false);
    setSettings({
      ...settings,
      [key]: key === "freeShippingThreshold" || key === "standardShippingFee" ? Number(value) : value,
    });
  };

  const handleHeroImagesChange = (images: ProductImage[]) => {
    setSaved(false);
    setHeroImages(images);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const payload = { ...settings, heroImage: heroImages[0]?.url ?? "" };
      const res = await axios.put("/api/settings", payload);
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
      <p className="text-sm text-ash/50 mb-8">These save for real, to MongoDB.</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-sm font-semibold mb-1">Homepage Hero Image</h2>
          <p className="text-xs text-ash/50 mb-3">
            Shown behind the "Cut for how you actually move" headline on the homepage. Upload a new one anytime to
            replace it — leave empty to keep the default gradient look.
          </p>
          <ImageUploader images={heroImages} onChange={(imgs) => handleHeroImagesChange(imgs.slice(-1))} />
        </section>

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
    </div>
  );
}
