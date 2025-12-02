import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import config from "../../config";

export const loginUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }

  const secrect =  config.jwtSecret;

  const token = jsonwebtoken.sign({ id: user.id, email: user.email, role: user.role }, secrect, {
    expiresIn: "1d",
  });

  return { user, token };
};
