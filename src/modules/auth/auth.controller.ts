import { Request, Response } from "express";
import { loginUser } from "./auth.service";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginUser(email, password);

    if (!result) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Login successful", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
