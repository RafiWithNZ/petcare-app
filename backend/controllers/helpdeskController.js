import Suggestion from "../models/SuggestionSchema.js";

export const getAllSuggestion = async (req, res) => {
  try {
    const data = await Suggestion.find().exec();
    res.status(200).json({ success: true, message: "Getting all suggestions", data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};

export const createSuggestion = async (req, res) => {
  try {
    const data = await Suggestion.create(req.body);
    data.save();

    res.status(201).json({ success: true, message: "Saran berhasil terkirim" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};
