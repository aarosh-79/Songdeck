import { Router } from "express";
import {
  createUpvote,
  removeUpvote,
  getStreamUpvotes,
  getUserUpvotes,
  getWorkspaceUpvotes,
} from "../controllers/upvote.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createUpvote);
router.delete("/", verifyToken, removeUpvote);
router.get("/stream/:streamId", getStreamUpvotes);
router.get("/user/:userId", getUserUpvotes);
router.get("/workspace/:workspaceId", getWorkspaceUpvotes);

export default router;