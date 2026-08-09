import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "settings.json");

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  currency: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
}

const DEFAULTS: StoreSettings = {
  storeName: "Tabsha Clothing Studio",
  supportEmail: "support@tabsha.com",
  currency: "PKR",
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
};

// Deliberately not routed through MongoDB — this is a single global settings
// document either way, so a flat JSON file keeps it simple. If you move the
// rest of the app to Mongo, it's easy to swap this for a one-document
// collection later without changing the API shape below.
export const settingsStore = {
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
    const current = settingsStore.get();
    const next = { ...current, ...patch };
    fs.writeFileSync(DB_PATH, JSON.stringify(next, null, 2));
    return next;
  },
};
