import mongoose from "mongoose";
import Caretaker from "../models/CaretakerSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    caretaker: {
      type: mongoose.Types.ObjectId,
      ref: "Caretaker",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (caretakerId) {
  const stats = await this.aggregate([
    {
      $match: { caretaker: caretakerId },
    },
    {
      $group: {
        _id: "$caretaker",
        numOfRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    const avgRatingRounded = Math.round(stats[0].avgRating * 10) / 10;
    await Caretaker.findByIdAndUpdate(caretakerId, {
      totalRating: stats[0].numOfRating,
      averageRating: avgRatingRounded,
    });
  } else {
    await Caretaker.findByIdAndUpdate(caretakerId, {
      totalRating: 0,
      averageRating: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.caretaker);
});

export default mongoose.model("Review", reviewSchema);
