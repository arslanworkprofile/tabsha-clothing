import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type CategoryDocument = mongoose.InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export default models.Category || model("Category", CategorySchema);
