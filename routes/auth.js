import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(400).send({ errorMessage: "Invalid email or password." });
  }

  if (user.deletedAt) {
    return res
      .status(400)
      .send({ errorMessage: "Your account has been deleted." });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).send({ errorMessage: "Invalid email or password." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET ?? "",
    { expiresIn: "7d" }
  );

  res.send({ token });
});

router.post("/register", async (req, res, next) => {
  const user = await User.create(req.body);

  if (user.errors) {
    return res.status(400).send(user);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET ?? "",
    { expiresIn: "7d" }
  );

  res.status(201).send({ token, user });
});

router.post("/forgot-password", async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(400).send({ errorMessage: "Invalid email." });
  }

  if (user.deletedAt) {
    return res
      .status(400)
      .send({ errorMessage: "Your account has been deleted." });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET ?? "",
    { expiresIn: "1h" }
  );

  const updatedUser = await User.update(user.id, { resetPasswordToken: token });

  if (updatedUser.errors) {
    return res.status(400).send(updatedUser);
  }

  const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset Password",
    text: `Click the link to reset your password: ${resetLink}`,
  });

  res.send({ message: "Email sent." });
});

router.post("/reset-password", async (req, res, next) => {
  const { password, passwordConfirm, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");

    const user = await User.findById(decoded.id);

    if (!user || user.resetPasswordToken !== token) {
      return res.status(400).send({ errorMessage: "Invalid token." });
    }

    const updatedUser = await User.update(user.id, {
      password,
      passwordConfirm,
      resetPasswordToken: null,
    });

    if (updatedUser.errors) {
      return res.status(400).send(updatedUser);
    }

    res.send({ message: "Password reset successful." });
  } catch (error) {
    res.status(400).send({ errorMessage: "Invalid token." });
  }
});

export default router;
