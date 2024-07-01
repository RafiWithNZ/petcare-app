import User from "../models/UserSchema.js";
import Caretaker from "../models/CaretakerSchema.js";
import Orders from "../models/OrderSchema.js";
import bcrypt from "bcryptjs";
import Pets from "../models/PetSchema.js";

export const updateUsers = async (req, res) => {
  const id = req.params.id;
  const { name, oldPassword, newPassword, photo, phone, address } =
    req.body;

  try {
    const user = await User.findById(id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Password lama salah" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          photo,
          phone,
          address,
          password: newPassword
            ? await bcrypt.hash(newPassword, await bcrypt.genSalt(10))
            : user.password,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User update failed",
    });
  }
};

export const deleteUsers = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User delete failed",
    });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({
      success: true,
      data: user,
      message: "User Ditemukan",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "User Tidak Ditemukan",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      data: users,
      message: "User Ditemukan",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Tidak Ditemukan",
    });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId)
      .populate("orders")
      .populate("favourites");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Tidak Ditemukan",
      });
    }
    const { password, ...rest } = user._doc;
    const pets = await Pets.find({ user: userId });

    res.status(200).json({
      success: true,
      message: "User Ditemukan",
      data: { ...rest, pets },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tidak bisa menemukan user",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Orders.find({ user: req.userId });

    const caretakerIds = orders.map((el) => el.caretaker.id);

    const myCaretaker = await Caretaker.find({
      _id: { $in: caretakerIds },
    });

    res.status(200).json({
      success: true,
      message: "Getting Orders",
      data: myCaretaker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tidak bisa menemukan order",
    });
  }
};

export const toggleFavourite = async (req, res) => {
  const userId = req.params.id;
  const { caretakerId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const index = user.favourites.indexOf(caretakerId);
    if (index === -1) {
      user.favourites.push(caretakerId);
    } else {
      user.favourites.splice(index, 1);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `${index === -1 ? "Ditambahkan" : "Dihapus"} favourites`,
      favoriteStatus: index === -1,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};

export const favouriteStatus = async (req, res) => {
  const { userId } = req.params;
  const { caretakerId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFavourite = user.favourites.includes(caretakerId);

    res.status(200).json({
      success: true,
      isFavourite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get favourite status",
    });
  }
};

export const updateUsersStatus = async (req, res) => {
  const id = req.params.id;
  const { isActive } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User status update failed",
    });
  }
};
