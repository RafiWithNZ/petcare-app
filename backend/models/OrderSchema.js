import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    caretaker: {
      type: mongoose.Types.ObjectId,
      ref: "Caretaker",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderDate: {
      type: String,
      required: true,
    },
    selectedPet: {
      type: mongoose.Types.ObjectId,
      ref: "Pets",
    },
    orderedService: {
      type: mongoose.Types.ObjectId,
      ref: "Service",
    },
    status: {
      type: String,
      default: "Pending",
    },
    rated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate("user")
    .populate("caretaker")
    .populate("orderedService")
    .populate("selectedPet");
  next();
});

export default mongoose.model("Orders", orderSchema);
