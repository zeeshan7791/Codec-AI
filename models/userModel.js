const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookie = require("cookie");
const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "Username is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password length should be 6 character long"],
  },
  customerId: { type: String, default: "" },
  subscription: { type: String, default: "" },
});

// hash password

userSchema.pre("save", async function (next) {
  // update may user don't change password while updating profile
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// match password
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Sign token

userSchema.methods.getSignedToken = async function (res) {
  const accessToken = JWT.sign(
    {
      id: this.id,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIREIN,
    }
  );
  const refreshToken = JWT.sign(
    { id: this.id },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: process.env.JWT_REFRESH_EXPIREIN }
  );
  res.cookie("refreshToken", `${refreshToken}`, {
    maxAgw: 86400 * 7000,
    httpOnly: true,
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
