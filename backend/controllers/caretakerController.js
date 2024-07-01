import Caretaker from "../models/CaretakerSchema.js";
import Orders from "../models/OrderSchema.js";
import bcrypt from "bcryptjs";
import Service from "../models/ServiceSchema.js";
import { sanitizeFilter } from "mongoose";

export const updateCT = async (req, res) => {
  const id = req.params.id;
  const cleanBody = sanitizeFilter(req.body);

  const {
    name,
    oldPassword,
    newPassword,
    photo,
    pictures = [],
    documents = [],
    phone,
    address,
    experiences,
    specialization,
    timeSlots,
    about,
  } = cleanBody;

  try {
    const ct = await Caretaker.findById(id);
    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, ct.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Password lama salah" });
    }

    // Prepare the update data
    const updateData = {
      name,
      password: newPassword
        ? await bcrypt.hash(newPassword, await bcrypt.genSalt(10))
        : ct.password,
      photo,
      pictures: Array.isArray(pictures) ? [...pictures] : [pictures],
      documents: Array.isArray(documents) ? [...documents] : [documents],
      phone,
      address,
      experiences,
      specialization,
      timeSlots,
      about,
    };

    // Update the caretaker
    const updatedCT = await Caretaker.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedCT) {
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan" });
    }

    res.status(200).json({
      success: true,
      message: "User diperbarui",
      data: updatedCT,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan",
    });
  }
};

export const deleteCT = async (req, res) => {
  const id = req.params.id;

  try {
    await Caretaker.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User delete failed",
    });
  }
};

export const getSingleCT = async (req, res) => {
  const id = req.params.id;

  try {
    const ct = await Caretaker.findById(id)
      .populate("reviews")
      .populate("services")
      .populate("orders")
      .select("-password");

    res.status(200).json({
      success: true,
      data: ct,
      message: "User Ditemukan",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "User Tidak Ditemukan",
    });
  }
};

export const getAllCT = async (req, res) => {
  try {
    const { query } = req.query;
    let cts;

    if (query) {
      cts = await Caretaker.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
          { address: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      cts = await Caretaker.find().select("-password");
    }

    res.status(200).json({
      success: true,
      data: cts,
      message: "User Ditemukan",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Tidak Ditemukan",
    });
  }
};

export const getCTProfile = async (req, res) => {
  const ctId = req.userId;

  try {
    const caretaker = await Caretaker.findById(ctId);

    if (!caretaker) {
      return res.status(404).json({
        success: false,
        message: "User Tidak Ditemukan",
      });
    }
    const { password, ...rest } = caretaker._doc;

    const orders = await Orders.find({ caretaker: ctId });

    const services = await Service.find({ caretaker: ctId });

    res.status(200).json({
      success: true,
      message: "User Ditemukan",
      data: { ...rest, orders, services },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tidak bisa menemukan user",
    });
  }
};

export const approval = async (req, res) => {
  try {
    await Caretaker.findOneAndUpdate(
      { _id: req.params.id },
      { isApproved: true }
    );

    res.status(200).json({ success: true, message: "Seller disetujui" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal error",
    });
  }
};

export const updateCTStatus = async (req, res) => {
  const id = req.params.id;
  const { isActive } = req.body;

  try {
    const updatedCT = await Caretaker.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Caretaker ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      data: updatedCT,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Caretaker status update failed",
    });
  }
};
