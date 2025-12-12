const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
};

// Google Login
exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, sub: googleId } = ticket.getPayload();
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ name, email, googleId });
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    },
  });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset Password",
    html: `<p>
  We received a request to reset the password for your account of expense tracker app. 
  To proceed, please click the link below. 
  This link is valid for a limited time, so be sure to reset your password soon. 
</p>
<p style="margin-top: 10px;">
  <a href="${resetLink}" style="color: #ffffff; background-color: #007bff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    Reset Your Password
  </a>
</p>
<p style="margin-top: 10px; color: #555555; font-size: 0.9em;">
  If you did not request a password reset, you can safely ignore this email.
</p>`,
  });

  res.json({ success: true, message: "Reset password link sent to email" });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};
