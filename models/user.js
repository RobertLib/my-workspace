import Model from "./model.js";
import db from "../db.js";
import bcrypt from "bcrypt";

export default class User extends Model {
  constructor(data) {
    super(data);

    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
  }

  static async findByEmail(email) {
    const { rows } = await db.query(
      'SELECT * FROM "users" WHERE "email" = $1',
      [email]
    );

    return rows[0] ? new User(rows[0]) : null;
  }

  static async create({ email, password, passwordConfirm } = {}) {
    try {
      const errors = {};

      if (!email) {
        errors.email = "Email is required.";
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        errors.email = "Invalid email format.";
      }
      if (!password) {
        errors.password = "Password is required.";
      } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long.";
      }
      if (!passwordConfirm) {
        errors.passwordConfirm = "Password confirmation is required.";
      } else if (password !== passwordConfirm) {
        errors.passwordConfirm = "Passwords do not match.";
      }

      if (Object.keys(errors).length > 0) {
        return {
          errorMessage: "Invalid input.",
          errors,
        };
      }

      const hash = await bcrypt.hash(password, 12);

      const { rows } = await db.query(
        'INSERT INTO "users" ("email", "password") VALUES ($1, $2) RETURNING "id", "email", "role"',
        [email, hash]
      );

      return rows[0];
    } catch (error) {
      if (error.code === "23505") {
        return {
          errorMessage: "Invalid input.",
          errors: {
            email: "User with this email already exists.",
          },
        };
      }

      throw error;
    }
  }
}
