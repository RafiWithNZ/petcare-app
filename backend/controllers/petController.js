import Pets from "../models/PetSchema.js";
import User from "../models/UserSchema.js";

export const getMyPets = async (req, res) => {
  try {
    const ownerId = req.userId;
    // retrieve pet dari spesific user
    // const myPets = await User.findById(ownerId).select("pets");

    // retrive pet berdasarkan id pemiliknya
    const myPets = await Pets.find({ user: ownerId });

    res
      .status(200)
      .json({ success: true, message: "Getting Pets", data: myPets });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tidak bisa menemukan apapun",
    });
  }
};

export const createPet = async (req, res) => {
  const userId = req.userId;
  try {
    const {
      petName,
      photo,
      animalType,
      age,
      weight,
      description,
      documents = [],
    } = req.body;

    const petData = {
      user: userId,
      petName,
      photo,
      animalType,
      age,
      weight,
      description: description ?? undefined,
      documents: Array.isArray(documents) ? [...documents] : [documents],
    };

    const pet = await Pets.create(petData);
    pet.save();

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { pets: pet._id },
      },
      { new: true }
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Berhasil menambahkan profil hewan baru",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again",
    });
  }
};

export const updatePet = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedPet = await Pets.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Peliharaan telah diupdate",
      data: updatedPet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "update failed",
    });
  }
};

export const deletePet = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  try {
    const user = await User.findById(userId);
    const newPetList = user.pets.filter((petId) => petId.toString() !== id);
    await User.findByIdAndUpdate(userId, { pets: newPetList }, { new: true });
    await Pets.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Data peliharaan di hapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "delete failed",
    });
  }
};

export const getPetProfile = async (req, res) => {
  const petId = req.params.id;

  try {
    const myPet = await Pets.findById(petId);
    const { ...rest } = myPet._doc;

    res.status(200).json({
      success: true,
      message: "Info Ditemukan",
      data: { ...rest },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Tidak bisa menemukan info",
    });
  }
};
