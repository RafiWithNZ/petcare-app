import Service from "../models/ServiceSchema.js";
import Caretaker from "../models/CaretakerSchema.js";

export const createServ = async (req, res) => {
  const ctId = req.userId;
  const { servName, description, price } = req.body;
  try {
    const ct = await Caretaker.findById(ctId);
    if (!ct.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Maaf Anda belum disetujui",
      });
    }

    const servData = {
      caretaker: ctId,
      servName,
      description,
      price,
    };

    const service = await Service.create(servData);
    service.save();

    await Caretaker.findByIdAndUpdate(
      ctId,
      {
        $push: { services: service._id },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Layanan baru berhasil ditambahkan" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Data yang Anda masukkan tidak valid" });
  }
};

export const updateServ = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedServ = await Service.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Layanan diperbarui",
      data: updatedServ,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "update failed",
    });
  }
};

export const deleteServ = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedServ = await Service.findByIdAndDelete(id);
    const ctId = deletedServ.caretaker;

    await Caretaker.findByIdAndUpdate(
      ctId,
      {
        $pull: { services: deletedServ._id },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Layanan dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "delete failed",
    });
  }
};

export const getSingleServ = async (req, res) => {
  const id = req.params.id;

  try {
    const serv = await Service.findById(id);

    res.status(200).json({
      success: true,
      data: serv,
      message: "Layanan Ditemukan",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Tidak Ditemukan apapun",
    });
  }
};

export const getMyServices = async (req, res) => {
  const sellerId = req.userId;

  try {
    const myServ = await Service.find({ caretaker: sellerId });
    // const myServ = await Caretaker.findById(sellerId).select("services");

    res.status(200).json({
      success: true,
      message: "Tidak Ditemukan",
      data: myServ,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tidak bisa menemukan apapun",
    });
  }
};

export const updateServStatus = async (req, res) => {
  const id = req.params.id;
  const { isActive } = req.body;

  try {
    const updatedServ = await Service.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Layanan ${isActive ? "diaktifkan" : "dinonaktifkan"}`,
      data: updatedServ,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Kesalahan internal",
    });
  }
};
