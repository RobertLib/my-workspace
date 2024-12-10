import Model from "./model.js";
import db from "../db.js";
import bcrypt from "bcrypt";

const properties = ["email", "password", "role", "resetPasswordToken"];

function serialize(data) {
  const obj = {};

  properties.forEach((prop) => {
    if (data[prop] !== undefined) {
      obj[prop] = data[prop];
    }
  });

  return obj;
}

export default class User extends Model {
  constructor(data = {}) {
    super(data);

    properties.forEach((prop) => {
      this[prop] = data[prop];
    });
  }

  static async find({
    sortKey = "id",
    sortOrder = "desc",
    limit = 20,
    offset = 0,
    deleted = "false",
    email = "",
    role = "",
  } = {}) {
    let whereQuery = `WHERE "deletedAt" IS ${
      deleted === "true" ? "NOT" : ""
    } NULL`;

    const values = [];

    if (email) {
      whereQuery += ` AND unaccent("email") ILIKE unaccent($1)`;
      values.push(`%${email}%`);
    }

    if (role) {
      whereQuery += ` AND "role" = $${values.length + 1}`;
      values.push(role);
    }

    const usersQuery = `
      SELECT "id", "email", "role" FROM "users"
      ${whereQuery}
      ORDER BY "${sortKey}" ${sortOrder}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    const countQuery = `SELECT COUNT(*) FROM "users" ${whereQuery}`;

    const usersResult = await db.query(usersQuery, [...values, limit, offset]);
    const countResult = await db.query(countQuery, values);

    const users = usersResult.rows.map((user) => new User(user));
    const total = parseInt(countResult.rows[0].count, 10);

    return { data: users, total };
  }

  static async findById(id) {
    const { rows } = await db.query(
      `SELECT "id", "email", "role", "resetPasswordToken" FROM "users" WHERE "id" = $1`,
      [id]
    );

    return rows[0] ? new User(rows[0]) : null;
  }

  static async findByEmail(email) {
    const { rows } = await db.query(
      'SELECT "id", "email", "password", "role" FROM "users" WHERE "email" = $1',
      [email]
    );

    return rows[0] ? new User(rows[0]) : null;
  }

  static async create(data) {
    try {
      const errors = {};

      if (!data.email) {
        errors.email = "Email is required.";
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        errors.email = "Invalid email format.";
      }
      if (!data.password) {
        errors.password = "Password is required.";
      } else if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters long.";
      }
      if (!data.passwordConfirm) {
        errors.passwordConfirm = "Password confirmation is required.";
      } else if (data.password !== data.passwordConfirm) {
        errors.passwordConfirm = "Passwords do not match.";
      }

      if (Object.keys(errors).length > 0) {
        return {
          errorMessage: "Invalid input.",
          errors,
        };
      }

      const hash = await bcrypt.hash(data.password, 12);

      const userData = serialize({ ...data, password: hash });

      const fields = Object.keys(userData);
      const values = Object.values(userData);

      const quotedFields = fields.map((field) => `"${field}"`).join(", ");
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(", ");

      const query = `
        INSERT INTO "users" (${quotedFields})
        VALUES (${placeholders})
        RETURNING "id", "email", "role"`;

      const { rows } = await db.query(query, values);

      return new User(rows[0]);
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

  static async update(id, data) {
    try {
      const errors = {};

      if (data.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        errors.email = "Invalid email format.";
      }
      if (data.password && data.password.length < 6) {
        errors.password = "Password must be at least 6 characters long.";
      }
      if (data.passwordConfirm && data.password !== data.passwordConfirm) {
        errors.passwordConfirm = "Passwords do not match.";
      }

      if (Object.keys(errors).length > 0) {
        return {
          errorMessage: "Invalid input.",
          errors,
        };
      }

      const userData = serialize(data);

      if (data.password) {
        const hash = await bcrypt.hash(data.password, 12);
        userData.password = hash;
      }

      userData.updatedAt = new Date();

      const fields = Object.keys(userData);
      const values = Object.values(userData);

      const updateFields = fields
        .map((field, index) => `"${field}" = $${index + 1}`)
        .join(", ");

      values.push(id);

      const query = `
        UPDATE "users"
        SET ${updateFields}
        WHERE "id" = $${values.length}
        RETURNING "id", "email", "role"`;

      const { rows } = await db.query(query, values);

      return new User(rows[0]);
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

  static async delete(id) {
    const { rows } = await db.query(
      'UPDATE "users" SET "deletedAt" = NOW() WHERE "id" = $1 RETURNING "id", "email", "role"',
      [id]
    );

    return rows[0] ? new User(rows[0]) : null;
  }
}
