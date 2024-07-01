import Categories from "../models/CategoriesSchema.js";

export const getAll = async (req, res) => {
  try {
    const categories = await Categories.find().exec(); 

    res.status(200).json({ success: true, message: "Getting all Categories", data: categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};

export const add = async (req, res) => {
  try {
    const category = new Categories(req.body);
    await category.save();
    res.status(201).json({ success: true, message: "Berhasil ditambah" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};

export const del = async (req, res) => {
  const id = req.params.id;
  try {
    await Categories.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};
