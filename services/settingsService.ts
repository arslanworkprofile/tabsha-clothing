import { connectDB, isMongoConfigured } from "@/lib/mongodb";
import SettingsModel from "@/models/Settings";
import { localSettingsStore } from "@/lib/localSettingsStore";
import type { StoreSettings } from "@/types/settings";

const DEFAULTS: StoreSettings = {
  storeName: "Tabsha Clothing Studio",
  supportEmail: "support@tabsha.com",
  currency: "PKR",
  freeShippingThreshold: 5000,
  standardShippingFee: 250,
  heroImage: "",
};

function toPlainSettings(doc: any): StoreSettings {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    storeName: obj.storeName ?? DEFAULTS.storeName,
    supportEmail: obj.supportEmail ?? DEFAULTS.supportEmail,
    currency: obj.currency ?? DEFAULTS.currency,
    freeShippingThreshold: obj.freeShippingThreshold ?? DEFAULTS.freeShippingThreshold,
    standardShippingFee: obj.standardShippingFee ?? DEFAULTS.standardShippingFee,
    heroImage: obj.heroImage ?? DEFAULTS.heroImage,
  };
}

export const settingsService = {
  async get(): Promise<StoreSettings> {
    if (isMongoConfigured()) {
      await connectDB();
      // Single-document collection: find the one settings doc, or create it on first use.
      let doc = await SettingsModel.findOne();
      if (!doc) doc = await SettingsModel.create(DEFAULTS);
      return toPlainSettings(doc);
    }
    return localSettingsStore.get();
  },

  async update(patch: Partial<StoreSettings>): Promise<StoreSettings> {
    if (isMongoConfigured()) {
      await connectDB();
      let doc = await SettingsModel.findOne();
      if (!doc) {
        doc = await SettingsModel.create({ ...DEFAULTS, ...patch });
      } else {
        Object.assign(doc, patch);
        await doc.save();
      }
      return toPlainSettings(doc);
    }
    return localSettingsStore.update(patch);
  },
};
