import express from "express";

import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "./user.controller";
import { authMiddleware } from "../../middleware/auth";
const router = express.Router();

router.post("/", createUser);
router.get("/", authMiddleware("admin","user"), getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.delete("/:id", deleteUserById);

export const usersRoutes = router;
