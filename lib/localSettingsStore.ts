import fs from "fs";
import path from "path";
import type { StoreSettings } from "@/types/settings";

const DB_PATH = path.join(process.cwd(), "data", "settings.json");

const DEFAULTS: StoreSettings = {
  storeName: "Tabsha Clothing Studio",
  supportEmail: "support@tabsha.com",
  currency: "PKR",
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  heroImage: "",
};

// Local-dev-only fallback (see services/settingsService.ts): writing to disk works fine
// on your machine but never persists on Vercel, since its filesystem is read-only in
// production. Once MONGODB_URI is set, settingsService uses Mongo instead and this file
// is never touched.
export const localSettingsStore = {
  get(): StoreSettings {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULTS, null, 2));
      return DEFAULTS;
    }
    try {
      const raw = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
      return { ...DEFAULTS, ...raw };
    } catch {
      return DEFAULTS;
    }
  },
  update(patch: Partial<StoreSettings>): StoreSettings {
    const current = localSettingsStore.get();
    const next = { ...current, ...patch };
    fs.writeFileSync(DB_PATH, JSON.stringify(next, null, 2));
    return next;
  },
};
