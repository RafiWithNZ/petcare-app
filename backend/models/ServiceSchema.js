import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  caretaker: {
    type: mongoose.Types.ObjectId,
    ref: "Caretaker",
    required: true,
  },
  servName: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("Service", ServiceSchema);
