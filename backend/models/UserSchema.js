import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  photo: { type: String },
  role: {
    type: String,
    enum: ["customer", "caretaker"],
    default: "customer",
  },
  gender: { type: String, enum: ["Laki-Laki", "Perempuan"] },
  address: { type: String },
  favourites: [{ type: mongoose.Types.ObjectId, ref: "Caretaker" }],

  // orders info
  orders: [{ type: mongoose.Types.ObjectId, ref: "Orders" }],

  // pets info
  pets: [{ type: mongoose.Types.ObjectId, ref: "Pets" }],

  //status
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("User", UserSchema);
