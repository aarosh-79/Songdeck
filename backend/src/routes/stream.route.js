import { Router } from "express";
import {
  addStream,
  getStreams,
  getStreamById,
  updateStream,
  deleteStream,
  getUserStreams,
  getUserWorkspaceStreams,
  getPlayedStreams,
  getUnplayedStreams,
} from "../controllers/stream.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getStreams);
router.get("/:id", getStreamById);
router.get("/workspace/:spaceId", getStreams);
router.get("/workspace/:spaceId/played", getPlayedStreams);
router.get("/workspace/:spaceId/unplayed", getUnplayedStreams);

router.post("/workspace/:spaceId", verifyToken, addStream);
router.put("/:id", verifyToken, updateStream);
router.delete("/:id", verifyToken, deleteStream);
router.get("/user/:userId", verifyToken, getUserStreams);
router.get("/user/:userId/workspace/:spaceId", verifyToken, getUserWorkspaceStreams);

export default router;
