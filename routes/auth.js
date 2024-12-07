import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

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

  res.status(200).send({ token });
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

export default router;
