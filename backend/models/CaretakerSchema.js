import mongoose from "mongoose";

const CaretakerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    gender: { type: String, enum: ["Laki-Laki", "Perempuan"] },
    photo: { type: String },
    pictures: { type: Array },
    documents: { type: Array },
    role: { type: String },

    //caretaker info
    isApproved: { type: Boolean, default: false },
    specialization: {
      type: Array,
    },
    about: { type: String },
    address: { type: String },
    timeSlots: { type: Array },

    //Review Info
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },

    // orders info
    orders: [{ type: mongoose.Types.ObjectId, ref: "Orders" }],
    // service info
    services: [{ type: mongoose.Types.ObjectId, ref: "Service" }],

    //status
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Caretaker", CaretakerSchema);
