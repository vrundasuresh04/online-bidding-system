import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    icon: String, // String pointing to URL or icon class
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
