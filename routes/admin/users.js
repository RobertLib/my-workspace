import express from "express";
import isAuth from "../../middlewares/is-auth.js";
import isAdmin from "../../middlewares/is-admin.js";
import processTableQuery from "../../middlewares/process-table-query.js";
import User from "../../models/user.js";

const router = express.Router();

const SORT_COLUMNS = ["id", "email", "role"];

router.get(
  "/",
  isAuth,
  isAdmin,
  processTableQuery(SORT_COLUMNS),
  async (req, res, next) => {
    const users = await User.find(req.processedQuery);

    res.send(users);
  }
);

router.get("/:id", isAuth, isAdmin, async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).send("User not found.");
  }

  res.send(user);
});

router.post("/", isAuth, isAdmin, async (req, res, next) => {
  const user = await User.create(req.body);

  if (user.errors) {
    return res.status(400).send(user);
  }

  res.status(201).send(user);
});

router.put("/:id", isAuth, isAdmin, async (req, res, next) => {
  const user = await User.update(req.params.id, req.body);

  if (user.errors) {
    return res.status(400).send(user);
  }

  res.send(user);
});

router.delete("/:id", isAuth, isAdmin, async (req, res, next) => {
  await User.delete(req.params.id);

  res.status(204).send();
});

export default router;
