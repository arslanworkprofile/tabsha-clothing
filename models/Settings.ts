import mongoose, { Schema, models, model } from "mongoose";

// Only ever one document in this collection — see services/settingsService.ts, which
// finds-or-creates it rather than looking it up by id.
const SettingsSchema = new Schema(
  {
    storeName: { type: String, default: "Tabsha Clothing Studio" },
    supportEmail: { type: String, default: "support@tabsha.com" },
    currency: { type: String, default: "PKR" },
    freeShippingThreshold: { type: Number, default: 5000 },
    standardShippingFee: { type: Number, default: 250 },
    heroImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export type SettingsDocument = mongoose.InferSchemaType<typeof SettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default models.Settings || model("Settings", SettingsSchema);
