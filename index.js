import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/auth.js";
import adminUsersRoutes from "./routes/admin/users.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client", "dist")));

app.use((req, res, next) => {
  const currentTime = new Date().toISOString();
  console.info(`[${currentTime}] Request: ${req.method} ${req.url}`);
  next();
});

app.use("/api", authRoutes);
app.use("/api/admin/users", adminUsersRoutes);

app.get("*name", (req, res, next) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
