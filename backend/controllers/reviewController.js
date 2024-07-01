import Review from "../models/ReviewSchema.js";
import Caretaker from "../models/CaretakerSchema.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});

    res.status(200).json({ success: true, msg: "Succesful", data: reviews });
  } catch (error) {
    res.status(404).json({ success: false, msg: "Not Found" });
  }
};

export const createReview = async (req, res) => {
  if (!req.body.caretaker) req.body.caretaker = req.params.id;
  if (!req.body.user) req.body.user = req.userId;

  const newReview = await Review.create(req.body);

  try {
    const savedReview = await newReview.save();

    await Caretaker.findByIdAndUpdate(req.body.caretaker, {
      $push: { reviews: savedReview._id },
    });

    res
      .status(200)
      .json({ success: true, message: "Ulasan berhasil disubmit", data: savedReview });
  } catch (error) {
    res.status(404).json({ success: false, message: "Internal server error" });
  }
};
