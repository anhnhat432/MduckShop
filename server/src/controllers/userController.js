const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { createHttpError } = require("../utils/httpError");

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  token: generateToken(user._id),
});

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    return res.status(200).json({
      success: true,
      data: buildAuthResponse(user),
    });
  } catch (error) {
    return next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(createHttpError(400, "User already exists"));
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      data: buildAuthResponse(user),
    });
  } catch (error) {
    return next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
};
