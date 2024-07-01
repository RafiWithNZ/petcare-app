import User from "../models/UserSchema.js";
import Caretaker from "../models/CaretakerSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendMail from "../utils/sendMail.js";

// generate session token
export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
};
// create activation token
export const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// create reset token
export const createResetToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.RESET_SECRET, {
    expiresIn: "5m",
  });
};

export const register = async (req, res) => {
  const { name, email, photo, role, gender, password } = req.body;

  try {
    let userEmail = null;

    if (role === "customer") {
      userEmail = await User.findOne({ email });
    } else {
      userEmail = await Caretaker.findOne({ email });
    }

    //cek apakah user sudah ada atau belum
    if (userEmail) {
      return res.status(400).json({ message: "User sudah ada" });
    }

    const user = {
      name: name,
      password: password,
      email: email,
      role: role,
      photo: photo
        ? photo
        : "https://res.cloudinary.com/dsmkicjob/image/upload/v1719383874/pp_c1q4xr.jpg",
      gender: gender,
    };

    //send email
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Aktivasi Akun",
        html: `
        <div>
          <h1>Halo ${user.name}!</h1> 
          <p>Klik link ini untuk mengaktifkan akun anda:</p>
          <a href="${activationUrl}">Link Aktivasi</a>
          <p>Link kadaluarsa dalam 5 Menit</p>
        </div>
        `,
      });
      res.status(201).json({
        success: true,
        message: `Mohon cek email Anda:  ${user.email} untuk aktivasi akun Anda`,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error. Coba lagi" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Internal server error. Coba lagi" });
  }
};

export const activation = async (req, res) => {
  try {
    //validasi activation token
    const { token } = req.body;
    const newUser = jwt.verify(token, process.env.ACTIVATION_SECRET);
    if (!newUser) {
      return res.status(400).json({ message: "Token Invalid" });
    }

    //deklarasi new user
    const { name, email, password, photo, role, gender } = newUser;

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === "customer") {
      newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        photo,
        role,
        gender,
      });
    } else {
      newUser = await Caretaker.create({
        name,
        email,
        password: hashedPassword,
        photo,
        role,
      });
    }

    await newUser.save();
    res.status(201).json({ success: true, message: "Akun berhasil dibuat" });
  } catch (error) {}
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = null;

    const customer = await User.findOne({ email });
    const caretaker = await Caretaker.findOne({ email });

    if (customer) {
      user = customer;
    }
    if (caretaker) {
      user = caretaker;
    }

    //cek apakah user ada atau tidak
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    //cek apakah user diban atau tidak
    if (user.isActive === false) {
      return res.status(404).json({
        message: "User telah di banned oleh admin, silahkan hubungi admin",
      });
    }

    //cek password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Email atau password salah" });
    }

    //get token
    const token = generateToken(user);
    const { password: hashPassword, role, ...rest } = user._doc;

    res.status(200).json({
      status: true,
      token,
      role,
      data: { ...rest },
      message: "Login berhasil",
    });
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("Password")) {
      return res.status(400).json({ status: false, message: "Password salah" });
    }
    res
      .status(200)
      .json({ status: false, message: "Internal server error. Coba lagi" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    let user = null;

    const customer = await User.findOne({ email });
    const caretaker = await Caretaker.findOne({ email });

    if (customer) {
      user = customer;
    }
    if (caretaker) {
      user = caretaker;
    }

    //cek apakah user ada atau tidak
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    //send email
    const resetToken = createResetToken(user);
    const resetUrl = `http://localhost:3000/forget/${resetToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Reset Password",
        html: `
        <div>
          <h1>Halo ${user.name}!</h1> 
          <p>Klik link ini untuk reset password anda:</p>
          <a href="${resetUrl}">Link Reset Password</a>
          <p>Link kadaluarsa dalam 5 Menit</p>
        </div>
        `,
      });
      res.status(200).json({
        success: true,
        message: `Mohon cek email Anda:  ${user.email} untuk reset password`,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error. Coba lagi" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Internal server error. Coba lagi" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    //validasi activation token
    const { token, password } = req.body;
    const user = jwt.verify(token, process.env.RESET_SECRET);
    if (!user) {
      return res.status(400).json({ message: "Token Invalid" });
    }

    //deklarasi new user
    const { id, role } = user;

    //reset password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (role === "customer") {
      await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
    } else {
      await Caretaker.findByIdAndUpdate(
        { _id: id },
        { password: hashedPassword }
      );
    }
    res.status(201).json({ success: true, message: "Akun berhasil direset" });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Internal server error. Coba lagi" });
  }
};
