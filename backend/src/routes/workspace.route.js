import { Router } from "express";
import {
	createWorkspace,
	getAllWorkspaces,
	getWorkspaceById,
	updateWorkspace,
	deleteWorkspace,
	getUserWorkspaces,
} from "../controllers/workspace.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllWorkspaces);
router.get("/:id", getWorkspaceById);

router.post("/", verifyToken, createWorkspace);
router.put("/:id", verifyToken, updateWorkspace);
router.delete("/:id", verifyToken, deleteWorkspace);
router.get("/user/:userId", verifyToken, getUserWorkspaces);

export default router;
