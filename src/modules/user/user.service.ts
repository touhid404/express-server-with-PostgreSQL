import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

export const createUserInDB = async (payload: Record<string, unknown>) => {


  const hashedPassword = await bcrypt.hash(payload.password as string, 10); 

  const result = await pool.query(
    "INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [payload.name, payload.email, payload.role, hashedPassword]
  );

  return result;
};
