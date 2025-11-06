import { Router } from "express";
import {
  signupuser,
  loginuser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserHostedWorkspaces,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signupuser);
router.post("/login", loginuser);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/hosted-workspaces/:userId", verifyToken, getUserHostedWorkspaces);

export default router;