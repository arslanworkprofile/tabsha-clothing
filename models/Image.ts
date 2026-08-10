import mongoose, { Schema, models, model } from "mongoose";

// Images live in their own collection (rather than embedded in Product/Category docs) so
// that fetching a product/category never has to pull megabytes of binary data along with
// it, and so a single image can be swapped/removed without rewriting its parent document.
const ImageSchema = new Schema(
  {
    data: { type: Buffer, required: true }, // stored as BSON binary, not base64 text
    contentType: { type: String, required: true, default: "image/webp" },
    filename: { type: String, default: "" },
    size: { type: Number, required: true }, // bytes, for quick inspection/limits
  },
  { timestamps: true }
);

export type ImageDocument = mongoose.InferSchemaType<typeof ImageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default models.Image || model("Image", ImageSchema);
