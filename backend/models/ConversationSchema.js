import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: "Caretaker",
      required: true,
    },
    buyerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readBySeller: {
      type: Boolean,
      required: true,
    },
    readByBuyer: {
      type: Boolean,
      required: true,
    },
    lastMessage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", ConversationSchema);
