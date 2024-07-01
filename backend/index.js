import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import caretakerRoute from "./Routes/caretaker.js";
import reviewRoute from "./Routes/review.js";
import petRoute from "./Routes/pet.js";
import serviceRoute from "./Routes/service.js";
import orderRoute from "./Routes/order.js";
import helpdeskRoute from "./Routes/helpdesk.js";
import categoriesRoute from "./Routes/categories.js";
import messageRoute from "./Routes/message.js";
import conversationRoute from "./Routes/conversation.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.get("/", (req, res) => {
  res.send("API is working");
});

// Database connection
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    // Retry if connection fails
    setTimeout(connectDB, 5000);
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/caretakers", caretakerRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/my-pets", petRoute);
app.use("/api/v1/my-services", serviceRoute);
app.use("/api/v1/my-orders", orderRoute);
app.use("/api/v1/helpdesk", helpdeskRoute);
app.use("/api/v1/categories", categoriesRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/conversations", conversationRoute);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
