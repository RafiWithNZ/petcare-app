import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  petName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  animalType: {
    type: String,
    enum: ["anjing", "kucing", "kelinci", "hamster", "burung", "reptil"],
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  documents: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("Pets", PetSchema);
