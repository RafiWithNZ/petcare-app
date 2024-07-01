import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Caretaker from "../models/CaretakerSchema.js";

export const authenticate = async (req, res, next) => {
  //get token from headers
  const authToken = req.headers.authorization;

  //check if token exist
  if (!authToken || !authToken.startsWith("Bearer ")) {
    {
      return res.status(401).json({
        success: false,
        message: "Authorization Denied",
      });
    }
  }

  try {
    const token = authToken.split(" ")[1];

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token Expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  let user;

  const customer = await User.findById(userId);
  const caretaker = await Caretaker.findById(userId);

  if (customer) {
    user = customer;
  }
  if (caretaker) {
    user = caretaker;
  }

  if (!roles.includes(user.role)) {
    return res.status(401).json({
      success: false,
      message: "Forbidden",
    });
  }

  next();
};
