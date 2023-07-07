const userModel = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");
// JWT TOKEN
exports.sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken(res);
  res.status(statusCode).json({
    success: true,
    token,
  });
};
// Register
exports.registerController = async (req, res, next) => {
  try {
    console.log(req.body, "reg message");
    const { username, email, password } = req.body;

    // exisitng user
    const isExisitingEmail = await userModel.findOne({ email });
    if (isExisitingEmail) {
      return next(new errorResponse("Email already registered", 500));
    }
    const user = await userModel.create({ username, email, password });
    this.sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
  }
};

// LOGIN
exports.loginController = async (req, res, next) => {
  try {
    console.log(req.body, "body-----");
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return next(new errorResponse("please provide email or password"));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new errorResponse("invalid credentials", 404));
    }
    const isMatchUser = await user.matchPassword(password);
    if (!isMatchUser) {
      return next(new errorResponse("Invalid credentials", 401));
    }
    this.sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
  }
};
exports.logoutController = async (req, res) => {
  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: "logout successfully",
  });
};
