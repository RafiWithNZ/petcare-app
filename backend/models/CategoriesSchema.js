import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    description: {
      type: String,
    },
  }
);

export default mongoose.model("Categories", CategoriesSchema);
